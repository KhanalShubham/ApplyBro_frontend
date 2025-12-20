import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { Loader } from "../ui/loader";
import { toast } from "sonner";
import { useEffect, useState } from "react";

interface ProtectedRouteProps {
    children: React.ReactNode;
    requireAuth?: boolean;
    requireAdmin?: boolean;
    redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * 
 * Handles route protection based on authentication and authorization.
 * 
 * @param children - The component to render if authorized
 * @param requireAuth - If true, requires user to be logged in
 * @param requireAdmin - If true, requires user to be an admin
 * @param redirectTo - Custom redirect path (defaults: /login for auth, /unauthorized for admin)
 */
export function ProtectedRoute({
    children,
    requireAuth = true,
    requireAdmin = false,
    redirectTo
}: ProtectedRouteProps) {
    const { user, isLoading, isAdmin } = useAuth();
    const [hasShownToast, setHasShownToast] = useState(false);

    useEffect(() => {
        // Reset toast flag when route changes
        setHasShownToast(false);
    }, [window.location.pathname]);

    // Show loading spinner while checking authentication
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
                <Loader size="lg" label="Verifying access..." />
            </div>
        );
    }

    // Check authentication requirement
    if (requireAuth && !user) {
        if (!hasShownToast) {
            toast.error("Please log in to continue", {
                description: "You need to be logged in to access this page",
            });
            setHasShownToast(true);
        }
        return <Navigate to={redirectTo || "/login"} replace state={{ from: window.location.pathname }} />;
    }

    // Check admin requirement
    if (requireAdmin && !isAdmin) {
        if (!hasShownToast) {
            toast.error("Access Denied", {
                description: "You don't have permission to access this page",
            });
            setHasShownToast(true);
        }
        return <Navigate to={redirectTo || "/unauthorized"} replace />;
    }

    // User is authorized, render the protected content
    return <>{children}</>;
}
