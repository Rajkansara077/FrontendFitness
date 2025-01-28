import { useState } from 'react';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
 
function ImportData() {
    const location = useLocation();
    const importedData = location.state || [];
    const navigate = useNavigate();
    
    const [selectedEntries, setSelectedEntries] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    // Filter out summary rows
    const filteredData = importedData.filter(data => data.TransactionId);

    const handleSelectImportedData = (data, isSelected) => {
        setSelectedEntries(prev =>
            isSelected ? [...prev, data] : prev.filter(entry => entry.TransactionId !== data.TransactionId)
        );
    };

    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedEntries([]);
        } else {
            setSelectedEntries(filteredData);
        }
        setSelectAll(!selectAll);
    };

    const handleSendToDatabase = async () => {
        if (selectedEntries.length === 0) {
            alert("Please select entries to send.");
            return;
        }
    
        for (const entry of selectedEntries) {
            const { CustomerName, VehicleNo, OperationDate, VehicleType, Price } = entry;
    
            let customerId = null;
            if (CustomerName) {
                try {
                    const customerResponse = await axios.get('http://localhost:5000/customers/filter', {
                        params: { CustomerName },
                    });
    
                    if (customerResponse.data && customerResponse.data.length > 0) {
                        customerId = customerResponse.data[0].CustomerId;
                    } else {
                        const newCustomerResponse = await axios.post('http://localhost:5000/customers', {
                            CustomerName,
                            MobileNo: '0000000000',
                        });
    
                        customerId = newCustomerResponse.data.customer.CustomerId;
                    }
                } catch (error) {
                    console.error(`Error processing customer ${CustomerName}:`, error);
                    continue;
                }
            }
    
            let formattedDate;
            if (!OperationDate) {
                const currentDate = new Date();
                formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
            } else {
                try {
                    const parsedDate = new Date(OperationDate);
                    if (isNaN(parsedDate)) throw new Error("Invalid date format");
                    formattedDate = `${parsedDate.getMonth() + 1}-${parsedDate.getDate()}-${parsedDate.getFullYear()}`;
                } catch (error) {
                    const currentDate = new Date();
                    formattedDate = `${currentDate.getMonth() + 1}-${currentDate.getDate()}-${currentDate.getFullYear()}`;
                }
            }
    
            try {
                await axios.post('http://localhost:5000/transactions', {
                    VehicleNo,
                    OperationDate: formattedDate,
                    VehicleType: VehicleType || 'N/A',
                    Price,
                    CustomerId: customerId,
                });
            } catch (error) {
                console.error('Error creating transaction:', error);
            }
        }
    
        alert("Selected transactions have been processed.");
        navigate(`/customervise`);
        setSelectedEntries([]);
    };
    
    return (
        <div className="main-content">
            <main>
                <h3>Preview Imported Data</h3>
                <button className="mark-paid-button" onClick={handleSendToDatabase}>Send Selected to Database</button>
                <table className="transactions-table">
                    <thead>
                        <tr>
                            <th>
                                <input
                                    type="checkbox"
                                    onChange={handleSelectAll}
                                    checked={selectAll}
                                />
                            </th>
                            <th>Transaction ID</th>
                            <th>Vehicle No</th>
                            <th>Customer Name</th>
                            <th>Price</th>
                            <th>Vehicle Type</th>
                            <th>Operation Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredData.map((data, index) => (
                            <tr key={index}>
                                <td>
                                    <input
                                        type="checkbox"
                                        onChange={(e) => handleSelectImportedData(data, e.target.checked)}
                                        checked={selectedEntries.some(entry => entry.TransactionId === data.TransactionId)}
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
            </main>
        </div>
    );
}

export default ImportData;
