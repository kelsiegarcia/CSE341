// TODO: Add express-session middleware for login persistence
// OAuth login is successfully reaching callback and retrieving profile data

require('dotenv').config({ path: __dirname + '/.env' }); 
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const fs = require('fs');

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerFile = require('./swagger/swagger-output.json');


const connectDB = require('./config/db'); 


const app = express();
// const PORT = process.env.PORT || 8080;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
const eventRoutes = require('./routes/events'); 
app.use('/events', eventRoutes);

// Swagger Docs
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

// Default route
app.get('/', (req, res) => {
  res.send('Welcome to the tasktide 🚀');
});

// Read credentials JSON
const googleConfig = JSON.parse(
  fs.readFileSync("./config/google-credentials.json", "utf8")
).web;
console.log("OAuth callback URL being used:", googleConfig.redirect_uris[0]);



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
      // search for or create a user in database
      // return the profile
      console.log("✅ Google profile:", profile.displayName)

      return done(null, profile);
    }
  )
);


app.use(passport.initialize());

// ------------------ AUTH ROUTES ------------------
app.get(
  '/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get(
  '/auth/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication
    res.json({ message: '✅ Successfully authenticated with Google!', user: req.user });
  }
);


// ------------------ DATABASE CONNECTION ------------------
const PORT = process.env.PORT || 8080;
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tasktide';

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('✅ Connected to MongoDB');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err.message);
  });

// ------------------ ERROR HANDLING ------------------
app.use((err, req, res, next) => {
  console.log(`➡️ ${req.method} ${req.url}`);
  console.log('💥 Global error handler reached!');
  console.log('🔥 Raw error object:', err);
  console.log('🔥 Type of err:', typeof err);

  if (err.name === 'CastError') {
    return res.status(400).json({ message: 'Invalid ID format' });
  }
  if (err.name === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }
  console.log('💥 Using default 500 handler now');


  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});
