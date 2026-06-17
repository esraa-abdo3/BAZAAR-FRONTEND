import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const bazaarAiAxios = axios.create({
  baseURL: BASE_URL,
});

bazaarAiAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getDashboardAi() {
  const res = await bazaarAiAxios.post("/dashboard-ai");
  console.log("ai",res)
  return res.data?.data ?? res.data;
}