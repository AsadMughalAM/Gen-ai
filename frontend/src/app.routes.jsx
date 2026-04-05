import React from "react";
import { createBrowserRouter } from "react-router-dom";
import Register from "./features/auth/pages/Register";
import Login from "./features/auth/pages/Login";
import App from "./App";
import Protected from "./features/auth/components/Protected";
export const router = createBrowserRouter([
  { path: "/register", element: <Register /> },
  { path: "/login", element: <Login /> },
  { path: "/", element:<Protected><App /></Protected>  },
]);
