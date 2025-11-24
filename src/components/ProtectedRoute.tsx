import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../features/auth/AuthContext";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // show spinner if checking auth status
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        Loading...
      </div>
    );
  }

  // if not authenticated, redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // render child routes if authenticated
  return <Outlet />;
}
