import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const bazaarBrandAxios = axios.create({
  baseURL: BASE_URL,
});

bazaarBrandAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getOneBrand(brandId) {
  const res = await bazaarBrandAxios.get(`/brands/${brandId}`);
  return res.data.data ?? res.data;
}


export async function addBrandDirect(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  const res = await bazaarBrandAxios.post("/brands/add-direct", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
}


export async function editBrand(brandId, data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      formData.append(key, value);
    }
  });
  const res = await bazaarBrandAxios.patch(`/brands/${brandId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
 
  return res.data;
}


export async function deleteBrand(brandId) {
  const res = await bazaarBrandAxios.delete(`/brands/${brandId}`);
  return res.data;
}