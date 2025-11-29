import { useEffect, useState } from 'react';
import { getAllTransactions, Transaction } from '../services/api';

import './AdminDashboard.css';

export const AdminDashboard = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const load = async () => {
    const data = await getAllTransactions();
    setTransactions(data);
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <section className="ad-section">
      <div className="ad-header">
        <h2 className="ad-title">All Transactions</h2>
        <button className="ad-refresh" onClick={load}>
          Refresh
        </button>
      </div>
      <div className="ad-table-wrapper">
        <table className="ad-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Card</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Reason</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(t => (
              <tr key={t.id}>
                <td>{t.id}</td>
                <td>{t.cardNumber}</td>
                <td>{t.type}</td>
                <td>{t.amount}</td>
                <td>{t.status}</td>
                <td>{t.reason || '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
