const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose'); // Import mongoose

const app = express();
const PORT = 3016;

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://divyabhat886:Divyabhat88@cluster0.d52z3w0.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((err) => {
    console.error('Error connecting to MongoDB', err);
  });

// Hardcoded admin credentials
const adminCredentials = {
  username: 'admin',
  password: 'admin123',
}
// Route to handle admin login
app.post('/admin/login', (req, res) => {
  const { username, password } = req.body;

  // You can use Mongoose queries to check admin credentials from the database if needed
  if (username === adminCredentials.username && password === adminCredentials.password) {
    res.json({ message: 'Login successful' });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});

// Example route for an admin dashboard
app.get('/admin/dashboard', (req, res) => {
  // Replace this with your logic to render the admin dashboard
  res.send('Admin Dashboard');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
