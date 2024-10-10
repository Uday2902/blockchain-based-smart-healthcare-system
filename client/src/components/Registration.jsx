import React, { useState, useEffect } from "react";
import "./styles/Registration.css";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DoctorRegistration from "./DoctorRegistration";
import PatientRegistration from "./PatientRegistration";

const Registration = () => {
  const [view, setView] = useState("register");
  const userType = useSelector((state) => state.user.userType);
  const isMetaMaskConnected = useSelector(
    (state) => state.metamask.isMetaMaskConnected
  );
  const navigate = useNavigate();

  useEffect(() => {
    console.log("User type -> ", userType);
    if (isMetaMaskConnected) {
      if (userType === "Doctor") {
        navigate("/doctor-table");
      } else if (userType === "Patient") {
        navigate("/patient-table");
      }
    } else {
      navigate("/signin");
    }
  }, []);

  const handleRegisterAsDoctor = () => {
    setView("doctor");
  };

  const handleRegisterAsPatient = () => {
    setView("patient");
  };

  return (
    <>
      {view === "register" ? (
        <div className="auth-container">
          <button
            type="button"
            className="auth-button"
            onClick={handleRegisterAsDoctor}
          >
            Register as Doctor
          </button>
          <button
            type="button"
            className="auth-button"
            onClick={handleRegisterAsPatient}
          >
            Register as Patient
          </button>
        </div>
      ) : view === "doctor" ? (
        <DoctorRegistration />
      ) : (
        <PatientRegistration />
      )}
    </>
  );
};

export default Registration;
