# 🚌 C&C Transport - Bus Booking System

A modern, full-featured bus booking application built with Next.js, Supabase, and Paystack.

## 📋 Features

✅ **Passenger Features**
- Search for available buses by route and date
- Interactive seat selection with real-time availability
- Secure payment processing via Paystack
- Email confirmation with ticket details
- Responsive design with glass morphism UI

✅ **Admin Features**
- Manage buses with capacity and details
- Create and manage routes
- Schedule buses with times and fares
- Automatic seat generation
- View all bookings and payments
- Real-time availability updates

✅ **Technical Features**
- Server-side components with Next.js 16+
- Supabase for backend database
- Paystack payment integration
- Nodemailer for email notifications
- Font Awesome icons
- Tailwind CSS with glass morphism
- TypeScript for type safety
- React Hook Form for form handling

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm/yarn
- Supabase account (create at https://supabase.com)
- Paystack account (create at https://paystack.com)
- Gmail account for Nodemailer (or any SMTP service)

### Installation

1. **Install Dependencies**
```bash
npm install --legacy-peer-deps
```

2. **Set Up Environment Variables**

Create a `.env.local` file in the root directory:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Paystack Configuration
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=your_paystack_public_key
PAYSTACK_SECRET_KEY=your_paystack_secret_key

# Email Configuration (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
EMAIL_FROM=noreply@ccbooking.com

# App URL
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**How to Get These Keys:**

#### Supabase
1. Go to https://supabase.com and create an account
2. Create a new project
3. Go to Settings → API
4. Copy `Project URL` and `anon key`
5. Also copy the `service_role key` (keep this secret!)

#### Paystack
1. Go to https://paystack.com and sign up
2. Go to Settings → API Keys
3. Copy both your Public and Secret keys
4. Enable Paystack via your dashboard

#### Gmail (for Nodemailer)
1. Enable 2-Step Verification on your Google Account
2. Go to https://myaccount.google.com/apppasswords
3. Generate an App Password for "Mail"
4. Use this 16-character password as `EMAIL_PASSWORD`

### Database Setup

1. **Create Database Tables**
   - Go to your Supabase project dashboard
   - Click on "SQL Editor"
   - Open `DATABASE_SCHEMA.sql` file from this repo
   - Copy and paste all the SQL commands
   - Execute them to create all tables and indexes

2. **Verify Tables**
   - Go to the "Tables" section in Supabase
   - You should see:
     - buses
     - routes
     - bus_schedules
     - seats
     - bookings
     - tickets

### Running the Application

```bash
# Development
npm run dev

# Open http://localhost:3000 in your browser
```

## 📱 Application Routes

### Customer Routes
- `/` - Homepage with search
- `/booking` - Booking page with schedule search and seat selection
- `/booking?success=true` - Booking confirmation page

### Admin Routes
- `/admin` - Admin dashboard (manage buses, routes, schedules, view bookings)

### API Routes
- `POST /api/payments/callback` - Paystack payment verification callback

## 🎯 How It Works

### Booking Flow
1. User searches for buses by route and date
2. Available schedules are displayed with pricing
3. User clicks to expand a schedule and view seat map
4. User selects 1-5 seats from the interactive seat layout
5. User enters passenger details
6. Payment is processed via Paystack
7. Upon successful payment, user receives confirmation email with ticket

### Admin Flow
1. Admin creates buses with capacity
2. Admin creates routes (From City → To City)
3. Admin creates schedules by selecting bus, route, date, time, and fare
4. System automatically generates seat layout (e.g., 6 rows × 2 columns = 12 seats)
5. When a ticket is booked and paid, seats are marked as unavailable
6. Admin can view all bookings, payment status, and passenger details

## 🏗️ Project Structure

```
src/
├── app/
│   ├── (routes)/           # Main route group
│   │   ├── page.tsx        # Homepage
│   │   ├── booking/        # Booking page
│   │   └── admin/          # Admin dashboard
│   ├── api/                # API routes
│   │   └── payments/
│   │       └── callback/   # Payment verification
│   ├── layout.tsx          # Root layout
│   └── globals.css         # Global styles
├── components/
│   ├── ui/                 # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   └── form.tsx
│   ├── seats/              # Seat selection component
│   └── tickets/            # Ticket display component
├── lib/
│   ├── supabase/           # Supabase configuration
│   ├── server/             # Server utilities
│   │   ├── nodemailer.ts
│   │   └── paystack.ts
│   └── utils.ts            # Helper functions
├── types/                  # TypeScript types
└── actions/                # Server actions
```

## 🎨 UI/UX Features

- **Glass Morphism Design** - Modern frosted glass effect with backdrop blur
- **Responsive Layout** - Works on mobile, tablet, and desktop
- **Interactive Seat Map** - Visual bus seat layout with real-time selection
- **Beautiful Cards** - Gradient cards with glass effect
- **Font Awesome Icons** - Professional icons throughout the app
- **Smooth Transitions** - Animated state changes and interactions
- **Toast Notifications** - User feedback with Sonner

## 🔐 Security

- Server-side rendering for sensitive operations
- Environment variables for secrets
- Supabase RLS (Row Level Security) ready
- Input validation with Zod
- CORS configured for Paystack

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues or questions:
- Create an issue on GitHub
- Email support at support@ccbooking.com
- Check the FAQ section

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🙏 Credits

Built with:
- [Next.js](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend as a Service
- [Paystack](https://paystack.com/) - Payment processing
- [Tailwind CSS](https://tailwindcss.com/) - Styling
- [Shadcn/ui](https://ui.shadcn.com/) - UI components
- [Font Awesome](https://fontawesome.com/) - Icons
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Sonner](https://sonner.emilkowal.ski/) - Notifications

---

**Version:** 1.0.0  
**Last Updated:** May 2026
