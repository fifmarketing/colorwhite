'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp'
import { Loader2, Lock, Mail } from 'lucide-react'

export default function AdminLoginPage() {
  const router = useRouter()
  const [step, setStep] = useState<'request' | 'verify'>('request')
  const [code, setCode] = useState('')
  const [sentTo, setSentTo] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const requestCode = async () => {
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/request-code', { method: 'POST' })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to send login code')
        return
      }
      setSentTo(data.sentTo || 'your admin email')
      setStep('verify')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const verifyCode = async (value: string) => {
    if (value.length !== 6) return
    setIsLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: value }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Invalid code')
        setCode('')
        return
      }
      router.replace('/admin/dashboard')
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-secondary/30 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
            <Lock className="h-6 w-6 text-primary" />
          </div>
          <CardTitle className="text-2xl">Admin Login</CardTitle>
          <CardDescription>
            {step === 'request'
              ? 'A one-time login code will be sent to the admin email.'
              : `Enter the 6-digit code sent to ${sentTo}.`}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {step === 'request' ? (
            <Button onClick={requestCode} disabled={isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Sending code...
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4" />
                  Send Login Code
                </>
              )}
            </Button>
          ) : (
            <>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={code}
                  onChange={(value) => {
                    setCode(value)
                    if (value.length === 6) verifyCode(value)
                  }}
                  disabled={isLoading}
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
              {isLoading && (
                <p className="text-center text-sm text-muted-foreground flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Verifying...
                </p>
              )}
              <Button variant="ghost" onClick={requestCode} disabled={isLoading} className="w-full">
                Resend code
              </Button>
            </>
          )}
          {error && <p className="text-center text-sm text-destructive">{error}</p>}
        </CardContent>
      </Card>
    </main>
  )
}
