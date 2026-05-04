import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'

interface ContactFormData {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body: ContactFormData = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.subject || !body.message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Validate message length
    if (body.message.trim().length < 10) {
      return NextResponse.json(
        { error: 'Message must be at least 10 characters' },
        { status: 400 }
      )
    }

    const fromEmail = process.env.FROM_EMAIL || 'onboarding@resend.dev'
    const fromName = process.env.FROM_NAME || 'Tulu e Biz'
    const adminEmail = process.env.ADMIN_EMAIL || 'colorwhitecosmetics@gmail.com'

    // Send email to admin
    const adminEmailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: adminEmail,
      replyTo: body.email,
      subject: `New Contact: ${body.subject}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          </style>
        </head>
        <body>
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto;">
              <h1 style="color: white; font-size: 32px; font-weight: 700; margin-bottom: 10px;">✨ New Message!</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px;">You have a new contact form submission</p>
            </div>
          </div>

          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Sender Card -->
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
              <div style="display: flex; align-items: center; margin-bottom: 20px; gap: 12px;">
                <div style="width: 60px; height: 60px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; font-size: 24px;">
                  ${body.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 style="color: #111; font-size: 20px; font-weight: 600; margin-bottom: 4px;">${body.name}</h2>
                  <p style="color: #667eea; font-size: 14px; margin: 0;">📧 ${body.email}</p>
                </div>
              </div>
              ${body.phone ? `<p style="color: #666; font-size: 14px; margin: 8px 0;">📱 ${body.phone}</p>` : ''}
            </div>

            <!-- Message Details -->
            <div style="background: linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
              <div style="margin-bottom: 24px;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 600;">Subject</p>
                <h3 style="color: #111; font-size: 18px; font-weight: 600; margin: 0;">${body.subject}</h3>
              </div>

              <div style="border-top: 1px solid #e5e7eb; padding-top: 24px;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 12px; font-weight: 600;">Message</p>
                <div style="background: white; border-radius: 8px; padding: 20px; border-left: 4px solid #667eea;">
                  <p style="color: #333; font-size: 15px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; margin: 0;">${body.message}</p>
                </div>
              </div>
            </div>

            <!-- Action Buttons -->
            <div style="display: flex; gap: 12px; margin-bottom: 30px;">
              <a href="mailto:${body.email}?subject=Re: ${encodeURIComponent(body.subject)}" style="flex: 1; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 600; transition: transform 0.2s;">
                Reply to ${body.name}
              </a>
              <a href="tel:${body.phone || '+1'}" style="flex: 1; background: #f3f4f6; color: #333; text-decoration: none; padding: 14px 24px; border-radius: 8px; text-align: center; font-weight: 600; border: 1px solid #e5e7eb;">
                ${body.phone ? 'Call Now' : 'Contact Info'}
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">Submitted at: ${new Date().toLocaleString('en-US', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</p>
              <p style="color: #ccc; font-size: 11px; margin-top: 12px;">This is an automated notification from ${fromName}</p>
            </div>
          </div>

          <!-- Bottom Banner -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
            <p style="color: #999; font-size: 12px; margin: 0;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>
          </div>
        </body>
        </html>
      `,
    })

    // Send confirmation email to user
    const confirmationEmailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: body.email,
      subject: '✅ We received your message',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; }
          </style>
        </head>
        <body>
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 40px 20px; text-align: center;">
            <div style="max-width: 600px; margin: 0 auto;">
              <div style="width: 80px; height: 80px; border-radius: 50%; background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center; margin: 0 auto 20px; font-size: 40px;">
                ✅
              </div>
              <h1 style="color: white; font-size: 32px; font-weight: 700; margin-bottom: 10px;">Thank You!</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 16px;">We received your message and will get back to you soon</p>
            </div>
          </div>

          <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
            <!-- Welcome Message -->
            <div style="background: white; border-radius: 12px; padding: 30px; margin-bottom: 30px; box-shadow: 0 4px 6px rgba(0,0,0,0.07);">
              <h2 style="color: #111; font-size: 22px; font-weight: 600; margin-bottom: 16px;">Hi ${body.name}! 👋</h2>
              <p style="color: #555; font-size: 15px; line-height: 1.8; margin-bottom: 12px;">
                Thank you for taking the time to reach out to us. We truly appreciate your message and are excited to connect with you.
              </p>
              <p style="color: #555; font-size: 15px; line-height: 1.8;">
                Our team will review your inquiry and respond as quickly as possible. We're here to help!
              </p>
            </div>

            <!-- Your Message Summary -->
            <div style="background: linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(5, 150, 105, 0.05) 100%); border: 1px solid #d1fae5; border-radius: 12px; padding: 30px; margin-bottom: 30px;">
              <h3 style="color: #111; font-size: 16px; font-weight: 600; margin-bottom: 20px; display: flex; align-items: center; gap: 8px;">
                📋 Your Message Summary
              </h3>

              <div style="background: white; border-radius: 8px; padding: 20px; margin-bottom: 16px;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 600;">Subject</p>
                <p style="color: #111; font-size: 15px; font-weight: 600; margin: 0;">${body.subject}</p>
              </div>

              <div style="background: white; border-radius: 8px; padding: 20px;">
                <p style="color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 6px; font-weight: 600;">Your Message</p>
                <p style="color: #555; font-size: 14px; line-height: 1.7; white-space: pre-wrap; word-break: break-word; margin: 0; border-left: 3px solid #10b981; padding-left: 12px;">${body.message}</p>
              </div>
            </div>

            <!-- What's Next -->
            <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 12px; padding: 24px; margin-bottom: 30px;">
              <h3 style="color: #065f46; font-size: 16px; font-weight: 600; margin-bottom: 16px;">⏱️ What Happens Next?</h3>
              <ol style="margin: 0; padding-left: 20px; color: #047857;">
                <li style="margin-bottom: 10px; font-size: 14px; line-height: 1.6;">We review your message carefully</li>
                <li style="margin-bottom: 10px; font-size: 14px; line-height: 1.6;">Our team will respond to your inquiry</li>
                <li style="font-size: 14px; line-height: 1.6;">We'll help you with your request</li>
              </ol>
            </div>

            <!-- CTA -->
            <div style="text-align: center; margin-bottom: 30px;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL}" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 16px 40px; border-radius: 8px; font-weight: 600; transition: transform 0.2s;">
                Visit Our Website
              </a>
            </div>

            <!-- Contact Info -->
            <div style="background: #f9fafb; border-radius: 12px; padding: 24px; margin-bottom: 30px; text-align: center;">
              <p style="color: #666; font-size: 14px; margin-bottom: 12px; font-weight: 600;">Have any questions? We're here to help!</p>
              <p style="color: #999; font-size: 13px; margin: 0;">
                📧 ${fromEmail}
              </p>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center;">
              <p style="color: #999; font-size: 12px; margin: 0;">Thank you for choosing us!</p>
              <p style="color: #ccc; font-size: 11px; margin-top: 12px;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (adminEmailResult.error) {
      console.error('[v0] Failed to send admin email:', adminEmailResult.error)
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: 'Your message has been sent successfully!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Contact form error:', error)
    return NextResponse.json(
      { error: 'Failed to process your request' },
      { status: 500 }
    )
  }
}
