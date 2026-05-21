# 📧 Nodemailer Setup Guide

This guide explains how to set up email notifications for your bus booking system.

## Using Gmail (Recommended for Development)

### Step 1: Enable 2-Step Verification

1. Go to https://myaccount.google.com/security
2. Click "2-Step Verification"
3. Follow the steps to enable it
4. You'll need to verify with your phone

### Step 2: Create App Password

1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer" (or your device)
3. Google will generate a 16-character password
4. Copy this password - you'll need it next

**Note:** This is different from your Gmail password!

### Step 3: Configure Environment Variables

In `.env.local`:
```env
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password_here
EMAIL_FROM=noreply@ccbooking.com
```

Replace:
- `your_email@gmail.com` - Your Gmail address
- `your_app_password_here` - The 16-character password from Step 2
- `noreply@ccbooking.com` - Your business email (can be same as EMAIL_USER)

### Step 4: Test Email Sending

1. Start the app: `npm run dev`
2. Book a ticket
3. During booking confirmation, emails will be sent
4. Check your inbox for confirmation emails

## Email Templates

The app uses pre-configured templates for:

### 1. Booking Confirmation Email
Sent when payment is successful:
- Passenger name and details
- Route information
- Departure date and time
- Seat numbers
- Total fare paid
- Ticket number

**Triggers:** After successful Paystack payment verification

### 2. Payment Receipt Email
Includes:
- Transaction reference
- Amount paid
- Payment date
- Booking status

**Triggers:** When payment is verified

## Using Other Email Providers

### Outlook/Hotmail
```env
EMAIL_USER=your_email@outlook.com
EMAIL_PASSWORD=your_password
```

Update `src/lib/server/nodemailer.ts`:
```typescript
const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});
```

### SendGrid
1. Sign up at https://sendgrid.com
2. Create an API key
3. Install sendgrid package: `npm install @sendgrid/mail`

Update the mailer:
```typescript
import sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export async function sendEmail(options: EmailOptions) {
  try {
    await sgMail.send({
      to: options.to,
      from: process.env.EMAIL_FROM,
      subject: options.subject,
      html: options.html,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
```

### AWS SES
1. Set up AWS SES
2. Verify email address
3. Get SMTP credentials

### Resend (Modern Alternative)
1. Sign up at https://resend.com
2. Get API key
3. Install: `npm install resend`

```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(options: EmailOptions) {
  try {
    const data = await resend.emails.send({
      from: process.env.EMAIL_FROM,
      to: options.to,
      subject: options.subject,
      html: options.html,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
```

## Customizing Email Templates

### Edit Booking Confirmation Email

File: `src/lib/server/nodemailer.ts`

Function: `getBookingConfirmationEmail()`

Modify the HTML template to match your branding:

```typescript
export function getBookingConfirmationEmail(
  passengerName: string,
  from: string,
  to: string,
  departureDate: string,
  departureTime: string,
  seats: string[],
  totalPrice: number,
  ticketNumber: string
): string {
  return `
    <!-- Customize this HTML -->
    <html>
      <body>
        <!-- Add your branding, logo, colors, etc. -->
      </body>
    </html>
  `;
}
```

## Email Sending Flow

```
User Books Ticket
    ↓
Paystack Payment Initiated
    ↓
Payment Confirmed
    ↓
verifyBookingPayment() called
    ↓
Database Updated
    ↓
sendEmail() called with confirmation template
    ↓
Nodemailer sends via SMTP
    ↓
Email delivered to customer inbox
```

## Troubleshooting

### Issue: "Invalid login"

**Solutions:**
1. Check EMAIL_USER spelling (must be exact Gmail address)
2. Verify EMAIL_PASSWORD is the 16-character app password (not your Gmail password)
3. Ensure 2-Step Verification is enabled
4. Try generating a new App Password

### Issue: "SMTP connection timeout"

**Solutions:**
1. Check your internet connection
2. Verify firewall isn't blocking port 587
3. Try using port 465 with `secure: true`
4. Check Gmail's "Less secure apps" setting (if enabled)

### Issue: "Emails not being received"

