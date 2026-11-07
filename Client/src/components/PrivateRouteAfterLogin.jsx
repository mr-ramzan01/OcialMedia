import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "./Loader";

export const PrivateRouteAfterLogin = ({ children }) => {
  const { isAuth, isLoading } = useContext(AuthContext);

  if (isLoading) return <Loader />;
  if (isAuth) return <Navigate to="/" replace />;
  return children;
};
