import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogOut, PlusCircle } from 'lucide-react';

const Navbar = ({ onOpenAddModal }) => {
  const { user, logout } = useAuth();

  const getInitial = (name) => {
    return name ? name.charAt(0).toUpperCase() : 'U';
  };

  return (
    <header className="navbar">
      <div className="container navbar-content">
        {/* Brand Logo */}
        <div className="brand-logo">
          <div className="brand-icon-box">
            <Wallet size={22} />
          </div>
          <span>SpendWise</span>
        </div>

        {/* Right Nav Options */}
        {user ? (
          <div className="nav-user-section">
            <button
              onClick={onOpenAddModal}
              className="btn btn-primary btn-sm"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <PlusCircle size={16} />
              <span>Add Transaction</span>
            </button>

            <div className="user-badge" title={user.email}>
              <div className="user-avatar-circle">{getInitial(user.name)}</div>
              <span>{user.name.split(' ')[0]}</span>
            </div>

            <button
              onClick={logout}
              className="btn btn-outline btn-sm"
              title="Logout"
              style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default Navbar;
