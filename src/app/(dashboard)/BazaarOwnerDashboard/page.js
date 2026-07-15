// "use client";

// import { useState, useEffect, useCallback } from "react";
// import {TrendingUp,TrendingDown,PlusCircle,PenLine,Trash2,ChevronRight,ChevronLeft,Loader2} from "lucide-react";
// import {LineChart,Line,BarChart,Bar,XAxis,YAxis,Tooltip,ResponsiveContainer,CartesianGrid,} from "recharts";
// import DashboardHeader from "../../components/Dashboard/BazarownerDashboard/DashboardHeader";
// import {getDashboard,getBrandComparison,getSalesByHour} from "../../services/dashboardhomeService";
// import Link from "next/link";
// import { useRouter } from "next/navigation";


// const PERIOD_MAP = {
//   "Full Day": "full",
//   Morning: "morning",
//   Afternoon: "afternoon",
//   Evening: "evening",
// };


// function formatHour(h) {
//   if (h === 0 || h === 24) return "12 AM";
//   if (h === 12) return "12 PM";
//   return h < 12 ? `${h} AM` : `${h - 12} PM`;
// }


// function Skeleton({ className = "" }) {
//   return (
//     <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
//   );
// }

// const CustomTooltip = ({ active, payload, label }) => {
//   if (!active || !payload?.length) return null;
//   return (
//     <div className="bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl">
//       <p className="font-semibold mb-1">{label}</p>
//       <p>
//         Revenue:{" "}
//         <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
//       </p>
//       <p>
//         Orders: <span className="font-bold">{payload[1]?.value ?? "—"}</span>
//       </p>
//     </div>
//   );
// };


// export default function BazaarOwnerDashboardPage() {

//   const [timeFilter, setTimeFilter] = useState("Full Day");
//   const [page, setPage] = useState(1);
//   const LIMIT = 4;
//   const [totals, setTotals] = useState(null);
//   const [brands, setBrands] = useState([]);
//   const [pagination, setPagination] = useState(null);
//   const [brandComparison, setBrandComparison] = useState([]);
//   const [salesData, setSalesData] = useState([]);
//   const [loadingMain, setLoadingMain] = useState(true);
//   const [loadingChart, setLoadingChart] = useState(false);
//   const [loadingSales, setLoadingSales] = useState(false);
//   const [error, setError] = useState(null);
//   const [selectedDate, setSelectedDate] = useState(
//   new Date().toISOString().split("T")[0]
//   );
//   const router = useRouter();


//   const fetchDashboard = useCallback(async (p) => {
//     try {
//       setLoadingMain(true);
//       const data = await getDashboard({ page: p, limit: LIMIT });
//       console.log("get dashboard", data)
//       setTotals(data.totals);
//       setBrands(data.brands);
//       setPagination(data.pagination);
//     } catch (e) {
//       setError("Failed to load dashboard data.");
//     } finally {
//       setLoadingMain(false);
//     }
//   }, []);

 
//   const fetchComparison = useCallback(async () => {
//     try {
//       setLoadingChart(true);
//       const data = await getBrandComparison();
//       setBrandComparison(
//         data.map((b) => ({ name: b.brandName + ` : ${b.totalRevenue}`+" EGP", value: b.totalRevenue }))
//       );
//     } catch {
      
//     } finally {
//       setLoadingChart(false);
//     }
//   }, []);


//   const fetchSales = useCallback(async (period, date = selectedDate) => {
//   try {
//     setLoadingSales(true);

//     const data = await getSalesByHour({
//       date,
//       period,
//     });

//     const arr = Array.isArray(data) ? data : [data];

//     setSalesData(
//       arr
//         .filter((d) => d?.hour !== undefined)
//         .map((d) => ({
//           time: formatHour(d.hour),
//           revenue: d.revenue ?? 0,
//           orders: d.orders ?? 0,
//         }))
//     );
//   } catch {
//     setSalesData([]);
//   } finally {
//     setLoadingSales(false);
//   }
// }, [selectedDate]);


//   useEffect(() => {
//     fetchDashboard(page);
//     fetchComparison();
//   }, []);

