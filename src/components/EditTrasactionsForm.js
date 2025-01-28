import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import './CustomerForm.css';

function EdittransactionForm() {
    const { transactionId } = useParams();  // Get customerId from the URL
    const [formData, setFormData] = useState({
        TransactionId: '',
        CustomerId: '',
        VehicleNo: '',
        OperationDate: '',
        Price: '',
        VehicleType: '',
    });
    const navigate = useNavigate();
    const location = useLocation(); 
    const [customers, setCustomers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/customers')
        .then((res) => {
            setCustomers(res.data);
        })
        .catch((err) => {
            console.error('Error fetching customer data:', err);
        });
   
    }, []);
    // Fetch existing customer data when the page loads
    useEffect(() => {
       
            if (location.state) {
                // If the full customer object is passed via state, use it directly
                setFormData({
                    TransactionId: location.state.TransactionId,
             CustomerId: location.state.CustomerId,
             VehicleNo: location.state.VehicleNo,
             Price: location.state.Price,
             VehicleType: location.state.VehicleType,
             OperationDate: new Date(location.state.OperationDate).toISOString().split('T')[0] 
                });
            } 
             
        }, [transactionId, location.state]);
    // Handle form submission to update the customer
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
            navigate(`/transactionlist`)
        } catch (error) {
            console.error(error);
            alert('Failed to update transaction.');
        }
    }, [formData,navigate]);

    return (
        <><div className="main-content">
           
                <main >
                <h2 className="text-white text-center text-2xl font-bold mb-4">Edit Customer</h2>
                {formData.TransactionId && (
                    <div className="modal-overlay">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h3 className="title">Edit Transaction</h3>
                               
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
                                    <button type="submit" className="btn">
                                        Save Changes
                                    </button>
                                    <div className='space'/>
                                    <button
                                        type="button"
                                       className="btn"
                                        onClick={() => {setFormData({ TransactionId: "" })
                                        navigate(`/transactionlist`);}}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            
        </main></div>
       </>
    );
}

export default EdittransactionForm;
