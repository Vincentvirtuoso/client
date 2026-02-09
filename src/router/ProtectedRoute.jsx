import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import FullScreenLoader from "../components/others/FullScreenLoader";

export default function ProtectedRoute({ children }) {
  const { status, user, isBooting } = useAuth();
  const location = useLocation();

  if (isBooting || status === "booting") {
    return (
      <FullScreenLoader
        message="Processing User"
        isLoading={isBooting || status === "booting"}
      />
    );
  }

  if (status === "unauthenticated") {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return children;
}
