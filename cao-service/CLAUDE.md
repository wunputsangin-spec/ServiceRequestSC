# CLAUDE.md — Project Configuration

> ไฟล์นี้ใช้กำหนด context และ rules สำหรับ Claude Code  
> Stack: **Next.js (App Router) + TypeScript + Tailwind CSS + Supabase + Vercel**

---

## 🧱 Tech Stack

| Layer        | Technology                          |
|--------------|-------------------------------------|
| Framework    | Next.js (App Router, TypeScript)    |
| Styling      | Tailwind CSS v4 + shadcn/ui         |
| Database     | Supabase (PostgreSQL + Auth)        |
| Deployment   | Vercel                              |
| Version Ctrl | GitHub                              |

---

## 🌍 Environment

- **ทุก operation รันใน Claude Code Sandbox เท่านั้น**
- ห้าม install หรือแก้ไขอะไรนอก Sandbox
- ห้าม commit ไฟล์ `.env.local` หรือ secret ขึ้น GitHub

---

## 📁 File & Folder Conventions

```
app/
  layout.tsx          # Root layout (Server Component)
  page.tsx            # Home page
  (auth)/             # Auth route group
  api/[route]/
    route.ts          # API route handlers
lib/
  supabase/
    client.ts         # Browser client (createBrowserClient)
    server.ts         # Server client (createServerClient)
  db.ts               # Database queries — ห้าม inline ใน components
components/
  ui/                 # shadcn/ui components
  [feature]/          # Feature-specific components
```

---

## ⚙️ Component Rules

- **Server Components คือ default** — ไม่ต้องเพิ่ม directive อะไร
- เพิ่ม `"use client"` เฉพาะเมื่อใช้: `useState`, `useEffect`, `onClick`, browser APIs
- **ห้าม** call database หรือ Supabase client ตรงๆ ใน Client Components
- ทุก async data fetching ทำใน Server Components หรือ Route Handlers

---

## 🗄️ Supabase

### Client Setup
```ts
// lib/supabase/server.ts — ใช้ใน Server Components และ Route Handlers
import { createServerClient } from '@supabase/ssr'

// lib/supabase/client.ts — ใช้ใน Client Components เท่านั้น
import { createBrowserClient } from '@supabase/ssr'
```

### Environment Variables
```env
# .env.local (ห้าม commit)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sb_publishable_xxx   # แทน anon key (ใหม่)
SUPABASE_SECRET_KEY=sb_secret_xxx                         # แทน service_role key (ใหม่)
```

> ⚠️ Supabase เปลี่ยน key format ใหม่ปี 2026: ใช้ `sb_publishable_xxx` / `sb_secret_xxx`  
> Legacy `anon` / `service_role` keys จะถูก deprecated ปลายปี 2026

### Row Level Security (RLS)
- เปิด RLS ทุก table เสมอ
- เขียน SQL migration สำหรับ policies ไว้ใน `supabase/migrations/`

---

## 🚀 Deployment

### GitHub → Vercel Flow
1. Push ขึ้น `main` branch → Vercel auto-deploy production
2. Push ขึ้น branch อื่น → Vercel สร้าง Preview URL อัตโนมัติ

### Environment Variables บน Vercel
ต้องตั้งค่าใน Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SECRET_KEY`

### Vercel Integration กับ Supabase
เปิดใช้ผ่าน Vercel Dashboard → Settings → Integrations → Supabase  
(จะ sync environment variables โดยอัตโนมัติ)

---

## 🛠️ Commands

```bash
npm run dev          # Start dev server (Turbopack — Next.js 16 default)
npm run build        # Production build
npx tsc --noEmit     # Type check
npm run lint         # ESLint
```

---

## 📝 Middleware

> ⚠️ Next.js 16: middleware logic ต้องอยู่ใน `proxy.ts` ไม่ใช่ `middleware.ts`

---

## 🔒 Security Rules

- ห้าม hardcode secrets ในโค้ด
- ห้าม expose `SUPABASE_SECRET_KEY` ไปฝั่ง client
- ใช้ environment variables สำหรับทุก credential
- ตรวจสอบว่า `.env.local` อยู่ใน `.gitignore` เสมอ

---

## ✅ .gitignore ที่ต้องมี

```
.env.local
.env*.local
.next/
node_modules/
```

---

*อัปเดตล่าสุด: มิถุนายน 2026*
