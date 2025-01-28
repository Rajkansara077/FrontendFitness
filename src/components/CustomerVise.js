import { useState, useEffect, useCallback ,useRef} from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import './TransactionPage.css'; // Add custom styles here
import * as XLSX from 'xlsx'; 
function TransactionList() {
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const fileInputRef = useRef(null);
    const [formData, setFormData] = useState({
        TransactionId: '',
        CustomerId: '',
        VehicleNo: '',
        OperationDate: '',
        Price: '',
        VehicleType: '',
    });
    const [showModal, setShowModal] = useState(false);
    // Fetch transactions on page load
    const [importedData, setImportedData] = useState([]);



    const handleClick = () => {
        fileInputRef.current.click();
    };
   
 

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const allowedExtensions = ["xlsx", "xls"];
            const fileExtension = file.name.split(".").pop();
            if (!allowedExtensions.includes(fileExtension)) {
                alert("Invalid file type. Please upload an Excel file.");
                return;
            }

            // Read the Excel file
            const reader = new FileReader();
            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: "array" });
                const sheetName = workbook.SheetNames[0]; // Use the first sheet
                const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
                setImportedData(sheetData);
            
                setShowModal(true); 
                
            };
            reader.onerror = (error) => {
                console.error("FileReader Error:", error);
                alert("Failed to read file.");
            };
            reader.readAsArrayBuffer(file);
        }
    };

    
    const handleEditTranset = (transaction) => {
        navigate(`/transaction/edit/${transaction.TransactionId}`, { state: transaction });
    };
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
            VehicleType: '' ,      OperationDate: ''
        }); // Reset form data
    } catch (error) {
        console.error(error);
        alert('Failed to update transaction.');
    }
}, [formData]);
const handleDeleteTransaction = useCallback((id) => {
    axios.delete(`http://localhost:5000/transactions/${id}`)
        .then(() => {
            // setTransactions(transactions.filter(transaction => transaction.TransactionId !== id));
            alert('Transaction deleted successfully');
            fetchTransaction();
        })
        .catch((err) => {
            console.error('Error deleting transaction:', err);
            alert('Failed to delete transaction');
        });
},[]);
const exportToExceltransactions = (customerId) => {
    // Find the selected customer's data
    const selectedCustomer = transactions.find((customer) => customer.CustomerId === customerId);
    if (!selectedCustomer) {
        alert("Customer not found.");
        return;
    }

    // Truncate or sanitize the customer name for the sheet name
    const sheetName = selectedCustomer.CustomerName?.slice(0, 31) || "Transaction Report";

    // Format the data for Excel
    const formattedData = selectedCustomer.Transactions.map((transaction) => ({
        TransactionId: transaction.TransactionId,
        VehicleNo: transaction.VehicleNo,
        OperationDate: new Date(transaction.OperationDate).toLocaleDateString(),
        VehicleType: transaction.VehicleType || "N/A",
        Price: transaction.Price,
        Status: transaction.IsPaid ? "Paid" : "Unpaid",
    }));

    // Calculate total, paid, and unpaid amounts for the selected group
    const totalAmount = selectedCustomer.Transactions.reduce((sum, t) => sum + parseFloat(t.Price || 0), 0).toFixed(2);
    const paidAmount = selectedCustomer.Transactions
        .filter((t) => t.IsPaid)
        .reduce((sum, t) => sum + parseFloat(t.Price || 0), 0)
        .toFixed(2);
    const unpaidAmount = (totalAmount - paidAmount).toFixed(2);

    // Add summary rows
    formattedData.push({}, // Add an empty row for spacing
        {
            TransactionId: "",
            VehicleNo: "",
            OperationDate: "",
            VehicleType: "",
            Price: `Total Amount: ₹${totalAmount}`,
            Status: "",
        },
        {
            TransactionId: "",
            VehicleNo: "",
            OperationDate: "",
            VehicleType: "",
            Price: `Paid Amount: ₹${paidAmount}`,
            Status: "",
        },
        {
            TransactionId: "",
            VehicleNo: "",
            OperationDate: "",
            VehicleType: "",
            Price: `Unpaid Amount: ₹${unpaidAmount}`,
            Status: "",
        }
    );

    // Generate Excel sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, sheetName);
    XLSX.writeFile(wb, `transaction_report_${selectedCustomer.CustomerName?.replace(/[^a-zA-Z0-9]/g, "_")}.xlsx`);
};


const fetchTransaction = async () => {
   
    try {
        const res = await axios.get('http://localhost:5000/transactions/group');
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
    axios.get('http://localhost:5000/transactions/group')
        .then((res) => {
            setTransactions(res.data);
        })
        .catch((err) => {
            console.error('Error fetching transaction data:', err);
        });
}, [handleDeleteTransaction,handleEditTransaction]);

useEffect(() => {
    console.log('Current importedData:', importedData);
    if (importedData.length > 0 && showModal) {
        console.log('Navigating with data:', importedData);
        navigate(`/importdata`, { state: importedData });
    }
}, [importedData, showModal, navigate]);


