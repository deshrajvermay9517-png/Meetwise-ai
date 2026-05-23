# Meetwise — AI Meeting Notes SaaS

Meetwise is a premium, production-ready AI meeting notes SaaS. It turns your meeting recordings into transcripts, summaries, action items, and searchable knowledge using a modern, stable tech stack.

---

## ⚡ Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Vanilla CSS (TailwindCSS optional)
- **Database & Auth**: Supabase (PostgreSQL, Supabase Auth SSR, Supabase Storage)
- **Transcription**: OpenAI Whisper API (Optional)
- **AI Analytics**: Anthropic Claude API (Summaries, action items, speaker sentiment, search - Optional)
- **Payments**: Razorpay (Optional)
- **Email**: Resend (Optional)

---

## ⚙️ Local Development Setup

### 1. Install Dependencies
Run the following command from the project root:
```bash
npm install
```

### 2. Environment Variables Configuration
Copy the `env.example` file to `.env.local`:
```bash
cp env.example .env.local
```
Fill in the variables in `.env.local` using the guide below.

#### Required Variables (Basic App & Auth)
```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3001
CRON_SECRET=a-long-random-string-for-cron-jobs
```

#### Optional Integration Variables (No crash if left empty)
- **OpenAI (Whisper + Embeddings)**:
  `OPENAI_API_KEY=` (Set to enable transcription and search embeddings)
- **Anthropic (Claude Analysis)**:
  `ANTHROPIC_API_KEY=` (Set to enable TL;DR, summaries, key decisions, speaker sentiment)
- **Razorpay Payments**:
  `RAZORPAY_KEY_ID=`
  `RAZORPAY_KEY_SECRET=`
  `RAZORPAY_WEBHOOK_SECRET=` (Set to enable Pro plan checkout and subscriptions)
- **Resend Transactional Email**:
  `RESEND_API_KEY=`
  `RESEND_FROM_EMAIL=` (Set to enable transactional email notifications)
- **Google Search Console**:
  `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION=` (Set to add site verification metadata tag)
- **Google Analytics**:
  `NEXT_PUBLIC_GA_MEASUREMENT_ID=` (Set to load Google Analytics tracking script)
- **Google AdSense**:
  `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT=` (Set to load Google AdSense scripts)

### 3. Supabase Auth Configuration
To verify user accounts via email confirmation, you must set the following in your Supabase Project dashboard:
- **Site URL**:
  `http://localhost:3001`
- **Redirect URLs**:
  `http://localhost:3001/**`

### 4. Supabase Database Migration
Ensure you have the pgvector extension enabled. Run the SQL files in `supabase/migrations/` in order:
1. `001_init.sql` (Creates core tables: profiles, workspaces, meetings, transcripts, summaries, action_items, meeting_embeddings, integrations)
2. `002_razorpay.sql` (Creates payments audit table)

### 5. Run the Local Server
Since port 3000 is usually occupied, Meetwise is configured to run on port **3001**:
```bash
npm run dev -- -p 3001
```
Open [http://localhost:3001](http://localhost:3001) in your browser.

---

## 🚀 Production Deployment Checklist

### Vercel Deployment
1. Import your GitHub repository to Vercel.
2. Add all environment variables from `.env.local` to the Vercel dashboard. Update `NEXT_PUBLIC_APP_URL` to your production URL (e.g. `https://meetwise.app`).
3. Set the build command to `npm run build` and output directory to `.next`.
4. Deploy!

### Custom Domain Checklist
1. Purchase a domain (e.g. from Namecheap or GoDaddy) and add it to your Vercel project settings.
2. Configure DNS records (CNAME and A records) as instructed by Vercel.
3. Wait for SSL certificate generation.
4. **CRITICAL**: Go to your Supabase Auth Dashboard -> URL Configuration and update:
   - **Site URL**: `https://yourdomain.com`
   - **Redirect URLs**: `https://yourdomain.com/**`

### Google Search Console Checklist
1. Visit [Google Search Console](https://search.google.com/search-console).
2. Add a new **URL Prefix** property using your production domain (`https://yourdomain.com`).
3. Copy the HTML Tag verification code (looks like `google-site-verification=...`).
4. Set the value as your `NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION` environment variable in Vercel.
5. Redeploy your app on Vercel to reflect the tag.
6. Once the site is live, submit your sitemap to Search Console: `https://yourdomain.com/sitemap.xml`.

### Razorpay Production Checklist
1. Complete KYC verification on the [Razorpay Dashboard](https://dashboard.razorpay.com).
2. Switch from "Test Mode" to "Live Mode".
3. Generate new Live **Key ID** and **Key Secret** and add them to your Vercel env variables.
4. Go to Razorpay Settings -> Webhooks -> Add New Webhook:
   - Webhook URL: `https://yourdomain.com/api/webhooks/razorpay` (or your webhook route)
   - Active Events: `payment.captured`, `subscription.charged`
   - Set a custom **Secret** and add it as `RAZORPAY_WEBHOOK_SECRET` in Vercel.

### Google Analytics & AdSense Checklist
1. **Google Analytics**: Set up a Google Analytics 4 property, copy your `G-XXXXXXXXXX` Measurement ID, and add it as `NEXT_PUBLIC_GA_MEASUREMENT_ID`.
2. **Google AdSense**: Apply for an AdSense account. Once approved, copy your client ID (e.g. `ca-pub-XXXXXXXXXXXXXXXX`) and add it as `NEXT_PUBLIC_GOOGLE_ADSENSE_CLIENT`. Make sure you have created standard Privacy Policy and Terms pages, as Google requires them for approval.

---

## ⚖️ Legal & Trust Pages (Included)
The following public legal routes are built-in and can be easily edited:
- `/privacy` — [Privacy Policy](file:///C:/Users/deshr/Downloads/meetwise%20app/meetwise-complete/meetwise/app/privacy/page.tsx)
- `/terms` — [Terms of Service](file:///C:/Users/deshr/Downloads/meetwise%20app/meetwise-complete/meetwise/app/terms/page.tsx)
- `/refund` — [Refund & Cancellation Policy](file:///C:/Users/deshr/Downloads/meetwise%20app/meetwise-complete/meetwise/app/refund/page.tsx)
- `/contact` — [Contact Support Form](file:///C:/Users/deshr/Downloads/meetwise%20app/meetwise-complete/meetwise/app/contact/page.tsx)
