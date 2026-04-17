# 🚀 DevShowcase — Personal Website Gallery Platform

A production-ready full-stack platform to showcase your personal projects with a beautiful dark UI, admin dashboard, drag-and-drop reordering, and Cloudinary image uploads.

---

## 📁 Project Structure

```
showcase/
├── backend/          ← Express + MongoDB API
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── middleware/
│   │   └── adminAuth.js
│   ├── models/
│   │   └── Website.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── websites.js
│   │   └── upload.js
│   ├── server.js
│   ├── .env.example
│   ├── vercel.json
│   └── package.json
│
└── frontend/         ← React + Vite + Tailwind
    ├── src/
    │   ├── components/
    │   │   ├── ui/         (Navbar, StatusBadge, SkeletonCard, ScrollProgress)
    │   │   ├── showcase/   (WebsiteCard, FilterBar, HeroSection)
    │   │   └── admin/      (WebsiteForm, SortableItem)
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── hooks/
    │   │   ├── useWebsites.js
    │   │   └── useScrollProgress.js
    │   ├── lib/
    │   │   └── api.js
    │   ├── pages/
    │   │   ├── HomePage.jsx
    │   │   ├── SitePage.jsx
    │   │   ├── AdminLogin.jsx
    │   │   └── AdminDashboard.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── .env.example
    ├── vercel.json
    └── package.json
```

---

## ⚡ Local Development Setup

### Step 1 — Backend

```bash
cd backend
npm install
cp .env.example .env
# Fill in your .env values (see below)
npm run dev
# → Runs on http://localhost:5000
```

### Step 2 — Frontend

```bash
cd frontend
npm install
cp .env.example .env.local
# Set VITE_API_URL=http://localhost:5000/api
npm run dev
# → Runs on http://localhost:3000
```

---

## 🔐 Environment Variables

### Backend `.env`

```env
PORT=5000
MONGODB_URI=mongodb+srv://USER:PASS@cluster.mongodb.net/showcase?retryWrites=true&w=majority
ADMIN_PASSWORD=your_strong_password_here
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend `.env.local`

```env
VITE_API_URL=http://localhost:5000/api
```

---

## 🛠️ Getting Your Credentials

### MongoDB Atlas
1. Go to [mongodb.com/atlas](https://mongodb.com/atlas) → Create free cluster
2. Database Access → Add user with password
3. Network Access → Allow from anywhere: `0.0.0.0/0`
4. Connect → Drivers → Copy URI → paste in `.env`

### Cloudinary
1. Go to [cloudinary.com](https://cloudinary.com) → Free account
2. Dashboard → copy Cloud name, API Key, API Secret → paste in `.env`

---

## 🚀 Vercel Deployment

### Deploy Backend

```bash
cd backend
npx vercel --prod
# Add all .env variables in Vercel dashboard → Settings → Environment Variables
# Set FRONTEND_URL to your frontend Vercel URL
```

### Deploy Frontend

```bash
cd frontend
npx vercel --prod
# Add VITE_API_URL=https://your-backend.vercel.app/api in Vercel env vars
```

> ⚠️ **Important**: After deploying both, update:
> - Backend `FRONTEND_URL` → your frontend Vercel URL
> - Frontend `VITE_API_URL` → your backend Vercel URL + `/api`

---

## 🧭 Routes

| Route | Description |
|-------|-------------|
| `/` | Public homepage with project gallery |
| `/site/:id` | Individual project detail page |
| `/admin/login` | Admin login (password from `.env`) |
| `/admin` | Admin dashboard (protected) |

---

## 🔌 API Endpoints

| Method | Route | Auth | Description |
|--------|-------|------|-------------|
| GET | `/api/health` | No | Health check |
| POST | `/api/auth/login` | No | Admin login |
| POST | `/api/auth/verify` | Token | Verify token |
| GET | `/api/websites` | No | List all websites |
| GET | `/api/websites/:id` | No | Get + increment views |
| POST | `/api/websites` | Admin | Create website |
| PUT | `/api/websites/:id` | Admin | Update website |
| DELETE | `/api/websites/:id` | Admin | Delete website |
| PUT | `/api/websites/bulk/reorder` | Admin | Reorder websites |
| POST | `/api/upload` | Admin | Upload single image |
| POST | `/api/upload/multiple` | Admin | Upload multiple images |

---

## ✨ Features

- 🎨 **Premium dark UI** — Glassmorphism + gradient accents
- 🃏 **3D tilt cards** — react-parallax-tilt on hover
- 🔄 **Drag & drop** — dnd-kit to reorder projects
- 📸 **Image upload** — Cloudinary with preview
- 🔍 **Search & filter** — by name, tech, status
- 🔢 **View counter** — auto-increments on page visit
- 📱 **Responsive** — mobile-first design
- ⚡ **Smooth scroll** — Lenis scroll library
- 📊 **Scroll progress** — top progress indicator
- 🔐 **Admin auth** — simple password protection
- 💀 **Skeleton loaders** — while data fetches
- 🚦 **Rate limiting** — protects API endpoints

---

## 🔒 Security Notes

- Admin password is **never sent to the client** — only compared server-side
- Token is base64 of password, verified on every protected request
- CORS is locked to your `FRONTEND_URL`
- Rate limiting: 100 req/15min globally, 10 login attempts/15min
- Input validation on all routes
- Helmet.js for HTTP security headers

---

## 🎛️ Admin Dashboard Usage

1. Go to `/admin/login` → enter your `ADMIN_PASSWORD`
2. **Add Project** → Fill form, upload images, add tech tags
3. **Edit** → Click pencil icon on any project
4. **Delete** → Click trash icon → confirm
5. **Reorder** → Drag grip handle to reorder
6. **Toggle view** → List/Grid toggle at top right of list
