const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const port = 3015;

// Connect to MongoDB (Make sure you have MongoDB installed and running)
mongoose.connect('mongodb+srv://divyabhat886:Divyabhat88@cluster0.d52z3w0.mongodb.net/', { useNewUrlParser: true, useUnifiedTopology: true });

// Create a mongoose schema and model
const userSchema = new mongoose.Schema({
  organizationName: String,
  email: String,
  password: String
});

const User = mongoose.model('User', userSchema);

// Middleware for parsing JSON
app.use(bodyParser.json());

// Signup endpoint
app.post('/signup', async (req, res) => {
  try {
    const { organizationName, email, password } = req.body;

    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ error: 'Email already registered' });
    }

    // Create a new user
    const newUser = new User({ organizationName, email, password });
    await newUser.save();

    // Signup successful
    res.status(201).json({ message: 'Signup successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login endpoint
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    // Check if the user exists
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Check if the passwsord is correct
    if (user.password !== password) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Login successful
    res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
