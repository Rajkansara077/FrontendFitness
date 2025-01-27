import React from 'react';

function CustomerTable({ customers, onEdit, onDelete, onExport }) {
    return (
        <div className="table-container">
            <h2>Customers</h2>
            <table className="dashboard-table">
                <thead>
                    <tr>
                        <th>Customer Name</th>
                        <th>Mobile No</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {customers.length > 0 ? (
                        customers.map((customer) => (
                            <tr key={customer.CustomerId}>
                                <td>{customer.CustomerName}</td>
                                <td>{customer.MobileNo}</td>
                                <td>
                                    <button onClick={() => onEdit(customer)}>Edit</button>
                                    <button onClick={() => onDelete(customer.CustomerId)}>Delete</button>
                                    <button className="export-button" onClick={onExport}>
                                        Export to Excel
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan="3">No customers available</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}

export default CustomerTable;
