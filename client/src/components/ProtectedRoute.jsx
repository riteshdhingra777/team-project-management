import { Navigate } from "react-router-dom";
import { useAuth } from "../store/auth";
import { Loader2 } from "lucide-react";

const ProtectedRoute = ({ children }) => {
  const { isLoggedIn, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="loading-screen">
        <Loader2 size={40} className="animate-spin text-purple-400" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
