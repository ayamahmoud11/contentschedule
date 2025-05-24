import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import PostEditorPage from "./pages/PostEditorPage";
import SettingsPage from "./pages/SettingsPage";
import ProfilePage from "./pages/ProfilePage";  
import Navbar from "./components/Navbar";
import {UserProvider} from "./pages/UserContext";

function AppRoutes() {
  const isLoggedIn = !!localStorage.getItem("token");

  return (
    <div className ="min-h-screen flex justify-center items-center">
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route
          path="/"
          element={isLoggedIn ?  <LoginPage /> : <Navigate to="/profile" />}
          />
        <Route
          path="/register"
          element={!isLoggedIn ? <RegisterPage /> : <Navigate to="/LoginPage" />}
        />
        <Route
          path="/login"
          element={!isLoggedIn ? <LoginPage /> : <Navigate to="/LoginPage" />}
        />
        <Route
          path="/dashboard"
          element={isLoggedIn ? <DashboardPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/post-editor"
          element={isLoggedIn ? <PostEditorPage /> : <Navigate to="/post-editor" />}
        />
        <Route
          path="/settings"
          element={isLoggedIn ? <SettingsPage /> : <Navigate to="/settings" />}
        />
        <Route
          path="/profile"
          element={isLoggedIn ? <ProfilePage /> : <Navigate to="/profile" />}
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
    </div>
  );
}

export default AppRoutes;
