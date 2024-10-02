import React from 'react';
import StatCard from './StatCard';
import { FaWallet, FaUsers, FaClipboardList, FaShoppingCart } from 'react-icons/fa';
import './styles/Dashboard.css';

const RightPanel = () => {
  return (
    <div className="right-panel">
      <div className="stats-grid">
        <StatCard
          title="Today's Money"
          stat="$53,000"
          icon={<FaWallet />}
          change="+55%"
          isIncrease
        />
        <StatCard
          title="Today's Users"
          stat="2,300"
          icon={<FaUsers />}
          change="+5%"
          isIncrease
        />
        <StatCard
          title="New Clients"
          stat="+3,020"
          icon={<FaClipboardList />}
          change="-14%"
          isIncrease={false}
        />
        <StatCard
          title="Total Sales"
          stat="$173,000"
          icon={<FaShoppingCart />}
          change="+8%"
          isIncrease
        />
      </div>
      <div className="info-cards">
        <div className="info-card">
          <h2>Built by Developers</h2>
          <p>From colors, cards, typography to complex elements, you will find the full documentation.</p>
          <a href="#">Read more →</a>
        </div>
        <div className="info-card">
          <img src="https://via.placeholder.com/150" alt="chakra" />
          <h2>Work with the rockets</h2>
          <p>Wealth creation is a revolutionary recent positive-sum game. It is all about who takes the opportunity first.</p>
          <a href="#">Read more →</a>
        </div>
      </div>
    </div>
  );
};

export default RightPanel;
