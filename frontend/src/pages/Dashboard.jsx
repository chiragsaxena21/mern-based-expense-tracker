import React, { useState, useEffect, useCallback } from 'react';
import api from '../api/axios';
import Navbar from '../components/Navbar';
import BalanceCard from '../components/BalanceCard';
import TransactionList from '../components/TransactionList';
import CategoryBreakdown from '../components/CategoryBreakdown';
import TransactionForm from '../components/TransactionForm';

const Dashboard = () => {
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    totalBalance: 0,
    totalIncome: 0,
    totalExpense: 0,
    categoryBreakdown: [],
  });
  const [filters, setFilters] = useState({
    type: 'all',
    search: '',
    sortBy: 'date_desc',
  });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [feedbackMsg, setFeedbackMsg] = useState('');

  // Fetch transactions and financial summary from backend
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const params = {};
      if (filters.type !== 'all') params.type = filters.type;
      if (filters.search) params.search = filters.search;
      if (filters.sortBy) params.sortBy = filters.sortBy;

      // Parallel requests for optimal speed
      const [txRes, sumRes] = await Promise.all([
        api.get('/transactions', { params }),
        api.get('/transactions/summary'),
      ]);

      setTransactions(txRes.data.data || []);
      setSummary(sumRes.data.summary || {});
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Handle filter / search changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  // Open modal to add a new transaction
  const handleOpenAddModal = () => {
    setEditingTransaction(null);
    setIsModalOpen(true);
  };

  // Open modal to edit an existing transaction
  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setIsModalOpen(true);
  };

  // Delete transaction
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?')) {
      return;
    }

    try {
      await api.delete(`/transactions/${id}`);
      showNotification('Transaction deleted successfully!');
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete transaction');
    }
  };

  // Submit handler for both Add and Edit
  const handleFormSubmit = async (formData) => {
    if (editingTransaction) {
      // Edit existing
      await api.put(`/transactions/${editingTransaction._id}`, formData);
      showNotification('Transaction updated successfully!');
    } else {
      // Create new
      await api.post('/transactions', formData);
      showNotification('Transaction added successfully!');
    }
    fetchData();
  };

  const showNotification = (msg) => {
    setFeedbackMsg(msg);
    setTimeout(() => {
      setFeedbackMsg('');
    }, 3500);
  };

  return (
    <div>
      <Navbar onOpenAddModal={handleOpenAddModal} />

      <main className="container" style={{ paddingBottom: '60px' }}>
        {feedbackMsg && (
          <div
            className="alert alert-success"
            style={{ marginTop: '20px', animation: 'fadeIn 0.3s ease' }}
          >
            {feedbackMsg}
          </div>
        )}

        {/* Top 3 Metric Cards */}
        <BalanceCard summary={summary} />

        {/* Main Content Area */}
        <div className="dashboard-layout">
          {/* Left Column: Transaction List */}
          <div>
            <TransactionList
              transactions={transactions}
              filters={filters}
              onFilterChange={handleFilterChange}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          </div>

          {/* Right Column: Category Breakdown */}
          <div>
            <CategoryBreakdown breakdown={summary.categoryBreakdown} />
          </div>
        </div>
      </main>

      {/* Add / Edit Transaction Modal */}
      <TransactionForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={editingTransaction}
      />
    </div>
  );
};

export default Dashboard;
