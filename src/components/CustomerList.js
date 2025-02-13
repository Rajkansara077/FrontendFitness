import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
// import './CustomerPage.css'; // Add custom styles here
import * as XLSX from 'xlsx'; 
function CustomerList() {
    const navigate = useNavigate();
    const [customers, setCustomers] = useState([]);
  
    // Fetch customers on page load
   
 // Handle editing of customer details
//  const handleEdit = (customer) => {
//     setEditingCustomerId(customer.CustomerId);  // Set the customer being edited
//     setEditData({
//         CustomerName: customer.CustomerName,
//         MobileNo: customer.MobileNo,
//     });  // Pre-fill the form with current customer data
// };
const handleEdit = (customer) => {
    // Pass the entire customer object as state when navigating
    navigate(`/customers/edit/${customer.CustomerId}`, { state: customer });
};

    // Handle deleting a customer
   // Handle deleting a customer
   const handleDeleteCustomer = useCallback((id) => {
    axios.delete(`http://localhost:5000/customers/${id}`)
        .then(() => {
            setCustomers(customers.filter(customer => customer.CustomerId !== id));
            alert('Customer deleted successfully');
            fetchReport();
        })
        .catch((err) => {
            console.error('Error deleting customer:', err);
            alert('Failed to delete customer');
        });
},[ setCustomers,customers]);
const fetchReport = async () => {
    try {
        const res = await axios.get('http://localhost:5000/customers');
        setCustomers(res.data);
    } catch (error) {
        console.error(error);
        alert('Failed to fetch report.');
    }
};
 // Handle the form submission for editing customer details

useEffect(() => {
    axios.get('http://localhost:5000/customers')
        .then((res) => {
            setCustomers(res.data);
        })
        .catch((err) => {
            console.error('Error fetching customer data:', err);
        });
}, []);
const exportCustomerToExcel = (customer) => {
    const formattedData = [
        {
            CustomerId: customer.CustomerId,
            CustomerName: customer.CustomerName || '',
            MobileNo: customer.MobileNo || '',
        },
    ];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws, 'Customer Report');
    const sanitizedFileName = customer.CustomerName?.replace(/[^a-zA-Z0-9]/g, '_') || 'customer';
    XLSX.writeFile(wb, `${sanitizedFileName}.xlsx`);
};

// Import your CSS file

// ... (Your existing component logic and data fetching)

return (
    <div className="customer-list-container"> {/* Main container */}
        <div className="customer-list-content"> {/* Content area */}
            <h2 className="customer-list-title">Customers</h2> {/* Title */}

            <div className="customer-list-actions"> {/* Container for buttons */}
                <Link to="/add-customer">
                    <button className="customer-list-add-button">Add Customer</button>
                </Link>
            </div>

            <div className="table-responsive"> {/* For table responsiveness */}
                <table className="customer-list-table">
                    <thead>
                        <tr>
                            <th>Id</th>
                            <th>Customer Name</th>
                            <th>Mobile No</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {customers.length > 0 ? (
                            customers.map((customer, index) => (
                                <tr key={customer.CustomerId}>
                                    <td>{index + 1}</td>
                                    <td>{customer.CustomerName}</td>
                                    <td>{customer.MobileNo}</td>
                                    <td>
                                        <button className="customer-list-edit-button" onClick={() => handleEdit(customer)}>
                                            Edit
                                        </button>
                                        <button
                                            className="customer-list-delete-button"
                                            onClick={() => handleDeleteCustomer(customer.CustomerId)}
                                        >
                                            Delete
                                        </button>
                                        <button
                                            className="customer-list-export-button"
                                            onClick={() => exportCustomerToExcel(customer)}
                                        >
                                            Export to Excel
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="4">No customers available</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    </div>
);
}

export default CustomerList;
