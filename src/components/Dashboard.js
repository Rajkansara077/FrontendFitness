import { useEffect, useState } from 'react';

import axios from 'axios';
import './Dashboard.css'; // Add custom styles here.


function Dashboard() {
  const [count, setCount] = useState([]);
 
  const [transactionsfilter, setTransactionsfilter] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ CustomerId: '',  });
  const [currentMonthTransactions, setCurrentMonthTransactions] = useState(0);
  const [overallAmount, setOverallAmount] = useState(0);
  const [customerTransactions, setCustomerTransactions] = useState([]);
  // const [customertotal, setCustomertotal] = useState(0);
  const [customertotal, setCustomertotal] = useState({
    CustomerName: '',
    TotalAmount: 0,
    PaidAmount: 0,
    UnpaidAmount: 0
  });
  
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

        // Calculate current month's transactions
        const currentMonth = new Date().getMonth();
        const currentYear = new Date().getFullYear();
        const thisMonthTransactions = transactionsData.filter((transaction) => {
          const date = new Date(transaction.OperationDate);
          return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
        });

        const thisMonthTotal = thisMonthTransactions.reduce(
          (sum, transaction) => sum + (transaction.Price || 0),
          0
        );
        setCurrentMonthTransactions(thisMonthTotal);

        // Calculate overall amount
        const totalAmount = transactionsData.reduce(
          (sum, transaction) => sum + (transaction.Price || 0),
          0
        );
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

  console.log('Selected Customer ID:', customerId);

  if (customerId && customerId !== "null") {
    // Find the selected customer's transactions
    const customerFilteredTransactions = transactionsfilter.find(item => item.CustomerId === parseInt(customerId));

    if (customerFilteredTransactions) {
      const { Transactions, TotalAmount, PaidAmount, UnpaidAmount, CustomerName } = customerFilteredTransactions;

      const vehicleTypes = Transactions.reduce((acc, transaction) => {
        if (!acc.includes(transaction.VehicleType)) {
          acc.push(transaction.VehicleType);
        }
        return acc;
      }, []);

      // Ensure all required fields are set
      setCustomertotal({
        CustomerName: CustomerName || 'Unknown',
        TotalAmount: TotalAmount || 0,
        PaidAmount: PaidAmount || 0,
        UnpaidAmount: UnpaidAmount || 0
      });

      setCustomerTransactions(Transactions);
      setCustomerVehicleTypes(vehicleTypes);
    } else {
      setCustomertotal({ CustomerName: '', TotalAmount: 0, PaidAmount: 0, UnpaidAmount: 0 });
      setCustomerTransactions([]);
      setCustomerVehicleTypes([]);
    }
  } else {
    setCustomertotal({ CustomerName: '', TotalAmount: 0, PaidAmount: 0, UnpaidAmount: 0 });
    setCustomerTransactions([]);
    setCustomerVehicleTypes([]);
  }
};

return (
  <div className="dashboard-container"> {/* Main container */}
    <div className="dashboard-content"> {/* Content area */}
      <div className="stats-grid">
        <div className="stat-card-2">
          <div className="stat-icon"><i className="fas fa-users"></i></div> {/* Icon */}
          <div className="stat-info">
            <span className="stat-label" >Customers</span>
            <p className="stat-value">{count.totalCustomers || 0}</p>
          </div>
        </div>
        <div className="stat-card-1">
          <div className="stat-icon"><i className="fas fa-car"></i></div> {/* Icon */}
          <div className="stat-info">
            <span className="stat-label">Cars</span>
            <p className="stat-value">{count.totalCars || 0}</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon"><i className="fas fa-money-bill-wave"></i></div> {/* Icon */}
          <div className="stat-info">
            <span className="stat-label">{getMonthName(new Date().getMonth())} Transactions</span>
            <p className="stat-value">₹{currentMonthTransactions.toLocaleString()}</p>
          </div>
        </div>
        <div className="stat-card-3">
          <div className="stat-icon"><i className="fas fa-chart-line"></i></div> {/* Icon */}
          <div className="stat-info">
            <span className="stat-label">Overall Amount</span>
            <p className="stat-value">₹{overallAmount.toLocaleString()}</p>
          </div>
        </div>
      </div>

      <div className="customer-section"> {/* Customer section */}
        <div className="customer-select"> {/* Select styles */}
          <label htmlFor="CustomerId">Select Customer:</label>
          <select
            id="CustomerId"
            value={formData.CustomerId}
            onChange={handleCustomerSelect}
            className="customer-dropdown" // Dropdown styles
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

        {formData.CustomerId && formData.CustomerId !== "None" && customertotal.CustomerName && (
  <div className="customer-summary">
    <h3>Customer Summary</h3>
    <div className="summary-card">
      <p><strong>Customer Name:</strong> {customertotal.CustomerName || 'N/A'}</p>
      <p><strong>Total Amount:</strong> ₹{customertotal.TotalAmount || 0}</p>
      <p><strong>Total Paid:</strong> ₹{customertotal.PaidAmount || 0}</p>
      <p><strong>Total Unpaid:</strong> ₹{customertotal.UnpaidAmount || 0}</p>
      <p><strong>All Vehicle Types:</strong> {customerVehicleTypes.length > 0 ? customerVehicleTypes.join(', ') : 'N/A'}</p>
      <p><strong>Total Transactions (Current Month):</strong> {customerTransactions.length}</p>
    </div>
  </div>
)}

      </div>
    </div>
  </div>
);
}

export default Dashboard;
