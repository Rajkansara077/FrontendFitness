import { useEffect, useState } from 'react';
import axios from 'axios';
import './Dashboard.css'; // Add custom styles here.


function Dashboard() {
  const [count, setCount] = useState([]);
  const [transactions, setTransactions] = useState([]);
  console.log('this is transactions',transactions);
  const [transactionsfilter, setTransactionsfilter] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ CustomerId: '',  });
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState(0);
  const [overallAmount, setOverallAmount] = useState(0);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  const [customertotal, setCustomertotal] = useState(0);
  const [customerVehicleTypes, setCustomerVehicleTypes] = useState([]);
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
    axios.get('http://localhost:5000/customers')
    .then((res) => {
        setCustomers(res.data);
    })
    .catch((err) => {
        console.error('Error fetching customer data:', err);
    });
    axios.get('http://localhost:5000/transactions/group')
        .then((res) => {
            setTransactionsfilter(res.data);
        })
        .catch((err) => {
            console.error('Error fetching transaction data:', err);
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
// Handle customer selection change
const handleCustomerSelect = (e) => {
  const customerId = e.target.value;

  setFormData({ ...formData, CustomerId: customerId });
console.log('this is customerId',customerId);
  if (customerId  && customerId !== "null") {
    // Filter transactions for the selected customer
    const customerFilteredTransactions = transactionsfilter.find(item => item.CustomerId === parseInt(customerId));
    if (customerFilteredTransactions) {
      const { Transactions } = customerFilteredTransactions;

  

      const vehicleTypes = Transactions.reduce((acc, transaction) => {
        const vehicleType = transaction.VehicleType;
        if (!acc.includes(vehicleType)) {
          acc.push(vehicleType);
        }
        return acc;
      }, []);
setCustomertotal(customerFilteredTransactions);
      setCustomerTransactions(Transactions);
 
      setCustomerVehicleTypes(vehicleTypes);
    }
  } else {
    // Reset when 'null' is selected
    setCustomerTransactions([]);
setCustomertotal(0);
    setCustomerVehicleTypes([]);
  }
};
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
          <div className="title">
          <label htmlFor="CustomerId">Select Customer</label>
          <select
            id="CustomerId"
            value={formData.CustomerId}
            onChange={handleCustomerSelect}
            required
          >
            <option value="">Select Customer</option>
            <option value={null}>None</option>
            {customers.map((customer) => (
              <option key={customer.CustomerId} value={customer.CustomerId}>
                {customer.CustomerName}
              </option>
            ))}
          </select>
          </div>
          {(formData.CustomerId && formData.CustomerId !== "None") && (
  <div className="customer-summary">
    <h3>Customer Summary</h3>
    <div className="summary-card">
    <p><strong>Customer Name:</strong> {customertotal.CustomerName.toLocaleString()}</p>
      <p><strong>Total Amount:</strong> ₹{customertotal.TotalAmount.toLocaleString()}</p>
      <p><strong>Total Paid:</strong> ₹{customertotal.PaidAmount.toLocaleString()}</p>
      <p><strong>Total Unpaid:</strong> ₹{customertotal.UnpaidAmount.toLocaleString()}</p>
      <p><strong>All Vehicle Types:</strong> {customerVehicleTypes.join(', ')}</p>
      <p><strong>Total Transactions (Current Month):</strong> {customerTransactions.length}</p>
      {/* <p><strong>Total Transactions (Overall):</strong> {customerOverallTransactions.length}</p> */}
      {/* <p><strong>Overall Amount (Current Month):</strong> ₹{currentMonthTransactions.toLocaleString()}</p>
      <p><strong>Overall Amount (All Time):</strong> ₹{overallAmount.toLocaleString()}</p> */}
    </div>
  </div>
)}
    
        </main>
      </div>
    </div>
  );
}

export default Dashboard;
