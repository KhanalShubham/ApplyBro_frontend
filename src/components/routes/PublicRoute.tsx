import { Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";

interface PublicRouteProps {
    children: React.ReactNode;
    redirectIfAuthenticated?: boolean;
    redirectTo?: string;
}

/**
 * PublicRoute Component
 * 
 * Handles public routes that should redirect authenticated users.
 * Useful for login/signup pages that shouldn't be accessible when already logged in.
 * 
 * @param children - The component to render
 * @param redirectIfAuthenticated - If true, redirects logged-in users (default: false)
 * @param redirectTo - Where to redirect authenticated users (default: /dashboard)
 */
export function PublicRoute({
    children,
    redirectIfAuthenticated = false,
    redirectTo = "/dashboard"
}: PublicRouteProps) {
    const { user, isLoading } = useAuth();

    // Don't redirect during initial load
    if (isLoading) {
        return <>{children}</>;
    }

    // If user is authenticated and we should redirect them
    if (redirectIfAuthenticated && user) {
        return <Navigate to={redirectTo} replace />;
    }

    // Render the public page
    return <>{children}</>;
}
