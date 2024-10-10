import React, { useEffect } from "react";
import { useState } from "react";
import { ethers } from "ethers";
import "./styles/SignIn.css";
import { useNavigate } from "react-router-dom";
import DRContractABI, {
  DRContractAddress,
} from "../../contracts/Doctor Registry/DRContractABI";
import { useWallet } from "../utils/useWallet";
import { useSelector } from "react-redux";

const SignIn = () => {
  const [connected, setConnected] = useState(false);
  const isMetaMaskConnected = useSelector((state) => state.metamask.isMetaMaskConnected);

  const navigate = useNavigate();
  const {handleConnectWallet} = useWallet();

  useEffect(() => {
    console.log("ISMETAMASK CONNECTED -> ", isMetaMaskConnected);
    if(isMetaMaskConnected){
      navigate('/register');
    }
  },[])


  const handleConnectionClick = async () => {
    if (!connected) {

      await handleConnectWallet();

      // const doctorRegistryContract = new ethers.Contract(
      //   DRContractAddress,
      //   DRContractABI,
      //   signer
      // );

      // const newDoctor = await doctorRegistryContract.registerDoctor(
      //   "Test Doctor 2",
      //   "Orthopedic",
      //   "Ortho2902",
      //   "Male"
      // );
    } else {
      window.ethereum.selectedAddress = null;
      setConnected(false);
    }
  };

  return (
    <div className="auth-container" onClick={handleConnectionClick}>
      <button type="submit" className="auth-button">
        {connected ? "Disconnect Wallet" : "Connect MetaMask Wallet"}
      </button>
    </div>
  );
};

export default SignIn;
