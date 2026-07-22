import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { generateLoginCode, maskEmail } from '@/lib/admin-auth'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST() {
  try {
    const adminEmail = process.env.ADMIN_EMAIL
    const fromEmail = process.env.FROM_EMAIL
    const fromName = process.env.FROM_NAME || 'Color White Beauty'

    if (!adminEmail || !fromEmail) {
      return NextResponse.json(
        { error: 'ADMIN_EMAIL or FROM_EMAIL is not configured' },
        { status: 500 }
      )
    }

    const result = await generateLoginCode()
    if (!result.ok) {
      return NextResponse.json(
        { error: result.error, retryAfterSeconds: result.retryAfterSeconds },
        { status: 429 }
      )
    }

    const emailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: adminEmail,
      subject: `Your admin login code: ${result.code}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; color: #333;">
          <div style="background: linear-gradient(135deg, #c19a6b 0%, #8b6f47 100%); padding: 40px 20px; text-align: center;">
            <h1 style="color: white; font-size: 26px; font-weight: 700; margin: 0;">Admin Login Code</h1>
          </div>
          <div style="max-width: 480px; margin: 0 auto; padding: 32px 20px;">
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 32px; text-align: center;">
              <p style="color: #555; font-size: 15px; margin: 0 0 20px;">Use this code to sign in to the admin panel. It expires in 10 minutes.</p>
              <p style="font-size: 40px; font-weight: 700; letter-spacing: 10px; color: #8b6f47; margin: 0; font-family: monospace;">${result.code}</p>
              <p style="color: #999; font-size: 12px; margin: 24px 0 0;">If you didn't request this code, you can safely ignore this email.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (emailResult.error) {
      console.error('[v0] Failed to send login code email:', emailResult.error)
      return NextResponse.json({ error: 'Failed to send login code email' }, { status: 500 })
    }

    return NextResponse.json({ success: true, sentTo: maskEmail(adminEmail) })
  } catch (error) {
    console.error('[v0] request-code error:', error)
    return NextResponse.json({ error: 'Failed to send login code' }, { status: 500 })
  }
}
