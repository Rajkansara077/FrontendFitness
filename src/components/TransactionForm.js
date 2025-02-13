import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TransactionForm.css';

function TransactionForm() {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ CustomerId: '',Notes: '', VehicleNo: '', OperationDate: '',Price: '',VehicleType:'' });
    const navigate = useNavigate();
  
   
    useEffect(() => {
        axios
            .get('http://localhost:5000/customers')
            .then((res) => setCustomers(res.data))
            .catch((error) => console.error('Failed to fetch customers:', error));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            console.log('this is form data',formData);
            await axios.post('http://localhost:5000/transactions', formData);
            alert('Transaction added successfully!');
            navigate('/transactionlist')
            setFormData({ CustomerId: '',Notes: '', VehicleNo: '', OperationDate: '',Price: '',VehicleType:'' }); // Reset form
        } catch (error) {
            console.error(error);
            alert('Failed to add transaction.');
        }
    };

    return (
        <div className="transaction-form-container">
            <div className="transaction-form-content">
                <h2 className="transaction-form-title">Add New Transaction</h2>
                <form onSubmit={handleSubmit} className="transaction-form">
                    <label htmlFor="CustomerId">Select Customer</label>
                    <select
                        id="CustomerId"
                        className="transaction-form-select" // Style the select element
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

                    <label htmlFor="VehicleNo">Vehicle Number</label>
                    <input
                        className="transaction-form-input"
                        type="text"
                        id="VehicleNo"
                        placeholder="Enter vehicle number"
                        value={formData.VehicleNo}
                        onChange={(e) => setFormData({ ...formData, VehicleNo: e.target.value })}
                        required
                    />

                    <label htmlFor="Price">Price</label>
                    <input
                        className="transaction-form-input"
                        type="number" // Use type="number" for price
                        id="Price"
                        placeholder="Enter Price"
                        value={formData.Price}
                        onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                        required
                    />

                    <label htmlFor="VehicleType">Vehicle Type</label>
                    <input
                        className="transaction-form-input"
                        type="text"
                        id="VehicleType"
                        placeholder="Enter Vehicle Type"
                        value={formData.VehicleType}
                        onChange={(e) => setFormData({ ...formData, VehicleType: e.target.value })}
                        required
                    />

                    <label htmlFor="Notes">Notes</label>
                    <input
                        className="transaction-form-input"
                        type="text"
                        id="Notes"
                        placeholder="Enter Notes"
                        value={formData.Notes}
                        onChange={(e) => setFormData({ ...formData, Notes: e.target.value })}
                        required
                    />

                    <label htmlFor="OperationDate">Operation Date</label>
                    <input
                        type="date"
                        className="transaction-form-input"
                        id="OperationDate"
                        value={formData.OperationDate}
                        onClick={(e) => e.target.showPicker()}
                        onChange={(e) => setFormData({ ...formData, OperationDate: e.target.value })}
                        required
                    />

                    <button className="transaction-form-button" type="submit">Submit</button>
                </form>
            </div>
        </div>
    );
}

export default TransactionForm;
