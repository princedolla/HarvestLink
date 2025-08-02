import { Routes, Route } from "react-router-dom";

import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import HarvestList from "./components/HarvestList2";
import HomePage from "./components/HomePage";
import FarmerDashboard from "./components/FarmerDashboard";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import AdminApp from "./admin/AdminApp";
import Login from "./admin/Login";
import FarmerProfile from "./components/FarmerProfile2";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="*" element={<HomePage />} />
        <Route path="/harvests" element={<HarvestList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/farmer/:farmerId" element={<FarmerProfile />} />
        {/* Load the admin routes via AdminApp sub-routing */}
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
