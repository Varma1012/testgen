// components/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useStore } from "../lib/store";

interface Props {
  children: JSX.Element;
}

export default function PrivateRoute({ children }: Props) {
  const isAuthenticated = useStore((s) => s.isAuthenticated);
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}