**Solutions:**
1. Check spam/junk folder
2. Verify recipient email is correct
3. Check sender address isn't flagged
4. Review Nodemailer logs in terminal
5. Add custom email headers for better deliverability

### Issue: "error: self-signed certificate"

**Solution:** Add this to Nodemailer config:
```typescript
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: { ... },
  tls: {
    rejectUnauthorized: false
  }
});
```

## Email Best Practices

### 1. Sender Reputation
- Use consistent sender email
- Implement SPF/DKIM records
- Monitor bounce rates

### 2. Content
- Include unsubscribe link (if newsletter)
- Use professional HTML templates
- Test on multiple email clients
- Keep text-to-HTML ratio balanced

### 3. Frequency
- Send transactional emails immediately
- Don't spam customers
- Batch marketing emails

### 4. Personalization
- Use customer's name
- Include booking-specific details
- Show relevant next steps

### 5. Mobile Optimization
- Use responsive email templates
- Test on mobile clients
- Keep content concise

## Advanced Configuration

### Email with Attachments

```typescript
export async function sendEmailWithAttachment(
  options: EmailOptions,
  attachmentPath: string
) {
  return transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: options.to,
    subject: options.subject,
    html: options.html,
    attachments: [
      {
        filename: 'ticket.pdf',
        path: attachmentPath
      }
    ],
  });
}
```

### Email Queue/Retry Logic

```typescript
const queue: EmailOptions[] = [];

async function processEmailQueue() {
  while (queue.length > 0) {
    const email = queue.shift();
    try {
      await sendEmail(email);
    } catch (error) {
      queue.push(email); // Re-add on failure
      await new Promise(r => setTimeout(r, 5000)); // Retry after 5s
    }
  }
}
```

### Rate Limiting

```typescript
import rateLimit from 'express-rate-limit';

const emailLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 emails per 15 minutes per IP
});
```

## Production Recommendations

1. **Use Dedicated Sender**
   - Domain-specific email (e.g., noreply@ccbooking.com)
   - Set up SPF/DKIM records
   - Monitor sender reputation

2. **Implement Logging**
   - Log all sent emails
   - Track bounce rates
   - Monitor delivery times

3. **Add Retry Logic**
   - Implement exponential backoff
   - Queue failed emails
   - Alert on persistent failures

4. **Monitor Performance**
   - Track email delivery time
   - Monitor SMTP connection health
   - Set up alerts for failures

5. **Compliance**
   - Include contact information
   - Honor unsubscribe requests
   - Follow CAN-SPAM/GDPR requirements

## Email Security

### Never Log Passwords
```typescript
// ❌ WRONG
console.log(process.env.EMAIL_PASSWORD);

// ✅ CORRECT
console.log('Email configured'); // Just confirm it's set
```

### Validate Email Addresses
```typescript
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(email)) {
  throw new Error('Invalid email');
}
```

### Use Environment Variables
- Never hardcode credentials
- Use `.env.local` for development
- Use CI/CD secrets for production

## Support

- Nodemailer Docs: https://nodemailer.com/
- Gmail App Password: https://support.google.com/accounts/answer/185833
- Email Best Practices: https://sendgrid.com/resource/email-best-practices/

## Examples

### Send Booking Confirmation
```typescript
const result = await sendEmail({
  to: booking.passenger_email,
  subject: 'Your Bus Booking Confirmation - C&C Transport',
  html: getBookingConfirmationEmail(
    booking.passenger_name,
    schedule.route.from_location,
    schedule.route.to_location,
    schedule.departure_date,
    schedule.departure_time,
    booking.seats,
    booking.total_price,
    ticketNumber
  ),
});
```

### Send Payment Receipt
```typescript
const result = await sendEmail({
  to: booking.passenger_email,
  subject: 'Payment Receipt - C&C Transport',
  html: getPaymentReceiptEmail(
    booking.passenger_name,
    booking.payment_reference,
    booking.total_price
  ),
});
```

## Next Steps

1. ✅ Configure Gmail app password
2. ✅ Update `.env.local`
3. ✅ Test email sending
4. ✅ Customize templates with your branding
5. ✅ Monitor email delivery in production
