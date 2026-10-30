import React from 'react';
import { DollarSign, TrendingUp, TrendingDown } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount || 0);
};

const BalanceCard = ({ summary }) => {
  const { totalBalance = 0, totalIncome = 0, totalExpense = 0 } = summary || {};

  return (
    <div className="metrics-grid">
      {/* Total Balance Card */}
      <div className="metric-card">
        <div className="metric-info">
          <h4>Total Net Balance</h4>
          <div className={`amount ${totalBalance >= 0 ? 'positive' : 'expense'}`}>
            {formatCurrency(totalBalance)}
          </div>
        </div>
        <div className="metric-icon-box balance">
          <DollarSign size={24} />
        </div>
      </div>

      {/* Total Income Card */}
      <div className="metric-card">
        <div className="metric-info">
          <h4>Total Income</h4>
          <div className="amount income">
            +{formatCurrency(totalIncome)}
          </div>
        </div>
        <div className="metric-icon-box income">
          <TrendingUp size={24} />
        </div>
      </div>

      {/* Total Expense Card */}
      <div className="metric-card">
        <div className="metric-info">
          <h4>Total Expenses</h4>
          <div className="amount expense">
            -{formatCurrency(totalExpense)}
          </div>
        </div>
        <div className="metric-icon-box expense">
          <TrendingDown size={24} />
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
