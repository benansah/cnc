# 🚀 Quick Start Checklist

Complete these steps to get your C&C Transport app running:

## Phase 1: Initial Setup (5 minutes)

- [ ] Clone/download the project
- [ ] Run `npm install --legacy-peer-deps`
- [ ] Create `.env.local` file in project root
- [ ] Copy environment variables template

## Phase 2: Supabase Setup (10 minutes)

- [ ] Create account at https://supabase.com
- [ ] Create a new project
- [ ] Copy `Project URL` and `anon key`
- [ ] Copy `service_role key` (keep secret!)
- [ ] Open `DATABASE_SCHEMA.sql` in Supabase SQL Editor
- [ ] Execute all SQL commands
- [ ] Verify tables created in Supabase dashboard

## Phase 3: Paystack Setup (10 minutes)

- [ ] Create account at https://paystack.com
- [ ] Go to Settings → API Keys
- [ ] Copy `Public Key` and `Secret Key`
- [ ] Note test card numbers for development
- [ ] (Optional) Configure webhook in dashboard

## Phase 4: Email Setup (5 minutes)

### Option A: Gmail (Recommended)
- [ ] Enable 2-Step Verification on Google Account
- [ ] Generate App Password at https://myaccount.google.com/apppasswords
- [ ] Copy the 16-character password

### Option B: Other Provider
- [ ] Sign up with SendGrid, AWS SES, or Resend
- [ ] Get API credentials
- [ ] Update `src/lib/server/nodemailer.ts`

## Phase 5: Environment Variables

Create `.env.local` with these keys:

```
NEXT_PUBLIC_SUPABASE_URL=<your_supabase_url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your_anon_key>
SUPABASE_SERVICE_ROLE_KEY=<your_service_role_key>
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=<your_paystack_public_key>
PAYSTACK_SECRET_KEY=<your_paystack_secret_key>
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@ccbooking.com
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Phase 6: Test the App

- [ ] Run `npm run dev`
- [ ] Open http://localhost:3000
- [ ] Verify homepage loads
- [ ] Go to /admin and add:
  - [ ] A bus (e.g., "Express XL" - 50 seats)
  - [ ] A route (e.g., "Lagos" → "Abuja")
  - [ ] A schedule (set for tomorrow's date)
- [ ] Go back to homepage and search
- [ ] Verify schedule appears
- [ ] Test booking with Paystack test card: `4111 1111 1111 1111`
- [ ] Check inbox for confirmation email

## Phase 7: Production Setup (When Ready)

- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Get Paystack LIVE keys
- [ ] Update Paystack keys in environment
- [ ] Configure Paystack webhook URL
- [ ] Deploy to hosting (Vercel recommended)
- [ ] Update Supabase environment URLs
- [ ] Configure email for production

## Troubleshooting

| Issue | Solution |
|-------|----------|
| npm install fails | Use `--legacy-peer-deps` flag |
| Database connection error | Verify Supabase keys are correct |
| Payment fails | Check Paystack test mode is enabled |
| Emails not sending | Verify Gmail app password setup |
| Page not loading | Check Next.js server is running (port 3000) |

## File Structure Overview

```
src/
├── app/               # Pages and API routes
├── components/        # Reusable UI components
├── lib/              # Utilities and configs
├── types/            # TypeScript types
└── actions/          # Server actions

Key Files:
- DATABASE_SCHEMA.sql     ← Run in Supabase
- SETUP_GUIDE.md          ← Detailed setup
- PAYSTACK_SETUP.md       ← Payment setup
- NODEMAILER_SETUP.md     ← Email setup
```

## Key URLs

- Homepage: http://localhost:3000/
- Booking: http://localhost:3000/booking
- Admin: http://localhost:3000/admin

## Admin Features

1. **Buses Tab**
   - Add new buses with seating capacity
   - View all buses with capacity info

2. **Routes Tab**
   - Create routes between cities
   - View all available routes

3. **Schedules Tab**
   - Combine buses and routes with times/fares
   - Set departure and arrival times
   - Define fare price per seat
   - Specify available seats

4. **Bookings Tab**
   - View all customer bookings
   - Check payment status
   - See passenger and seat details

## Customer Flow

1. Search for buses (route + date)
2. Select a schedule to view seats
3. Choose desired seats (up to 5)
4. Enter passenger details
5. Proceed to payment
6. Pay via Paystack
7. Receive confirmation email
8. Booking complete!

## Payment Test Flow

1. Go to admin and create a test schedule
2. Search and book on homepage
3. At payment page, use test card:
   - **Number:** 4111 1111 1111 1111
   - **Expiry:** Any future date
   - **CVV:** Any 3 digits
   - **PIN:** Any 4 digits
4. Complete payment
5. Check email for confirmation

## API Endpoints

### Public
- `GET /` - Homepage
- `GET /booking` - Booking page

### Admin
- `GET /admin` - Admin dashboard

### Server Actions (in `src/actions/`)
- `getAvailableSchedules()` - Search buses
- `getSeatsForSchedule()` - Get seat layout
- `createBooking()` - Create new booking
- `verifyBookingPayment()` - Verify payment
- `createBus()` - Add new bus (admin)
- `createRoute()` - Add new route (admin)
- `createSchedule()` - Add schedule (admin)
- `getSchedules()` - List schedules (admin)
- `getBookings()` - List bookings (admin)

### API Routes
- `GET /api/payments/callback` - Paystack callback

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| NEXT_PUBLIC_SUPABASE_URL | Database URL | https://xxx.supabase.co |
| NEXT_PUBLIC_SUPABASE_ANON_KEY | Public API key | eyJ... |
| SUPABASE_SERVICE_ROLE_KEY | Admin API key | eyJ... (KEEP SECRET) |
| NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY | Payment public key | pk_test_xxx |
| PAYSTACK_SECRET_KEY | Payment secret key | sk_test_xxx (KEEP SECRET) |
| EMAIL_USER | Sender email | user@gmail.com |
| EMAIL_PASSWORD | Email password | xxxxxxxx (app password) |
| EMAIL_FROM | Email display address | noreply@ccbooking.com |
| NEXT_PUBLIC_APP_URL | App domain | http://localhost:3000 |

## Next Steps After Setup

1. **Customize Branding**
   - Update company name in pages
   - Add your logo
   - Change colors in CSS

2. **Add More Features**
   - Customer login/registration
   - Booking history
   - Refund system
   - Admin analytics

3. **Optimize Performance**
   - Add caching
   - Optimize images
   - Compress assets

4. **Deploy**
   - Push to GitHub
   - Deploy to Vercel
   - Set up CI/CD

## Getting Help

- Check documentation files (SETUP_GUIDE.md, PAYSTACK_SETUP.md, NODEMAILER_SETUP.md)
- Review code comments
- Check terminal logs for error messages
- Verify environment variables are set
- Test with correct test card numbers

## Important Notes

⚠️ **Security:**
- Never commit `.env.local`
- Keep service role key secret
- Use HTTPS in production
- Validate all user inputs

⚠️ **Testing:**
- Use Paystack test mode for development
- Use test cards provided
- Don't use real payment cards

⚠️ **Production:**
- Switch to Paystack LIVE keys
- Update all URLs to production domain
- Set up SSL certificate
- Enable CORS appropriately
- Monitor error logs

---

**Status:** ✅ Ready to use  
**Version:** 1.0.0  
**Last Updated:** May 2026
