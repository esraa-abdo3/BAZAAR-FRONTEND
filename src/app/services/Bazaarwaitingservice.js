import axios from "axios";
import { getBazaarSetting } from "./bazaarSettingsService";

const BASE_URL = "https://bazary-backend.vercel.app/api/bazaar";

const bazaarWaitingAxios = axios.create({
  baseURL: BASE_URL,
});

bazaarWaitingAxios.interceptors.request.use((config) => {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});


export async function getWaitingList() {
  const bazaar = await getBazaarSetting();
  const bazaarId = bazaar?._id;
  

  if (!bazaarId) {
    throw new Error("Couldn't determine bazaar ID from settings.");
  }
  const res = await bazaarWaitingAxios.get(`/${bazaarId}/waiting`);
  return res.data?.data?.waitingList ?? [];
}


export async function approveWaitingEntry(waitingId) {
  console.log("waiting id", waitingId)
  const res = await bazaarWaitingAxios.patch(`/waiting/${waitingId}/approve`);
  
  return res.data;
}

export async function rejectWaitingEntry(waitingId) {
  const res = await bazaarWaitingAxios.patch(`/waiting/${waitingId}/reject`);
  return res.data;
}