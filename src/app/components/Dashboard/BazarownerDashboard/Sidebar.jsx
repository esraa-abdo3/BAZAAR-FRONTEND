
// "use client";

// import { useState, useEffect } from "react";
// import Link from "next/link";
// import {
//   LayoutDashboard,
//   Store,
//   Settings,
//   User,
//   X,
//   Menu,
//   Clock,
//   History,

//   Brain,
// } from "lucide-react";
// import { useRouter } from "next/navigation";
// import axios from "axios";
// import { LogOut } from "lucide-react";
// import { usePathname } from "next/navigation";
// import { getWaitingList } from "../../../services/Bazaarwaitingservice";
// import { getBazaarSetting } from "../../../services/bazaarSettingsService";

// const navLinks = [
//   {
//     label: "Dashboard",
//     icon: LayoutDashboard,
//     href: "/BazaarOwnerDashboard",
//   },
//   {
//     label: "Waiting List",
//     icon: Clock,
//     href: "/BazaarOwnerDashboard/Waitinglist",
//     badgeKey: "waiting",
//   },
//     {
//     label: "AI Insights",
//     icon: Brain,
//     href: "/BazaarOwnerDashboard/aiinsights",
//   },
//   {
//     label: "Bazaar Control",
//     icon: Store,
//     href: "/BazaarOwnerDashboard/bazaarcontrol",
//   },
//   {
//     label: "History",
//     icon: History,
//     href: "/BazaarOwnerDashboard/history",
//   },

//   {
//     label: "Settings",
//     icon: Settings,
//     href: "/BazaarOwnerDashboard/settings",
//   },
// ];

// export default function Sidebar({ active }) {
//   const [open, setOpen] = useState(false);
//   const [waitingCount, setWaitingCount] = useState(0);
//   const router = useRouter();
//   const pathname = usePathname();
//   const [bazaarName, setBazaarName] = useState("");

//   useEffect(() => {
//     const loadWaitingCount = async () => {
//       try {
//         const list = await getWaitingList();
//         setWaitingCount(list.filter((e) => e.status === "PENDING").length);
//       } catch (err) {
//         // Silently ignore — badge just won't show a count
//       }
//     };
//     loadWaitingCount();
//   }, [pathname]);

// const handleLogout = async () => {
//   try {
//     const token = localStorage.getItem("token");
//     await axios.post(
//       "https://bazary-backend.vercel.app/api/auth/logout",
//       {},
//       {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       }
//     );

//   } catch (error) {
//     console.log("logout error:", error);
//   } finally {
//     localStorage.removeItem("token");

//     localStorage.removeItem("user");
//     router.push("/auth/login");
//   }
//   };
//   useEffect(() => {
//   const loadBazaarData = async () => {
//     try {
//       const setting = await getBazaarSetting();
//       setBazaarName(setting?.bazaarName || "Bazaar Owner");
//     } catch (error) {
//       setBazaarName("Bazaar Owner");
//     }
//   };

//   loadBazaarData();
// }, []);

//   return (
//     <>

//       <button
//         onClick={() => setOpen(true)}
//         className="lg:hidden fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center bg-white border border-gray-200 rounded-lg shadow-sm"
//         aria-label="Open sidebar"
//       >
//         <Menu size={18} className="text-gray-600" />
//       </button>

   
//       {open && (
//         <div
//           className="lg:hidden fixed inset-0 bg-black/40 z-40"
//           onClick={() => setOpen(false)}
//         />
//       )}

     
// <aside
//   className={`
//     fixed top-0 left-0 h-full w-[220px]
//     bg-white border-r border-gray-100
//     flex flex-col justify-between
//     py-6 px-3
//     z-50
//     transition-transform duration-300 ease-in-out

//     ${open ? "translate-x-0" : "-translate-x-full"}

//     lg:translate-x-0
//   `}
// >
     
//         <div>
       
//           <div className="flex items-center justify-between px-3 mb-8">
//             <div className="flex items-center gap-2">
//               <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0">
//                 <Store size={15} className="text-white" />
//               </div>
//               <div>
//                 <p className="text-xs font-semibold text-gray-800 leading-none">
//                   Bazaar Admin
//                 </p>
//                 <p className="text-[10px] text-gray-400">SaaS Management</p>
//               </div>
//             </div>
//             <button
//               onClick={() => setOpen(false)}
//               className="lg:hidden text-gray-400 hover:text-gray-600"
//               aria-label="Close sidebar"
//             >
//               <X size={16} />
//             </button>
//           </div>

         
//           <nav className="flex flex-col gap-1">
//             {navLinks.map(({ label, icon: Icon, href, badgeKey }) => (
//               <Link
//                 key={label}
//                 href={href}
//                 onClick={() => setOpen(false)}
//                className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//   pathname === href
//     ? "bg-indigo-50 text-indigo-600"
//     : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
// }`}
//               >
//                 <span className="flex items-center gap-3">
//                   <Icon size={16} />
//                   {label}
//                 </span>
//                 {badgeKey === "waiting" && waitingCount > 0 && (
//                   <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold leading-none">
//                     {waitingCount}
//                   </span>
//                 )}
//               </Link>
//             ))}
//           </nav>
//         </div>

