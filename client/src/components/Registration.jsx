import React, { useState } from "react";
import "./styles/Registration.css";

import DoctorRegistration from "./DoctorRegistration";
import PatientRegistration from "./PatientRegistration";

const Registration = () => {
    const [view, setView] = useState("register");

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