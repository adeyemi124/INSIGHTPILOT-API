const express = require('express');
const mongoose = require('mongoose');
const setUserRoutes = require('./routes/userRoutes');
require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const aiRoutes = require('./routes/aiRoutes');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

app.use(cors({
    origin: 'https://insightpilot.vercel.app', 
    credentials: true,               
  }));

  app.get('/api/test', (req, res) => {
    res.json({ message: 'CORS is working!' });
  });

// Database connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.error('MongoDB connection error:', err));

// Set up routes
app.use('/api/auth', authRoutes);
app.use('/api', aiRoutes);
setUserRoutes(app);

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});