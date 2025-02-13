import { useEffect, useState } from 'react';
import axios from 'axios';
import './Report.css';
import * as XLSX from 'xlsx'; 
function Report() {
    const [filters, setFilters] = useState({ fromDate: '', toDate: '', customerId: '' });
    const [report, setReport] = useState([]);
    const [customers, setCustomers] = useState([]);

    const fetchReport = async () => {
        try {
            const res = await axios.get('http://localhost:5000/transactions/report', { params: filters });
            setReport(res.data);
        } catch (error) {
            console.error(error);
            alert('Failed to fetch report.');
        }
    };
    useEffect(() => {
        axios
            .get('http://localhost:5000/customers')
            .then((res) => setCustomers(res.data))
            .catch((error) => console.error('Failed to fetch customers:', error));
    }, []);
 // Export the report to Excel
 const exportToExcel = () => {
    const formattedData = report.map((transaction, index) => ({
        NO: index + 1, // Auto-increment ID
        DATE: new Date(transaction.OperationDate).toLocaleDateString(), // Format date
        "AGENT NAME": transaction.Customer?.CustomerName || '', 
        "VEHICLE NUMBER": transaction.VehicleNo,
        "VEHICLE TYPE": transaction.VehicleType || 'N/A',
        PRICE: transaction.Price,
        NOTES: transaction.Notes,
        // Flatten CustomerName
        MOBILENUMBER: transaction.Customer?.MobileNo || '',
        Status: transaction.IsPaid ? "Paid" : "Unpaid", // Include MobileNo
    }));

    // Calculate the total, paid, and unpaid amounts
    const totalAmount = report.reduce((sum, transaction) => sum + (transaction.Price || 0), 0);
    const paidAmount = report
        .filter((transaction) => transaction.IsPaid)
        .reduce((sum, transaction) => sum + (transaction.Price || 0), 0);
    const unpaidAmount = totalAmount - paidAmount;

    // Add summary rows with correct structure
    formattedData.push(
        {}, // Empty row for spacing
        {
            NO: '',
            DATE: '',
            "AGENT NAME": '',
            "VEHICLE NUMBER": '',
            "VEHICLE TYPE": 'Total Amount', // Label
            PRICE: totalAmount, // Total value
        NOTES:'',            MOBILENUMBER: '',
        Status: "",
        },
        {
            NO: '',
            DATE: '',
            "AGENT NAME": '',
            "VEHICLE NUMBER": '',
            "VEHICLE TYPE": 'Paid Amount', // Label
            PRICE: paidAmount, // Paid value
            NOTES:'',  
            MOBILENUMBER: '',
            Status: "",
        },
        {
            NO: '',
            DATE: '',
            "AGENT NAME": '',
            "VEHICLE NUMBER": '',
            "VEHICLE TYPE": 'Unpaid Amount', // Label
            PRICE: unpaidAmount, // Unpaid value
            NOTES:'',  
            MOBILENUMBER: '',
            Status: "",
        }
    );

    // Generate Excel sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData);
    XLSX.utils.book_append_sheet(wb, ws, 'Transaction Report');
    XLSX.writeFile(wb, 'transaction_report.xlsx');
};





return (
    <>
        <div className="main-content">
            <main>
                <h2 className="title">Transaction Report</h2>
                <div className="filters">
                    <div className="form-group">
                        <label htmlFor="fromDate">From Date</label>
                        <input
                            type="date"
                            id="fromDate"
                            onClick={(e) => e.target.showPicker()}
                            value={filters.fromDate}
                            onChange={(e) => setFilters({ ...filters, fromDate: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="toDate">To Date</label>
                        <input
                            type="date"
                            id="toDate"
                            value={filters.toDate}
                            onClick={(e) => e.target.showPicker()}
                            onChange={(e) => setFilters({ ...filters, toDate: e.target.value })}
                        />
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
                        Generate Report
                    </button>
                    <button className="export-button" onClick={exportToExcel}>
                        Export to Excel
                    </button>
                </div>

                <table className="dashboard-table">
                    <thead>
                        <tr>
                            <th>Customer Name</th>
                            <th>Vehicle Type</th>
                            <th>Vehicle No</th>
                            <th>Notes</th>
                            <th>Operation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {report.length > 0 ? (
                            report.map((entry) => (
                                <tr key={entry.TransactionId}>
                                    <td>{entry.Customer && entry.Customer.CustomerName ? entry.Customer.CustomerName : 'No Name Available'}</td>
                                    <td>{entry.VehicleType}</td>
                                    <td>{entry.VehicleNo}</td>
                                    <td>{entry.Notes}</td>
                                    <td>{new Date(entry.OperationDate).toLocaleDateString()}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="no-data">
                                    No data available
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </main>
        </div>
    </>
);
}

export default Report;
