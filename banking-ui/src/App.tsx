import { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { ProtectedRoute } from './components/ProtectedRoute';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';

import './App.css';

export type Role = 'CUSTOMER' | 'ADMIN';

function App() {
  const [role, setRole] = useState<Role | null>(null);
  const [user, setUser] = useState<any>(null);

  const handleLogin = (r: Role, u: any) => {
    setRole(r);
    setUser(u);
  };

  const logout = () => {
    setRole(null);
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/login" element={<Login onLogin={handleLogin} />} />
      <Route
        path="/customer"
        element={
          <ProtectedRoute role={role} requiredRole="CUSTOMER">
            <div className="app-root">
              <header className="app-header">
                <span className="app-title">Banking System POC</span>
                <button className="app-logout" onClick={logout}>Logout</button>
              </header>
              <main className="app-main">
                {user && <CustomerDashboard user={user} />}
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin"
        element={
          <ProtectedRoute role={role} requiredRole="ADMIN">
            <div className="app-root">
              <header className="app-header">
                <span className="app-title">Banking System POC – Admin</span>
                <button className="app-logout" onClick={logout}>Logout</button>
              </header>
              <main className="app-main">
                <AdminDashboard />
              </main>
            </div>
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default App;
