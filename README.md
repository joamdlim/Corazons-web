# 🎂 Corazón Cakes — Full-Stack Cake Ordering Website

A complete, production-ready cake ordering website built with Next.js 14 (App Router), TypeScript, Tailwind CSS v4, Supabase + Prisma ORM, and NextAuth.js v5.

---

## ✨ Features

- **Public website** — 6-section landing page (Hero, Cake Collection, Order Form, About, Contact)
- **Full menu page** — `/menu` with all cakes
- **Cake detail page** — `/cake/[id]` with flavor/size selectors
- **Cal.com integration** — embedded booking calendar for pickup date selection
- **Admin panel** — protected `/admin/*` routes with full CRUD
- **Responsive** — mobile-first, hamburger navbar, touch-target-compliant
- **Toast notifications** — success/error feedback on all forms

---

## 🛠️ Prerequisites

- Node.js 18+
- npm 9+
- A [Supabase](https://supabase.com) project (free tier works)
- A [Cal.com](https://cal.com) account (for booking embed)

---

## ⚙️ Environment Variables

Copy `.env.example` to `.env` and fill in all values:

```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `DATABASE_URL` | Supabase PostgreSQL connection string (pooler URL for Prisma) |
| `DIRECT_URL` | Direct Supabase Postgres URL (non-pooler, for migrations) |
| `NEXTAUTH_URL` | Your app URL (`http://localhost:3000` for local dev) |
| `NEXTAUTH_SECRET` | Random secret string — generate with `openssl rand -base64 32` |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anon/public key |
| `NEXT_PUBLIC_CALCOM_USERNAME` | Your Cal.com username (e.g. `yourusername`) |

---

## 🚀 Setup & Run

### 1. Clone & Install

```bash
cd corazon-cakes
npm install
```

### 2. Configure Environment

```bash
cp .env.example .env
# Fill in all values in .env
```

### 3. Prisma — Generate Client

```bash
npm run db:generate
# or: npx prisma generate
```

### 4. Migrate Database

Run migrations to create all tables:

```bash
npm run db:migrate
# or: npx prisma migrate dev --name init
```

> For production, use `npx prisma migrate deploy` instead.

### 5. Seed Database

Seed 5 cakes + 1 admin user:

```bash
npm run db:seed
# or: npx prisma db seed
```

This creates:
- 5 artisan cake entries
- Admin user: **admin@cakeshop.com** / **admin123**
- Default settings row

### 6. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the website.
Admin panel: [http://localhost:3000/admin/login](http://localhost:3000/admin/login)

---

## 📅 Cal.com Setup

1. Create a free account at [cal.com](https://cal.com)
2. Create an event type called `cake-pickup`
3. Set your username in `.env`:
   ```env
   NEXT_PUBLIC_CALCOM_USERNAME="your-username"
   ```
4. The booking widget will appear in the Order section automatically

---

## 🗂️ Project Structure

```
corazon-cakes/
├── app/
│   ├── page.tsx              # Landing page (6 sections)
│   ├── menu/                 # Full menu page
│   ├── cake/[id]/            # Cake detail page
│   ├── order/                # Standalone order page
│   ├── admin/                # Protected admin panel
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── orders/
│   │   ├── cakes/
│   │   ├── messages/
│   │   └── settings/
│   └── api/                  # API routes (public + admin)
├── components/
│   ├── admin/                # Admin-specific components
│   ├── Navbar.tsx
│   ├── HeroSection.tsx
│   ├── CakeCollection.tsx
│   ├── CakeCard.tsx
│   ├── ProductDetail.tsx
│   ├── OrderSection.tsx      # Cal.com + OrderForm
│   ├── OrderForm.tsx
│   ├── AboutSection.tsx
│   ├── ContactSection.tsx
│   └── Footer.tsx
├── lib/
│   ├── prisma.ts
│   ├── auth.ts               # NextAuth v5 config
│   └── supabase.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── middleware.ts              # Route protection
└── .env.example
```

---

## 🔐 Admin Credentials

After seeding:
- **URL**: `/admin/login`
- **Email**: `admin@cakeshop.com`
- **Password**: `admin123`

> ⚠️ Change the password before deploying to production!

---

## 🌐 Deployment (Vercel)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Add all environment variables in Vercel dashboard
4. Run `npx prisma migrate deploy` in Vercel build command or via Supabase dashboard

---

## 🎨 Design System

| Token | Value |
|---|---|
| Dark bg | `#1a1a1a` |
| Light bg | `#fdf8f3` |
| Primary pink | `#f4a7b9` |
| Sage green | `#a8c5a0` |
| Muted text | `#888780` |
| Heading font | Playfair Display (serif) |
| Body font | Inter (sans-serif) |
