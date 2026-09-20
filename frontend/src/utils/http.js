import axios from "axios";
import { useAuthStore } from "../stores/auth";
import { useToastStore } from "../stores/toast";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
  timeout: 12000,
  headers: { "Accept": "application/json" },
});

api.interceptors.request.use((config) => {
  const authStore = useAuthStore();
  const token = authStore.accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const authStore = useAuthStore();
    const toastStore = useToastStore();
    const originalRequest = error.config;
    if (error.response?.status === 401 && !originalRequest._retried) {
      originalRequest._retried = true;
      try {
        await authStore.refresh();
        if (originalRequest) {
          originalRequest.headers.Authorization = `Bearer ${authStore.accessToken}`;
          return api(originalRequest);
        }
      } catch {
        authStore.logout();
        toastStore.error("Session expired. Please sign in again.");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
