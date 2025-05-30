const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

// Remove deprecated options
mongoose.connect('mongodb+srv://kkdprince6318:admin123@cluster0.wzu9grl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
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
