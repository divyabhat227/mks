const express = require('express');
const bodyParser = require('body-parser');
const { MongoClient } = require('mongodb');
const xlsx = require('xlsx');

const app = express();
const port = 3003;

// MongoDB connection URI
const mongoURI =
  'mongodb+srv://divyabhat886:Divyabhat88@cluster0.d52z3w0.mongodb.net/';
  

// Middleware
app.use(bodyParser.json());

// MongoDB client
const client = new MongoClient(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to read data from Excel file
function readExcel(filePath) {
  const workbook = xlsx.readFile(filePath);
  const sheetName = workbook.SheetNames[0];
  const sheet = workbook.Sheets[sheetName];
  return xlsx.utils.sheet_to_json(sheet);
}

// Connect to MongoDB
client
  .connect()
  .then(() => {
    const db = client.db('mksdatabase');
    const productsCollection = db.collection('mkscollection');

    // Search endpoint
    app.get('/search/:serialNumber', (req, res) => {
      const serialNumber = req.params.serialNumber;

      // Search for the product in the database
      productsCollection.findOne({ serialNumber: serialNumber })
        .then(product => {
          if (!product) {
            res.status(404).json({ error: 'Product not found' });
          } else {
            res.json(product);
          }
        })
        .catch(err => {
          console.error('Error searching for product:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });

    // Update quantity endpoint
    app.post('/updateQuantity', (req, res) => {
      const { serialNumber, accessory, quantity } = req.body;

      // Update quantity in the database
      productsCollection.updateOne(
        { serialNumber: serialNumber, 'accessories.name': accessory },
        { $set: { 'accessories.$.quantity': quantity } }
      )
        .then(result => {
          if (result.matchedCount === 0) {
            res.status(404).json({ error: 'Product or accessory not found' });
          } else {
            res.json({ message: 'Quantity updated successfully' });
          }
        })
        .catch(err => {
          console.error('Error updating quantity:', err);
          res.status(500).json({ error: 'Internal Server Error' });
        });
    });

    // Start the server
    app.listen(port, () => {
      console.log(`Server is running on http://localhost:${port}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to MongoDB:', err);
  });
 

