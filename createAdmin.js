const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

// Remove deprecated options
mongoose.connect('mongodb://localhost:27017/blogdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

(async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: 'admin@example.com' });
    
    if (existingAdmin) {
      console.log('✅ Admin already exists');
    } else {
      // Create new admin if doesn't exist
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await Admin.create({ email: 'admin@example.com', password: hashedPassword });
      console.log('✅ Admin created');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    mongoose.disconnect();
  }
})();
