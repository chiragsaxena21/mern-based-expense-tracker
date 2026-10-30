import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
  const { user, loading } = useAuth();
  const [isRegisterView, setIsRegisterView] = useState(false);

  // Show clean loading spinner while checking persisted authentication
  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: 'var(--bg-main)',
        }}
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e2e8f0',
            borderTopColor: '#4f46e5',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
        `}</style>
        <p style={{ marginTop: '16px', color: '#64748b', fontWeight: '500' }}>
          Loading SpendWise...
        </p>
      </div>
    );
  }

  // If user is logged in, show Dashboard
  if (user) {
    return <Dashboard />;
  }

  // Otherwise, show Login or Register based on user selection
  return isRegisterView ? (
    <Register onSwitchToLogin={() => setIsRegisterView(false)} />
  ) : (
    <Login onSwitchToRegister={() => setIsRegisterView(true)} />
  );
}

export default App;
