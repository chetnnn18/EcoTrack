# WasteWise - Setup and Usage Guide

WasteWise is a web-first MERN application for waste reporting, status tracking, admin review, analytics, user management, and database-managed bin records.

## Prerequisites

- Node.js 20 or newer
- MongoDB Atlas URI or local MongoDB connection string
- Optional Cloudinary account for hosted image uploads

## Install

```bash
cd client
npm install

cd ../server
npm install
```

## Configure Server

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

Optional:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=no-reply@yourdomain.com
BREVO_SENDER_NAME=WasteWise
```

## Run Locally

Terminal 1:

```bash
cd server
npm run dev
```

Terminal 2:

```bash
cd client
npm run dev
```

Open:

```text
http://127.0.0.1:5173
```

## Main Workflows

- Register and verify email using OTP.
- Login with JWT authentication.
- Submit waste reports with category, description, address, and images.
- Track report status in My Reports.
- Edit profile and change password.
- Admins can review reports, assign collectors, update status, view charts, manage users, and maintain bin records.

## Seed Local Test Data

```bash
cd server
node send_test_data.js
```

Seeded accounts:

```text
Admin:     admin@wastewise.com / Admin@123
Collector: collector@wastewise.com / Collector@123
```

When `NODE_ENV=development` and email is not configured, OTPs appear directly on the OTP screens for local testing.

## Build

```bash
cd client
npm run build
```

The build output is `client/dist`.

## Troubleshooting

- Server exits immediately: check `server/.env`, especially `MONGO_URI` and `JWT_SECRET`.
- Uploads fail locally: leave Cloudinary keys empty and the server will store files in `server/uploads`.
- Client API calls fail: confirm the API is running on port `5000` and `CLIENT_URL` allows `http://localhost:5173`.
