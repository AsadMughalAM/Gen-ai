import axios from "axios";

let authToken = null;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:3000",
  withCredentials: true,
});

function initializeAuthToken() {
  try {
    const storedToken = localStorage.getItem("genai_auth_token");
    if (storedToken) {
      authToken = storedToken;
      api.defaults.headers.common.Authorization = `Bearer ${authToken}`;
      console.debug("apiClient: loaded auth token from localStorage", !!authToken);
    }
  } catch (error) {
    authToken = null;
    console.warn("apiClient: failed to load auth token", error);
  }
}

initializeAuthToken();

function hasAuthToken() {
  return Boolean(authToken);
}

api.interceptors.request.use((config) => {
  if (authToken) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      setAuthToken(null);
    }

    return Promise.reject(error);
  },
);

function setAuthToken(token) {
  authToken = token;
  if (token) {
    try {
      localStorage.setItem("genai_auth_token", token);
    } catch (error) {
      // ignore localStorage failure
    }
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    try {
      localStorage.removeItem("genai_auth_token");
    } catch (error) {
      // ignore localStorage failure
    }
    delete api.defaults.headers.common.Authorization;
  }
}

export { api, setAuthToken, hasAuthToken };
