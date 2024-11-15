import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import SidePanel from "./components/SidePanel";
import ReactModal from "./components/ReactModal";
import Registration from "./components/Registration";
import NotFound from "./components/NotFound";
import Dashboard from "./components/Dashboard";

const SignIn = lazy(() => import("./components/SignIn"));
const SignUp = lazy(() => import("./components/DoctorRegistration"));
const Billing = lazy(() => import("./components/Billing"));
const PatientTables = lazy(() => import("./components/PatientTables"));
const DoctorTables = lazy(() => import("./components/DoctorTables"));

const MainLayoutRoutes = () => (
  <Routes>
    <Route path="/patient-table" element={<PatientTables />} />
    <Route path="/doctor-table" element={<DoctorTables />} />
    <Route path="/billing" element={<Billing />} />
  </Routes>
);

const MainLayout = () => (
  <>
    <SidePanel />
    <div className="main-content">
      <MainLayoutRoutes />
    </div>
  </>
);

function App() {
  return (
    <div className="app">
      <Router>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route index element={<SignIn />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/modal" element={<ReactModal />} />
            {/* <Route path="/dashboard" element={<Dashboard />} /> */}
            <Route path="/register" element={<Registration />} />
            <Route path="/*" element={<MainLayout />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </Router>
    </div>
  );
}

export default App;
