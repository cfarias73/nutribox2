const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  subscription: {
    type: String,
    enum: ['free', 'premium'],
    default: 'free'
  },
  analysisQuota: {
    count: {
      type: Number,
      default: 0
    },
    lastReset: {
      type: Date,
      default: Date.now
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Method to check if user has remaining quota
userSchema.methods.hasQuota = function() {
  const now = new Date();
  const lastReset = new Date(this.analysisQuota.lastReset);
  
  // Reset quota if it's a new day
  if (now.getDate() !== lastReset.getDate() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getFullYear() !== lastReset.getFullYear()) {
    this.analysisQuota.count = 0;
    this.analysisQuota.lastReset = now;
    return true;
  }

  // Check quota based on subscription type
  if (this.subscription === 'premium') {
    return true; // Unlimited for premium users
  }
  
  return this.analysisQuota.count < 5; // 5 analysis per day for free users
};

module.exports = mongoose.model('User', userSchema);