import { Navigate } from "react-router-dom";

type AdminRouteProps = {
  children: React.ReactNode;
};

const AdminRoute = ({ children }: any) => {
  const role = localStorage.getItem("role");

  return role === "admin" || "null" || "undefined" ? children : <Navigate to="/" />;
};

// const AdminRoute = ({ children }: AdminRouteProps) => {
//   const role = localStorage.getItem("role");

//   return role === "admin" ? children : <Navigate to="/" replace />;
// };

export default AdminRoute;
