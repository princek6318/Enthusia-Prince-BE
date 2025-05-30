const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blogRoutes');
require('dotenv').config();

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], // Allow both localhost and IP
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Connect to MongoDB
mongoose.connect('mongodb://localhost:27017/blogdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Serve static files from the uploads directory
const path = require('path');
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Add a test endpoint
app.get('/test', (req, res) => {
  res.json({ message: 'Server is running!' });
});

// Routes
app.use('/admin', authRoutes);
app.use('/api/blogs', blogRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