//   useEffect(() => {
//     fetchSales(PERIOD_MAP[timeFilter]);
//   }, [timeFilter]);

//   useEffect(() => {
//     fetchDashboard(page);
//   }, [page]);


//   const stats = totals
//     ? [
//         {
//           label: "TOTAL REVENUE",
//           value: `$${totals.totalRevenue.toLocaleString()}`,
//           up: true,
//         },
//         {
//           label: "TOTAL ORDERS",
//           value: totals.totalOrders.toLocaleString(),
//           up: true,
//         },
//         {
//           label: "PRODUCTS SOLD COUNT",
//           value: totals.totalProducts.toLocaleString(),
//           up: false,
//         },
//       ]
//     : [];

 
//   return (
//     <>
//       <DashboardHeader greeting="good morning" />

//       <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
//         {error && (
//           <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
//             {error}
//           </div>
//         )}

        
//         <section>
//           <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-0.5">
//             Revenue Tracking
//           </h2>
//           <p className="text-sm text-gray-400 mb-5">
//             Performance across all brand channels
//           </p>

     
//           <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
//             {loadingMain
//               ? Array.from({ length: 3 }).map((_, i) => (
//                   <div
//                     key={i}
//                     className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
//                   >
//                     <Skeleton className="h-3 w-24 mb-3" />
//                     <Skeleton className="h-7 w-32 mb-3" />
//                     <Skeleton className="h-3 w-14" />
//                   </div>
//                 ))
//               : stats.map(({ label, value, up }) => (
//                   <div
//                     key={label}
//                     className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
//                   >
//                     <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
//                       {label}
//                     </p>
//                     <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
//                       {value}
//                     </p>
//                     <div
//                       className={`flex items-center gap-1 text-xs font-medium ${
//                         up ? "text-emerald-500" : "text-red-400"
//                       }`}
//                     >
//                       {up ? (
//                         <TrendingUp size={12} />
//                       ) : (
//                         <TrendingDown size={12} />
//                       )}
//                       {up ? "Live data" : "Live data"}
//                     </div>
//                   </div>
//                 ))}
//           </div>


