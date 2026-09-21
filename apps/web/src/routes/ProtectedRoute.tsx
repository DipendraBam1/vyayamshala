import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

type Role = "ADMIN" | "TRAINER" | "MEMBER";

interface ProtectedRouteProps {
  allowedRole: Role;
  children: React.ReactNode;
}

export default function ProtectedRoute({
  allowedRole,
  children,
}: ProtectedRouteProps) {
  const { user } = useAuth();

  // Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role
  if (user.role !== allowedRole) {
    return <Navigate to="/" replace />;
  }

  return children;
}