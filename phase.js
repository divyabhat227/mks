const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://divyabhat886:Divyabhat88@cluster0.d52z3w0.mongodb.net/', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const Product = mongoose.model('Product', {
  phase: String,
  quotationNo: String,
  quotationDate: Date,
  deliveryType: String,
  courierLR: String,
  person: String,
});

app.post('/submitForm', async (req, res) => {
  const {
    phase,
    quotationNo,
    quotationDate,
    deliveryType,
    courierLR,
    person,
  } = req.body;

  try {
    const product = new Product({
      phase,
      quotationNo,
      quotationDate,
      deliveryType,
      courierLR,
      person,
    });

    await product.save();

    res.json({ message: 'Form submitted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

