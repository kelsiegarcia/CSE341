require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const fs = require('fs');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output.json');
const authRoutes = require('./routes/auth');
const eventRoutes = require('./routes/events');
const connectDB = require('./config/db');
const usersRoutes = require('./routes/users');

const app = express();

// ------------------ CONNECT TO MONGODB ------------------
connectDB();

// ------------------ MIDDLEWARE ------------------
app.use(cors());
app.use(express.json());

// ✅ Session middleware must come BEFORE passport.initialize()
app.use(session({
  secret: process.env.SESSION_SECRET || 'keyboardcat',
  resave: false,
  saveUninitialized: false
}));

// ✅ Initialize passport and sessions ONCE
app.use(passport.initialize());
app.use(passport.session());

// ------------------ PASSPORT GOOGLE OAUTH2 STRATEGY ------------------
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL:
        process.env.NODE_ENV === "production"
          ? "https://cse341-webservices-zcob.onrender.com/auth/google/callback"
          : "http://localhost:8080/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      console.log("✅ Google profile:", profile.displayName);
      return done(null, profile);
    }
  )
);

// ✅ Serialization for login sessions
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// ------------------ ROUTES ------------------
app.use('/events', eventRoutes);
app.use('/auth', authRoutes);
app.use('/users', usersRoutes);

app.get('/', (req, res) => {
  res.send('Welcome to TaskTide 🚀 <a href="/auth/google">Login with Google</a>');
});

// ------------------ SWAGGER DOCS ------------------
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(swaggerFile, {
    customSiteTitle: 'TaskTide API Docs',
    customCss: `
      .logout-btn {
        background-color: #e74c3c;
        color: white;
        border: none;
        padding: 8px 14px;
        border-radius: 6px;
        cursor: pointer;
        font-size: 14px;
        margin-left: 12px;
      }
      .logout-btn:hover {
        background-color: #c0392b;
      }
    `,
    customJs: `
      window.addEventListener('load', () => {
        const topbar = document.querySelector('.topbar');
        if (topbar && !document.querySelector('.logout-btn')) {
          const btn = document.createElement('button');
          btn.innerText = 'Logout';
          btn.className = 'logout-btn';
          btn.onclick = () => {
            window.location.href = '/auth/logout';
          };
          topbar.appendChild(btn);
        }
      });
    `
  })
);

// ------------------ START SERVER ------------------
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasktide';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => console.error('❌ MongoDB connection error:', err.message));

// ------------------ GLOBAL ERROR HANDLER ------------------
app.use((err, req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  console.log('💥 Global error handler reached!');
  console.log('🔥 Raw error object:', err);
  if (err.name === 'CastError')
    return res.status(400).json({ message: 'Invalid ID format' });
  if (err.name === 'ValidationError')
    return res.status(400).json({ message: err.message });
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});