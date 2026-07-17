"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  LayoutDashboard,
  Store,
  Shield,
  Users,
  Package,
  ClipboardList,
  Settings,
  User,
  X,
  Menu,
  LogOut,
} from "lucide-react";

const navLinks = [
  { label: "Overview", tab: "overview", icon: LayoutDashboard },
  { label: "Bazaars", tab: "bazaars", icon: Store },
  { label: "Brands", tab: "brands", icon: Shield },
  { label: "Users", tab: "users", icon: Users },
  { label: "Products", tab: "products", icon: Package },
  { label: "Orders", tab: "orders", icon: ClipboardList },
  { label: "Settings", tab: "settings", icon: Settings },
];


export default function AdminSidebar({ activePage, setActivePage }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const [adminName, setAdminName] = useState("Admin");

  const NEXT_PUBLIC_WEBSITE_URL="http://localhost:3000"
  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const userStr = localStorage.getItem("user");
        if (userStr) {
          try {
            const user = JSON.parse(userStr);
            setAdminName(user.fullName || "Super Admin");
          } catch {
            // ignore
          }
        }
      }
    };
    loadUser();
    window.addEventListener("userUpdate", loadUser);
    return () => window.removeEventListener("userUpdate", loadUser);
  }, []);

const handleGoToWebsite = () => {
  window.open("/", "_blank");
}
const handleLogout = async () => {
  try {
    const token = localStorage.getItem("token");

    await axios.post(
      "https://bazary-backend.vercel.app/api/auth/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    console.log("logout error:", error);
  } finally {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    router.push("/auth/login");
  }
};
  function navigate(tab) {
    setActivePage(tab);
    setOpen(false);
  }


  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm"
        aria-label="Open sidebar"
      >
        <Menu size={18} className="text-gray-600" />
      </button>

      {open && (
        <div
          className="lg:hidden fixed inset-0 bg-black/40 z-40"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[220px]
          bg-white border-r border-gray-100
          flex flex-col justify-between
          py-6 px-3
          z-50
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0
        `}
      >
        <div>
          <div className="flex items-center justify-between px-3 mb-8">
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <LayoutDashboard size={15} className="text-white" />
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-gray-800 leading-none truncate">
                  Super Admin
                </p>
                <p className="text-[10px] text-gray-400">Platform Management</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600 flex-shrink-0"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, icon: Icon, tab }) => (
              <button
                key={label}
                onClick={() => navigate(tab)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors w-full text-left ${
                  activePage === tab
                    ? "bg-indigo-50 text-indigo-600"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                <Icon size={16} />
                {label}
              </button>
            ))}
          </nav>
        </div>

   <div className="flex gap-2 px-3 pt-4 border-t border-gray-100">
  <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
    <User size={15} className="text-amber-700" />
  </div>

  <div className="min-w-0">
    <p className="text-xs font-semibold text-gray-800 truncate">
      {adminName}
    </p>

    <button
      onClick={handleGoToWebsite}
      className="flex items-center gap-1 mt-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 cursor-pointer transition"
    >
      <Store size={10} />
      Go to Website
    </button>

    <button
      onClick={handleLogout}
      className="flex items-center gap-0.5 mt-1 text-xs font-medium text-red-500 cursor-pointer transition w-full"
    >
      <LogOut size={10} />
      Logout
    </button>
  </div>
</div>
      </aside>
    </>
  );
}
