import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const settingAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

settingAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getBazaarSetting() {
    const res = await settingAxios.get("/setting");
    console.log("settingg",res.data.data.bazaar)
  return res.data.data.bazaar;
}


export async function updateBazaarSetting(body) {
  const isFormData = body instanceof FormData;
  const res = await settingAxios.patch("/setting", body, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {},
  });
  return res.data.data.bazaar ?? res.data.data;
}
