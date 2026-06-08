import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";

const brandAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically to every request
brandAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── AUTH ─────────────────────────────────────────────
export async function registerBrand(data) {
  const res = await brandAxios.post("/auth/register/brand", data);
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  return res.data;
}

// ── PRODUCTS ─────────────────────────────────────────
export async function getBrandProducts() {
  const res = await brandAxios.get("/brand/products");
  return res.data;
}

export async function createProduct(formData) {
  const res = await brandAxios.post("/brand/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function updateProduct(id, formData) {
  const res = await brandAxios.put(`/brand/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

export async function deleteProduct(id) {
  const res = await brandAxios.delete(`/brand/products/${id}`);
  return res.data;
}

// ── ORDERS ───────────────────────────────────────────
export async function getBrandOrders() {
  const res = await brandAxios.get("/brand/orders");
  return res.data;
}

export async function updateOrderStatus(id, status) {
  const res = await brandAxios.patch(`/brand/orders/${id}/status`, { status });
  return res.data;
}

// ── STATS ────────────────────────────────────────────
export async function getBrandStats() {
  const res = await brandAxios.get("/brand/stats");
  return res.data;
}

// ── SETTINGS ─────────────────────────────────────────
export async function getBrandProfile() {
  const res = await brandAxios.get("/brand/profile");
  return res.data;
}

export async function updateBrandProfile(data) {
  const res = await brandAxios.put("/brand/profile", data);
  return res.data;
}
