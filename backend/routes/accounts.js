// routes/accounts.js
const express = require('express');
const router = express.Router();
const Account = require('../models/Account'); // Ensure correct path to your Account model

// Endpoint to check KYC status
router.get('/kyc-status/:accountNumber', async (req, res) => {
  const { accountNumber } = req.params;

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    return res.json({ kycSubmitted: account.kycSubmitted });
  } catch (error) {
    console.error('Error fetching KYC status:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Endpoint to submit KYC details
router.post('/submit-kyc/:accountNumber', async (req, res) => {
  const { accountNumber } = req.params;
  const { email, aadharImage, photo, panImage } = req.body;

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      return res.status(404).json({ message: 'Account not found' });
    }

    // Check if KYC has already been submitted
    if (account.kycSubmitted) {
      return res.status(400).json({ message: 'KYC has already been submitted' });
    }

    // Update account with KYC details
    account.email = email;
    account.aadharImage = aadharImage;
    account.photo = photo;
    account.panImage = panImage;
    account.kycSubmitted = true; // Set KYC submitted status to true

    await account.save(); // Save updated account

    return res.status(201).json({ message: 'KYC details submitted successfully' });
  } catch (error) {
    console.error('Error submitting KYC:', error);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
