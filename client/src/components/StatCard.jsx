// src/components/StatCard.js
import React from 'react';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';
import './styles/StatCard.css';

const StatCard = ({ title, stat, icon, change, isIncrease }) => {
  return (
    <div className="stat-card">
      <div className="stat-card-content">
        <div className="stat-card-header">
          <h3>{title}</h3>
        </div>
        <div className="stat-card-body">
          <span className="stat">{stat}</span>
          <div className={`change ${isIncrease ? 'increase' : 'decrease'}`}>
            <span className="change-icon">
              {isIncrease ? <FaArrowUp /> : <FaArrowDown />}
            </span>
            <span>{change}</span>
          </div>
        </div>
      </div>
      <div className="stat-card-icon">
        {icon}
      </div>
    </div>
  );
};

export default StatCard;
