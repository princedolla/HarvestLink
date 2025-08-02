import React from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./Login";
import AdminDashboard from "./AdminDashboard";

const AdminApp = () => {
  const location = useLocation();
  const token = localStorage.getItem("adminToken");

  return (
    <Routes>
      {/* Login route */}
      <Route
        path="/login"
        element={
          token ? (
            <Navigate to="/admin" replace state={{ from: location }} />
          ) : (
            <Login />
          )
        }
      />

      {/* Protected dashboard route */}
      <Route
        path="/"
        element={
          token ? (
            <AdminDashboard />
          ) : (
            <Navigate to="/admin/login" replace state={{ from: location }} />
          )
        }
      />

      {/* Catch-all: redirect to login if route not found */}
      <Route path="*" element={<Navigate to="/admin/login" replace />} />
    </Routes>
  );
};

export default AdminApp;
