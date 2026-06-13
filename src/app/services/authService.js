import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/auth";

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Register customer
export async function registerCustomer({ fullName, email, password }) {
  const res = await authAxios.post("/register/customer", { fullName, email, password });
  return res.data;
}

// Login
export async function login({ email, password }) {
  const res = await authAxios.post("/login", { email, password });
  // Save token if returned
if (res.data?.data?.accessToken) {
  localStorage.setItem("token", res.data.data.accessToken);
}
  console.log(res)

  const token = res.data?.data?.accessToken;
  if (token) {
    localStorage.setItem("token", token);
  }


}
// Logout
export async function logout() {
  const token = localStorage.getItem("token");
  const res = await authAxios.post(
    "/logout",
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  localStorage.removeItem("token");
  localStorage.removeItem("email");
  return res.data;
}

// Forget Password
export async function forgetPassword({ email }) {
  const res = await authAxios.post("/forgotPassword", { email });
  console.log(res)
  return res.data;
}

// Reset Password
export async function resetPassword({ token, password }) {
  const res = await authAxios.post(`/resetPassword`, { token, password });
  return res.data;
}