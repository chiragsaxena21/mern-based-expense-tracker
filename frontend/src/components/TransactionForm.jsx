import React, { useState, useEffect } from 'react';
import { X, ArrowDownRight, ArrowUpRight } from 'lucide-react';

const EXPENSE_CATEGORIES = [
  'Food & Dining',
  'Housing & Rent',
  'Shopping',
  'Transportation',
  'Bills & Utilities',
  'Entertainment',
  'Health & Medical',
  'Education',
  'Personal Care',
  'Other Expense',
];

const INCOME_CATEGORIES = [
  'Salary',
  'Freelance / Gig',
  'Investment / Returns',
  'Allowance / Pocket Money',
  'Bonus / Gift',
  'Other Income',
];

const TransactionForm = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState({
    title: '',
    amount: '',
    type: 'expense',
    category: EXPENSE_CATEGORIES[0],
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If initialData is provided (edit mode), populate form
  useEffect(() => {
    if (initialData) {
      setFormData({
        title: initialData.title || '',
        amount: initialData.amount || '',
        type: initialData.type || 'expense',
        category: initialData.category || (initialData.type === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0]),
        date: initialData.date ? new Date(initialData.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
        notes: initialData.notes || '',
      });
    } else {
      setFormData({
        title: '',
        amount: '',
        type: 'expense',
        category: EXPENSE_CATEGORIES[0],
        date: new Date().toISOString().split('T')[0],
        notes: '',
      });
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleTypeChange = (newType) => {
    setFormData((prev) => ({
      ...prev,
      type: newType,
      category: newType === 'income' ? INCOME_CATEGORIES[0] : EXPENSE_CATEGORIES[0],
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.title.trim()) {
      setError('Please enter a description or title');
      return;
    }

    if (!formData.amount || Number(formData.amount) <= 0) {
      setError('Please enter a valid amount greater than 0');
      return;
    }

    try {
      setIsSubmitting(true);
      await onSubmit(formData);
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentCategories = formData.type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3 className="modal-title">
            {initialData ? 'Edit Transaction' : 'Add New Transaction'}
          </h3>
          <button className="icon-btn" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          {/* Income vs Expense Toggle */}
          <div className="type-toggle-group">
            <button
              type="button"
              className={`type-toggle-btn ${formData.type === 'expense' ? 'active-expense' : ''}`}
              onClick={() => handleTypeChange('expense')}
            >
              <ArrowDownRight size={18} />
              Expense
            </button>
            <button
              type="button"
              className={`type-toggle-btn ${formData.type === 'income' ? 'active-income' : ''}`}
              onClick={() => handleTypeChange('income')}
            >
              <ArrowUpRight size={18} />
              Income
            </button>
          </div>

          {/* Title */}
          <div className="form-group">
            <label className="form-label">Title / Description</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g. Grocery shopping, Freelance pay"
              className="form-input"
              required
            />
          </div>

          {/* Amount & Category */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                min="0.01"
                value={formData.amount}
                onChange={handleChange}
                placeholder="0.00"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="form-select"
              >
                {currentCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Date */}
          <div className="form-group">
            <label className="form-label">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="form-input"
              required
            />
          </div>

          {/* Optional Notes */}
          <div className="form-group">
            <label className="form-label">Notes (Optional)</label>
            <input
              type="text"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Add any extra details..."
              className="form-input"
            />
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" onClick={onClose} className="btn btn-outline">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn btn-primary">
              {isSubmitting ? 'Saving...' : initialData ? 'Update Transaction' : 'Save Transaction'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TransactionForm;
