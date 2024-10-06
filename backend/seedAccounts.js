const mongoose = require('mongoose');
const Account = require('./models/Account'); // Ensure correct path to Account model

// MongoDB connection string
const mongoURI = 'mongodb://127.0.0.1:27017/?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+1.9.1'; // Replace with your MongoDB URI

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.error(err));

// Seed 10 account details
const seedAccounts = async () => {
  const accounts = [
    {
      accountNumber: '1111111111',
      holderName: 'Mukil',
      phoneNumber: '9123456789',
      branchId: '1001',
      balance: 50000
    },
    {
      accountNumber: '1111111112',
      holderName: 'Mathi',
      phoneNumber: '9123456790',
      branchId: '1002',
      balance: 50000
    },
    {
      accountNumber: '1111111113',
      holderName: 'Guna',
      phoneNumber: '9123456791',
      branchId: '1003',
      balance: 50000
    },
    {
      accountNumber: '1111111114',
      holderName: 'Pet',
      phoneNumber: '9123456792',
      branchId: '1004',
      balance: 50000
    },
    {
      accountNumber: '1111111115',
      holderName: 'Maha',
      phoneNumber: '9123456793',
      branchId: '1005',
      balance: 50000
    },
    {
      accountNumber: '1111111116',
      holderName: 'Naga',
      phoneNumber: '9123456794',
      branchId: '1006',
      balance: 50000
    },
    {
      accountNumber: '1111111117',
      holderName: 'Priya',
      phoneNumber: '9123456795',
      branchId: '1007',
      balance: 50000
    },
    {
      accountNumber: '1111111118',
      holderName: 'Abitha',
      phoneNumber: '9123456796',
      branchId: '1008',
      balance: 50000
    },
    {
      accountNumber: '1111111119',
      holderName: 'Vinmalar',
      phoneNumber: '9123456797',
      branchId: '1009',
      balance: 50000
    },
    {
      accountNumber: '1111111120',
      holderName: 'John',
      phoneNumber: '9123456798',
      branchId: '1010',
      balance: 50000
    }
  ];

  try {
    // Insert accounts into the database
    await Account.insertMany(accounts);
    console.log('Accounts seeded successfully');
  } catch (err) {
    console.error('Error seeding accounts:', err);
  } finally {
    mongoose.connection.close(); // Close the connection after seeding
  }
};

seedAccounts();
