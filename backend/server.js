const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const authRoutes = require('./routes/auth');
const accountRoutes = require('./routes/accountRoutes');
const Account = require('./models/Account');

const app = express();
app.use(express.json());
app.use(cors());

// Multer setup for handling image uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Folder where files will be stored
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filenames with timestamp
  }
});

const upload = multer({ storage: storage });

// Authentication and account routes
app.use('/auth', authRoutes);
app.use('/accounts', accountRoutes);

// KYC route to handle KYC submissions
app.post('/kyc/submit/:accountNumber', upload.fields([
  { name: 'aadharImage', maxCount: 1 },  // Updated field name
  { name: 'profileImage', maxCount: 1 },  // Updated field name
  { name: 'panImage', maxCount: 1 }       // Updated field name
]), async (req, res) => {
  try {
    const { accountNumber } = req.params;
    const { email } = req.body;

    // Find the account using the account number
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check for required files
    if (!req.files['aadharImage'] || !req.files['profileImage'] || !req.files['panImage']) {
      return res.status(400).json({ message: 'All images are required.' });
    }

    // Update the account with KYC details
    account.kyc = {
      email,
      aadhar: req.files['aadharImage'][0].filename, // File for Aadhar
      photo: req.files['profileImage'][0].filename, // File for profile photo
      panCard: req.files['panImage'][0].filename // File for PAN card
    };

    await account.save(); // Save the updated account
    res.status(200).json({ message: 'KYC submitted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// KYC route to check KYC status
app.get('/kyc/:accountNumber', async (req, res) => {
  try {
    const { accountNumber } = req.params;

    // Find the account using the account number
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if KYC has been submitted
    const kycSubmitted = !!account.kyc; // Checks if KYC exists

    // Respond with the KYC status
    res.status(200).json({ kycSubmitted, kyc: account.kyc });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error', error: err.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Server Error');
});

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
