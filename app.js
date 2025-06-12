const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const uploadRoutes = require('./routes/uploadRoutes');
const fetchRoutes = require('./routes/fetchRoutes');

require('dotenv').config();

const app = express();
app.use(cors());

// Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, { 
  useNewUrlParser: true, 
  useUnifiedTopology: true 
})
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

// Middleware to parse form data
app.use(express.urlencoded({ extended: true }));

// Serve static files from the public folder
app.use(express.static('public'));




// Use upload routes
app.use('/api', uploadRoutes);
app.use('/api', fetchRoutes);





// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err.message);
  res.status(500).json({ error: `Server error: ${err.message}` });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});