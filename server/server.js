const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db.js');
const { setSocketIO } = require('./services/notificationService.js');

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);

const defaultAllowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];
const envAllowedOrigins = [
  process.env.CLIENT_URL,
  ...(process.env.CLIENT_URLS || '').split(',').map((origin) => origin.trim())
].filter(Boolean);
const allowedOrigins = [...new Set([...defaultAllowedOrigins, ...envAllowedOrigins])];

const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

setSocketIO(io);

io.on('connection', (socket) => {
  socket.on('join', (roomId) => {
    if (roomId) socket.join(roomId.toString());
  });
});

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes.js'));
app.use('/api/dashboard', require('./routes/dashboardRoutes.js'));
app.use('/api/upload', require('./routes/uploadRoutes.js'));
app.use('/api/admin', require('./routes/adminRoutes.js'));
app.use('/api/collector', require('./routes/collectorRoutes.js'));
app.use('/api/rewards', require('./routes/rewardRoutes.js'));
app.use('/api/notifications', require('./routes/notificationRoutes.js'));
app.use('/api/bins', require('./routes/binRoutes.js'));

app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'WasteWise API is running',
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'WasteWise backend is running',
    health: '/api/health'
  });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API Base URL: http://localhost:${PORT}/api`);
});
