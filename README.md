# Campus Hub

A full‑stack web app for sharing and exploring campus interview experiences and resources.

## 🚀 Live Deployment

- **Frontend**: https://campus-hub-blue.vercel.app
- **Backend**: https://campus-hub-server-zyue.onrender.com

## 🛠️ Tech Stack

- **Frontend (`client/`)**: React 18 + Vite with React Router
- **Backend (`server/`)**: Node.js + Express + MongoDB (Mongoose)
- **Auth**: JWT-based
- **Proxy**: Vite dev server proxies `/api` to backend

## 📁 Directory structure

```
Campus Hub/
├─ client/            # React + Vite app
│  ├─ src/
│  │  ├─ components/   # Reusable UI components
│  │  ├─ pages/       # Route components
│  │  └─ config/       # API configuration
│  ├─ package.json    # dev/build/preview scripts
│  └─ vite.config.js  # `/api` → http://localhost:5000 proxy
├─ server/            # Express API server
│  ├─ routes/         # `auth.js`, `posts.js`
│  ├─ models/         # `User.js`, `Post.js`
│  └─ .env           # Environment variables (MONGO_URI, JWT_SECRET)
└─ README.md          # This file
```

## 🚀 Quick Start

- Node.js 18+ and npm
- A MongoDB database (local or cloud)

## Environment variables (`server/.env`)

Create `server/.env` (not committed to git) with the following:

```
# Required
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>/<dbname>?retryWrites=true&w=majority
JWT_SECRET=your-strong-secret

# Optional
DB_NAME=campushub
PORT=5000
NODE_ENV=development
ALLOW_MAINTENANCE=true   # enable /api/posts/cleanup-saved in non-prod
```

Notes:
- `PORT` defaults to `5000` if not set.
- The client dev server proxies `/api` to `http://localhost:5000` as configured in `client/vite.config.js`.

## Installation

Run the client and server installs separately.

- **Backend**
  1. `cd server` (from your terminal)
  2. `npm install`
  3. Create `.env` as above
  4. `npm start`
  5. Health check: open `http://localhost:5000/api/health`

- **Frontend**
  1. `cd client`
  2. `npm install`
  3. `npm run dev`
  4. Open the printed local URL (typically `http://localhost:5173`)

## Scripts

- **client/package.json**
  - `npm run dev` – start Vite dev server
  - `npm run build` – production build
  - `npm run preview` – preview built app

- **server/package.json**
  - `npm start` – start Express server (`server.js`)

## API overview

Base URL during local dev: `http://localhost:5000`

- **Health**
  - `GET /api/health` → `{ status: 'ok', dbState: <0|1|2|3> }`

- **Auth (`/api/auth`)**
  - `GET /api/auth/health` → quick router check
  - `POST /api/auth/signup`
    - body: `{ name, email, password, startYear?, passOutYear?, department?, rollNumber?, avatarUrl? }`
    - requires `JWT_SECRET` configured
  - `POST /api/auth/login`
    - body: `{ email, password }`
    - returns `{ token, user }`
  - `GET /api/auth/me` (requires `Authorization: Bearer <token>`) → `{ user }`

- **Posts (`/api/posts`)**
  - `GET /api/posts` – list posts, optional `?createdByEmail=` filter
  - `GET /api/posts/saved` – list saved posts for the authenticated user
  - `GET /api/posts/:id` – get single post
  - `POST /api/posts` – create post (auth required)
    - fields include `title`, `description`, `company?`, `role?`, `interviewType?`, `questionsAsked?[]`, `preparationTips?`, `personalInsights?`, `difficulty?`, `experience?`, `numberOfRounds?`, `numberOfProblems?`, `tags?[]`
  - `PUT /api/posts/:id` – update post (owner only)
  - `DELETE /api/posts/:id` – delete post (owner only)
  - `POST /api/posts/save` – save a post to the authenticated user’s `savedPosts`
  - `POST /api/posts/cleanup-saved` – dev/maintenance to clean invalid saved references (guarded by `ALLOW_MAINTENANCE` or `NODE_ENV !== 'production'`)

Auth middleware expects `Authorization: Bearer <token>` and verifies with `JWT_SECRET`.

## Development tips

- If the client cannot reach the API, verify the backend is running on port `5000` and your `MONGO_URI` is valid.
- Adjust proxy target in `client/vite.config.js` if the API port changes.
- Logs in `server/routes/*` can help trace common errors (e.g., missing JWT or invalid credentials).

## Build & Deployment (basic)

- **Frontend**: `cd client && npm run build` → deploy `client/dist/` to static hosting.
- **Backend**: deploy `server/` to your Node hosting provider; make sure to set env vars and connect to MongoDB.

