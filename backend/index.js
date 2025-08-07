const express = require('express');
const cors = require('cors');
const path = require('path');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const http = require('http');
const bcrypt = require('bcryptjs');
const { setupSocket } = require('./utils/socket');
const User = require('./models/User');


const authRoutes = require('./routes/authRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const providerRoutes = require('./routes/providerRoutes');
const adminRoutes = require('./routes/admin');
const userRoutes = require('./routes/userRoutes');
const weatherRoutes = require('./routes/weather');

// configurations
const app = express();
dotenv.config();
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// routes
app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/provider', providerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/user', userRoutes);
app.use('/api/check-weather', weatherRoutes);

const server = http.createServer(app);

// Admin Creation
(async () => {
  const hashedPassword = await bcrypt.hash("admin123", 10);

  const noAdminCreatedBefore = await User.findOne({ email: "admin@gardencleaning.com" });

  if (noAdminCreatedBefore) {
    // admin has been created already
  }
  else {
    const adminUser = new User({
      name: "Super Admin",
      email: "admin@gardencleaning.com",
      password: hashedPassword,
      isAdmin: true,
      role: 'admin',
      agreeToTerms: true
    });

    await adminUser.save();
    console.log("✅ Admin created");
    process.exit();
  }
})();

mongoose.connect(process.env.MONGO_URI,)
  .then(() => {
    console.log('Connected to MongoDB');

    setupSocket(server);

    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error('MongoDB connection error:', err));
