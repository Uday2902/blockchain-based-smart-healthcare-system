import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SidePanel from "./components/SidePanel";
import Navbar from "./components/Navbar";
import TableSection from "./components/TableSection";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/DoctorRegistration";
import Billing from "./components/Billing";
import Registration from "./components/Registration";
import PatientTables from "./components/PatientTables"
import DoctorTables from "./components/DoctorTables";
import ReactModal from "./components/ReactModal";

const MainLayout = () => (
  <>
    <SidePanel />
    <div className="main-content">
      {/* <Navbar /> */}
      {/* <div className="content"> */}
        <Routes>
          <Route path="/patient-table" element={<PatientTables />} />
          <Route path="/doctor-table" element={<DoctorTables />} />
          <Route path="/billing" element={<Billing />} />
          <Route path="/modal" element={<ReactModal />} />
        </Routes>
      {/* </div> */}
     </div> 
  </>
);

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
