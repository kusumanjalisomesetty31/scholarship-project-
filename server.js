const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
app.use(express.json()); // Add this line to parse JSON body

// Middleware
app.use(express.urlencoded({ extended: true })); // ✅ Correct parser
app.use(express.static('public'));

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/scholarshipDB', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

// MongoDB Schema
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  mobile: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Hardcoded Admin Credentials


// ---------------- ROUTES ---------------- //

// Admin Login
app.post('/adminlogin', (req, res) => {
  console.log("🔐 Admin login attempt:", req.body); // Confirm input
  const { email, password } = req.body;

  const adminEmail = 'admin@scholarship.com';
  const adminPassword = 'admin123';

  if (email === adminEmail && password === adminPassword) {
    console.log("✅ Admin login successful");
    res.json({ success: true });
  } else {
    console.log("❌ Admin login failed");
    res.status(401).json({ success: false });
  }
});


// User Registration
app.post('/register', async (req, res) => {
  const { name, email, mobile, password } = req.body;
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).send('User already registered');

    const newUser = new User({ name, email, mobile, password });
    await newUser.save();
    res.send('Registration successful! Please login.');
  } catch (err) {
    res.status(500).send('Error occurred during registration.');
  }
});

// User Login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (user) {
      res.json({ success: true });
    } else {
      res.status(401).json({ success: false });
    }
  } catch (err) {
    res.status(500).json({ success: false });
  }
});

// Optional: Serve static pages (if needed)
app.get('/adminlogin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminlogin.html'));
});
app.get('/userregister', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'userregister.html'));
});
app.get('/userlogin', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'userlogin.html'));
});
app.get('/userhome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'userhome.html'));
});
app.get('/adminhome', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'adminhome.html'));
});
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'main.html'));
});


// Start Server
const PORT = process.env.PORT || 10000;
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