//           <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            
//             <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
//               <p className="text-sm font-semibold text-gray-700 mb-4">
//                 Brand Comparison (Bar)
//               </p>
//               {loadingChart ? (
//                 <div className="flex items-center justify-center h-[200px]">
//                   <Loader2 size={22} className="animate-spin text-indigo-400" />
//                 </div>
//               ) : brandComparison.length === 0 ? (
//                 <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
//                   No data available
//                 </div>
//               ) : (
//                 <ResponsiveContainer width="100%" height={200}>
//                   <BarChart
//                     data={brandComparison}
//                     layout="vertical"
//                     barSize={8}
//                   >
//                     <XAxis type="number" hide />
//                     <YAxis
//                       type="category"
//                       dataKey="name"
//                       tick={{ fontSize: 14, fill: "#9ca3af" }}
//                       axisLine={false}
//                       tickLine={false}
//                       width={180}
//                     />
//                     <Tooltip
//                       cursor={{ fill: "transparent" }}
//                       contentStyle={{
//                         fontSize: 12,
//                         borderRadius: 8,
//                         border: "1px solid #e5e7eb",
//                       }}
//                       formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
//                     />
//                     <Bar
//                       dataKey="value"
//                       fill="#4f46e5"
//                       radius={[0, 4, 4, 0]}
//                     />
//                   </BarChart>
//                 </ResponsiveContainer>
//               )}
//             </div>

         
//             <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
//               <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
//                 <p className="text-sm font-semibold text-gray-700">
//                   Sales During the Day
//                 </p>
//                 <div className="flex flex-wrap gap-1">
//                   {["Full Day", "Morning", "Afternoon", "Evening"].map((t) => (
//                     <button
//                       key={t}
//                       onClick={() => setTimeFilter(t)}
//                       className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
//                         timeFilter === t
//                           ? "bg-indigo-600 text-white"
//                           : "text-gray-500 hover:bg-gray-100"
//                       }`}
//                     >
//                       {t}
//                     </button>
//                   ))}
//                   <input
//   type="date"
//   value={selectedDate}
//   onChange={(e) => {
//     setSelectedDate(e.target.value);
//     fetchSales(timeFilter, e.target.value);
//   }}
//   className="text-xs border rounded-md px-2 py-1 text-gray-600"
// />
//                 </div>
//               </div>
//               {loadingSales ? (
//                 <div className="flex items-center justify-center h-[180px]">
//                   <Loader2 size={22} className="animate-spin text-indigo-400" />
//                 </div>
//               ) : salesData.length === 0 ? (
//                 <div className="flex items-center justify-center h-[180px] text-gray-400 text-sm">
//                   No sales data for this period
//                 </div>
//               ) : (
//                 <ResponsiveContainer width="100%" height={180}>
//                   <LineChart data={salesData}>
//                     <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
//                     <XAxis
//                       dataKey="time"
//                       tick={{ fontSize: 10, fill: "#9ca3af" }}
//                       axisLine={false}
//                       tickLine={false}
//                     />
//                     <YAxis hide />
//                     <Tooltip content={<CustomTooltip />} />
//                     <Line
//                       type="monotone"
//                       dataKey="revenue"
//                       stroke="#4f46e5"
//                       strokeWidth={2.5}
//                       dot={false}
//                       activeDot={{ r: 5, fill: "#4f46e5", strokeWidth: 0 }}
//                     />
//                     <Line
//                       type="monotone"
//                       dataKey="orders"
//                       stroke="transparent"
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               )}
//             </div>
//           </div>
//         </section>

    
//         <section>
//           <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
//             <div>
//               <h2 className="text-lg sm:text-xl font-bold text-gray-800">
//                 Brand Management
//               </h2>
//               <p className="text-sm text-gray-400">
//                 {pagination
//                   ? `${pagination.totalBrands} Verified Partners`
//                   : "Loading..."}
//               </p>
//             </div>
//             <div className="bg-[#4f46e5] text-white py-2 px-4 rounded-[8px] text-sm font-bold hover:scale-[.98] transition-all duration-200">
//               <Link href={"/BazaarOwnerDashboard/Addbrand"}>
//                 Add Brand
//               </Link>
//             </div>
        
//           </div>

