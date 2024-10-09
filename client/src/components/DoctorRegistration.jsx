import React, { useState } from "react";
import "./styles/SignUp.css";
import { useSelector } from "react-redux";
import DRContractABI, { DRContractAddress } from "../../contracts/Doctor Registry/DRContractABI";

const DoctorRegistration = () => {
  
  const [name, setName] = useState("");
  const [speciality, setSpeciality] = useState("");
  const [licenceNumber, setLicenceNumber] = useState("");
  const [gender, setGender] = useState("");

  const isMetaMaskConnected = useSelector((state) => state.metamask.isMetaMaskConnected);
  const signer = useSelector((state) => state.user.signer);
  const provider = useSelector((state) => state.user.provider);
  const DRcontract = useSelector((state) => state.user.DRcontract);

  

  const handleDoctorRegistration = async (e) => {
    e.preventDefault();

    if (isMetaMaskConnected) {
      try {
        console.log("isMetaMaskConnected -> ", isMetaMaskConnected);
        console.log("DRcontract -> ", DRcontract);
        await DRcontract.registerDoctor(name, speciality, licenceNumber, gender);
        alert("Doctor registered successfully!");
        
        navigate('/tables');
      } catch (error) {
        console.error("Error registering doctor:", error);
        alert("Failed to register doctor. Please try again.");
      }
    } else {
      alert("Please connect your MetaMask wallet first.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Enter your details to register</p>
        <form className="auth-form" onSubmit={handleDoctorRegistration}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Speciality</label>
          <input
            type="text"
            placeholder="Your speciality"
            value={speciality}
            onChange={(e) => setSpeciality(e.target.value)}
            required
          />

          <label>Licence Number</label>
          <input
            type="text"
            placeholder="Your licence number"
            value={licenceNumber}
            onChange={(e) => setLicenceNumber(e.target.value)}
            required
          />

          <label>Gender</label>
          <select
            style={{
              marginBottom: "1rem",
              height: "2.3rem",
              border: "1px solid black",
              borderColor: "#d4d2d2",
              borderRadius: "0.3rem",
              padding: "0.3rem",
            }}
            value={gender}
            onChange={(e) => setGender(e.target.value)}
            required
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>

          {/* Submit Button */}
          <button type="submit" className="auth-button">
            SIGN UP
          </button>
        </form>

        {/* Footer Link */}
        <p className="auth-footer">
          <a href="/register" className="signin-link">
            back to registration
          </a>
        </p>
      </div>
    </div>
  );
};

export default DoctorRegistration;