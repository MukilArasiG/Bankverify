const mongoose = require('mongoose');

// Main account schema
const accountSchema = new mongoose.Schema({
  accountNumber: { 
    type: String, 
    required: true, 
    unique: true 
  },
  holderName: { 
    type: String, 
    required: true 
  },
  phoneNumber: { 
    type: String, 
    required: true 
  },
  branchId: { 
    type: String, 
    required: true 
  },
  balance: { 
    type: Number, 
    default: 0 
  },
  kycSubmitted: { 
    type: Boolean, 
    default: false 
  },
  kycDetails: { // KYC details sub-schema embedded in the account schema
    email: { 
      type: String 
    },
    aadharImage: { 
      type: String 
    },
    photoImage: { 
      type: String 
    },
    panImage: { 
      type: String 
    }
  }
}, { timestamps: true }); // Automatically adds `createdAt` and `updatedAt` timestamps

// Export the Account model
module.exports = mongoose.model('Account', accountSchema);
