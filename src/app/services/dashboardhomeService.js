import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const dashboardAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Attach token automatically
dashboardAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * GET /dashboard?page=&limit=
 * Returns totals (revenue, orders, products) + paginated brands list
 */
export async function getDashboard({ page = 1, limit = 10 } = {}) {
  const res = await dashboardAxios.get("/dashboard", {
    params: { page, limit },
  });
  return res.data.data; // { brands, totals, pagination }
}

/**
 * GET /dashboard/brandComparsion
 * Returns all brands sorted by revenue for the bar chart
 */
export async function getBrandComparison() {
  const res = await dashboardAxios.get("/dashboard/brandComparsion");
  return res.data.data.brands; // [{ brandId, brandName, totalOrders, totalRevenue }]
}

/**
 * GET /dashboard/salesByHour?date=YYYY-MM-DD&period=full|morning|afternoon|evening
 * Returns hourly sales data for the line chart
 */
export async function getSalesByHour({
  date,
  period = "full",
} = {}) {
  const today = date ?? new Date().toISOString().split("T")[0];
  const res = await dashboardAxios.get("/dashboard/salesByHour", {
    params: { date: today, period },
  });
  console.log("res",res);
return res.data.data.salesByHour;
}
