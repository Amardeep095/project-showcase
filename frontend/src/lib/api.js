import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/api";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// Attach admin token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("admin_token");
  if (token) config.headers["x-admin-token"] = token;
  return config;
});

// Global error handling
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("admin_token");
      if (window.location.pathname.startsWith("/admin") &&
          window.location.pathname !== "/admin/login") {
        window.location.href = "/admin/login";
      }
    }
    return Promise.reject(err);
  }
);

// ─── Websites ──────────────────────────────────────────────────────────────
export const websiteApi = {
  getAll: (params = {}) => api.get("/websites", { params }),
  getOne: (id) => api.get(`/websites/${id}`),
  create: (data) => api.post("/websites", data),
  update: (id, data) => api.put(`/websites/${id}`, data),
  delete: (id) => api.delete(`/websites/${id}`),
  reorder: (items) => api.put("/websites/bulk/reorder", { items }),
};

// ─── Auth ──────────────────────────────────────────────────────────────────
export const authApi = {
  login: (password) => api.post("/auth/login", { password }),
  verify: () => api.post("/auth/verify"),
};

// ─── Upload ───────────────────────────────────────────────────────────────
export const uploadApi = {
  single: (file) => {
    const form = new FormData();
    form.append("image", file);
    return api.post("/upload", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  multiple: (files) => {
    const form = new FormData();
    files.forEach((f) => form.append("images", f));
    return api.post("/upload/multiple", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

export default api;
