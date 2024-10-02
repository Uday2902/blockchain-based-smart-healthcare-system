import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SidePanel from "./components/SidePanel";
import Navbar from "./components/Navbar";
import TableSection from "./components/TableSection";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import Billing from "./components/Billing";

const MainLayout = () => (
  <>
    <SidePanel />
    <div className="main-content">
      <Navbar />
      <div className="content">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tables" element={<TableSection />} />
          <Route path="/billing" element={<Billing />} />
        </Routes>
      </div>
    </div>
  </>
);

function App() {
  return (
    <div className="app">
      <Router>
        <Routes>
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/*" element={<MainLayout />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
