# WasteWise MERN Deployment Guide

This guide covers deploying the current `client/` and `server/` MERN application.

## Server Deployment

The Express API lives in `server/`.

Common Render settings:

- Root Directory: `server`
- Runtime: Docker or Node
- Build Command, if using Node runtime: `npm install`
- Start Command: `npm start`

Required environment variables:

```env
NODE_ENV=production
PORT=10000
MONGO_URI=your_mongodb_uri
JWT_SECRET=replace_with_a_long_random_secret
JWT_EXPIRE=7d
CLIENT_URL=https://your-client-domain.com
CLIENT_URLS=https://your-client-domain.com
```

Optional production services:

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
BREVO_API_KEY=your_brevo_api_key
BREVO_SENDER_EMAIL=no-reply@yourdomain.com
BREVO_SENDER_NAME=WasteWise
```

Health check:

```text
https://your-api-domain.com/api/health
```

## Client Deployment

The React app lives in `client/`.

Common Vercel or Netlify settings:

- Root Directory: `client`
- Build Command: `npm run build`
- Output Directory: `dist`

Client environment:

```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

## Post-Deploy Checks

1. Open the deployed client.
2. Register a test account.
3. Verify OTP email delivery or development fallback behavior.
4. Login and submit a report with an image.
5. Confirm the uploaded image URL is stored on the report.
6. Login as an admin account and update the report status.
7. Add and update a bin record from the admin dashboard.
