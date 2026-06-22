# PromptHive — AI Prompt Sharing & Marketplace Platform

## 🌐 Live URL
[https://prompthive.vercel.app](https://prompthive.vercel.app)

## 📌 Project Purpose
PromptHive is a community-driven marketplace where users can discover, share, bookmark, and manage AI prompts for tools like ChatGPT, Gemini, Claude, Midjourney, and more.

## ✨ Key Features
- 🔐 JWT-based authentication (Email/Password + Google OAuth)
- 👥 Role-based access control (User / Creator / Admin)
- 📝 Prompt CRUD with admin moderation (pending → approved/rejected)
- 🔒 Premium prompt locking with Stripe one-time $5 payment
- 🔖 Bookmark toggle system with duplicate prevention
- ⭐ Review & rating system
- 🚩 Report prompt with reason + description
- 🔍 Server-side search, filter, and sort
- 📊 Creator analytics dashboard (Recharts)
- 🛡️ Admin dashboard (users, prompts, payments, reports, analytics)
- 📱 Fully responsive (mobile, tablet, desktop)
- 🎞️ Framer Motion animations throughout

## 🧰 NPM Packages Used

### Frontend
| Package | Purpose |
|---------|---------|
| `next` 14 | App framework |
| `react`, `react-dom` | UI library |
| `framer-motion` | Animations |
| `axios` | HTTP client |
| `react-icons` | Icon library |
| `react-hot-toast` | Toast notifications |
| `recharts` | Charts & graphs |
| `tailwindcss` | Utility CSS framework |
| `clsx` | Conditional classNames |

### Backend
| Package | Purpose |
|---------|---------|
| `express` | Server framework |
| `mongoose` | MongoDB ODM |
| `jsonwebtoken` | JWT auth |
| `bcryptjs` | Password hashing |
| `cors` | Cross-origin requests |
| `dotenv` | Environment variables |
| `stripe` | Payment processing |

## 🚀 Getting Started

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
npm install
node index.js
```

## 🔑 Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=https://ai-prompt-sharing-server.vercel.app
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

### Backend (.env)
```
PORT=5000
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your_jwt_secret
STRIPE_SECRET_KEY=sk_test_...
```

## 👤 Admin Credentials
- Email: admin@prompthive.com
- Password: Admin@12345
