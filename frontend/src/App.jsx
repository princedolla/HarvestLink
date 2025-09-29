// src/App.jsx
import { Routes, Route } from "react-router-dom";


import Navbar from "./components/NavBar";
import RegisterForm from "./components/RegisterForm";
import LoginForm from "./components/LoginForm";
import HarvestList from "./components/HarvestList2";
import HomePage from "./components/HomePage";
import FarmerDashboard from "./components/FarmerDashboard";
import ForgotPasswordForm from "./components/ForgotPasswordForm";
import AdminApp from "./admin/AdminApp";
import Login from "./admin/Login";
import FarmerProfile from "./components/FarmerProfile2";
import AboutUs from './components/AboutUs';
import Services from './components/Services';
import Blog from './components/Blog';
import Contact from './components/Contact';
import Marketplace from "./components/Marketplace";
import FAQ from './components/FAQ';
import HelpCenter from './components/HelpCenter';
import PrivacyPolicy from './components/PrivacyPolicy';
import TermsOfService from './components/TermsOfService';
import ShippingInfo from './components/ShippingInfo';
import ReturnsPolicy from './components/ReturnsPolicy';


// Try importing Marketplace this way

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/services" element={<Services />} />
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/help-center" element={<HelpCenter />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        <Route path="/terms-of-service" element={<TermsOfService />} />
        <Route path="/shipping-info" element={<ShippingInfo />} />
        <Route path="/returns-policy" element={<ReturnsPolicy />} />
        <Route path="/harvests" element={<HarvestList />} />
        <Route path="/register" element={<RegisterForm />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/dashboard" element={<FarmerDashboard />} />
        <Route path="/forgot-password" element={<ForgotPasswordForm />} />
        <Route path="/farmer/:farmerId" element={<FarmerProfile />} />
        <Route path="/admin/*" element={<AdminApp />} />
        <Route path="/admin/login" element={<Login />} />
        <Route path="*" element={<HomePage />} />
      </Routes>
    </div>
  );
}

export default App;