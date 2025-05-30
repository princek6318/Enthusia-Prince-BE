const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect('mongodb://localhost:27017/blogdb')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

(async () => {
  try {
    const newPassword = 'admin123'; // Change this to your desired password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    const result = await Admin.updateOne(
      { email: 'admin@example.com' },
      { $set: { password: hashedPassword } }
    );
    
    if (result.modifiedCount > 0) {
      console.log('✅ Admin password reset successfully');
    } else {
      console.log('❌ Admin not found');
    }
  } catch (err) {
    console.error('❌ Error:', err.message);
  } finally {
    mongoose.disconnect();
  }
})();