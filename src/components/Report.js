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
        TransactionId: index + 1, // Generate an auto-incremented ID starting from 1
        VehicleNo: transaction.VehicleNo,
        OperationDate: new Date(transaction.OperationDate).toLocaleDateString(), // Format date
        VehicleType: transaction.VehicleType || 'N/A',
        Price: transaction.Price,
        CustomerName: transaction.Customer?.CustomerName || '', // Flatten CustomerName
        MobileNo: transaction.Customer?.MobileNo || '' // Include MobileNo if required
    }));

    // Calculate the total, paid, and unpaid amounts
    const totalAmount = report.reduce((sum, transaction) => sum + (transaction.Price || 0), 0);
    const paidAmount = report
        .filter((transaction) => transaction.IsPaid)
        .reduce((sum, transaction) => sum + (transaction.Price || 0), 0);
    const unpaidAmount = totalAmount - paidAmount;

    // Add summary rows
    formattedData.push(
        {}, // Add an empty row for spacing
        {
            TransactionId: '', // Leave TransactionId empty for the total row
            VehicleNo: '',
            OperationDate: '',
            VehicleType: '', // Label for the summary section
            Price: '', // No price in the header row
            CustomerName: '',
            MobileNo: ''
        },
        {
            TransactionId: '', // Leave TransactionId empty
            VehicleNo: '',
            OperationDate: '',
            VehicleType: 'Total Amount', // Label for total amount
            Price: totalAmount, // Total value
            CustomerName: '',
            MobileNo: ''
        },
        {
            TransactionId: '', // Leave TransactionId empty
            VehicleNo: '',
            OperationDate: '',
            VehicleType: 'Paid Amount', // Label for paid amount
            Price: paidAmount, // Paid value
            CustomerName: '',
            MobileNo: ''
        },
        {
            TransactionId: '', // Leave TransactionId empty
            VehicleNo: '',
            OperationDate: '',
            VehicleType: 'Unpaid Amount', // Label for unpaid amount
            Price: unpaidAmount, // Unpaid value
            CustomerName: '',
            MobileNo: ''
        }
    );

    // Generate Excel sheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(formattedData, { skipHeader: false });
    XLSX.utils.book_append_sheet(wb, ws, 'Transaction Report');
    XLSX.writeFile(wb, 'transaction_report.xlsx');
};




    return (
        <> <div className="main-content">
           

                <main >
                    {/* <div className="report-container"> */}
                        <h2 className="title">Transaction Report</h2>
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
                                    value={filters.toDate}
                                    onClick={(e) => e.target.showPicker()}
                                    onChange={(e) => setFilters({ ...filters, toDate: e.target.value })} />
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
                                            <td>{new Date(entry.OperationDate).toLocaleDateString()}</td>

                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="3" className="no-data">
                                            No data available
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                        {/* Edit Customer Form */}

                   </main></div></>
    );
}

export default Report;
