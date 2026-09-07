import type { ReactElement } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import type { AppRole } from "@/api/auth";

interface ProtectedRouteProps {
  children: ReactElement;
  allowedRoles?: AppRole[];
}

export function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div
        style={{
          padding: "4rem",
          textAlign: "center",
          color: "var(--color-text-secondary)",
        }}
      >
        Loading session...
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role as AppRole)) {
    switch (user.role) {
      case "student":
        return <Navigate to="/student" replace />;
      case "corporate":
        return <Navigate to="/corporate" replace />;
      case "educator_bilingual":
      case "educator_silver":
        return <Navigate to="/educator" replace />;
      case "alumni":
        return <Navigate to="/career" replace />;
      case "admin":
        return <Navigate to="/admin/verifications" replace />;
      default:
        return <Navigate to="/" replace />;
    }
  }

  return children;
}
