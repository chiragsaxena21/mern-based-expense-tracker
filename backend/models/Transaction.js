const mongoose = require('mongoose');

// Transaction schema definition
const transactionSchema = new mongoose.Schema(
  {
    // Associate each transaction with a specific user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    title: {
      type: String,
      required: [true, 'Please enter a description/title for this transaction'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    amount: {
      type: Number,
      required: [true, 'Please enter a valid amount'],
      min: [0.01, 'Amount must be greater than zero'],
    },
    type: {
      type: String,
      enum: {
        values: ['income', 'expense'],
        message: '{VALUE} is not a valid transaction type (must be income or expense)',
      },
      required: [true, 'Please specify if this is an income or expense'],
    },
    category: {
      type: String,
      required: [true, 'Please select a category'],
      trim: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      trim: true,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Transaction', transactionSchema);
