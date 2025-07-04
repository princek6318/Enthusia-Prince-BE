const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const Admin = require('./models/Admin');
require('dotenv').config();

mongoose.connect('mongodb+srv://kkdprince6318:admin123@cluster0.wzu9grl.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

(async () => {
  try {
    const newPassword = 'admin123'; 
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