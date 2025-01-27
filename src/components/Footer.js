import React from 'react';
import './Footer.css'; // Optional: for styling the footer


const Footer = () => {
  return (
    <div className="footer-container">
      <footer className="footer">
        {/* Uncomment logo section if required */}
        {/* <div className="footer-logo">
          <img src={logo} alt="Logo" className="footer-logo-image" />
          <span className="footer-logo-text">🚗 VIP AUTOMATED VEHICLE FITNESS TESTING CENTER</span>
        </div> */}
        <nav className="footer-nav">
          <a href="/">Dashboard</a>
          <a href="/customerlist">Customer</a>
          <a href="/transactionlist">Transaction</a>
          <a href="/report">Report</a>
        </nav>
        <div className="footer-info">
          <p>&copy; 2025 VIP Automated Vehicle Fitness Testing Center. All rights reserved.</p>
          <p>Contact us: <a href="mailto:contact@viptestingcenter.com">contact@viptestingcenter.com</a></p>
        </div>
      </footer>
    </div>
  );
};

export default Footer;
