import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Add custom styles here.
import logo from '../assests/logo.jpg';

function Dashboard() {
  const [count, setCount] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState(0);
  const [overallAmount, setOverallAmount] = useState(0);

  const getMonthName = (monthIndex) => {
    const monthNames = [
      'January', 'February', 'March', 'April', 'May', 'June',
      'July', 'August', 'September', 'October', 'November', 'December'
    ];
    return monthNames[monthIndex];
  };

  useEffect(() => {
    axios
      .get('http://localhost:5000/dashboard')
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => {
        console.error('Error fetching customer data:', err);
      });
  }, []);

  useEffect(() => {
    axios
      .get('http://localhost:5000/transactions')
      .then((res) => {
        const transactionsData = res.data;
        setTransactions(transactionsData);

        // Calculate current month's transactions
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthTransactions = transactionsData.filter((transaction) => {
          const date = new Date(transaction.OperationDate);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const thisMonthTotal = thisMonthTransactions.reduce((sum, transaction) => sum + (transaction.Price || 0), 0);
        setCurrentMonthTransactions(thisMonthTotal);

        // Calculate overall amount
        const totalAmount = transactionsData.reduce((sum, transaction) => sum + (transaction.Price || 0), 0);
        setOverallAmount(totalAmount);
      })
      .catch((err) => {
        console.error('Error fetching transaction data:', err);
      });
  }, []);

  return (
    <div>
      <div className="main-content">
        <main>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-time">Customers</span>
              </div>
              <div className="stat-body">
                <p className="stat-value">{count.totalCustomers}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-time">Cars</span>
              </div>
              <div className="stat-body">
                <p className="stat-value">{count.totalCars}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-time">{getMonthName(new Date().getMonth())} Transactions</span>
              </div>
              <div className="stat-body">
                <p className="stat-value">₹{currentMonthTransactions.toLocaleString()}</p>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-header">
                <span className="stat-time">Overall Amount</span>
              </div>
              <div className="stat-body">
                <p className="stat-value">₹{overallAmount.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
