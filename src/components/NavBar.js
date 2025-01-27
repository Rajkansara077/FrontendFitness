import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
    return (
        <div >
            <div className="sidebar">
                <nav className="sidebar-header">
                    <Link to="/Dashboard" className="sidebar-link">Dashboard</Link>
                    <Link to="/customerlist" className="sidebar-link">Customer</Link>
                    <Link to="/transactionlist" className="sidebar-link">Transaction</Link>
                    <Link to="/report" className="sidebar-link">Reports</Link>
                    <Link to="/customervise" className="sidebar-link">Customer-Vise</Link>
                </nav>
            </div>
            <div className="main-content">
                <header className="top-nav">
                    <h1 className="page-title">VIP AUTOMATED VEHICLE FITNESS TESTING CENTER</h1>
                    {isLoggedIn && <button onClick={handleLogout}>Logout</button>}
                </header>
            </div>
        </div>
    );
};

export default Navbar;
