import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CustomerForm.css';

function CustomerForm() {
    const [formData, setFormData] = useState({ CustomerName: '', MobileNo: '' });
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:5000/customers', formData);
            alert('Customer added successfully!');
            setFormData({ CustomerName: '', MobileNo: '' }); // Reset form
            navigate('/customerlist');
        } catch (error) {
            console.error(error);
            alert('Failed to add customer.');
        }
    };

    return (
        <><div className="main-content">
           
          <main >
        
            
            {/* <div className="card"> */}
            <form onSubmit={handleSubmit} className="customer-form">
              <h2 className="text-white text-center text-2xl font-bold mb-4">Add Customer</h2>
              <label htmlFor="CustomerName" >Customer Name</label>
              <input
                className="input-field"
                type="text"
                placeholder="Enter customer name"
                                value={formData.CustomerName}
                                onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}
              />
              <label htmlFor="MobileNo">Mobile Number</label>
              <input
                className="input-field"
                type="text"
                id="MobileNo"
                                placeholder="Enter mobile number"
                                value={formData.MobileNo}
                                onChange={(e) => setFormData({ ...formData, MobileNo: e.target.value })}
              />
              <button className="btn" type="submit" >Submit</button>
            {/* </div> */}
            </form>
           
      
          
          </main>
        </div>
        </>

    );
}

export default CustomerForm;
