import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './TransactionForm.css';

function TransactionForm() {
    const [customers, setCustomers] = useState([]);
    const [formData, setFormData] = useState({ CustomerId: '', VehicleNo: '', OperationDate: '',Price: '',VehicleType:'' });
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
            setFormData({ CustomerId: '', VehicleNo: '', OperationDate: '',Price: '',VehicleType:'' }); // Reset form
        } catch (error) {
            console.error(error);
            alert('Failed to add transaction.');
        }
    };

    return (
        <><div className="main-content">
            
                <main >
        
            
            {/* <div className="card"> */}
            <form onSubmit={handleSubmit} className="customer-form">
              <h2 className="text-white text-center text-2xl font-bold mb-4">Add New Transaction</h2>
            
               <label htmlFor="CustomerId" >Select Customer</label>
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
                            
                                <label htmlFor="VehicleNo">Vehicle Number</label>
                                <input
                                className="input-field"
                                    type="text"
                                    id="VehicleNo"
                                    placeholder="Enter vehicle number"
                                    value={formData.VehicleNo}
                                    onChange={(e) => setFormData({ ...formData, VehicleNo: e.target.value })}
                                    required />
                            
          
                                <label htmlFor="Price">Price</label>
                                <input
                                  className="input-field"
                                    type="text"
                                    id="Price"
                                    placeholder="Enter Price"
                                    value={formData.Price}
                                    onChange={(e) => setFormData({ ...formData, Price: e.target.value })}
                                    required />
                 
                           
                                <label htmlFor="VehicleType">VehicleType</label>
                                <input
                                  className="input-field"
                                    type="text"
                                    id="VehicleType"
                                    placeholder="Enter VehicleType"
                                    value={formData.VehicleType}
                                    onChange={(e) => setFormData({ ...formData, VehicleType: e.target.value })}
                                    required />
                          
                          
                          <label htmlFor="OperationDate">Operation Date</label>
<input
    type="date"
    className="input-field"
    id="OperationDate"
    value={formData.OperationDate}
    onClick={(e) => e.target.showPicker()} // This forces the date picker to open when clicked
    onChange={(e) => setFormData({ ...formData, OperationDate: e.target.value })}
    required />

                        
              <button className="btn" type="submit" >Submit</button>
            {/* </div> */}
            </form>
           
      
          
          </main>
                </div>
               </>
        
    );
}

export default TransactionForm;
