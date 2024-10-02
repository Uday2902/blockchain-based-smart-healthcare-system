// src/components/Navbar.js
import React from 'react';
import { FaSearch, FaUserCircle, FaBell } from 'react-icons/fa';
import './styles/Navbar.css';

const Navbar = () => {
  return (
    <div className="navbar">
      <div className="navbar-left">
        <span className="breadcrumb">Pages / Tables</span>
        <h1>Tables</h1>
      </div>
      <div className="navbar-right">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input type="text" placeholder="Type here..." />
        </div>
        <FaUserCircle className="navbar-icon" />
        <FaBell className="navbar-icon" />
        <button className="sign-in-button">Sign In</button>
      </div>
    </div>
  );
};

export default Navbar;
