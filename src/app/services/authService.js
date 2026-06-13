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
export async function login({ email, password, router }) {
  const res = await authAxios.post("/login", { email, password });
  console.log(res)

  const token = res.data?.data?.accessToken;
  const role = res.data?.data?.user?.role;

  if (token) {
    localStorage.setItem("token", token);
  }

  localStorage.setItem("user", JSON.stringify(res.data.data.user));

  if (role === "CUSTOMER") {
    router.push("/");
  } else if (role === "BRAND_OWNER") {
    router.push("/BrandOwnerDashboard");
  } else if (role === "BAZAAR_OWNER") {
    router.push("/BazaarOwnerDashboard");
  }

  return res.data;
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