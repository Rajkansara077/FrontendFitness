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
      <div className="customer-form-container"> {/* Main container */}
          <div className="customer-form-content"> {/* Content area */}
              <h2 className="customer-form-title">Add Customer</h2> {/* Title */}
              <form onSubmit={handleSubmit} className="customer-form">
                  <label htmlFor="CustomerName">Customer Name</label>
                  <input
                      className="customer-form-input"
                      type="text"
                      placeholder="Enter customer name"
                      value={formData.CustomerName}
                      onChange={(e) => setFormData({ ...formData, CustomerName: e.target.value })}
                      required // Add required attribute
                  />
                  <label htmlFor="MobileNo">Mobile Number</label>
                  <input
                      className="customer-form-input"
                      type="text"
                      id="MobileNo"
                      placeholder="Enter mobile number"
                      value={formData.MobileNo}
                      onChange={(e) => setFormData({ ...formData, MobileNo: e.target.value })}
                      required // Add required attribute
                  />
                  <button className="customer-form-button" type="submit">Submit</button>
              </form>
          </div>
      </div>
  );

}

export default CustomerForm;
