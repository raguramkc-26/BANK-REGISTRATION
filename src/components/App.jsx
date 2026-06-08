import React from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import BankFormRegistration from "./BankFormRegistration";
import BankFormRegistrationAdmin from "./BankFormRegistrationAdmin";
import LoginComponent from "./LoginComponent";
import Dashboard from "./DashBoard";
import "../App.css";

function App() {
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  return (
    <div className={isLoggedIn ? "app-background-dashboard" : "app-background"}> 
      <Routes>

        {/* Registration Type */}
        <Route path="/register-type" element={ 
          <div className="page-container">
            <h2>Choose Registration Type</h2>
            <div className="button-group">
              <button className="user-register-btn" onClick={() => navigate("/register-user")}>User Registration</button>
              <button className="admin-register-btn" onClick={() => navigate("/register-admin")}>Admin Registration</button>
            </div>
          </div>
        }/>

        {/* User Registration */}
        <Route path="/register-user" element={<BankFormRegistration onRegisterSuccess={() => navigate("/login")} />}/>

        {/* Admin Registration */}
        <Route path="/register-admin" element={<BankFormRegistrationAdmin onRegisterSuccess={() => navigate("/login")} />}/>

        {/* Login */}
        <Route path="/login" element={<LoginComponent />}/>

        {/* Dashboard (Protected Route) */}
        <Route
          path="/dashboard"
          element={isLoggedIn ? <Dashboard /> : <Navigate to="/login" />}
        />

        {/* Default Path */}
        <Route path="*" element={<Navigate to="/register-type" />} />
      </Routes>
    </div>
  );
}

export default App;
