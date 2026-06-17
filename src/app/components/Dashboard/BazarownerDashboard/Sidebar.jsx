"use client";

import { useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  Settings,
  User,
  X,
  Menu,

  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";

const navLinks = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/BazaarOwnerDashboard",
  },
    {
    label: "AI Insights",
    icon: Brain,
    href: "/BazaarOwnerDashboard/aiinsights",
  },
  {
    label: "Bazaar Control",
    icon: Store,
    href: "/BazaarOwnerDashboard/bazaarcontrol",
  },

  {
    label: "Settings",
    icon: Settings,
    href: "/BazaarOwnerDashboard/settings",
  },
];

export default function Sidebar({ active }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

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
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <Store size={15} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-semibold text-gray-800 leading-none">
                  Bazaar Admin
                </p>
                <p className="text-[10px] text-gray-400">SaaS Management</p>
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="lg:hidden text-gray-400 hover:text-gray-600"
              aria-label="Close sidebar"
            >
              <X size={16} />
            </button>
          </div>

         
          <nav className="flex flex-col gap-1">
            {navLinks.map(({ label, icon: Icon, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
               className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
  pathname === href
    ? "bg-indigo-50 text-indigo-600"
    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
}`}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
           <div className="flex  gap-2 px-3 pt-4 border-t border-gray-100">
          <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
            <User size={15} className="text-amber-700" />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-gray-800 truncate">Alex Rivers</p>
                        <button
  onClick={handleLogout}
  className="flex items-center  gap-0.5 mt-1   text-xs font-medium text-red-500 cursor-pointer  transition w-full"
>
  <LogOut size={10} />
  Logout
</button>
          </div>
        </div>
 
</div>
       
      </aside>
    </>
  );
}
