import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";

const brandAxios = axios.create({ baseURL: BASE_URL });

brandAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ── AUTH ─────────────────────────────────────────────────────────────────────
// POST /auth/bazaars/:bazaarId/brands/register
export async function registerBrand(bazaarId, data) {
  const res = await brandAxios.post(
    `/auth/bazaars/${bazaarId}/brands/register`,
    data,
  );
  if (res.data?.token) localStorage.setItem("token", res.data.token);
  return res.data;
}

// ── BRAND PROFILE ─────────────────────────────────────────────────────────────
// GET /brand
export async function getBrandProfile() {
  const res = await brandAxios.get("/brand");
  return res.data;
}

// PATCH /brand
export async function updateBrandProfile(data) {
  const res = await brandAxios.patch("/brand", data);
  return res.data;
}

// ── DASHBOARD STATS ───────────────────────────────────────────────────────────
// GET /brand/dashboard
export async function getBrandDashboard() {
  const res = await brandAxios.get("/brand/dashboard");
  return res.data;
}

// ── PRODUCTS ──────────────────────────────────────────────────────────────────
// GET /brand/products
export async function getBrandProducts() {
  const res = await brandAxios.get("/brand/products");
  return res.data;
}

// GET /brand/products/:id
export async function getBrandProduct(id) {
  const res = await brandAxios.get(`/brand/products/${id}`);
  return res.data;
}

// POST /brand/products
export async function createProduct(formData) {
  const res = await brandAxios.post("/brand/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// PATCH /brand/products/:id
export async function updateProduct(id, formData) {
  const res = await brandAxios.patch(`/brand/products/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}

// DELETE /brand/products/:id
export async function deleteProduct(id) {
  const res = await brandAxios.delete(`/brand/products/${id}`);
  return res.data;
}

// ── ORDERS ────────────────────────────────────────────────────────────────────
// GET /brand/orders
export async function getBrandOrders(status = "") {
  const url = status ? `/brand/orders?status=${status}` : "/brand/orders";
  const res = await brandAxios.get(url);
  return res.data;
}

// GET /brand/orders/:id
export async function getBrandOrder(id) {
  const res = await brandAxios.get(`/brand/orders/${id}`);
  return res.data;
}

// PATCH /brand/orders/:id/status
export async function updateOrderStatus(id, status) {
  const res = await brandAxios.patch(`/brand/orders/${id}/status`, { status });
  return res.data;
}
