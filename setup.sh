#!/bin/bash
# MeetWise — one-command setup
# Usage: bash setup.sh

set -e

echo ""
echo "╔══════════════════════════════════════╗"
echo "║        MeetWise Setup Script         ║"
echo "╚══════════════════════════════════════╝"
echo ""

# 1. Check Node.js
if ! command -v node &> /dev/null; then
  echo "Node.js not found. Install from https://nodejs.org (v18+ required)"
  exit 1
fi

NODE_VER=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VER" -lt 18 ]; then
  echo "Node.js v18+ required. Current: $(node -v)"
  exit 1
fi
echo "Node.js $(node -v) - OK"

# 2. Install dependencies
echo ""
echo "Installing dependencies..."
npm install
echo "Dependencies installed"

# 3. Set up .env.local
if [ ! -f .env.local ]; then
  cp env.example .env.local
  echo ""
  echo "Created .env.local - fill in your API keys before running the app:"
  echo ""
  echo "  NEXT_PUBLIC_SUPABASE_URL=        # from supabase.com project settings"
  echo "  NEXT_PUBLIC_SUPABASE_ANON_KEY=   # from supabase.com project settings"
  echo "  SUPABASE_SERVICE_ROLE_KEY=       # from supabase.com project settings"
  echo "  OPENAI_API_KEY=                  # from platform.openai.com"
  echo "  ANTHROPIC_API_KEY=               # from console.anthropic.com"
  echo "  RAZORPAY_KEY_ID=                 # add after Razorpay KYC"
  echo "  RAZORPAY_KEY_SECRET=             # add after Razorpay KYC"
  echo "  RAZORPAY_WEBHOOK_SECRET=         # add after Razorpay KYC"
  echo "  RESEND_API_KEY=                  # from resend.com"
  echo "  RESEND_FROM_EMAIL=               # verified sender address"
  echo "  NEXT_PUBLIC_APP_URL=http://localhost:3001"
  echo "  CRON_SECRET=any-random-long-string"
  echo ""
  echo "Then run: npm run dev -- -p 3001"
else
  echo ".env.local exists - OK"
  echo ""
  echo "Starting dev server at http://localhost:3001"
  npm run dev -- -p 3001
fi
