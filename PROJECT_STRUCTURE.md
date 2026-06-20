# WasteWise Project Structure

```text
wastewise-main/
├── client/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── tailwind.config.js
│   ├── vite.config.js
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       ├── components/
│       ├── context/
│       ├── hooks/
│       ├── layouts/
│       ├── pages/
│       └── services/
├── server/
│   ├── server.js
│   ├── package.json
│   ├── Dockerfile
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── services/
│   └── utils/
├── README.md
├── HOW_TO_INSTALL_AND_USE.md
├── DEPLOY_GUIDE.md
├── TECH_STACK_REPORT.md
├── whatwedo.md
└── package.json
```

## Client

The client is a Vite React application styled with Tailwind CSS. It includes:

- Public landing page
- Authentication pages
- User dashboard
- Report waste form
- Report history
- Admin dashboard
- Profile settings

## Server

The server is an Express API using MongoDB through Mongoose. It includes:

- JWT authentication and OTP verification
- Report creation and status tracking
- Image upload abstraction with Cloudinary or local storage
- Admin statistics and user management
- Database-managed bin records
- Notifications and reward history endpoints retained from the original business logic
