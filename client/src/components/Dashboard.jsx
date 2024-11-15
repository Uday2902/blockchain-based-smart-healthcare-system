import React from 'react';
import { ethers } from 'ethers';
import './styles/Dashboard.css';
import { useWallet } from '../utils/useWallet';


const Dashboard = async () => {

  const {fetchLogs} = useWallet();

  return (
    <div className="right-panel" onClick={fetchLogs}>
      hello world
    </div>
  );
};

export default Dashboard;
