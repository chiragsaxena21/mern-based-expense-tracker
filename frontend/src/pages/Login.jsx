import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Wallet, LogIn } from 'lucide-react';

const Login = ({ onSwitchToRegister }) => {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in both email and password');
      return;
    }

    try {
      setLoading(true);
      await login(email, password);
    } catch (err) {
      setError(
        err.response?.data?.message || 'Login failed. Please check your credentials.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('demo@spendwise.com');
    setPassword('demo123456');
  };

  return (
    <div className="auth-wrapper">
      <div className="auth-card">
        <div className="auth-header">
          <div
            style={{
              display: 'inline-flex',
              padding: '12px',
              background: 'var(--primary-light)',
              color: 'var(--primary)',
              borderRadius: '16px',
              marginBottom: '12px',
            }}
          >
            <Wallet size={32} />
          </div>
          <h2>Welcome Back</h2>
          <p>Login to manage your expenses & budget</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="form-input"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary btn-full"
            style={{ marginTop: '12px' }}
          >
            <LogIn size={18} />
            <span>{loading ? 'Logging in...' : 'Sign In'}</span>
          </button>
        </form>

        <div className="demo-credentials-box">
          <p>
            <strong>Quick Demo Helper:</strong> Don't have an account yet? Click{' '}
            <button
              type="button"
              onClick={handleFillDemo}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--primary)',
                fontWeight: '600',
                cursor: 'pointer',
                padding: 0,
                textDecoration: 'underline',
              }}
            >
              Fill Demo Info
            </button>{' '}
            or create a new free account below.
          </p>
        </div>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a
            href="#register"
            onClick={(e) => {
              e.preventDefault();
              onSwitchToRegister();
            }}
          >
            Create an account
          </a>
        </div>
      </div>
    </div>
  );
};

export default Login;
