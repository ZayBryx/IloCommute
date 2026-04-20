import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthProvider";

const ProtectedRoutes = () => {
  const { authData, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex items-center justify-center">Loading Spinner...</div>
    );
  }

  return authData.isAuth ? <Outlet /> : <Navigate to="/" />;
};

export default ProtectedRoutes;
