/**
 * Email notification service for BestMealMate
 * Uses Resend for production email delivery
 */

import { Resend } from 'resend'

export interface EmailOptions {
  to: string
  subject: string
  html: string
  text?: string
}

// Initialize Resend client (lazy initialization)
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    return null
  }
  return new Resend(apiKey)
}

/**
 * Send an email notification via Resend
 * Falls back to console logging if RESEND_API_KEY is not configured
 */
export async function sendEmail(options: EmailOptions): Promise<boolean> {
  try {
    const resend = getResend()

    if (resend) {
      // Send via Resend in production
      const { error } = await resend.emails.send({
        from: process.env.EMAIL_FROM || 'BestMealMate <noreply@bestmealmate.com>',
        to: options.to,
        subject: options.subject,
        html: options.html,
      })

      if (error) {
        console.error('Resend error:', error)
        return false
      }

      console.log('📧 Email sent via Resend:', {
        to: options.to,
        subject: options.subject,
      })
    } else {
      // Fallback: log to console in development
      console.log('📧 Email notification (dev mode - no RESEND_API_KEY):', {
        to: options.to,
        subject: options.subject,
      })
    }

    return true
  } catch (error) {
    console.error('Failed to send email:', error)
    return false
  }
}

/**
 * Send welcome email after subscription starts
 */
export async function sendWelcomeEmail(email: string, tier: string): Promise<boolean> {
  const tierName = tier === 'family' ? 'Family' : 'Premium'

  return sendEmail({
    to: email,
    subject: `Welcome to BestMealMate ${tierName}! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #22c55e; }
            .content { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(to right, #22c55e, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍳 BestMealMate</div>
            </div>
            <div class="content">
              <h1>Welcome to ${tierName}! 🎉</h1>
              <p>Thanks for upgrading to BestMealMate ${tierName}. You now have access to:</p>
              <ul>
                <li>✅ Unlimited AI meal suggestions</li>
                <li>✅ ${tier === 'family' ? 'Unlimited' : 'Up to 8'} family profiles</li>
                <li>✅ Advanced recipe import</li>
                <li>✅ Priority AI Chef support</li>
                ${tier === 'family' ? '<li>✅ Family sharing features</li>' : ''}
              </ul>
              <p>Your 14-day free trial has started. You won't be charged until the trial ends.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://www.bestmealmate.com/dashboard" class="button">Start Planning Meals</a>
              </p>
            </div>
            <div class="footer">
              <p>Questions? Reply to this email or visit our help center.</p>
              <p>© ${new Date().getFullYear()} BestMealMate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send payment failure notification
 */
export async function sendPaymentFailedEmail(email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: '⚠️ Payment Failed - Action Required',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #22c55e; }
            .alert { background: #fef2f2; border: 1px solid #fecaca; border-radius: 12px; padding: 30px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(to right, #22c55e, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍳 BestMealMate</div>
            </div>
            <div class="alert">
              <h1>⚠️ Payment Failed</h1>
              <p>We were unable to process your payment for BestMealMate. Your subscription may be interrupted if not resolved.</p>
              <p><strong>What to do:</strong></p>
              <ul>
                <li>Update your payment method in Settings</li>
                <li>Make sure your card hasn't expired</li>
                <li>Check with your bank if the charge was blocked</li>
              </ul>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://www.bestmealmate.com/dashboard/settings" class="button">Update Payment Method</a>
              </p>
            </div>
            <div class="footer">
              <p>Need help? Reply to this email and we'll assist you.</p>
              <p>© ${new Date().getFullYear()} BestMealMate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send subscription canceled notification
 */
export async function sendSubscriptionCanceledEmail(email: string): Promise<boolean> {
  return sendEmail({
    to: email,
    subject: 'Your BestMealMate subscription has been canceled',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #22c55e; }
            .content { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(to right, #22c55e, #10b981); color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍳 BestMealMate</div>
            </div>
            <div class="content">
              <h1>We're sad to see you go 😢</h1>
              <p>Your BestMealMate subscription has been canceled. You've been moved to the Free plan.</p>
              <p><strong>What you still have:</strong></p>
              <ul>
                <li>✅ 2 family profiles</li>
                <li>✅ 5 AI suggestions per week</li>
                <li>✅ Basic meal planning</li>
              </ul>
              <p>We'd love to have you back! If you change your mind, you can upgrade anytime.</p>
              <p style="text-align: center; margin-top: 30px;">
                <a href="https://www.bestmealmate.com/dashboard/settings" class="button">Resubscribe</a>
              </p>
            </div>
            <div class="footer">
              <p>Tell us why you left - your feedback helps us improve!</p>
              <p>© ${new Date().getFullYear()} BestMealMate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}

/**
 * Send invoice paid receipt
 */
export async function sendInvoicePaidEmail(email: string, amount: number, currency: string): Promise<boolean> {
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency.toUpperCase(),
  }).format(amount / 100)

  return sendEmail({
    to: email,
    subject: `Receipt for your BestMealMate payment - ${formattedAmount}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { text-align: center; padding: 20px 0; }
            .logo { font-size: 24px; font-weight: bold; color: #22c55e; }
            .content { background: #f9fafb; border-radius: 12px; padding: 30px; margin: 20px 0; }
            .receipt { background: white; border: 1px solid #e5e7eb; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .amount { font-size: 32px; font-weight: bold; color: #22c55e; text-align: center; }
            .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">🍳 BestMealMate</div>
            </div>
            <div class="content">
              <h1>Payment Received ✅</h1>
              <p>Thanks for your payment! Here's your receipt:</p>
              <div class="receipt">
                <div class="amount">${formattedAmount}</div>
                <p style="text-align: center; color: #6b7280; margin: 10px 0;">
                  BestMealMate Subscription<br>
                  ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
              </div>
              <p style="text-align: center;">
                <a href="https://www.bestmealmate.com/dashboard/settings" style="color: #22c55e;">View billing history</a>
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} BestMealMate. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
  })
}
