const express = require('express');
const Account = require('../models/Account'); // Ensure correct path to Account model
const { submitKYC, getKYCStatus } = require('../controllers/kycController');
const router = express.Router();

// Endpoint to verify account details
router.post('/verify', async (req, res) => {
  const { accountNumber, holderName } = req.body;

  console.log('Verifying account with data:', { accountNumber, holderName }); // Log account verification attempt

  if (!accountNumber || !holderName) {
    return res.status(400).json({ message: 'Account number and holder name are required.' });
  }

  try {
    const account = await Account.findOne({ accountNumber, holderName });

    if (!account) {
      console.log('Account verification failed: Account not found.'); // Log verification failure
      return res.status(404).json({ message: 'Account number or holder name is incorrect.' });
    }

    console.log('Account verified successfully:', account); // Log successful verification
    return res.status(200).json({ message: 'Account verified successfully', account });
  } catch (error) {
    console.error('Error verifying account:', error);
    return res.status(500).json({ message: 'An error occurred during account verification. Please try again.' });
  }
});

// New endpoint to get account details by account number
router.get('/account/:accountNumber', async (req, res) => {
  const { accountNumber } = req.params;

  console.log('Fetching account details for account number:', accountNumber); // Log account detail fetch attempt

  if (!accountNumber) {
    return res.status(400).json({ message: 'Account number is required.' });
  }

  try {
    const account = await Account.findOne({ accountNumber });

    if (!account) {
      console.log('Account not found for account number:', accountNumber); // Log account not found
      return res.status(404).json({ message: 'Account not found.' });
    }

    // Restrict the returned fields if necessary (for security or privacy)
    console.log('Fetched account details:', { 
      accountNumber: account.accountNumber, 
      holderName: account.holderName,
      phoneNumber: account.phoneNumber,
      branchId: account.branchId,
      balance: account.balance 
    }); // Log fetched account details

    return res.status(200).json({
      accountNumber: account.accountNumber,
      holderName: account.holderName,
      phoneNumber: account.phoneNumber,
      branchId: account.branchId,
      balance: account.balance, // Only include fields that you want to expose
    });
  } catch (error) {
    console.error('Error fetching account details:', error);
    return res.status(500).json({ message: 'An error occurred while fetching account details.' });
  }
});

// Endpoint to transfer money between two accounts
router.post('/transfer', async (req, res) => {
  const { sourceAccount, recipientAccount, amount } = req.body;

  console.log('Initiating transfer from:', sourceAccount, 'to:', recipientAccount, 'amount:', amount); // Log transfer initiation

  if (!sourceAccount || !recipientAccount || !amount) {
    return res.status(400).json({ message: 'Source account, recipient account, and amount are required.' });
  }

  try {
    // Find the source and recipient accounts
    const sourceAcc = await Account.findOne({ accountNumber: sourceAccount });
    const recipientAcc = await Account.findOne({ accountNumber: recipientAccount });

    if (!sourceAcc) {
      console.log('Source account not found:', sourceAccount); // Log source account not found
      return res.status(404).json({ message: 'Source account not found.' });
    }

    if (!recipientAcc) {
      console.log('Recipient account not found:', recipientAccount); // Log recipient account not found
      return res.status(404).json({ message: 'Recipient account not found.' });
    }

    const transferAmount = parseFloat(amount);

    // Ensure the source account has enough balance
    if (sourceAcc.balance < transferAmount) {
      console.log('Insufficient funds in source account:', sourceAcc.accountNumber); // Log insufficient funds
      return res.status(400).json({ message: 'Insufficient funds in the source account.' });
    }

    // Perform the money transfer
    sourceAcc.balance -= transferAmount;
    recipientAcc.balance += transferAmount;

    // Save the updated balances
    await sourceAcc.save();
    await recipientAcc.save();

    console.log('Transfer successful from:', sourceAcc.accountNumber, 'to:', recipientAcc.accountNumber); // Log successful transfer
    return res.status(200).json({ message: 'Transfer successful.' });
  } catch (error) {
    console.error('Error during transfer:', error);
    return res.status(500).json({ message: 'An error occurred during the transfer. Please try again.' });
  }
});

// Route to submit KYC data
router.post('/kyc-submit/:accountNumber', async (req, res) => {
  console.log('Submitting KYC for account number:', req.params.accountNumber); // Log KYC submission attempt
  await submitKYC(req, res);
});

// Route to check KYC status
router.get('/kyc-status/:accountNumber', async (req, res) => {
  console.log('Checking KYC status for account number:', req.params.accountNumber); // Log KYC status check attempt
  await getKYCStatus(req, res);
});

module.exports = router;
