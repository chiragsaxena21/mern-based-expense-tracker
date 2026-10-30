const express = require('express');
const router = express.Router();
const Transaction = require('../models/Transaction');
const { protect } = require('../middleware/authMiddleware');

// All transaction routes are protected by JWT authentication
router.use(protect);

// @route   GET /api/transactions
// @desc    Get all transactions for logged in user (with optional filtering & search)
// @access  Private
router.get('/', async (req, res) => {
  try {
    const { type, category, search, sortBy } = req.query;

    // Filter criteria object - always scoped to current user
    const query = { user: req.user._id };

    // Filter by type (income or expense)
    if (type && type !== 'all') {
      query.type = type;
    }

    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }

    // Search by title (case-insensitive regex)
    if (search) {
      query.title = { $regex: search, $options: 'i' };
    }

    // Determine sorting (default: newest date first)
    let sortOptions = { date: -1, createdAt: -1 };
    if (sortBy === 'amount_asc') {
      sortOptions = { amount: 1 };
    } else if (sortBy === 'amount_desc') {
      sortOptions = { amount: -1 };
    } else if (sortBy === 'date_asc') {
      sortOptions = { date: 1 };
    }

    const transactions = await Transaction.find(query).sort(sortOptions);

    return res.status(200).json({
      success: true,
      count: transactions.length,
      data: transactions,
    });
  } catch (error) {
    console.error('Fetch Transactions Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve transactions',
    });
  }
});

// @route   GET /api/transactions/summary
// @desc    Get summary metrics (Total Balance, Income, Expense, Category Breakdown)
// @access  Private
router.get('/summary', async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user._id });

    let totalIncome = 0;
    let totalExpense = 0;
    const categoryTotals = {};

    transactions.forEach((tx) => {
      const amount = Number(tx.amount);
      if (tx.type === 'income') {
        totalIncome += amount;
      } else if (tx.type === 'expense') {
        totalExpense += amount;
        // Group expenses by category
        categoryTotals[tx.category] = (categoryTotals[tx.category] || 0) + amount;
      }
    });

    const totalBalance = totalIncome - totalExpense;

    // Convert categoryTotals to sorted array with percentages
    const categoryBreakdown = Object.keys(categoryTotals).map((cat) => {
      const catAmount = categoryTotals[cat];
      const percentage = totalExpense > 0 ? ((catAmount / totalExpense) * 100).toFixed(1) : 0;
      return {
        category: cat,
        amount: catAmount,
        percentage: Number(percentage),
      };
    }).sort((a, b) => b.amount - a.amount);

    return res.status(200).json({
      success: true,
      summary: {
        totalBalance,
        totalIncome,
        totalExpense,
        transactionCount: transactions.length,
        categoryBreakdown,
      },
    });
  } catch (error) {
    console.error('Summary Error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to generate financial summary',
    });
  }
});

// @route   POST /api/transactions
// @desc    Create a new transaction
// @access  Private
router.post('/', async (req, res) => {
  try {
    const { title, amount, type, category, date, notes } = req.body;

    // Validation
    if (!title || amount === undefined || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide title, amount, type (income/expense), and category',
      });
    }

    if (Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than 0',
      });
    }

    const transaction = await Transaction.create({
      user: req.user._id,
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: date ? new Date(date) : Date.now(),
      notes: notes || '',
    });

    return res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      data: transaction,
    });
  } catch (error) {
    console.error('Create Transaction Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error creating transaction',
    });
  }
});

// @route   PUT /api/transactions/:id
// @desc    Update an existing transaction
// @access  Private
router.put('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this transaction',
      });
    }

    const updatedTransaction = await Transaction.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      data: updatedTransaction,
    });
  } catch (error) {
    console.error('Update Transaction Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error updating transaction',
    });
  }
});

// @route   DELETE /api/transactions/:id
// @desc    Delete a transaction
// @access  Private
router.delete('/:id', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id);

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found',
      });
    }

    // Verify ownership
    if (transaction.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this transaction',
      });
    }

    await transaction.deleteOne();

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully',
      id: req.params.id,
    });
  } catch (error) {
    console.error('Delete Transaction Error:', error);
    return res.status(500).json({
      success: false,
      message: error.message || 'Server error deleting transaction',
    });
  }
});

module.exports = router;
