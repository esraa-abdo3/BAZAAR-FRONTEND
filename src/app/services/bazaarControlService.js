import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const controlAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


controlAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getBazaarControl() {
  const res = await controlAxios.get("/control");
  console.log(res.data.data.bazaar)
  return res.data.data.bazaar;
}


export async function toggleRegistration(isAcceptingBrands) {
  const res = await controlAxios.patch("/control/toggle", {
     
    isAcceptingBrands,
  }
  );
  return res.data.data;
}


export async function updateAutomation({ autoCloseOnFull, autoCloseBeforeEvent }) {
  const res = await controlAxios.patch("/control/automation", {
    autoCloseOnFull,
    autoCloseBeforeEvent,
  });
  return res.data.data;
}
