import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./NavBar.css";

const Navbar = ({ isLoggedIn, handleLogout }) => {
  const location = useLocation();

  return (
    <nav className="navbar">
      <div className="navbar-content">
        <div className="logo-container">
        <h3 className="nav-title">VIP Automated Vehicle Fitness Testing Center</h3>
          {/* <img src="/path/to/your/logo.png" alt="Logo" className="logo" /> */}
          {/* OR <span className="logo-text">VIP Auto</span> */}
        </div>
        <ul className="nav-links">
          <li className="nav-item">
            <Link to="/Dashboard" className={`nav-link ${location.pathname === '/Dashboard'? 'active': ''}`}>Dashboard</Link>
          </li>
          <li className="nav-item">
            <Link to="/customerlist" className={`nav-link ${location.pathname === '/customerlist'? 'active': ''}`}>Customer</Link>
          </li>
          <li className="nav-item">
            <Link to="/transactionlist" className={`nav-link ${location.pathname === '/transactionlist'? 'active': ''}`}>Transaction</Link>
          </li>
          <li className="nav-item">
            <Link to="/report" className={`nav-link ${location.pathname === '/report'? 'active': ''}`}>Reports</Link>
          </li>
          <li className="nav-item">
            <Link to="/customervise" className={`nav-link ${location.pathname === '/customervise'? 'active': ''}`}>Customer-Vise</Link>
          </li>
        </ul>
        {isLoggedIn && (
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;