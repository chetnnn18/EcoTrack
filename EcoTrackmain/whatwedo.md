# WasteWise - What We Did

> Project: WasteWise MERN  
> Stack: React (Vite) + Tailwind CSS + Node.js + Express + MongoDB  
> Purpose: Track the current conversion work and explain what changed.

---

## Current Project Structure

```text
wastewise-main/
├── client/               React Vite web application
├── server/               Express REST API
├── whatwedo.md           Session log
├── README.md             Setup and usage guide
└── package.json          Root helper scripts
```

---

## Session - 2026-06-18 MERN Conversion

### Goals Completed

1. Converted WasteWise into a web-first MERN stack application.
2. Removed the previous native app package.
3. Removed old native build and location workflows.
4. Replaced device-fed bin behavior with database-managed bin records.
5. Preserved useful business features: JWT auth, registration, OTP verification, reports, uploads, profile updates, admin reporting, users, notifications, rewards, and status tracking.
6. Redesigned the UI with an eco-friendly emerald/teal visual system.

### Backend Changes

- Renamed the API folder to `server/`.
- Added `/api/bins` for database-managed bin records.
- Added `server/controllers/binController.js` and `server/routes/binRoutes.js`.
- Updated bin records to use:
  - `name`
  - `location`
  - `fillLevel`
  - `status`
  - `lastUpdated`
- Removed public device ingestion.
- Updated waste categories to:
  - Plastic
  - Paper
  - Glass
  - Metal
  - Organic
  - Electronic Waste
  - Mixed Waste
- Relaxed report location handling so web users can submit an address without native coordinates.
- Added local upload fallback when Cloudinary credentials are not present.
- Added authenticated password change endpoint: `PATCH /api/auth/change-password`.
- Cleaned server bootstrap and static upload serving.

### Frontend Changes

- Renamed the web folder to `client/`.
- Rebuilt the React app around:
  - Landing page
  - Login
  - Register
  - OTP verification
  - Forgot password
  - Reset password
  - User dashboard
  - Report waste
  - My reports
  - Admin dashboard
  - Profile
- Added Tailwind CSS, Lucide React, Recharts, and Framer Motion.
- Added reusable UI components:
  - `Logo`
  - `ProtectedRoute`
  - `StatusBadge`
  - `StatCard`
  - `EmptyState`
- Added responsive navigation and dashboard layout.
- Added admin charts, report filters, user table, and database-managed bin controls.

### Verification

- Installed client and server dependencies.
- Built the client successfully with `npm run build`.
- Ran server syntax checks for changed API files.
- Started the client dev server at `http://127.0.0.1:5173`.
- Confirmed the client responds with HTTP 200.

### Notes

- The API server needs `server/.env` with a valid `MONGO_URI` and `JWT_SECRET` before it can run locally.
- Cloudinary is optional for local development because uploads fall back to `server/uploads`.
- NPM audit still reports dependency vulnerabilities in installed packages; review with `npm audit` before production deployment.

---

Last updated: 2026-06-18
