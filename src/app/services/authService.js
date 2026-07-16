import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api/auth";

const authAxios = axios.create({
  baseURL: BASE_URL,
  headers: { "Content-Type": "application/json" },
});


export async function registerCustomer({ fullName, email, password }) {
  const res = await authAxios.post("/register/customer", { fullName, email, password });
  return res.data;
}


export async function login({ email, password, router }) {
  const res = await authAxios.post("/login", { email, password });
  console.log('Login response:', res);

  // Extract token from possible response structures
  const token =
    res.data?.accessToken ||
    res.data?.token ||
    res.data?.data?.accessToken ||
    res.data?.data?.token ||
    null;
  console.log('Extracted token:', token);

  if (token) {
    localStorage.setItem('token', token);
  } else {
    console.warn('No token found in login response');
  }

  const user = res.data?.user || res.data?.data?.user || {};
  const role = user.role;

  if (user && Object.keys(user).length > 0) {
    localStorage.setItem("user", JSON.stringify(user));
  }

  if (role === "CUSTOMER") {
    router.push("/explore");
  } else if (role === "BRAND_OWNER") {
    router.push("/BrandOwnerDashboard");
  } else if (role === "BAZAAR_OWNER") {
    router.push("/BazaarOwnerDashboard");
  } else if (role === "ADMIN") {
    router.push("/AdminDashboard");
  }

  return res.data;
}

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


export async function forgetPassword({ email }) {
  const res = await authAxios.post("/forgotPassword", { email });
  console.log(res)
  return res.data;
}


export async function resetPassword({email,otp, password}) {
  const res = await authAxios.post(`/resetPassword`, { email,otp, password});
  return res.data;
}