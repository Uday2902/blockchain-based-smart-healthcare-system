import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaHome, FaTable, FaFileInvoiceDollar, FaUser, FaSignInAlt, FaUserPlus, FaBars } from 'react-icons/fa';
import './styles/SidePanel.css';
import { useSelector } from 'react-redux';

const SidePanel = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const userType = useSelector((state) => state.user.userType );

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`side-panel ${isOpen ? 'open' : ''}`}>
      <div className="side-panel-header">
        <h1>Blockchain Based Smart Healthcare</h1>
        <button className="menu-toggle" onClick={toggleMenu}>
          <FaBars />
        </button>
      </div>
      <div className="side-panel-menu">
        <div className="menu-item">
          <FaHome className="menu-icon" />
          <Link to="/" className="menu-link">Dashboard</Link>
        </div>
        <div className="menu-item">
          <FaTable className="menu-icon" />
          <Link to= {userType==="Doctor" ? "/doctor-table" : "/patient-table"} className="menu-link">Tables</Link>
        </div>
        <div className="menu-item">
          <FaFileInvoiceDollar className="menu-icon" />
          <Link to="/billing" className="menu-link">Billing</Link>
        </div>
        <div className="menu-item">
          <FaUser className="menu-icon" />
          <Link to="/profile" className="menu-link">Profile</Link>
        </div>
        <div className="menu-item">
          <FaSignInAlt className="menu-icon" />
          <Link to="/signin" className="menu-link">Sign In</Link>
        </div>
        <div className="menu-item">
          <FaUserPlus className="menu-icon" />
          <div className="menu-link" onClick={() => {navigate('/register')}}>Sign Up</div>
        </div>
      </div>
    </div>
  );
};

export default SidePanel;
