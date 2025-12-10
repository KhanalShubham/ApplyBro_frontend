import React from "react";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";
import { SignupPage } from "./components/SignupPage";
import { SuccessScreen } from "./components/SuccessScreen";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { useAuth } from "./contexts/AuthContext";
import { Loader } from "./components/ui/loader";

function ProtectedRoute({ roles }: { roles?: string[] }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <Loader className="min-h-screen bg-white" />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

function DashboardRoute() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  if (user.role === "admin") {
    return <AdminDashboard onLogout={logout} userName={user.name} />;
  }

  return <Dashboard onLogout={logout} userName={user.name} />;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/success" element={<SuccessScreen />} />

        <Route element={<ProtectedRoute roles={["student", "admin"]} />}>
          <Route path="/dashboard" element={<DashboardRoute />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
