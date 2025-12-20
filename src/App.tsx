import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { SignupPage } from "./components/SignupPage";
import { SuccessScreen } from "./components/SuccessScreen";
import { LoginPage } from "./components/LoginPage";
import { LandingPage } from "./components/LandingPage";
import { Dashboard } from "./components/Dashboard";
import { AdminDashboard } from "./components/AdminDashboard";
import { RecommendationsPage } from "./components/RecommendationsPage";
import { UnauthorizedPage } from "./components/pages/UnauthorizedPage";
import { NotFoundPage } from "./components/pages/NotFoundPage";
import { ProtectedRoute } from "./components/routes/ProtectedRoute";
import { PublicRoute } from "./components/routes/PublicRoute";
import { useAuth } from "./contexts/AuthContext";
import { Toaster } from "./components/ui/sonner";
import { ThemeProvider } from "./components/theme-provider";

/**
 * DashboardRoute - Determines which dashboard to show based on user role
 */
function DashboardRoute() {
  const { user, logout } = useAuth();

  if (!user) {
    return null;
  }

  // Admin users see AdminDashboard
  if (user.role === "admin") {
    return <AdminDashboard onLogout={logout} userName={user.name} />;
  }

  // Regular users see standard Dashboard
  return <Dashboard onLogout={logout} userName={user.name} />;
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true,
        }}
      >
        <Routes>
          {/* ==================== PUBLIC ROUTES ==================== */}
          {/* Accessible to everyone, authenticated users redirected from login/signup */}

          <Route
            path="/"
            element={
              <PublicRoute>
                <LandingPage />
              </PublicRoute>
            }
          />

          <Route
            path="/login"
            element={
              <PublicRoute redirectIfAuthenticated={true}>
                <LoginPage />
              </PublicRoute>
            }
          />

          <Route
            path="/signup"
            element={
              <PublicRoute redirectIfAuthenticated={true}>
                <SignupPage />
              </PublicRoute>
            }
          />

          <Route
            path="/signup/success"
            element={
              <PublicRoute>
                <SuccessScreen />
              </PublicRoute>
            }
          />

          {/* ==================== USER PROTECTED ROUTES ==================== */}
          {/* Require authentication - accessible to both students and admins */}

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requireAuth={true}>
                <DashboardRoute />
              </ProtectedRoute>
            }
          />

          <Route
            path="/recommendations"
            element={
              <ProtectedRoute requireAuth={true}>
                <RecommendationsPage />
              </ProtectedRoute>
            }
          />

          {/* Note: Dashboard contains all user sections (scholarships, documents, etc.) */}
          {/* These are rendered within Dashboard based on active section */}

          {/* ==================== ADMIN PROTECTED ROUTES ==================== */}
          {/* Require admin role - regular users will be redirected to /unauthorized */}

          <Route
            path="/admin/*"
            element={
              <ProtectedRoute requireAuth={true} requireAdmin={true}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          {/* ==================== ERROR ROUTES ==================== */}

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="/404" element={<NotFoundPage />} />

          {/* Catch-all route - redirect to 404 */}
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>

        {/* Global toast notifications */}
        <Toaster />
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
