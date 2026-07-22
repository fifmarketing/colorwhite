import { createHmac, createHash, randomInt, timingSafeEqual } from 'crypto'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/mongodb'

const SESSION_COOKIE = 'admin_session'
const SESSION_DURATION_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const CODE_TTL_MS = 10 * 60 * 1000 // 10 minutes
const MAX_ATTEMPTS = 5
const RESEND_COOLDOWN_MS = 60 * 1000 // 1 minute between code requests

function getSecret(): string {
  // Prefer AUTH_SECRET; fall back to a key derived from MONGODB_URI so
  // login still works before AUTH_SECRET is configured.
  const secret = process.env.AUTH_SECRET || process.env.MONGODB_URI
  if (!secret) throw new Error('AUTH_SECRET is not set')
  return createHash('sha256').update(`admin-session:${secret}`).digest('hex')
}

function sign(payload: string): string {
  return createHmac('sha256', getSecret()).update(payload).digest('base64url')
}

export function createSessionToken(): string {
  const payload = JSON.stringify({ role: 'admin', exp: Date.now() + SESSION_DURATION_MS })
  const encoded = Buffer.from(payload).toString('base64url')
  return `${encoded}.${sign(encoded)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false
  const [encoded, signature] = token.split('.')
  if (!encoded || !signature) return false
  const expected = sign(encoded)
  const sigBuf = Buffer.from(signature)
  const expBuf = Buffer.from(expected)
  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) return false
  try {
    const payload = JSON.parse(Buffer.from(encoded, 'base64url').toString())
    return payload.role === 'admin' && typeof payload.exp === 'number' && payload.exp > Date.now()
  } catch {
    return false
  }
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function setSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, createSessionToken(), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_DURATION_MS / 1000,
  })
}

export async function clearSessionCookie() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

function hashCode(code: string): string {
  return createHash('sha256').update(`login-code:${code}:${getSecret()}`).digest('hex')
}

export async function generateLoginCode(): Promise<
  { ok: true; code: string } | { ok: false; error: string; retryAfterSeconds?: number }
> {
  const db = await getDb()
  const existing = await db.collection('auth_codes').findOne({ key: 'admin' })

  if (existing && existing.createdAt) {
    const elapsed = Date.now() - new Date(existing.createdAt).getTime()
    if (elapsed < RESEND_COOLDOWN_MS) {
      return {
        ok: false,
        error: 'Please wait before requesting a new code.',
        retryAfterSeconds: Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000),
      }
    }
  }

  const code = randomInt(100000, 1000000).toString()
  await db.collection('auth_codes').updateOne(
    { key: 'admin' },
    {
      $set: {
        key: 'admin',
        codeHash: hashCode(code),
        expiresAt: new Date(Date.now() + CODE_TTL_MS),
        attempts: 0,
        createdAt: new Date(),
      },
    },
    { upsert: true }
  )

  return { ok: true, code }
}

export async function verifyLoginCode(
  code: string
): Promise<{ ok: true } | { ok: false; error: string }> {
  const db = await getDb()
  const record = await db.collection('auth_codes').findOne({ key: 'admin' })

  if (!record) {
    return { ok: false, error: 'No code was requested. Please request a new code.' }
  }
  if (new Date(record.expiresAt).getTime() < Date.now()) {
    return { ok: false, error: 'Code has expired. Please request a new code.' }
  }
  if (record.attempts >= MAX_ATTEMPTS) {
    return { ok: false, error: 'Too many attempts. Please request a new code.' }
  }

  const isValid = record.codeHash === hashCode(code.trim())

  if (!isValid) {
    await db.collection('auth_codes').updateOne({ key: 'admin' }, { $inc: { attempts: 1 } })
    return { ok: false, error: 'Invalid code. Please try again.' }
  }

  // One-time use: delete the code after successful verification
  await db.collection('auth_codes').deleteOne({ key: 'admin' })
  return { ok: true }
}

export function maskEmail(email: string): string {
  const [local, domain] = email.split('@')
  if (!domain) return email
  const visible = local.slice(0, 2)
  return `${visible}${'*'.repeat(Math.max(local.length - 2, 3))}@${domain}`
}