//           <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="w-full text-sm min-w-[600px]">
//                 <thead>
//                   <tr className="border-b border-gray-100">
//                     {[
//                       "Brand",
//                       "Owner Contact",
//                       "Products",
//                       "Orders",
//                       "Revenue",
//                     ].map((h) => (
//                       <th
//                         key={h}
//                         className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3"
//                       >
//                         {h}
//                       </th>
//                     ))}
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {loadingMain
//                     ? Array.from({ length: LIMIT }).map((_, i) => (
//                         <tr key={i} className="border-b border-gray-50">
//                           {Array.from({ length: 6 }).map((_, j) => (
//                             <td key={j} className="px-5 py-4">
//                               <Skeleton className="h-4 w-full" />
//                             </td>
//                           ))}
//                         </tr>
//                       ))
//                     : brands.map((brand, i) => (
//                       <tr
//                         onClick={() => router.push(`/BazaarOwnerDashboard/updatebrand/${brand.brandId}`)}
//                           key={brand.brandId}
//                           className={`border-b border-gray-50 transition-colors ${
//                             i === 0 ? "bg-gray-50" : "hover:bg-gray-50"
//                           }`}
//                         >
//                           <td className="px-5 py-4">
//                             <div className="flex items-center gap-3">
//                               <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
//                                 {brand.brandName[0]}
//                               </div>
//                               <span className="font-medium text-gray-800 whitespace-nowrap">
//                                 {brand.brandName}
//                               </span>
//                             </div>
//                           </td>
//                           <td className="px-5 py-4">
//                             <p className="font-medium text-gray-700">
//                               {brand.ownerName}
//                             </p>
//                             <p className="text-xs text-gray-400">
//                               {brand.ownerEmail}
//                             </p>
//                           </td>
//                           <td className="px-5 py-4">
//                             <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
//                               {brand.totalProducts} items
//                             </span>
//                           </td>
//                           <td className="px-5 py-4">
//                             <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-1 rounded-full">
//                               {brand.totalOrders}
//                             </span>
//                           </td>
//                           <td className="px-5 py-4">
//                             <span className="text-emerald-500 font-semibold">
//                               ${brand.totalRevenue.toLocaleString()}
//                             </span>
//                           </td>
                    
//                         </tr>
//                       ))}
//                 </tbody>
//               </table>
//             </div>

          
//             {pagination && pagination.totalPages > 1 && (
//               <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
//                 <p className="text-xs text-gray-400">
//                   Page {pagination.currentPage} of {pagination.totalPages}
//                 </p>
//                 <div className="flex items-center gap-1">
//                   <button
//                     disabled={page === 1}
//                     onClick={() => setPage((p) => p - 1)}
//                     className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronLeft size={14} />
//                   </button>
//                   {Array.from({ length: pagination.totalPages }, (_, i) => (
//                     <button
//                       key={i + 1}
//                       onClick={() => setPage(i + 1)}
//                       className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
//                         page === i + 1
//                           ? "bg-indigo-600 text-white"
//                           : "border border-gray-200 text-gray-500 hover:bg-gray-50"
//                       }`}
//                     >
//                       {i + 1}
//                     </button>
//                   ))}
//                   <button
//                     disabled={page === pagination.totalPages}
//                     onClick={() => setPage((p) => p + 1)}
//                     className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
//                   >
//                     <ChevronRight size={14} />
//                   </button>
//                 </div>
//               </div>
//             )}
//           </div>
//         </section>
//       </main>
//     </>
//   );
// }
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  TrendingUp,
  TrendingDown,
  PlusCircle,
  PenLine,
  Trash2,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Clock,
  Archive,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import DashboardHeader from "../../components/Dashboard/BazarownerDashboard/DashboardHeader";
import {
  getDashboard,
  getBrandComparison,
  getSalesByHour,
} from "../../services/dashboardhomeService";
import { getBazaarSetting } from "../../services/bazaarSettingsService";
import Link from "next/link";
import { useRouter } from "next/navigation";

const PERIOD_MAP = {
  "Full Day": "full",
  Morning: "morning",
  Afternoon: "afternoon",
  Evening: "evening",
};

function formatHour(h) {
  if (h === 0 || h === 24) return "12 AM";
  if (h === 12) return "12 PM";
  return h < 12 ? `${h} AM` : `${h - 12} PM`;
}

function Skeleton({ className = "" }) {
  return (
    <div className={`animate-pulse bg-gray-100 rounded-lg ${className}`} />
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 text-white text-xs rounded-xl p-3 shadow-xl">
      <p className="font-semibold mb-1">{label}</p>
      <p>
        Revenue:{" "}
        <span className="font-bold">${payload[0]?.value?.toLocaleString()}</span>
      </p>
      <p>
        Orders: <span className="font-bold">{payload[1]?.value ?? "—"}</span>
      </p>
    </div>
  );
};

// Full-page state shown when the bazaar isn't currently live
function BazaarStatusScreen({ status, bazaarName }) {
  const isUpcoming = status === "UPCOMING";

  const Icon = isUpcoming ? Clock : Archive;
  const title = isUpcoming ? "Your bazaar hasn't started yet" : "This bazaar has ended";
  const subtitle = isUpcoming
    ? "Dashboard analytics will appear here once your bazaar goes live."
    : "This bazaar is now closed. You can review its performance in the History page.";

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6">
      <div
        className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 ${
          isUpcoming ? "bg-indigo-50" : "bg-gray-100"
        }`}
      >
        <Icon size={28} className={isUpcoming ? "text-indigo-500" : "text-gray-400"} />
      </div>
      <h2 className="text-lg font-bold text-gray-800 mb-1">{title}</h2>
      <p className="text-sm text-gray-400 max-w-sm mb-1">{subtitle}</p>
      {bazaarName && (
        <p className="text-xs text-gray-300 mt-1">{bazaarName}</p>
      )}

      <span
        className={`mt-5 inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full ${
          isUpcoming ? "bg-indigo-50 text-indigo-600" : "bg-gray-100 text-gray-500"
        }`}
      >
        <span
          className={`w-1.5 h-1.5 rounded-full ${
            isUpcoming ? "bg-indigo-500" : "bg-gray-400"
          }`}
        />
        {status}
      </span>

      {!isUpcoming && (
        <Link
          href="/BazaarOwnerDashboard/history"
          className="mt-5 text-xs font-semibold text-indigo-600 hover:underline"
        >
          Go to History →
        </Link>
      )}
    </div>
  );
}

export default function BazaarOwnerDashboardPage() {
  const [timeFilter, setTimeFilter] = useState("Full Day");
  const [page, setPage] = useState(1);
  const LIMIT = 4;
  const [totals, setTotals] = useState(null);
  const [brands, setBrands] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [brandComparison, setBrandComparison] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loadingMain, setLoadingMain] = useState(true);
  const [loadingChart, setLoadingChart] = useState(false);
  const [loadingSales, setLoadingSales] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );

  // Bazaar status gating
  const [bazaarStatus, setBazaarStatus] = useState(null); // "UPCOMING" | "LIVE" | "ENDED" | ...
  const [bazaarName, setBazaarName] = useState("");
  const [statusLoading, setStatusLoading] = useState(true);

  const router = useRouter();

  const fetchDashboard = useCallback(async (p) => {
    try {
      setLoadingMain(true);
      const data = await getDashboard({ page: p, limit: LIMIT });
      setTotals(data.totals);
      setBrands(data.brands);
      setPagination(data.pagination);
    } catch (e) {
      setError("Failed to load dashboard data.");
    } finally {
      setLoadingMain(false);
    }
  }, []);

  const fetchComparison = useCallback(async () => {
    try {
      setLoadingChart(true);
      const data = await getBrandComparison();
      setBrandComparison(
        data.map((b) => ({
          name: b.brandName + ` : ${b.totalRevenue}` + " EGP",
          value: b.totalRevenue,
        }))
      );
    } catch {
    } finally {
      setLoadingChart(false);
    }
  }, []);

  const fetchSales = useCallback(
    async (period, date = selectedDate) => {
      try {
        setLoadingSales(true);

        const data = await getSalesByHour({
          date,
          period,
        });

        const arr = Array.isArray(data) ? data : [data];

        setSalesData(
          arr
            .filter((d) => d?.hour !== undefined)
            .map((d) => ({
              time: formatHour(d.hour),
              revenue: d.revenue ?? 0,
              orders: d.orders ?? 0,
            }))
        );
      } catch {
        setSalesData([]);
      } finally {
        setLoadingSales(false);
      }
    },
    [selectedDate]
  );

  // Step 1: figure out the bazaar's status BEFORE loading any dashboard data
  useEffect(() => {
    const loadStatus = async () => {
      try {
        setStatusLoading(true);
        const setting = await getBazaarSetting();
        setBazaarStatus(setting?.status ?? null);
        setBazaarName(setting?.bazaarName ?? "");
      } catch (e) {
        // If we can't determine status, fail safe: don't block the dashboard
        setBazaarStatus("UNKNOWN");
      } finally {
        setStatusLoading(false);
      }
    };
    loadStatus();
  }, []);

  const isBlocked = bazaarStatus === "UPCOMING" || bazaarStatus === "ENDED";

  // Step 2: only fetch dashboard data once we know the bazaar is actually live/active
  useEffect(() => {
    if (statusLoading || isBlocked) return;
    fetchDashboard(page);
    fetchComparison();
  }, [statusLoading, isBlocked]);

  useEffect(() => {
    if (statusLoading || isBlocked) return;
    fetchSales(PERIOD_MAP[timeFilter]);
  }, [timeFilter, statusLoading, isBlocked]);

  useEffect(() => {
    if (statusLoading || isBlocked) return;
    fetchDashboard(page);
  }, [page]);

  const stats = totals
    ? [
        {
          label: "TOTAL REVENUE",
          value: `$${totals.totalRevenue.toLocaleString()}`,
          up: true,
        },
        {
          label: "TOTAL ORDERS",
          value: totals.totalOrders.toLocaleString(),
          up: true,
        },
        {
          label: "PRODUCTS SOLD COUNT",
          value: totals.totalProducts.toLocaleString(),
          up: false,
        },
      ]
    : [];

  // While we don't yet know the bazaar's status, show a lightweight loading state
  if (statusLoading) {
    return (
      <>
        <DashboardHeader greeting="good morning" />
        <main className="p-4 sm:p-6 lg:p-8">
          <div className="flex items-center justify-center h-[300px]">
            <Loader2 size={24} className="animate-spin text-indigo-400" />
          </div>
        </main>
      </>
    );
  }

  // Bazaar is upcoming or ended: show the status screen and fetch nothing else
  if (isBlocked) {
    return (
      <>
        <DashboardHeader greeting="good morning" />
        <main className="p-4 sm:p-6 lg:p-8">
          <BazaarStatusScreen status={bazaarStatus} bazaarName={bazaarName} />
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardHeader greeting="good morning" />

      <main className="p-4 sm:p-6 lg:p-8 flex flex-col gap-8">
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        <section>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-0.5">
            Revenue Tracking
          </h2>
          <p className="text-sm text-gray-400 mb-5">
            Performance across all brand channels
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            {loadingMain
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                  >
                    <Skeleton className="h-3 w-24 mb-3" />
                    <Skeleton className="h-7 w-32 mb-3" />
                    <Skeleton className="h-3 w-14" />
                  </div>
                ))
              : stats.map(({ label, value, up }) => (
                  <div
                    key={label}
                    className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm"
                  >
                    <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mb-2">
                      {label}
                    </p>
                    <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      {value}
                    </p>
                    <div
                      className={`flex items-center gap-1 text-xs font-medium ${
                        up ? "text-emerald-500" : "text-red-400"
                      }`}
                    >
                      {up ? (
                        <TrendingUp size={12} />
                      ) : (
                        <TrendingDown size={12} />
                      )}
                      {up ? "Live data" : "Live data"}
                    </div>
                  </div>
                ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <p className="text-sm font-semibold text-gray-700 mb-4">
                Brand Comparison (Bar)
              </p>
              {loadingChart ? (
                <div className="flex items-center justify-center h-[200px]">
                  <Loader2 size={22} className="animate-spin text-indigo-400" />
                </div>
              ) : brandComparison.length === 0 ? (
                <div className="flex items-center justify-center h-[200px] text-gray-400 text-sm">
                  No data available
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={brandComparison} layout="vertical" barSize={8}>
                    <XAxis type="number" hide />
                    <YAxis
                      type="category"
                      dataKey="name"
                      tick={{ fontSize: 14, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                      width={180}
                    />
                    <Tooltip
                      cursor={{ fill: "transparent" }}
                      contentStyle={{
                        fontSize: 12,
                        borderRadius: 8,
                        border: "1px solid #e5e7eb",
                      }}
                      formatter={(v) => [`$${v.toLocaleString()}`, "Revenue"]}
                    />
                    <Bar dataKey="value" fill="#4f46e5" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <p className="text-sm font-semibold text-gray-700">
                  Sales During the Day
                </p>
                <div className="flex flex-wrap gap-1">
                  {["Full Day", "Morning", "Afternoon", "Evening"].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTimeFilter(t)}
                      className={`text-xs px-2 py-1 rounded-md font-medium transition-colors ${
                        timeFilter === t
                          ? "bg-indigo-600 text-white"
                          : "text-gray-500 hover:bg-gray-100"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(e) => {
                      setSelectedDate(e.target.value);
                      fetchSales(timeFilter, e.target.value);
                    }}
                    className="text-xs border rounded-md px-2 py-1 text-gray-600"
                  />
                </div>
              </div>
              {loadingSales ? (
                <div className="flex items-center justify-center h-[180px]">
                  <Loader2 size={22} className="animate-spin text-indigo-400" />
                </div>
              ) : salesData.length === 0 ? (
                <div className="flex items-center justify-center h-[180px] text-gray-400 text-sm">
                  No sales data for this period
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={salesData}>
                    <CartesianGrid stroke="#f3f4f6" strokeDasharray="3 3" />
                    <XAxis
                      dataKey="time"
                      tick={{ fontSize: 10, fill: "#9ca3af" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Line
                      type="monotone"
                      dataKey="revenue"
                      stroke="#4f46e5"
                      strokeWidth={2.5}
                      dot={false}
                      activeDot={{ r: 5, fill: "#4f46e5", strokeWidth: 0 }}
                    />
                    <Line type="monotone" dataKey="orders" stroke="transparent" />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </section>

        <section>
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Brand Management
              </h2>
              <p className="text-sm text-gray-400">
                {pagination
                  ? `${pagination.totalBrands} Verified Partners`
                  : "Loading..."}
              </p>
            </div>
            <div className="bg-[#4f46e5] text-white py-2 px-4 rounded-[8px] text-sm font-bold hover:scale-[.98] transition-all duration-200">
              <Link href={"/BazaarOwnerDashboard/Addbrand"}>Add Brand</Link>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="border-b border-gray-100">
                    {["Brand", "Owner Contact", "Products", "Orders", "Revenue"].map(
                      (h) => (
                        <th
                          key={h}
                          className="text-left text-[10px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3"
                        >
                          {h}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody>
                  {loadingMain
                    ? Array.from({ length: LIMIT }).map((_, i) => (
                        <tr key={i} className="border-b border-gray-50">
                          {Array.from({ length: 6 }).map((_, j) => (
                            <td key={j} className="px-5 py-4">
                              <Skeleton className="h-4 w-full" />
                            </td>
                          ))}
                        </tr>
                      ))
                    : brands.map((brand, i) => (
                        <tr
                          onClick={() =>
                            router.push(
                              `/BazaarOwnerDashboard/updatebrand/${brand.brandId}`
                            )
                          }
                          key={brand.brandId}
                          className={`border-b border-gray-50 transition-colors ${
                            i === 0 ? "bg-gray-50" : "hover:bg-gray-50"
                          }`}
                        >
                          <td className="px-5 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 text-xs font-bold flex-shrink-0">
                                {brand.brandName[0]}
                              </div>
                              <span className="font-medium text-gray-800 whitespace-nowrap">
                                {brand.brandName}
                              </span>
                            </div>
                          </td>
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-700">
                              {brand.ownerName}
                            </p>
                            <p className="text-xs text-gray-400">
                              {brand.ownerEmail}
                            </p>
                          </td>
                          <td className="px-5 py-4">
                            <span className="bg-indigo-50 text-indigo-600 text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap">
                              {brand.totalProducts} items
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="bg-emerald-50 text-emerald-600 text-xs font-medium px-3 py-1 rounded-full">
                              {brand.totalOrders}
                            </span>
                          </td>
                          <td className="px-5 py-4">
                            <span className="text-emerald-500 font-semibold">
                              ${brand.totalRevenue.toLocaleString()}
                            </span>
                          </td>
                        </tr>
                      ))}
                </tbody>
              </table>
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  Page {pagination.currentPage} of {pagination.totalPages}
                </p>
                <div className="flex items-center gap-1">
                  <button
                    disabled={page === 1}
                    onClick={() => setPage((p) => p - 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={14} />
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => (
                    <button
                      key={i + 1}
                      onClick={() => setPage(i + 1)}
                      className={`w-7 h-7 flex items-center justify-center rounded-md text-xs font-medium transition-colors ${
                        page === i + 1
                          ? "bg-indigo-600 text-white"
                          : "border border-gray-200 text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button
                    disabled={page === pagination.totalPages}
                    onClick={() => setPage((p) => p + 1)}
                    className="w-7 h-7 flex items-center justify-center rounded-md border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={14} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}

