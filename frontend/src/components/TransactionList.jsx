import React from 'react';
import {
  Search,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  Edit2,
  Calendar,
  Inbox,
} from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

const TransactionList = ({
  transactions,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
}) => {
  const { type, search, sortBy } = filters;

  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">Recent Transactions</h3>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        {/* Search input */}
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search transactions..."
            value={search}
            onChange={(e) => onFilterChange('search', e.target.value)}
            className="search-input"
          />
        </div>

        {/* Type pills: All, Income, Expense */}
        <div className="type-pills">
          <button
            className={`type-pill ${type === 'all' ? 'active' : ''}`}
            onClick={() => onFilterChange('type', 'all')}
          >
            All
          </button>
          <button
            className={`type-pill ${type === 'income' ? 'active' : ''}`}
            onClick={() => onFilterChange('type', 'income')}
          >
            Income
          </button>
          <button
            className={`type-pill ${type === 'expense' ? 'active' : ''}`}
            onClick={() => onFilterChange('type', 'expense')}
          >
            Expense
          </button>
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
          className="filter-select"
        >
          <option value="date_desc">Newest First</option>
          <option value="date_asc">Oldest First</option>
          <option value="amount_desc">Highest Amount</option>
          <option value="amount_asc">Lowest Amount</option>
        </select>
      </div>

      {/* Transactions List */}
      {transactions.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">
            <Inbox size={48} strokeWidth={1.5} />
          </div>
          <h4>No transactions found</h4>
          <p>
            {search || type !== 'all'
              ? 'Try adjusting your search or filters'
              : 'Click "Add Transaction" to record your first income or expense!'}
          </p>
        </div>
      ) : (
        <div className="transactions-list">
          {transactions.map((tx) => {
            const isIncome = tx.type === 'income';

            return (
              <div key={tx._id} className="transaction-item">
                <div className="tx-left">
                  <div className={`tx-icon ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? (
                      <ArrowUpRight size={20} />
                    ) : (
                      <ArrowDownRight size={20} />
                    )}
                  </div>

                  <div className="tx-info">
                    <h5>{tx.title}</h5>
                    <div className="tx-meta">
                      <span className="category-tag">{tx.category}</span>
                      <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={13} />
                        {formatDate(tx.date)}
                      </span>
                      {tx.notes && (
                        <span title={tx.notes} style={{ fontStyle: 'italic', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          • {tx.notes}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="tx-right">
                  <div className={`tx-amount ${isIncome ? 'income' : 'expense'}`}>
                    {isIncome ? '+' : '-'}
                    {formatCurrency(tx.amount)}
                  </div>

                  <div className="tx-actions">
                    <button
                      className="icon-btn"
                      onClick={() => onEdit(tx)}
                      title="Edit transaction"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      className="icon-btn delete"
                      onClick={() => onDelete(tx._id)}
                      title="Delete transaction"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TransactionList;
