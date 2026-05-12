require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { syncDatabase } = require('./models');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// CORS — open in dev, locked to FRONTEND_URL in prod
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:5174',
];
app.use(cors({
  origin: (origin, cb) => (!origin || process.env.NODE_ENV === 'development' || allowedOrigins.includes(origin))
    ? cb(null, true) : cb(new Error('CORS: origin not allowed')),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.options('*', cors());

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth',            require('./routes/auth'));
app.use('/api/buy-properties',  require('./routes/buyProperties'));
app.use('/api/rent-properties', require('./routes/rentProperties'));
app.use('/api/contact',         require('./routes/contact'));
app.use('/api/users',           require('./routes/users'));
app.use('/api/upload',          require('./routes/upload'));

// Root — so visiting localhost:5000 shows something useful
app.get('/', (req, res) => res.json({
  success: true,
  message: "Lucky's Home Improvement Services — API is running",
  note: 'Visit http://localhost:5173 for the frontend',
  api: {
    health:    '/api/health',
    auth:      '/api/auth/login',
    buy:       '/api/buy-properties',
    rent:      '/api/rent-properties',
    contact:   '/api/contact',
    users:     '/api/users',
    upload:    '/api/upload/images',
  },
}));

// Health check
app.get('/api/health', (req, res) => res.json({ success: true, status: 'ok', timestamp: new Date().toISOString() }));

// 404
app.use((req, res) => res.status(404).json({ success: false, message: 'Route not found' }));

// Global error handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

syncDatabase().then(() => {
  app.listen(PORT, () => {
    console.log('\n' + '='.repeat(52));
    console.log("  Lucky's Home Improvement Services — API Server");
    console.log('='.repeat(52));
    console.log('  API       → http://localhost:' + PORT);
    console.log('  Health    → http://localhost:' + PORT + '/api/health');
    console.log('  Uploads   → http://localhost:' + PORT + '/uploads');
    console.log('  Mode      → ' + (process.env.NODE_ENV || 'development'));
    console.log('  Admin     → admin@luckys-home.com / Admin@123');
    console.log('  Frontend  → http://localhost:5173');
    console.log('='.repeat(52) + '\n');
  });
}).catch(err => {
  console.error('\n[ERROR] Failed to start:', err.message);
  console.error('  Check DB credentials in .env and ensure MySQL is running.\n');
  process.exit(1);
});
