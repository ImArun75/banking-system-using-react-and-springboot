import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Role } from '../App';

import './Login.css';

interface LoginProps {
  onLogin: (role: Role, user: any) => void;
}

export const Login = ({ onLogin }: LoginProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (username === 'cust1' && password === 'pass') {
      onLogin('CUSTOMER', { name: 'John Doe', cardNumber: '4123456789012345' });
      navigate('/customer');
    } else if (username === 'admin' && password === 'admin') {
      onLogin('ADMIN', { name: 'Admin' });
      navigate('/admin');
    } else {
      setError('Invalid credentials');
    }
  };

    return (
        <div className="auth-container">
        <div className="auth-card">
            <h1 className="auth-title">Banking System</h1>
            <form onSubmit={submit}>
            <div className="auth-form-group">
                <label>Username</label>
                <input value={username} onChange={e => setUsername(e.target.value)} />
            </div>
            <div className="auth-form-group">
                <label>Password</label>
                <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                />
            </div>
            {error && <p className="auth-error">{error}</p>}
            <button type="submit" className="auth-button">Login</button>
            </form>
            <p className="auth-note">Customer: cust1 / pass</p>
            <p className="auth-note">Admin: admin / admin</p>
        </div>
        </div>
    );
};
