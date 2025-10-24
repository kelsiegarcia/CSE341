require('dotenv').config({ path: __dirname + '/.env' }); 

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
  res.send('Welcome to the Event Scheduler API 🚀');
});


// // Start server
// app.listen(PORT, () => {
//   console.log(`✅ Server running on port ${PORT}`);
// });


// console.log('Loaded local MONGODB_URI:', process.env.MONGODB_URI);


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
