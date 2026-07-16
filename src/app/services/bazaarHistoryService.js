import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const historyAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

historyAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * Returns the list of ended bazaars (history entries).
 * Normalizes whatever shape the backend returns into a plain array.
 */
export async function getBazaarHistoryList() {
  const res = await historyAxios.get("/history");
  const raw = res?.data?.data;

  if (Array.isArray(raw)) return raw;
  if (Array.isArray(raw?.bazaars)) return raw.bazaars;
  if (Array.isArray(raw?.history)) return raw.history;
  if (Array.isArray(res?.data)) return res.data;

  return [];
}

/**
 * Dashboard summary (brands, totals, pagination) for a specific ended bazaar.
 */
export async function getHistoryDashboard(bazaarId, { page = 1, limit = 10 } = {}) {
  const res = await historyAxios.get(`/dashboard/${bazaarId}`, {
    params: { page, limit },
  });
  return res.data.data;
}

/**
 * Sales-by-hour breakdown for a specific ended bazaar.
 */
export async function getHistorySalesByHour(bazaarId) {
  const res = await historyAxios.get(`/dashboard/salesByHour/${bazaarId}`);
  return res.data.data;
}

/**
 * Control / settings snapshot for a specific ended bazaar.
 */
export async function getHistoryControl(bazaarId) {
  const res = await historyAxios.get(`/control/${bazaarId}`);
  return res.data.data;
}