const handleMarkAsPaid = async (transactionId, customerId) => {
    try {
        const response = await fetch(`http://localhost:5000/transactions/${transactionId}/mark-paid`, { method: 'PATCH' });
        const data = await response.json();

        if (data.message === 'Transaction marked as paid') {
            alert('Transaction marked as paid');

            // Update the transactions locally
            setTransactions((prevGroupedTransactions) =>
                prevGroupedTransactions.map((customer) => {
                    if (customer.CustomerId === customerId) {
                        const updatedTransactions = customer.Transactions.map((transaction) => {
                            if (transaction.TransactionId === transactionId) {
                                return { ...transaction, IsPaid: true };
                            }
                            return transaction;
                        });

                        // Recalculate the total unpaid
                        const newTotalUnpaid = updatedTransactions.reduce(
                            (total, transaction) => (transaction.IsPaid ? total : total + transaction.Price),
                            0
                        );

                        return { ...customer, Transactions: updatedTransactions, TotalUnpaid: newTotalUnpaid };
                    }
                    return customer;
                })
            );
        } else {
            alert(data.message);
        }
    } catch (error) {
        console.error('Error marking transaction as paid:', error);
        alert('Failed to mark transaction as paid');
    }
};





    return (
        <><div className="main-content">
           
                <main >
                <div >

                {/* Transactions Table */}
                <div >
                    <h2 className="title">Transactions</h2>
                
                    <div className="button-container">
  <div>
    <Link to="/add-transaction">
      <button className="mark-paid-button">Add Transaction</button>
    </Link>
  </div>
  <div>
    <input 
      type="file" 
      accept=".xlsx, .xls" 
      onChange={handleFileChange} 
      style={{ display: "none" }} 
      ref={fileInputRef} 
    />
    <button className="mark-paid-button" onClick={handleClick}>
      Import from Excel
    </button>
  </div>
</div>






                    <table className="dashboard-table">
    <thead>
    
    </thead>
    <tbody>
    <div className="customers-container">
    {transactions.map((customer) => (
    <div key={customer.CustomerId} className="customer-card">
        <h3 className="customer-name">{customer.CustomerName}</h3>
        <p className="customer-total">
            Total Amount: <span className="total-amount">₹{customer.TotalAmount}</span>
        </p>
        <p className="customer-total">
            Paid Amount: <span className="paid-amount">₹{customer.PaidAmount}</span>
        </p>
        <p className="customer-total">
            Unpaid Amount: <span className="unpaid-amount">₹{customer.UnpaidAmount}</span>
        </p>
        <button
            className="export-button"
            onClick={() => exportToExceltransactions(customer.CustomerId)}
        >
            Export to Excel
        </button>

        <table className="transactions-table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Vehicle No</th>
                    <th>Price</th>
                    <th>Vehicle Type</th>
                    <th>Operation Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {customer.Transactions.map((transaction, index) => (
                    <tr key={transaction.TransactionId}>
                        <td className="status-paid">{index + 1}</td>
                        <td className="status-paid">{transaction.VehicleNo}</td>
                        <td className="status-paid">₹{" "}{transaction.Price}</td>
                        <td className="status-paid">{transaction.VehicleType || 'N/A'}</td>
                        <td className="status-paid">{new Date(transaction.OperationDate).toLocaleDateString()}</td>
                        <td>
                            {transaction.IsPaid ? (
                                <span className="status-paid">Paid</span>
                            ) : (
                                <button className="mark-paid-button" onClick={() => handleMarkAsPaid(transaction.TransactionId, customer.CustomerId)}>
                                    Mark as Paid
                                </button>
                            )}
                        </td>
                        <td>
                            <button onClick={() => handleEditTranset(transaction)}>Edit</button>
                            <button onClick={() => handleDeleteTransaction(transaction.TransactionId)}>Delete</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    </div>
))}

</div>

        {/* {transactions.length > 0 ? (
            transactions.map((transaction, index) => (
                <tr key={transaction.TransactionId}>
                    {/* Display frontend index starting from 1 */}
                    {/* <td>{index + 1}</td>
                    <td>{transaction.Customer && transaction.Customer.CustomerName ? transaction.Customer.CustomerName : 'No Name Available'}</td>
                    <td>{transaction.VehicleNo}</td>
                    <td>{transaction.Price}</td>
                    <td>{transaction.VehicleType || 'N/A'}</td>
                    <td>{new Date(transaction.OperationDate).toLocaleDateString()}</td>
                    <td>
                        <button onClick={() => handleEditTranset(transaction)}>Edit</button>
                        <button onClick={() => handleDeleteTransaction(transaction.TransactionId)}>Delete</button>
                        <button className="export-button" onClick={exportToExceltransactions}>
                            Export to Excel
                        </button>
                    </td>
                </tr>
            ))
        ) : (
            <tr>
                <td colSpan="7">No transactions available</td>
            </tr>
        )}  */}
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
