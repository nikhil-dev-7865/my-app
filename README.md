# My App

A modern personal finance and expense tracking application built with Next.js, Prisma, PostgreSQL, and Clerk. The platform helps users manage accounts, track spending, monitor budgets, and understand their financial activity through a clean dashboard and transaction workflow.

## Overview

This project is designed for users who want a simple but powerful way to:

- track income and expenses across multiple accounts
- monitor budget progress and spending trends
- create and manage transactions quickly
- review account-level financial summaries
- sign in securely with Clerk authentication
- receive email notifications and AI-assisted transaction support

## Features

- Secure authentication with Clerk
- Multi-account dashboard with financial summaries
- Budget tracking and progress visualization
- Transaction creation and management
- Account overview with recent activity
- AI-enhanced expense insights using Gemini/Groq-style integration patterns
- Email notifications with Resend
- Background automation via Inngest
- Anti-abuse and request protection with Arcjet
- PostgreSQL data layer powered by Prisma
- Responsive UI built with Next.js App Router and Tailwind CSS

## Tech Stack

- Next.js 16
- React 19
- Tailwind CSS
- Prisma ORM
- PostgreSQL
- Clerk Auth
- Resend email
- Inngest workflows
- Arcjet security
- Gemini API integration
- shadcn/ui component patterns

## Project Structure

```bash
.
├── app/
│   ├── (auth)/
│   ├── (main)/
│   ├── api/
│   ├── globals.css
│   └── layout.js
├── actions/
├── components/
├── lib/
├── prisma/
├── public/
├── data/
├── emails/
├── hooks/
├── middleware.js
├── package.json
├── prisma.config.ts
├── next.config.js
├── README.md
└── .env.example
```

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up environment variables

Create a `.env.local` file in the project root and add the required values:

```bash
DATABASE_URL="your_postgres_connection_string"
DIRECT_URL="your_direct_postgres_connection_string"

CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"

RESEND_API_KEY="your_resend_api_key"
GEMINI_API_KEY="your_gemini_api_key"

ARCJET_KEY="your_arcjet_key"
```

If your project uses additional environment variables for Inngest or deployment, add them here as needed.

### 3. Run Prisma migrations

```bash
npx prisma migrate dev
```

### 4. Start the app

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## Available Scripts

```bash
npm run dev
npm run build
npm run start
npm run lint
npm run email
```

## Deployment

This app is ready to be deployed on platforms such as Northflank. For production deployment, set all environment variables in your hosting provider and ensure your Prisma/PostgreSQL database is available.

### Northflank checklist

- Use a Web Service for the Next.js app
- Build command: `npm install && npm run build`
- Start command: `npx next start -H 0.0.0.0 -p 3000`
- Set the app port to `3000`
- Add all required secrets from `.env.example` in Northflank
- Connect a PostgreSQL database and set `DATABASE_URL` and `DIRECT_URL`
- Set Clerk public and secret keys before deployment

### Required environment variables

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
CLERK_SECRET_KEY="your_clerk_secret_key"
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"

DATABASE_URL="your_postgres_connection_string"
DIRECT_URL="your_direct_postgres_connection_string"

ARCJET_KEY="your_arcjet_key"
RESEND_API_KEY="your_resend_api_key"
GEMINI_API_KEY="your_gemini_api_key"
```
## License

This project is currently unlicensed and intended for personal or internal use unless otherwise specified.

## Repository Description

Personal finance tracker built with Next.js, Prisma, Clerk, and PostgreSQL for managing budgets, accounts, and transaction insights.
