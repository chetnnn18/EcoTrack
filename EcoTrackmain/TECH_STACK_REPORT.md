# WasteWise Technology Stack

## Overview

WasteWise is now a MERN stack web application focused on software-managed waste reporting and cleanup operations.

## Client

| Technology | Purpose |
|---|---|
| React | Component-based user interface |
| Vite | Development server and production bundling |
| Tailwind CSS | Utility-first styling and responsive layout |
| Lucide React | Icon system |
| Recharts | Admin analytics charts |
| Framer Motion | Lightweight UI animation |
| Axios | API communication |
| React Router | Client-side routing |

## Server

| Technology | Purpose |
|---|---|
| Node.js | JavaScript runtime |
| Express.js | REST API framework |
| MongoDB | Document database |
| Mongoose | Schema modeling and validation |
| JWT | Stateless authentication |
| bcryptjs | Password hashing |
| express-validator | Request validation |
| Multer | Multipart image handling |
| Cloudinary | Optional hosted image storage |
| Socket.io | Real-time update support |

## API Areas

- `/api/auth`
- `/api/dashboard`
- `/api/upload`
- `/api/admin`
- `/api/collector`
- `/api/rewards`
- `/api/notifications`
- `/api/bins`

## Database Models

- User
- GarbageReport
- Dustbin
- Notification
- RewardTransaction
- RewardItem
- CollectorProfile

## Web Features

- Landing page
- Login and registration
- OTP verification
- Forgot and reset password
- User dashboard
- Waste reporting with image upload
- Report history with filters and search
- Profile editing and password changes
- Admin analytics
- Admin report status management
- User management
- Database-managed bin records
