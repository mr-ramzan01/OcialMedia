# Ocial Media

An Instagram-style social network: posts with multiple images, reactions, comments, stories,
follows, saved posts, notifications and real-time 1:1 chat.

| Part | Stack |
|------|-------|
| `Client/` | React 18, Material UI 9, React Router 7, Socket.IO client, Create React App |
| `Server/` | Node 20+, Express 5, Mongoose 9 (MongoDB), Socket.IO, JWT auth, Cloudinary uploads |

## Prerequisites

- Node.js 20.19 or newer (Node 22 LTS recommended)
- MongoDB 7/8 running locally, **or** a MongoDB Atlas connection string
  - macOS: `brew tap mongodb/brew && brew install mongodb-community && brew services start mongodb-community`
- Optional: a [Cloudinary](https://cloudinary.com) account (required for image uploads: posts, stories, profile photos)
- Optional: Google OAuth client id/secret (for "Continue with Google")
- Optional: [EmailJS](https://www.emailjs.com) keys (for the forgot-password email; without them the reset link is shown on screen)

## Run locally

### 1. Backend

```bash
cd Server
cp .env.example .env        # then edit: JWT_SECRET_KEY, MONGO_URI, Cloudinary keys, ...
npm install
npm run dev                 # node --watch server.js  (or: npm start)
```

The API listens on http://localhost:8080 (`GET /health` for a liveness check).

### 2. Frontend

```bash
cd Client
npm install
npm start                   # http://localhost:3000, proxies to REACT_APP_API_URL
```

`Client/.env.development` points at `http://localhost:8080`. For other environments copy
`Client/.env.example` and set `REACT_APP_API_URL` (and the optional Google / EmailJS keys).

### Production build

```bash
cd Client && npm run build   # output in Client/build
```

## Environment variables

### Server (`Server/.env`)

| Variable | Required | Description |
|----------|----------|-------------|
| `PORT` | no | API port (default 8080) |
| `CLIENT_URL` | no | Comma separated list of allowed browser origins (default: localhost:3000 and the Netlify site) |
| `MONGO_URI` | yes* | Full MongoDB connection string |
| `DB_USERNAME`, `DB_PASSWORD`, `DB_URL` | yes* | Legacy Atlas pieces, used only when `MONGO_URI` is unset |
| `JWT_SECRET_KEY` | yes | Secret used to sign login tokens |
| `CLOUD_NAME`, `CLOUD_API_KEY`, `CLOUD_API_SECRET` | for uploads | Cloudinary credentials |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `GOOGLE_REDIRECT_URI` | for Google login | OAuth config; redirect URI must be `<client url>/google_Oauth` |

### Client (`Client/.env.*`)

| Variable | Description |
|----------|-------------|
| `REACT_APP_API_URL` | Backend base URL (no trailing slash) |
| `REACT_APP_GOOGLE_CLIENT_ID` | Google OAuth client id; the Google button is hidden when empty |
| `REACT_APP_EMAILJS_SERVICE_ID`, `REACT_APP_EMAILJS_TEMPLATE_ID`, `REACT_APP_EMAILJS_PUBLIC_KEY` | EmailJS config for password-reset emails |

## API overview

All routes are under `/api` and, except signup/login/forgot-password/Google OAuth, require
`Authorization: Bearer <token>`.

`users`, `posts` (including `DELETE /api/posts/:id` for your own posts), `likes`, `comments`, `follows`,
`savedposts` (save / unsave), `stories`, `notifications`, `chats`, `messages`, `messages/notifications`.
See `Server/routers/` for the full list.

Security defaults: `helmet` headers, a global rate limit of 600 requests per 15 minutes per IP, and a
stricter 30 per 15 minutes on login, signup and forgot-password.

Socket.IO events: `setup`, `join chat`, `typing`, `stop typing`, `new message` (client to server)
and `connected`, `typing`, `stop typing`, `message received` (server to client).
