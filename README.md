# WasteWise MERN

WasteWise is a responsive MERN stack web application for smart waste reporting and cleanup management. Residents can register, verify email with OTP, submit image-backed waste reports, track status, and manage profiles. Admins can review reports, manage users, view analytics, and maintain database-driven bin records.

## Stack

- Client: React, Vite, Tailwind CSS, Lucide React, Recharts, Framer Motion
- Server: Node.js, Express.js, MongoDB, Mongoose
- Auth: JWT with OTP verification
- Uploads: Cloudinary when configured, local storage fallback for development

## Folder Structure

```text
client/
  components/
  pages/
  layouts/
  hooks/
  services/
  context/

server/
  controllers/
  models/
  routes/
  middleware/
  utils/
  config/
```

## Setup

Install dependencies:

```bash
cd client
npm install

cd ../server
npm install
```

Create `server/.env` from `server/.env.example`:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://127.0.0.1:5173
```

Optional Cloudinary keys:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the API:

```bash
cd server
npm run dev
```

Run the web client:

```bash
cd client
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Local Test Accounts

Seed local admin, collector, bin, and reward test data:

```bash
cd server
node send_test_data.js
```

Default seeded accounts:

```text
Admin:     admin@wastewise.com / Admin@123
Collector: collector@wastewise.com / Collector@123
```

In development, if Brevo email is not configured, OTP values are returned to the frontend and shown on the OTP pages.

## Build

```bash
cd client
npm run build
```

The production bundle is generated in `client/dist`.

## Key API Areas

- `POST /api/auth/register`
- `POST /api/auth/verify-otp`
- `POST /api/auth/login`
- `GET /api/auth/me`
- `PATCH /api/auth/change-password`
- `GET /api/dashboard`
- `POST /api/dashboard/reports`
- `GET /api/dashboard/reports`
- `GET /api/admin/stats`
- `GET /api/admin/reports`
- `PATCH /api/admin/reports/:id/status`
- `GET /api/bins`
- `POST /api/bins`
- `PATCH /api/bins/:id`
- `DELETE /api/bins/:id`

## Notes

- The current application is a browser-based MERN product with database-managed bin records.
- Bin data is managed through MongoDB records.
- Local image uploads are stored in `server/uploads` when Cloudinary is not configured.