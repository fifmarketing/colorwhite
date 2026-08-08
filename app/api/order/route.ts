import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { getDb } from '@/lib/mongodb'

interface OrderItem {
  id: string | number
  name: string
  price: number
  quantity: number
  image?: string
}

interface OrderFormData {
  fullName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  items: OrderItem[]
  paymentMethod?: 'cod' | 'bank'
  /** Cloudinary URL of the customer's bank transfer screenshot. */
  paymentProof?: string
  paymentReference?: string
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: NextRequest) {
  try {
    const body: OrderFormData = await request.json()

    // Email and postal code are optional: most COD customers in Pakistan
    // order with just a phone number and address.
    if (
      !body.fullName?.trim() ||
      !body.phone?.trim() ||
      !body.address?.trim() ||
      !body.city?.trim()
    ) {
      return NextResponse.json(
        { error: 'Name, phone number, address and city are required' },
        { status: 400 }
      )
    }

    const email = body.email?.trim() ?? ''
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (email && !emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email format' }, { status: 400 })
    }

    const settings = await getSettings()
    const paymentMethod = body.paymentMethod === 'bank' ? 'bank' : 'cod'

    // Never let the browser pick a method the store has switched off.
    if (paymentMethod === 'bank' && !settings.payment.bankEnabled) {
      return NextResponse.json(
        { error: 'Bank transfer is not available right now. Please choose Cash on Delivery.' },
        { status: 400 }
      )
    }
    if (paymentMethod === 'cod' && !settings.payment.codEnabled) {
      return NextResponse.json(
        { error: 'Cash on Delivery is not available right now. Please choose Bank Transfer.' },
        { status: 400 }
      )
    }

    const paymentProof = typeof body.paymentProof === 'string' ? body.paymentProof.trim() : ''
    const paymentReference =
      typeof body.paymentReference === 'string' ? body.paymentReference.trim() : ''

    if (paymentMethod === 'bank' && settings.payment.requireProof && !paymentProof) {
      return NextResponse.json(
        { error: 'Please upload your payment screenshot to confirm the bank transfer.' },
        { status: 400 }
      )
    }

    // Prices, shipping and the total are recomputed from the database so a
    // tampered request cannot change what the customer is charged.
    let priced
    try {
      priced = await priceOrder(body.items)
    } catch (pricingError) {
      if (pricingError instanceof PricingError) {
        return NextResponse.json({ error: pricingError.message }, { status: 400 })
      }
      throw pricingError
    }

    const { items, subtotal, shipping, total } = priced
    const paymentLabel =
      paymentMethod === 'bank'
        ? settings.payment.bankLabel || 'Bank Transfer'
        : settings.payment.codLabel || 'Cash on Delivery (COD)'

    const fromEmail = process.env.FROM_EMAIL
    const fromName = process.env.FROM_NAME
    const adminEmail = process.env.ADMIN_EMAIL || 'colorwhitecosmetics@gmail.com'

    // Generate order ID
    const orderId = `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    const orderDate = new Date().toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

    // Save order to MongoDB
    try {
      const db = await getDb()
      await db.collection('orders').insertOne({
        orderId,
        fullName: body.fullName.trim(),
        email,
        phone: body.phone.trim(),
        address: body.address.trim(),
        city: body.city.trim(),
        postalCode: body.postalCode?.trim() ?? '',
        items,
        subtotal,
        shipping,
        total,
        paymentMethod,
        paymentProof,
        paymentReference,
        // Bank transfers wait on manual verification before fulfilment.
        paymentStatus: paymentMethod === 'bank' ? 'awaiting_verification' : 'cod_pending',
        status: 'pending',
        createdAt: new Date(),
      })
    } catch (dbError) {
      console.error('[v0] Failed to save order to database:', dbError)
    }

    // Build items HTML rows
    const itemsHtml = body.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb;">
            <p style="margin: 0; color: #111; font-size: 14px; font-weight: 600;">${item.name}</p>
            <p style="margin: 4px 0 0; color: #666; font-size: 12px;">Unit Price: Rs. ${item.price.toLocaleString()}</p>
          </td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #333; font-size: 14px;">${item.quantity}</td>
          <td style="padding: 12px; border-bottom: 1px solid #e5e7eb; text-align: right; color: #111; font-size: 14px; font-weight: 600;">Rs. ${(item.price * item.quantity).toLocaleString()}</td>
        </tr>
      `
      )
      .join('')

    // ---- ADMIN EMAIL ----
    const adminEmailResult = await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: adminEmail,
      replyTo: body.email,
      subject: `New Order Received - ${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; color: #333;">
          <div style="background: linear-gradient(135deg, #c19a6b 0%, #8b6f47 100%); padding: 40px 20px; text-align: center;">
            <div style="max-width: 640px; margin: 0 auto;">
              <h1 style="color: white; font-size: 30px; font-weight: 700; margin: 0 0 8px;">New Order Received</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin: 0;">A new customer just placed an order</p>
            </div>
          </div>

          <div style="max-width: 640px; margin: 0 auto; padding: 32px 20px;">

            <!-- Order Meta -->
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order ID</p>
                    <p style="margin: 4px 0 0; color: #111; font-size: 16px; font-weight: 700;">${orderId}</p>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Date</p>
                    <p style="margin: 4px 0 0; color: #111; font-size: 14px; font-weight: 600;">${orderDate}</p>
                  </td>
                </tr>
              </table>
            </div>

            <!-- Customer Info -->
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #111; font-size: 18px; font-weight: 700; margin: 0 0 16px;">Customer Information</h2>
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 8px 0; color: #666; width: 130px;">Full Name</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">${body.fullName}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Email</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">
                    <a href="mailto:${body.email}" style="color: #8b6f47; text-decoration: none;">${body.email}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Phone</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">
                    <a href="tel:${body.phone}" style="color: #8b6f47; text-decoration: none;">${body.phone}</a>
                  </td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666; vertical-align: top;">Address</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">${body.address}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">City</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">${body.city}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Postal Code</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">${body.postalCode}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; color: #666;">Payment</td>
                  <td style="padding: 8px 0; color: #111; font-weight: 600;">Cash on Delivery (COD)</td>
                </tr>
              </table>
            </div>

            <!-- Order Items -->
            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #111; font-size: 18px; font-weight: 700; margin: 0 0 16px;">Order Items</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Product</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            </div>

            <!-- Totals -->
            <div style="background: linear-gradient(135deg, rgba(193, 154, 107, 0.08) 0%, rgba(139, 111, 71, 0.08) 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #666;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; color: #111; font-weight: 600;">Rs. ${body.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Shipping</td>
                  <td style="padding: 6px 0; text-align: right; color: #111; font-weight: 600;">Rs. ${body.shipping.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0 0; border-top: 2px solid #e5e7eb; color: #111; font-size: 16px; font-weight: 700;">Total Amount</td>
                  <td style="padding: 14px 0 0; border-top: 2px solid #e5e7eb; text-align: right; color: #8b6f47; font-size: 20px; font-weight: 700;">Rs. ${body.total.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #999; font-size: 12px; margin: 0;">This is an automated notification from ${fromName}</p>
              <p style="color: #ccc; font-size: 11px; margin: 8px 0 0;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    // ---- CUSTOMER CONFIRMATION ----
    await resend.emails.send({
      from: `${fromName} <${fromEmail}>`,
      to: body.email,
      subject: `Order Confirmation - ${orderId}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
        <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f9fafb; color: #333;">
          <div style="background: linear-gradient(135deg, #c19a6b 0%, #8b6f47 100%); padding: 40px 20px; text-align: center;">
            <div style="max-width: 640px; margin: 0 auto;">
              <h1 style="color: white; font-size: 30px; font-weight: 700; margin: 0 0 8px;">Thank you for your order!</h1>
              <p style="color: rgba(255,255,255,0.9); font-size: 15px; margin: 0;">We've received your order and will start processing it shortly</p>
            </div>
          </div>

          <div style="max-width: 640px; margin: 0 auto; padding: 32px 20px;">

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #111; font-size: 20px; font-weight: 700; margin: 0 0 8px;">Hi ${body.fullName},</h2>
              <p style="color: #555; font-size: 15px; line-height: 1.7; margin: 0;">
                Your order has been placed successfully. Below are your order details. We'll contact you shortly to confirm delivery.
              </p>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0;">
                    <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Order ID</p>
                    <p style="margin: 4px 0 0; color: #111; font-size: 16px; font-weight: 700;">${orderId}</p>
                  </td>
                  <td style="padding: 8px 0; text-align: right;">
                    <p style="margin: 0; color: #666; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; font-weight: 600;">Date</p>
                    <p style="margin: 4px 0 0; color: #111; font-size: 14px; font-weight: 600;">${orderDate}</p>
                  </td>
                </tr>
              </table>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #111; font-size: 18px; font-weight: 700; margin: 0 0 16px;">Shipping To</h2>
              <p style="margin: 0; color: #333; font-size: 14px; line-height: 1.7;">
                <strong>${body.fullName}</strong><br>
                ${body.address}<br>
                ${body.city}, ${body.postalCode}<br>
                ${body.phone}
              </p>
            </div>

            <div style="background: white; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <h2 style="color: #111; font-size: 18px; font-weight: 700; margin: 0 0 16px;">Order Summary</h2>
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background: #f9fafb;">
                    <th style="padding: 12px; text-align: left; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Product</th>
                    <th style="padding: 12px; text-align: center; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Qty</th>
                    <th style="padding: 12px; text-align: right; font-size: 12px; color: #666; text-transform: uppercase; letter-spacing: 1px; font-weight: 600; border-bottom: 2px solid #e5e7eb;">Total</th>
                  </tr>
                </thead>
                <tbody>${itemsHtml}</tbody>
              </table>
            </div>

            <div style="background: linear-gradient(135deg, rgba(193, 154, 107, 0.08) 0%, rgba(139, 111, 71, 0.08) 100%); border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 6px 0; color: #666;">Subtotal</td>
                  <td style="padding: 6px 0; text-align: right; color: #111; font-weight: 600;">Rs. ${body.subtotal.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Shipping</td>
                  <td style="padding: 6px 0; text-align: right; color: #111; font-weight: 600;">Rs. ${body.shipping.toLocaleString()}</td>
                </tr>
                <tr>
                  <td style="padding: 6px 0; color: #666;">Payment</td>
                  <td style="padding: 6px 0; text-align: right; color: #111; font-weight: 600;">Cash on Delivery</td>
                </tr>
                <tr>
                  <td style="padding: 14px 0 0; border-top: 2px solid #e5e7eb; color: #111; font-size: 16px; font-weight: 700;">Total Amount</td>
                  <td style="padding: 14px 0 0; border-top: 2px solid #e5e7eb; text-align: right; color: #8b6f47; font-size: 20px; font-weight: 700;">Rs. ${body.total.toLocaleString()}</td>
                </tr>
              </table>
            </div>

            <div style="background: #f9fafb; border-radius: 12px; padding: 20px; margin-bottom: 24px; text-align: center;">
              <p style="margin: 0; color: #555; font-size: 13px; line-height: 1.6;">
                If you have any questions about your order, just reply to this email.
              </p>
            </div>

            <div style="text-align: center; padding-top: 16px; border-top: 1px solid #e5e7eb;">
              <p style="color: #999; font-size: 12px; margin: 0;">Thank you for shopping with ${fromName}</p>
              <p style="color: #ccc; font-size: 11px; margin: 8px 0 0;">© ${new Date().getFullYear()} ${fromName}. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `,
    })

    if (adminEmailResult.error) {
      console.error('[v0] Failed to send order admin email:', adminEmailResult.error)
      return NextResponse.json(
        { error: 'Failed to place order' },
        { status: 500 }
      )
    }

    return NextResponse.json(
      {
        success: true,
        orderId,
        message: 'Order placed successfully!',
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('[v0] Order submission error:', error)
    return NextResponse.json(
      { error: 'Failed to process your order' },
      { status: 500 }
    )
  }
}
