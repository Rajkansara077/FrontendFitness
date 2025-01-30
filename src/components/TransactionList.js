import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

// import './TransactionPage.css'; // Add custom styles here
import * as XLSX from 'xlsx'; 
function TransactionList() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [filters, setFilters] = useState({ fromDate: '', toDate: '', customerId: '',price:'',vehicleType:'' });
    const [formData, setFormData] = useState({
        TransactionId: '',
        CustomerId: '',
        VehicleNo: '',
        OperationDate: '',
        Price: '',
        VehicleType: '',
        Notes: '',
    });
    // Fetch transactions on page load
   
    const handleEditTranset = (transaction) => {
        navigate(`/transaction/edit/${transaction.TransactionId}`, { state: transaction });
    };
    const fetchTransaction = useCallback(async () => {
        setFilters({
            fromDate: '',
            toDate: '',
            customerId: '',
            price: '',
            vehicleType: '',
        });
        try {
            const res = await axios.get('http://localhost:5000/transactions');
            setTransactions(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch transactions.');
        }
    }, [setFilters, setTransactions]);
    
        // setFormData({
        //     TransactionId: transaction.TransactionId,
        //     CustomerId: transaction.CustomerId,
        //     VehicleNo: transaction.VehicleNo,
        //     Price: transaction.Price,
        //     VehicleType: transaction.VehicleType,
        //     OperationDate: new Date(transaction.OperationDate).toISOString().split('T')[0] // Set the date in YYYY-MM-DD format
        // });
    
    // Handle form submission for editing transaction
  const handleEditTransaction = useCallback(async (e) => {
    e.preventDefault();
    try {
        await axios.patch(`http://localhost:5000/transactions/${formData.TransactionId}`, formData);
        alert('Transaction updated successfully!');
        setFormData({
            TransactionId: '',
            CustomerId: '',
            VehicleNo: '',
            Price: '',     
            VehicleType: '' ,      OperationDate: '',
            Notes: '',
        }); // Reset form data
    } catch (error) {
        console.error(error);
        alert('Failed to update transaction.');
    }
}, [formData]);
const handleDeleteTransaction = useCallback((id) => {
    axios.delete(`http://localhost:5000/transactions/${id}`)
        .then(() => {
            setTransactions((prevTransactions) =>
                prevTransactions.filter((transaction) => transaction.TransactionId !== id)
            );
            alert('Transaction deleted successfully');
            fetchTransaction();
        })
        .catch((err) => {
            console.error('Error deleting transaction:', err);
            alert('Failed to delete transaction');
        });
}, [fetchTransaction]);

const exportToExceltransactions = (transactionId) => {
    const transaction = transactions.find((t) => t.TransactionId === transactionId);
    if (!transaction) {
        alert("Transaction not found.");
        return;
    }

    const formattedData = [
        {
            TransactionId: transaction.TransactionId,
            VehicleNo: transaction.VehicleNo,
            OperationDate: new Date(transaction.OperationDate).toLocaleDateString(), // Format date
            VehicleType: transaction.VehicleType || 'N/A',
            Price: transaction.Price,
            Notes: transaction.Notes,
            CustomerName: transaction.Customer?.CustomerName || '', // Flatten CustomerName
        },
    ];

    // Calculate total price, paid amount, and unpaid amount
    const totalPrice = parseFloat(formattedData[0].Price || 0).toFixed(2);
    const paidAmount = transaction.IsPaid ? totalPrice : 0;
    const unpaidAmount = transaction.IsPaid ? 0 : totalPrice;

    // Add a row for the total and other summaries
    formattedData.push(
        {},
        {
            NO: '',
            DATE: '',
            "AGENT NAME": '',
            "VEHICLE NUMBER": '',
            "VEHICLE TYPE": 'Total Amount', // Label
            Price: "", // Leave price blank for summary header
            CustomerName: "",
            Notes: "",
        },
        {
            TransactionId: "", // Leave TransactionId empty
            VehicleNo: "",
            OperationDate: "",
            VehicleType: "Total Amount", // Label for total amount
            Price: `₹${totalPrice}`, // Total value
            CustomerName: "",
            Notes: "",
        },
        {
            TransactionId: "", // Leave TransactionId empty
            VehicleNo: "",
            OperationDate: "",
            VehicleType: "Paid Amount", // Label for paid amount
            Price: `₹${paidAmount}`, // Paid value
            CustomerName: "",
            Notes: "",
        },
        {
            TransactionId: "", // Leave TransactionId empty
            VehicleNo: "",
            OperationDate: "",
            VehicleType: "Unpaid Amount", // Label for unpaid amount
            Price: `₹${unpaidAmount}`, // Unpaid value
            CustomerName: "",
            Notes: "",
        }
    );

    // Generate Excel sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'Transaction Report');
    XLSX.writeFile(wb, `transaction_${transactionId}_report.xlsx`);
};



const fetchReport = async () => {
    try {
        const res = await axios.get('http://localhost:5000/transactions/filter', { params: filters });
        setTransactions(res.data);
    } catch (error) {
        console.error(error);
        alert('Failed to fetch transaction.');
    }
};

useEffect(() => {
    axios.get('http://localhost:5000/customers')
    .then((res) => {
        setCustomers(res.data);
    })
    .catch((err) => {
        console.error('Error fetching customer data:', err);
    });
    axios.get('http://localhost:5000/transactions')
        .then((res) => {
            setTransactions(res.data);
        })
        .catch((err) => {
            console.error('Error fetching transaction data:', err);
        });
}, [handleDeleteTransaction,handleEditTransaction]);




// Utility function to generate random colors for the chart



    return (
        <><div className="main-content">
           
                <main >
                <div >

                {/* Transactions Table */}
                <div >
                    <h2 className="title">Transactions</h2>
                    <div className="filters">
                        <div className="form-group">
                            <label htmlFor="fromDate">From Date</label>
                            <input
                                type="date"
                                id="fromDate"
                                onClick={(e) => e.target.showPicker()}
                                value={filters.fromDate}
                                onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="toDate">To Date</label>
                            <input
                                type="date"
                                id="toDate"
                                onClick={(e) => e.target.showPicker()}
                                value={filters.toDate}
                                onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="price">Price</label>
                            <input
                                type="text"
                                id="price"
                                value={filters.price}
                                onChange={(e) => setFilters({ ...filters, price: e.target.value })}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="vehicleType">vehicleType</label>
                            <input
                                type="text"
                                id="vehicleType"
                                value={filters.vehicleType}
                                onChange={(e) => setFilters({ ...filters, vehicleType: e.target.value })}
                                required />
                        </div>
                        <div className="form-group">
                            <label htmlFor="CustomerId">Select Customer</label>
                            <select
                                id="CustomerId"
                                value={filters.customerId}
                                onChange={(e) => setFilters({ ...filters, customerId: e.target.value })}
                                required
                            >
                                <option value="">Select Customer</option>
                                {customers.map((customer) => (
                                    <option key={customer.CustomerId} value={customer.CustomerId}>
                                        {customer.CustomerName}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="generate-button" onClick={fetchReport}>
                            Filter Data
                        </button>
                        <button className="generate-button" onClick={fetchTransaction}>
                            Reset Filters
                        </button>

                    </div>
                    <div className="dashboard-button-container">
    <Link to="/add-transaction">
        <button className="mark-paid-button">Add Transaction</button>
    </Link>
</div>

                    <table className="dashboard-table">
    <thead>
        <tr>
            <th>Id</th>
            <th>Customer Name</th>
            <th>Vehicle No</th>
            <th>Price</th>
            <th>VehicleType</th>
            <th>Operation Date</th>
            <th>Status</th>
            <th>Notes</th>
            <th>Actions</th>
        </tr>
    </thead>
    <tbody>
        {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
                <tr key={transaction.TransactionId}>
                    {/* Display frontend index starting from 1 */}
                    <td>{index + 1}</td>
                    <td>{transaction.Customer && transaction.Customer.CustomerName ? transaction.Customer.CustomerName : 'No Name Available'}</td>
                    <td>{transaction.VehicleNo}</td>
                    <td>{transaction.Price}</td>
                    <td>{transaction.VehicleType || 'N/A'}</td>
                    <td>{new Date(transaction.OperationDate).toLocaleDateString()}</td>
                    <td>{transaction.IsPaid ? 'Paid' : 'Not Paid'}</td>
                    <td>{transaction.Notes || 'N/A'}</td>
                    <td>
                        <button onClick={() => handleEditTranset(transaction)}>Edit</button>
                        <button onClick={() => handleDeleteTransaction(transaction.TransactionId)}>Delete</button>
                        <button
        className="export-button"
        onClick={() => exportToExceltransactions(transaction.TransactionId)}
    >
        Export to Excel
    </button> 
    {/* <button className="export-button" onClick={exportToExceltransactions}>
                            Export to Excel
                        </button> */}
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7">No transactions available</td>
            </tr>
        )}
    </tbody>
</table>

                </div>
                {formData.TransactionId && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3>Edit Transaction</h3>
                                <button
                                    onClick={() => setFormData({ TransactionId: "" })}
                                    className="close-btn"
                                >
                                    &times;
                                </button>
                            </div>
                            <form onSubmit={handleEditTransaction}>
                                <div className="modal-body">
                                    <div className="form-group">
                                        <label htmlFor="CustomerId">Customer Name:</label>
                                        <select
                                            id="CustomerId"
                                            value={formData.CustomerId}
                                            onChange={(e) => setFormData({ ...formData, CustomerId: e.target.value })}
                                            required
                                        >
                                            <option value="">Select Customer</option>
                                            {customers.map((customer) => (
                                                <option key={customer.CustomerId} value={customer.CustomerId}>
                                                    {customer.CustomerName}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="VehicleNo">Vehicle No:</label>
                                        <input
                                            type="text"
                                            id="VehicleNo"
                                            value={formData.VehicleNo}
                                            onChange={(e) => setFormData({ ...formData, VehicleNo: e.target.value })}
                                            required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Price">Price:</label>
                                        <input
                                            type="text"
                                            id="Price"
                                            value={formData.Price}
                                            onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                                            required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="VehicleType">VehicleType:</label>
                                        <input
                                            type="text"
                                            id="VehicleType"
                                            value={formData.VehicleType}
                                            onChange={(e) => setFormData({ ...formData, VehicleType: e.target.value })}
                                            required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="Notes">Notes:</label>
                                        <input
                                            type="text"
                                            id="Notes"
                                            value={formData.Notes}
                                            onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                                            required />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="OperationDate">Operation Date:</label>
                                        <input
                                            type="date"
                                            id="OperationDate"
                                            value={formData.OperationDate}
                                            onChange={(e) => setFormData({ ...formData, OperationDate: e.target.value })}
                                            required />
                                    </div>
                                </div>
                                <div className="modal-footer">
                                    <button type="submit" className="save-btn">
                                        Save Changes
                                    </button>
                                    <button
                                        type="button"
                                        className="cancel-btn"
                                        onClick={() => setFormData({ TransactionId: "" })}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
           </main></div></>
    );
}

export default TransactionList;
