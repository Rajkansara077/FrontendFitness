import { useState, useEffect, useCallback ,useRef} from 'react';
import axios from 'axios';
import { data, Link, useLocation, useNavigate, useParams } from 'react-router-dom';
// import './TransactionPage.css'; // Add custom styles here
import * as XLSX from 'xlsx'; 
function ImportData() {
   
const location = useLocation();
const importedData = location.state || [];
console.log('Imported Data:', importedData);
    const navigate = useNavigate();
    const [transactions, setTransactions] = useState([]);
    const [customers, setCustomers] = useState([]);
    const fileInputRef = useRef(null);
    const [filters, setFilters] = useState({ fromDate: '', toDate: '', customerId: '',price:'',vehicleType:'' });
    const [formData, setFormData] = useState({
        TransactionId: '',
        CustomerId: '',
        VehicleNo: '',
        OperationDate: '',
        Price: '',
        VehicleType: '',
    });
    const [showModal, setShowModal] = useState(false);
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
    
            // Create the transaction
            try {
                const transactionResponse = await axios.post('http://localhost:5000/transactions', {
                    VehicleNo,
                    OperationDate: new Date(OperationDate).toISOString().split('T')[0], // Format date
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
        setShowModal(false); // Close modal
    };
    

    const handleClick = () => {
        fileInputRef.current.click();
    };
    const processExcelFile = async (file) => {
        try {
          // Step 1: Parse the Excel file
          const reader = new FileReader();
          reader.onload = async (e) => {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, { type: 'array' });
            const sheetName = workbook.SheetNames[0]; // Use the first sheet
            const sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
            console.log('Parsed Data:', sheetData);
      
            for (const row of sheetData) {
              const { CustomerName, VehicleNo, OperationDate, VehicleType, Price } = row;
      
              // Step 2: Check if the customer exists
              let customerId;
              try {
                const customerResponse = await axios.get(`http://localhost:5000/customers`, {
                  params: { CustomerName },
                });
      
                if (customerResponse.data && customerResponse.data.length > 0) {
                  // Customer exists
                  customerId = customerResponse.data[0].CustomerId;
                  console.log(`Customer exists: ${CustomerName}, ID: ${customerId}`);
                } else {
                  // Customer does not exist, create customer
                  const newCustomer = await axios.post('http://localhost:5000/customers', {
                    CustomerName,
                    MobileNo: '0000000000', // Default mobile number if not in Excel
                  });
      
                  customerId = newCustomer.data.customer.CustomerId;
                  console.log(`New Customer created: ${CustomerName}, ID: ${customerId}`);
                }
              } catch (error) {
                console.error('Error checking or creating customer:', error);
                continue; // Skip this row if there's an error
              }
      
              // Step 3: Create the transaction
              try {
                const transactionResponse = await axios.post('http://localhost:5000/transactions', {
                  VehicleNo,
                  OperationDate: new Date(OperationDate).toISOString().split('T')[0], // Convert to ISO format
                  VehicleType: VehicleType || 'N/A',
                  Price,
                  CustomerId: customerId,
                });
      
                console.log('Transaction created:', transactionResponse.data);
              } catch (error) {
                console.error('Error creating transaction:', error);
              }
            }
          };
      
          reader.onerror = (error) => {
            console.error('FileReader Error:', error);
          };
      
          reader.readAsArrayBuffer(file);
        } catch (error) {
          console.error('Error processing Excel file:', error);
        }
      };
      const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    processExcelFile(file);
  }
};
const fetchTransaction = async () => {
    setFilters({
        fromDate: '', toDate: '', customerId: '',price:'',vehicleType:''
    })
    try {
        const res = await axios.get('http://localhost:5000/transactions/group');
        setTransactions(res.data);
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
