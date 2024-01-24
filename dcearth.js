const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const multer = require('multer');
const xlsx = require('xlsx');

const app = express();
const port = 3005;

// Connect to MongoDB (Make sure MongoDB is running)
const uri = 'mongodb+srv://divyabhat886:Divyabhat88@cluster0.d52z3w0.mongodb.net/';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

let db;

client.connect((err) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    process.exit(1);
  }
  db = client.db('mksdatabase');
  console.log('mkscollection');
});

// Create a MongoDB collection for serial number details
const serialNumberCollection = 'serial_numbers';

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files (for images)
app.use(express.static('public'));

// Set up the route for handling file uploads
app.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    // Assuming your Excel file has columns: Serial Number, Product, Accessory
    const result = await db.collection(serialNumberCollection).insertMany(data);
    res.json({ message: 'File uploaded successfully' });
  } catch (error) {
    console.error(error);
    res.status(400).json({ error: 'Invalid file format' });
  }
});

// Handle search for serial number details
app.get('/search/:serialNumber', async (req, res) => {
  const { serialNumber } = req.params;

  try {
    const result = await db.collection(serialNumberCollection).find({ serialNumber: serialNumber }).toArray();
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error searching for serial number' });
  }
});

// Handle quantity input and store in the database
app.post('/update-quantity', async (req, res) => {
  const { serialNumber, quantity } = req.body;

  try {
    const result = await db.collection(serialNumberCollection).updateOne(
      { serialNumber: serialNumber },
      { $set: { quantity: quantity } }
    );
    res.json({ message: 'Quantity updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Error updating quantity' });
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

