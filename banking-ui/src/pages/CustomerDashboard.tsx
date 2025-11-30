import { useEffect, useState } from 'react';
import {
  getCardInfo,
  getCardTransactions,
  processTransaction,
} from '../services/api';
import type { Transaction, TransactionType } from '../services/api';


import './CustomerDashboard.css';

interface CustomerDashboardProps {
  user: { name: string; cardNumber: string };
}

export const CustomerDashboard = ({ user }: CustomerDashboardProps) => {
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [amount, setAmount] = useState('');
  const [pin, setPin] = useState('');
  const [type, setType] = useState<TransactionType>('topup');
  const [message, setMessage] = useState('');

  const load = async () => {
    const info = await getCardInfo(user.cardNumber);
    const txns = await getCardTransactions(user.cardNumber);
    setBalance(info.balance);
    setTransactions(txns);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    const res = await processTransaction({
      cardNumber: user.cardNumber,
      pin,
      amount: parseFloat(amount),
      type,
    });
    setMessage(res.message);
    if (res.success) {
      setBalance(res.balance);
      setAmount('');
      setPin('');
      await load();
    }
  };

  return (
    <>
      <section className="cd-section">
        <div className="cd-header">
          <h2>Customer Dashboard</h2>
          <p className="cd-subtitle">Manage balance and transactions</p>
        </div>
        <div className="cd-info-row">
          <div className="cd-info-item">
            <p className="cd-info-label">Name</p>
            <p className="cd-info-value">{user.name}</p>
          </div>
          <div className="cd-info-item">
            <p className="cd-info-label">Card</p>
            <p className="cd-info-value">{user.cardNumber}</p>
          </div>
          <div className="cd-info-item">
            <p className="cd-info-label">Balance</p>
            <p className="cd-info-value cd-info-balance">
              {balance.toFixed(2)}
            </p>
          </div>
        </div>
        <form className="cd-form" onSubmit={submit}>
          <div className="cd-form-group">
            <label>Type</label>
            <select
              value={type}
              onChange={e => setType(e.target.value as TransactionType)}
            >
              <option value="topup">Top-Up</option>
              <option value="withdraw">Withdraw</option>
            </select>
          </div>
          <div className="cd-form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={e => setAmount(e.target.value)}
            />
          </div>
          <div className="cd-form-group">
            <label>PIN</label>
            <input
              type="password"
              value={pin}
              onChange={e => setPin(e.target.value)}
            />
          </div>
          <button className="cd-submit" type="submit">
            Submit
          </button>
        </form>
        {message && (
          <p
            className={
              'cd-message ' +
              (message.toLowerCase().includes('success')
                ? 'cd-message-success'
                : 'cd-message-error')
            }
          >
            {message}
          </p>
        )}
      </section>

      <section className="cd-table-section">
        <div className="cd-header">
          <h2>Transactions</h2>
        </div>
        <div className="cd-table-wrapper">
          <table className="cd-table">
            <thead>
              <tr>
                <th>ID</th>
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
                  <td>{t.type}</td>
                  <td>{t.amount}</td>
                  <td>
                    <span
                      className={
                        t.status === 'SUCCESS'
                          ? 'cd-badge-success'
                          : 'cd-badge-failed'
                      }
                    >
                      {t.status}
                    </span>
                  </td>
                  <td>{t.reason || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
};
