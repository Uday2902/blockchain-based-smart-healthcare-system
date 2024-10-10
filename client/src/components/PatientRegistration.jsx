// src/components/SignUp.js
import React, { useState } from "react";
import "./styles/SignUp.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const PatientRegistration = () => {
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [gender, setGender] = useState("");

  const navigate = useNavigate();

  const isMetaMaskConnected = useSelector(
    (state) => state.metamask.isMetaMaskConnected
  );
  const signer = useSelector((state) => state.user.signer);
  const provider = useSelector((state) => state.user.provider);
  const PRcontract = useSelector((state) => state.user.PRcontract);
  const userType = useSelector((state) => state.user.userType);

  useEffect(() => {
    if (userType === "Doctor") {
      navigate("/doctor-table");
    } else if (userType === "Patient") {
      navigate("/patient-table");
    }
  }, []);

  const handlePatientRegistration = async (e) => {
    e.preventDefault();

    if (isMetaMaskConnected) {
      try {
        console.log("isMetaMaskConnected -> ", isMetaMaskConnected);
        console.log("PRcontract -> ", PRcontract);
        await PRcontract.registerPatient(name, dob, gender);
        alert("Patient registered successfully!");

        navigate("/tables");
      } catch (error) {
        console.error("Error registering patient:", error);
        alert("Failed to register patient. Please try again.");
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
        <form className="auth-form" onSubmit={handlePatientRegistration}>
          <label>Full Name</label>
          <input
            type="text"
            placeholder="Your full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Date of Birth</label>
          <input
            type="date"
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
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

export default PatientRegistration;
