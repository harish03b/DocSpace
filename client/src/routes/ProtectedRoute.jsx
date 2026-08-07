import { Navigate, Outlet } from "react-router-dom";
import { getToken } from "../utils/storage";

const ProtectedRoute = () => {
  const token = getToken();

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;