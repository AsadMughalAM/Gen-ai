import { useContext } from "react";
import { AuthContext } from "../auth-context.js";

export const useAuth = () => {
  return useContext(AuthContext);
};
