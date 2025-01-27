import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dashboard from './components/Dashboard';
import CustomerForm from './components/CustomerForm';
import TransactionForm from './components/TransactionForm';
import Report from './components/Report';
import EditCustomerForm from './components/EditCustomerForm';
import Navbar from './components/NavBar';
import CustomerList from './components/CustomerList';
import TransactionList from './components/TransactionList';
import Footer from './components/Footer';
import LoginWithOTP from './components/Login';
import EdittransactionForm from './components/EditTrasactionsForm';
import Customervise from './components/CustomerVise';
import ImportData from './components/ImportedData';
function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Check login status on component mount
    useEffect(() => {
        const loggedInStatus = localStorage.getItem('isLoggedIn');
        console.log('Logged in status from localStorage:', loggedInStatus);
        setIsLoggedIn(loggedInStatus === 'true'); // Ensure boolean conversion
    }, []);

    const handleLogout = () => {
        setIsLoggedIn(false); // Update state
        localStorage.removeItem('isLoggedIn'); // Clear localStorage
        console.log('User logged out');
    };

    return (
        <Router>
            <div className="app-container">
                <Navbar isLoggedIn={isLoggedIn} handleLogout={handleLogout} />
                <div className="content-container">
                    <Routes>
                        {/* Public routes */}
                        <Route
                            path="/"
                            element={
                                !isLoggedIn ? (
                                    <LoginWithOTP setIsLoggedIn={setIsLoggedIn} />
                                ) : (
                                    <Navigate to="/Dashboard" replace />
                                )
                            }
                        />

                        {/* Protected routes */}
                        {isLoggedIn && (
                            <>
                                <Route path="/Dashboard" element={<Dashboard />} />
                                <Route path="/add-customer" element={<CustomerForm />} />
                                <Route path="/customers/edit/:customerId" element={<EditCustomerForm />} />
                                <Route path="/transaction/edit/:transactionId" element={<EdittransactionForm />} />
                                <Route path="/add-transaction" element={<TransactionForm />} />
                                <Route path="/customerlist" element={<CustomerList />} />
                                <Route path="/transactionlist" element={<TransactionList />} />
                                <Route path="/report" element={<Report />} />
                                <Route path="/customervise" element={<Customervise />} />
                                <Route path="/importdata" element={<ImportData />} />
                            </>
                        )}

                        {/* Fallback route */}
                        <Route path="*" element={<Navigate to={isLoggedIn ? "/Dashboard" : "/"} replace />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
