import React from 'react';
import { PieChart } from 'lucide-react';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

const CategoryBreakdown = ({ breakdown = [] }) => {
  return (
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <PieChart size={20} color="#4f46e5" />
          <span>Expense Breakdown</span>
        </h3>
      </div>

      {breakdown.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-muted)' }}>
          <p style={{ fontSize: '0.9rem' }}>No expenses recorded yet.</p>
        </div>
      ) : (
        <div>
          {breakdown.slice(0, 5).map((item) => (
            <div key={item.category} className="category-item">
              <div className="category-header">
                <span style={{ color: 'var(--text-main)' }}>{item.category}</span>
                <span style={{ color: 'var(--text-muted)' }}>
                  {formatCurrency(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <div className="progress-bg">
                <div
                  className="progress-fill"
                  style={{
                    width: `${item.percentage}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CategoryBreakdown;
