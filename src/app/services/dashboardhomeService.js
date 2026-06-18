import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const dashboardAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


dashboardAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getDashboard({ page = 1, limit = 10 } = {}) {
  const res = await dashboardAxios.get("/dashboard", {
    params: { page, limit },
  });
  console.log("brands", res.data.data)
  return res.data.data; 
}


export async function getBrandComparison() {
  const res = await dashboardAxios.get("/dashboard/brandComparsion");

  return res.data.data.brands;
}


export async function getSalesByHour({  date, period = "full"} = {}) {
  const today = date ?? new Date().toISOString().split("T")[0];
  const res = await dashboardAxios.get("/dashboard/salesByHour", {
    params: { date: today, period },
  });

return res.data.data.salesByHour;
}
