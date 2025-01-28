import { useState, } from 'react';
import axios from 'axios';
import { useLocation, useNavigate, } from 'react-router-dom';
 
function ImportData() {
   
const location = useLocation();
const importedData = location.state || [];
console.log('Imported Data:', importedData);
    const navigate = useNavigate();
   
   
 
    // Fetch transactions on page load
  
    const [selectedEntries, setSelectedEntries] = useState([]);

    const handleSelectImportedData = (data, isSelected) => {
        setSelectedEntries((prev) =>
            isSelected
                ? [...prev, data]
                : prev.filter((entry) => entry.TransactionId !== data.TransactionId)
        );
    };

    const handleSendToDatabase = async () => {
        if (selectedEntries.length === 0) {
            alert("Please select entries to send.");
            return;
        }
    
        for (const entry of selectedEntries) {
            const { CustomerName, VehicleNo, OperationDate, VehicleType, Price } = entry;
    
            let customerId = null; // Default to null for missing customer names
            if (CustomerName) {
                try {
                    // Check if the customer exists
                    const customerResponse = await axios.get('http://localhost:5000/customers/filter', {
                        params: { CustomerName },
                    });
    
                    if (customerResponse.data && customerResponse.data.length > 0) {
                        // Customer exists, use their ID
                        customerId = customerResponse.data[0].CustomerId;
                        console.log(`Customer exists: ${CustomerName}, ID: ${customerId}`);
                    } else {
                        // Customer does not exist, create a new customer
                        const newCustomerResponse = await axios.post('http://localhost:5000/customers', {
                            CustomerName,
                            MobileNo: '0000000000', // Default mobile number
                        });
    
                        customerId = newCustomerResponse.data.customer.CustomerId;
                        console.log(`New Customer created: ${CustomerName}, ID: ${customerId}`);
                    }
                } catch (error) {
                    console.error(`Error checking or creating customer for ${CustomerName}:`, error);
                    continue; // Skip this entry if an error occurs
                }
            }
    
            // Validate and format the date
            let formattedDate;
            if (!OperationDate) {
                // Use the current date if no date is provided
                const currentDate = new Date();
                formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
            } else {
                try {
                    const parsedDate = new Date(OperationDate);
                    if (isNaN(parsedDate)) {
                        throw new Error("Invalid date format");
                    }
                    // Format the valid date as mm-dd-yyyy
                    formattedDate = `${parsedDate.getMonth() + 1}-${parsedDate.getDate()}-${parsedDate.getFullYear()}`;
                } catch (error) {
                    // Default to the current date if parsing fails
                    const currentDate = new Date();
                    formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
                    console.warn(`Invalid date format for ${OperationDate}. Defaulting to current date.`);
                }
            }
    
            // Create the transaction
            try {
                const transactionResponse = await axios.post('http://localhost:5000/transactions', {
                    VehicleNo,
                    OperationDate: formattedDate,
                    VehicleType: VehicleType || 'N/A',
                    Price,
                    CustomerId: customerId, // Use null if no customer
                });
    
                console.log('Transaction created:', transactionResponse.data);
            } catch (error) {
                console.error('Error creating transaction:', error);
            }
        }
    
        alert("Selected transactions have been processed.");
        navigate(`/customervise`);
        fetchTransaction(); // Refresh transactions
        setSelectedEntries([]); // Reset selected entries
      
    };
    


 
   
const fetchTransaction = async () => {

    try {
         await axios.get('http://localhost:5000/transactions/group');
     
    } catch (error) {
        console.error(error);
        alert('Failed to fetch transaction.');
    }
};
    return (
        <><div className="main-content">
           
                <main >
             

                {/* Transactions Table */}
                <div >
            
             
            

<div>
    <h3>Preview Imported Data</h3>
    <button className="mark-paid-button" onClick={handleSendToDatabase}>Send Selected to Database</button>
    <table className="transactions-table">
        <thead>
            <tr>
                <th>Select</th>
                <th>Transaction ID</th>
                <th>Vehicle No</th>
                <th>Customer Name</th>
                <th>Price</th>
                <th>Vehicle Type</th>
                <th>Operation Date</th>
            </tr>
        </thead>
        <tbody>
            {importedData?.map((data, index) => (
                <tr key={index}>
                    <td>
                        <input
                            type="checkbox"
                            onChange={(e) =>
                                handleSelectImportedData(data, e.target.checked)
                            }
                        />
                    </td>
                    <td className="status-paid">{data.TransactionId}</td>
                    <td className="status-paid">{data.VehicleNo}</td>
                    <td className="status-paid">{data.CustomerName}</td>
                    <td className="status-paid">{data.Price}</td>
                    <td className="status-paid">{data.VehicleType}</td>
                    <td className="status-paid">{data.OperationDate}</td>
                </tr>
            ))}
        </tbody>
    </table>
</div>




      
            </div>
           </main></div></>
    );
}

export default ImportData;
