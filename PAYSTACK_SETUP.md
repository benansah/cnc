# 🔧 Paystack Integration Guide

## Setup Instructions

### 1. Create Paystack Account

1. Go to https://paystack.com
2. Sign up and verify your email
3. Complete your profile with business information
4. Navigate to **Settings → Developers**

### 2. Get Your API Keys

In the Developers section, you'll see:
- **Public Key** - Use in `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY`
- **Secret Key** - Use in `PAYSTACK_SECRET_KEY`

Copy both keys and add them to your `.env.local` file.

### 3. Configure Webhook/Callback URL

This is crucial for payment verification!

#### Option A: During Payment Initialization (Automatic)
The application automatically sets the callback URL to:
```
https://your-app-url/api/payments/callback
```

This is configured in `src/lib/server/paystack.ts`

#### Option B: Via Paystack Dashboard (Manual)

If you want to set a static webhook in Paystack:

1. Go to Paystack Dashboard → **Settings → API Keys & Webhooks**
2. Scroll to "Test Mode Webhooks"
3. Add your callback URL:
   - Development: `http://localhost:3000/api/payments/callback`
   - Production: `https://your-domain.com/api/payments/callback`

4. Select the following events to listen for:
   - ✅ charge.success
   - ✅ charge.failed
   - ✅ transfer.success
   - ✅ transfer.reversed

5. Click "Save"

### 4. Payment Flow

```
User → Booking Form
    ↓
Paystack Integration (initializePayment)
    ↓
Paystack Payment Page
    ↓
User Completes Payment
    ↓
Paystack Callback → /api/payments/callback
    ↓
Verify Payment (verifyPayment)
    ↓
Update Booking Status → "completed"
    ↓
Mark Seats as Booked
    ↓
Send Confirmation Email
    ↓
Redirect to Success Page
```

## Testing Paystack Payments

### Test Card Numbers

Paystack provides test card numbers for development:

**Successful Payment:**
- Card Number: `4111 1111 1111 1111`
- Expiry: Any future date (e.g., 12/25)
- CVV: Any 3 digits (e.g., 123)
- PIN: Any 4 digits (e.g., 1234)

**Failed Payment:**
- Card Number: `4222 2222 2222 2222`

### Test Email
Use any email during testing. Common testing emails:
- `test@example.com`
- `user@test.com`
- Your own email

### Testing Flow
1. Start development server: `npm run dev`
2. Go to http://localhost:3000
3. Search for buses and proceed to booking
4. Enter passenger details
5. You'll be redirected to Paystack payment page
6. Use test card numbers above
7. After payment, you'll be redirected back to callback handler

## Production Setup

### 1. Environment Variables

Update `.env.local` with **LIVE** keys:
```env
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_live_xxxxx
PAYSTACK_SECRET_KEY=sk_live_xxxxx
NEXT_PUBLIC_APP_URL=https://yourdomain.com
```

### 2. Webhook Configuration

1. Go to Paystack Dashboard (Live Mode)
2. Settings → API Keys & Webhooks
3. Add your production callback URL:
   ```
   https://yourdomain.com/api/payments/callback
   ```

### 3. Payment Limits

For Nigerian businesses:
- Ensure your Paystack account is verified
- Check your daily transaction limits
- Contact Paystack support if you need higher limits

### 4. Customer Support

Paystack provides:
- Email: support@paystack.com
- Documentation: https://paystack.com/docs/

## Troubleshooting

### Issue: Payment Callback Not Being Called

**Solution:**
1. Verify callback URL is correct in `NEXT_PUBLIC_APP_URL`
2. Check Paystack webhook logs:
   - Paystack Dashboard → Activity → Webhooks
   - Look for webhook delivery status
3. Ensure your server is publicly accessible (not localhost)
4. Check `PAYSTACK_SECRET_KEY` is correct

### Issue: "Payment verification failed"

**Solution:**
1. Verify `PAYSTACK_SECRET_KEY` is correct (use Secret Key, not Public)
2. Check the payment reference is being passed correctly
3. Review Paystack transaction logs
4. Ensure amount in kobo matches the database record

### Issue: "Invalid public key"

**Solution:**
1. Verify `NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY` is correct
2. Ensure you're using the Public Key, not Secret Key
3. Check for typos or extra spaces
4. Verify you're using the correct environment (Live/Test)

### Issue: Emails Not Sending

This is a Nodemailer issue, not Paystack. See NODEMAILER_SETUP.md for solutions.

## Payment Verification Flow

The app verifies payments through these steps:

```typescript
// 1. Get payment reference from Paystack redirect
const reference = request.nextUrl.searchParams.get("reference");

// 2. Verify with Paystack API
const verification = await verifyPayment(reference);

// 3. If successful, update booking
if (verification.status && verification.data?.status === "success") {
  // Mark booking as paid
  // Book the seats
  // Send confirmation email
}
```

## Amount Calculation

Paystack requires amounts in **kobo** (smallest currency unit):
- 1 Naira (₦) = 100 Kobo
- Formula: `amount_in_naira * 100 = amount_in_kobo`

The app automatically converts:
```typescript
amount: Math.round(amount * 100) // Convert to kobo
```

## Commission & Fees

Paystack charges transaction fees:
- Check current rates on Paystack Dashboard
- Fees are deducted from your settlement
- You receive net amount after fees

To calculate customer cost:
- Displayed price to customer = what they pay
- Your actual receipt = price minus Paystack fees

## Settlement

- Paystack settles to your bank account
- Settlement timing depends on your account type
- Check Dashboard → Settlements for settlement history
- Automated Bank Settlement (ABS) available for verified accounts

## Additional Resources

- Paystack API Documentation: https://paystack.com/docs/api/
- Paystack Integration Guide: https://paystack.com/docs/integration/
- Sample Code: https://github.com/PaystackHQ/paystack-examples

## Support

For issues:
1. Check Paystack documentation
2. Review server logs
3. Contact Paystack support
4. Check app logs in console
