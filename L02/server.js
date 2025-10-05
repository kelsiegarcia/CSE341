require('dotenv').config();

const express = require('express');
const dbLink = require('./backend/db/link');
const contactRoutes = require('./backend/routes/contacts');

const app = express();
const port = process.env.PORT || 8080;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(204);
  next();
});

// Redirect root to /contacts
app.get('/', (req, res) => res.redirect('/contacts'));

// Routes
app.use('/contacts', contactRoutes);

// Health check for Render
app.get('/health', (_req, res) => res.send('ok'));

// Start after DB is ready
dbLink.initDb((err) => {
  if (err) {
    console.error('[mongo] init error:', err);
    process.exit(1);
  }
  console.log('[mongo] using DB:', dbLink.getDb().databaseName);
  app.listen(port, () => {
    console.log(`Connected to DB and listening on ${port}`);
  });
});
