/* eslint-disable react/prop-types */
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";

const ProtectedRoute = ({ children, restricted }) => {
  const token = Cookies.get("token");

  // If the route is restricted (like login or register) and the user is logged in, redirect to home
  if (restricted && token) {
    return <Navigate to="/" replace />;
  }

  // If the user is not logged in and trying to access anything other than login/register, redirect to login
  if (!restricted && !token) {
    return <Navigate to="/login" replace />;
  }

  // If the user is allowed to access the route, render the children
  return children;
};

export default ProtectedRoute;
