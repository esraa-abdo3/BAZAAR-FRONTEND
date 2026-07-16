import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/admin";

const adminAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Set Authorization header dynamically before every request
adminAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 1. Dashboard Core Stats
export async function getAdminDashboard() {
  const res = await adminAxios.get("/dashboard");
  return res.data.data;
}

// 2. Dashboard Charts & Analytics
export async function getAdminAnalytics() {
  const res = await adminAxios.get("/dashboard/analytics");
  return res.data.data;
}

// 3. Admin Setting
export async function getAdminSetting() {
  const res = await adminAxios.get("/setting");
  return res.data.data || res.data;
}

export async function updateAdminSetting(data) {
  const isFormData = data instanceof FormData;
  const res = await adminAxios.patch("/setting", data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data.data || res.data;
}

// 4. Bazaars Management
export async function getAdminBazaars({ page = 1, limit = 10, status } = {}) {
  const params = { page, limit };
  if (status) params.status = status;
  const res = await adminAxios.get("/bazaars", { params });
  return res.data.data || res.data;
}

export async function getAdminOneBazaar(id) {
  const res = await adminAxios.get(`/bazaars/${id}`);
  return res.data.data || res.data;
}

export async function updateAdminBazaar(id, data) {
  const isFormData = data instanceof FormData;
  const res = await adminAxios.patch(`/bazaars/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data.data || res.data;
}

// 5. Brands Management
export async function getAdminBrands({ page = 1, limit = 10 } = {}) {
  const res = await adminAxios.get("/brands", { params: { page, limit } });
  return res.data.data || res.data;
}

export async function getAdminOneBrand(id) {
  const res = await adminAxios.get(`/brands/${id}`);
  return res.data.data || res.data;
}

export async function updateAdminBrand(id, data) {
  const isFormData = data instanceof FormData;
  const res = await adminAxios.patch(`/brands/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data.data || res.data;
}

export async function deleteAdminBrand(id, reason) {
  const res = await adminAxios.delete(`/brands/${id}`, {
    data: { reason: reason || "Blocked by admin" },
  });
  return res.data;
}

// 6. Users Management
export async function getAdminUsers({ page = 1, limit = 10 } = {}) {
  const res = await adminAxios.get("/users", { params: { page, limit } });
  return res.data.data || res.data;
}

export async function getAdminOneUser(id) {
  const res = await adminAxios.get(`/users/${id}`);
  return res.data.data || res.data;
}

export async function deleteAdminUser(id) {
  const res = await adminAxios.delete(`/users/${id}`);
  return res.data;
}

// 7. Products Catalog
export async function getAdminProducts({ page = 1, limit = 10 } = {}) {
  const res = await adminAxios.get("/products", { params: { page, limit } });
  return res.data.data || res.data;
}

export async function getAdminOneProduct(id) {
  const res = await adminAxios.get(`/products/${id}`);
  return res.data.data || res.data;
}

export async function updateAdminProduct(id, data) {
  const isFormData = data instanceof FormData;
  const res = await adminAxios.patch(`/products/${id}`, data, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data.data || res.data;
}

export async function deleteAdminProduct(id, reason) {
  const res = await adminAxios.delete(`/products/${id}`, {
    data: { reason: reason || "Blocked by admin" },
  });
  return res.data;
}

// 8. Orders Log
export async function getAdminOrders({ page = 1, limit = 10 } = {}) {
  const res = await adminAxios.get("/orders", { params: { page, limit } });
  return res.data.data || res.data;
}

export async function getAdminOneOrder(id) {
  const res = await adminAxios.get(`/orders/${id}`);
  return res.data.data || res.data;
}
