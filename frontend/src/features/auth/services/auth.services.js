import { api, setAuthToken } from "../../../services/apiClient.js";

async function register({ email, username, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password,
    });
    const token = response?.data?.token || response?.data?.accessToken;
    if (token) setAuthToken(token);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });
    const token = response?.data?.token || response?.data?.accessToken;
    if (token) setAuthToken(token);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

async function logout() {
  try {
    const response = await api.get("/api/auth/logout");
    setAuthToken(null);
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

async function getMe() {
  try {
    const response = await api.get("/api/auth/getMe");
    return response.data;
  } catch (error) {
    throw error?.response?.data || error;
  }
}

export { register, login, logout, getMe, setAuthToken };
