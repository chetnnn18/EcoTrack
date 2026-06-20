# EcoTrack

EcoTrack is a responsive MERN stack web application for smart waste reporting and tracking. Residents can register, verify their accounts using OTP, submit image-based waste reports, track complaint status, and manage their profiles. Administrators can review reports, manage users, monitor analytics, and maintain database-driven waste bin records.

## Tech Stack

### Frontend
- React.js
- Vite
- Tailwind CSS
- Lucide React
- Recharts
- Framer Motion

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Authentication
- JWT Authentication
- OTP Verification

### Media Storage
- Cloudinary (Production)
- Local Storage Fallback (Development)

---

## Project Structure

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

---

## Installation

### Install Frontend Dependencies

```bash
cd client
npm install
```

### Install Backend Dependencies

```bash
cd ../server
npm install
```

---

## Environment Variables

Create a `.env` file inside the `server` folder:

```env
NODE_ENV=development
PORT=5000
MONGO_URI=your_mongodb_uri

JWT_SECRET=your_secret_key
JWT_EXPIRE=7d

CLIENT_URL=http://localhost:5173
CLIENT_URLS=http://127.0.0.1:5173
```

### Optional Cloudinary Configuration

```env
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

---

## Running the Project

### Start Backend

```bash
cd server
npm run dev
```

### Start Frontend

```bash
cd client
npm run dev
```

Open:

```
http://localhost:5173
```

---

## Build for Production

```bash
cd client
npm run build
```

The production build will be generated inside:

```
client/dist
```

---

## Features

- OTP-based user registration and verification
- Secure JWT authentication
- Image-based waste reporting
- Report status tracking
- Role-based access control
- Admin dashboard for report and user management
- Responsive UI with Tailwind CSS
- Cloudinary image upload support
- MongoDB-backed data storage

---

## API Endpoints

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

---

## Notes

- EcoTrack is a browser-based MERN application designed for efficient waste reporting and tracking.
- Waste bin information is managed through MongoDB.
- In development mode, local image storage is supported when Cloudinary is not configured.