//         <div>
//            <div className="flex  gap-2 px-3 pt-4 border-t border-gray-100">
//           <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
//             <User size={15} className="text-amber-700" />
//           </div>
//           <div className="min-w-0">
//          <p className="text-xs font-semibold text-gray-800 truncate">
//   {bazaarName}
// </p>
//                         <button
//   onClick={handleLogout}
//   className="flex items-center  gap-0.5 mt-1   text-xs font-medium text-red-500 cursor-pointer  transition w-full"
// >
//   <LogOut size={10} />
//   Logout
// </button>
//           </div>
//         </div>
 
// </div>
       
//       </aside>
//     </>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Store,
  Settings,
  User,
  X,
  Menu,
  Clock,
  History,
  ExternalLink,

  Brain,
} from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { getWaitingList } from "../../../services/Bazaarwaitingservice";
import { getBazaarSetting } from "../../../services/bazaarSettingsService";

const navLinks = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/BazaarOwnerDashboard",
  },
  {
    label: "Waiting List",
    icon: Clock,
    href: "/BazaarOwnerDashboard/Waitinglist",
    badgeKey: "waiting",
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
    label: "History",
    icon: History,
    href: "/BazaarOwnerDashboard/history",
  },

  {
    label: "Settings",
    icon: Settings,
    href: "/BazaarOwnerDashboard/settings",
  },
];

export default function Sidebar({ active }) {
  const [open, setOpen] = useState(false);
  const [waitingCount, setWaitingCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const [bazaarName, setBazaarName] = useState("");
  const [aiAssistant, setAiAssistant] = useState(false);
  const [bazaarStatus, setBazaarStatus] = useState(null);
  const [bazaarId, setBazaarId] = useState(null);

  useEffect(() => {
    const loadWaitingCount = async () => {
      try {
        const list = await getWaitingList();
        setWaitingCount(list.filter((e) => e.status === "PENDING").length);
      } catch (err) {
        // Silently ignore — badge just won't show a count
      }
    };
    loadWaitingCount();
  }, [pathname]);

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
  useEffect(() => {
  const loadBazaarData = async () => {
    try {
      const setting = await getBazaarSetting();
      setBazaarName(setting?.bazaarName || "Bazaar Owner");
      setAiAssistant(!!setting?.aiAssistant);
      setBazaarStatus(setting?.status ?? null);
      setBazaarId(setting?._id ?? null);
    } catch (error) {
      setBazaarName("Bazaar Owner");
      setAiAssistant(false);
      setBazaarStatus(null);
      setBazaarId(null);
    }
  };

  loadBazaarData();
}, []);

  // Hide "AI Insights" entirely when this bazaar doesn't have the AI add-on enabled
  const visibleNavLinks = navLinks.filter(
    (link) => link.label !== "AI Insights" || aiAssistant
  );

  // The bazaar's public page depends on its current status:
  // live → its live profile page, upcoming → its upcoming teaser page, ended → no public page to link to
  const publicPageHref =
    bazaarId && bazaarStatus === "LIVE"
      ? `/Bazaarprofile/${bazaarId}`
      : bazaarId && bazaarStatus === "UPCOMING"
      ? `/upcoming/${bazaarId}`
      : null;

  const finalNavLinks = [...visibleNavLinks];
  if (publicPageHref) {
    finalNavLinks.splice(1, 0, {
      label: "My Bazaar Page",
      icon: ExternalLink,
      href: publicPageHref,
      external: true,
    });
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
            {finalNavLinks.map(({ label, icon: Icon, href, badgeKey, external }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setOpen(false)}
                {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
               className={`flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
  !external && pathname === href
    ? "bg-indigo-50 text-indigo-600"
    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
}`}
              >
                <span className="flex items-center gap-3">
                  <Icon size={16} />
                  {label}
                </span>
                {badgeKey === "waiting" && waitingCount > 0 && (
                  <span className="flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-red-500 text-white text-[11px] font-semibold leading-none">
                    {waitingCount}
                  </span>
                )}
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
         <p className="text-xs font-semibold text-gray-800 truncate">
  {bazaarName}
</p>
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