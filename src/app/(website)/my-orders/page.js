
// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";

// const ORDERS_PER_PAGE = 6;

// // ── Status badge config ──────────────────────
// const STATUS_CONFIG = {
//   PENDING: {
//     label: "Pending",
//     bg: "#fff7ed",
//     color: "#ea580c",
//     border: "#fed7aa",
//     dot: "#f97316",
  
//   },
//   PREPARING: {
//     label: "Preparing",
//     bg: "#eff6ff",
//     color: "#2563eb",
//     border: "#bfdbfe",
//     dot: "#3b82f6",
   
//   },
//   READY: {
//     label: "Ready",
//     bg: "#f0fdf4",
//     color: "#16a34a",
//     border: "#bbf7d0",
//     dot: "#22c55e",
  
//   },
//   DELIVERED: {
//     label: "Delivered",
//     bg: "#f0f4ef",
//     color: "#50604A",
//     border: "#c6d4c3",
//     dot: "#50604A",

//   },
//   CANCELLED: {
//     label: "Cancelled",
//     bg: "#fef2f2",
//     color: "#dc2626",
//     border: "#fecaca",
//     dot: "#ef4444",
  
//   },
// };

// function StatusBadge({ status }) {
//   const cfg = STATUS_CONFIG[status] || {
//     label: status,
//     bg: "#f3f4f6",
//     color: "#6b7280",
//     border: "#e5e7eb",
//     dot: "#9ca3af",
//     icon: "•",
//   };
//   return (
//     <span
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: "6px",
//         background: cfg.bg,
//         color: cfg.color,
//         border: `1.5px solid ${cfg.border}`,
//         borderRadius: "999px",
//         padding: "4px 12px",
//         fontSize: "12px",
//         fontWeight: 700,
//         letterSpacing: "0.02em",
//       }}
//     >
//       <span
//         style={{
//           width: "7px",
//           height: "7px",
//           borderRadius: "50%",
//           background: cfg.dot,
//           flexShrink: 0,
//         }}
//       />
//       {cfg.label}
//     </span>
//   );
// }

// function PaymentBadge({ method }) {
//   const isVisa = method === "VISA";
//   return (
//     <span
//       style={{
//         display: "inline-flex",
//         alignItems: "center",
//         gap: "5px",
//         background: isVisa ? "#eff6ff" : "#f0fdf4",
//         color: isVisa ? "#1d4ed8" : "#15803d",
//         border: `1.5px solid ${isVisa ? "#bfdbfe" : "#bbf7d0"}`,
//         borderRadius: "999px",
//         padding: "4px 12px",
//         fontSize: "12px",
//         fontWeight: 700,
//       }}
//     >
//       {isVisa ? "💳" : "💵"} {method}
//     </span>
//   );
// }

// // ── Stat Card ────────────────────────────────
// function StatCard({ icon, label, value, sub, gradient }) {
//   return (
//     <div
//       style={{
//         background: gradient || "linear-gradient(135deg,#50604A,#7a9b71)",
//         borderRadius: "18px",
//         padding: "24px",
//         color: "#fff",
//         flex: 1,
//         minWidth: "180px",
//         position: "relative",
//         overflow: "hidden",
//         boxShadow: "0 8px 24px rgba(80,96,74,0.25)",
//       }}
//     >
//       <div
//         style={{
//           position: "absolute",
//           top: "-18px",
//           right: "-18px",
//           width: "80px",
//           height: "80px",
//           borderRadius: "50%",
//           background: "rgba(255,255,255,0.1)",
//         }}
//       />
//       <div style={{ fontSize: "30px", marginBottom: "8px" }}>{icon}</div>
//       <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "4px", lineHeight: 1 }}>
//         {value}
//       </div>
//       <div style={{ fontSize: "13px", opacity: 0.85, fontWeight: 600 }}>{label}</div>
//       {sub && <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "4px" }}>{sub}</div>}
//     </div>
//   );
// }

// // ── Pagination Controls ──────────────────────
// function PaginationControls({ currentPage, totalPages, onPageChange }) {
//   if (totalPages <= 1) return null;

//   // Build a compact list of page numbers with ellipses for large ranges
//   const getPageNumbers = () => {
//     const pages = [];
//     const maxVisible = 5;

//     if (totalPages <= maxVisible) {
//       for (let i = 1; i <= totalPages; i++) pages.push(i);
//       return pages;
//     }

//     pages.push(1);
//     if (currentPage > 3) pages.push("...");

//     const start = Math.max(2, currentPage - 1);
//     const end = Math.min(totalPages - 1, currentPage + 1);
//     for (let i = start; i <= end; i++) pages.push(i);

//     if (currentPage < totalPages - 2) pages.push("...");
//     pages.push(totalPages);

//     return pages;
//   };

//   const pageNumbers = getPageNumbers();

//   const navBtnStyle = (disabled) => ({
//     display: "flex",
//     alignItems: "center",
//     gap: "6px",
//     background: disabled ? "#f9fafb" : "#fff",
//     color: disabled ? "#d1d5db" : "#374151",
//     border: "1.5px solid #e5e7eb",
//     borderRadius: "10px",
//     padding: "9px 16px",
//     fontSize: "13px",
//     fontWeight: 600,
//     cursor: disabled ? "not-allowed" : "pointer",
//     transition: "all 0.15s",
//   });

//   return (
//     <div
//       style={{
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         gap: "8px",
//         marginTop: "28px",
//         flexWrap: "wrap",
//       }}
//     >
//       {/* Previous */}
//       <button
//         onClick={() => onPageChange(currentPage - 1)}
//         disabled={currentPage === 1}
//         style={navBtnStyle(currentPage === 1)}
//       >
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//           <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//         Previous
//       </button>

//       {/* Page numbers */}
//       <div style={{ display: "flex", gap: "4px" }}>
//         {pageNumbers.map((p, idx) =>
//           p === "..." ? (
//             <span
//               key={`ellipsis-${idx}`}
//               style={{
//                 display: "flex",
//                 alignItems: "center",
//                 justifyContent: "center",
//                 width: "36px",
//                 height: "36px",
//                 fontSize: "13px",
//                 color: "#9ca3af",
//               }}
//             >
//               …
//             </span>
//           ) : (
//             <button
//               key={p}
//               onClick={() => onPageChange(p)}
//               style={{
//                 width: "36px",
//                 height: "36px",
//                 borderRadius: "10px",
//                 border: "1.5px solid",
//                 borderColor: p === currentPage ? "#50604A" : "#e5e7eb",
//                 background: p === currentPage ? "#50604A" : "#fff",
//                 color: p === currentPage ? "#fff" : "#374151",
//                 fontSize: "13px",
//                 fontWeight: 700,
//                 cursor: "pointer",
//                 transition: "all 0.15s",
//               }}
//             >
//               {p}
//             </button>
//           )
//         )}
//       </div>

//       {/* Next */}
//       <button
//         onClick={() => onPageChange(currentPage + 1)}
//         disabled={currentPage === totalPages}
//         style={navBtnStyle(currentPage === totalPages)}
//       >
//         Next
//         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//           <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//       </button>
//     </div>
//   );
// }

// // ── Main Page ────────────────────────────────
// export default function MyOrdersPage() {
//   const router = useRouter();
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [activeTab, setActiveTab] = useState("all");
//   const [expandedOrder, setExpandedOrder] = useState(null);
//   const [currentPage, setCurrentPage] = useState(1);

//   useEffect(() => {
//     const fetchOrders = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         router.push("/auth/login");
//         return;
//       }
//       try {
//         const res = await fetch("https://bazary-backend.vercel.app/api/events/my-orders", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         const json = await res.json();
//         if (!res.ok || json.status !== "success") {
//           throw new Error(json.message || "Failed to load orders");
//         }
//         setData(json.data);
//       } catch (err) {
//         setError(err.message);
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchOrders();
//   }, [router]);

//   if (loading) {
//     return (
//       <div
//         style={{
//           minHeight: "100vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "16px",
//         }}
//       >
//         <div
//           style={{
//             width: "48px",
//             height: "48px",
//             borderRadius: "50%",
//             border: "3px solid #e5e7eb",
//             borderTopColor: "#50604A",
//             animation: "spin 0.9s linear infinite",
//           }}
//         />
//         <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading your orders…</p>
//         <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div
//         style={{
//           minHeight: "80vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "16px",
//           padding: "20px",
//         }}
//       >
//         <div style={{ fontSize: "56px" }}>😕</div>
//         <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>
//           Couldn't load orders
//         </h2>
//         <p style={{ color: "#6b7280" }}>{error}</p>
//         <button
//           onClick={() => window.location.reload()}
//           style={{
//             background: "#50604A",
//             color: "#fff",
//             border: "none",
//             borderRadius: "12px",
//             padding: "12px 28px",
//             fontWeight: 600,
//             cursor: "pointer",
//             fontSize: "15px",
//           }}
//         >
//           Try Again
//         </button>
//       </div>
//     );
//   }

//   if (!data || !data.orders || data.orders.length === 0) {
//     return (
//       <div
//         style={{
//           minHeight: "80vh",
//           display: "flex",
//           flexDirection: "column",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "16px",
//           padding: "20px",
//         }}
//       >
//         <div style={{ fontSize: "72px" }}>🛒</div>
//         <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a" }}>No orders yet</h2>
//         <p style={{ color: "#6b7280", textAlign: "center" }}>
//           Start shopping and your orders will appear here.
//         </p>
//         <button
//           onClick={() => router.push("/explore")}
//           style={{
//             background: "linear-gradient(135deg,#50604A,#7a9b71)",
//             color: "#fff",
//             border: "none",
//             borderRadius: "14px",
//             padding: "14px 36px",
//             fontWeight: 700,
//             cursor: "pointer",
//             fontSize: "16px",
//             boxShadow: "0 8px 24px rgba(80,96,74,0.3)",
//           }}
//         >
//           Explore Bazaars
//         </button>
//       </div>
//     );
//   }

//   // Filter
//   const statusTabs = ["all", "PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
//   const filteredOrders =
//     activeTab === "all"
//       ? data.orders
//       : data.orders.filter((o) => o.status === activeTab);

//   // ── Pagination math ──
//   const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
//   const safePage = Math.min(currentPage, totalPages);
//   const startIdx = (safePage - 1) * ORDERS_PER_PAGE;
//   const paginatedOrders = filteredOrders.slice(startIdx, startIdx + ORDERS_PER_PAGE);

//   const handleTabChange = (tab) => {
//     setActiveTab(tab);
//     setCurrentPage(1); // reset to page 1 whenever the filter changes
//   };

//   const handlePageChange = (page) => {
//     if (page < 1 || page > totalPages) return;
//     setCurrentPage(page);
//     setExpandedOrder(null);
//     // scroll back to the top of the list for better UX on page change
//     window.scrollTo({ top: 0, behavior: "smooth" });
//   };

//   const formatDate = (iso) => {
//     const d = new Date(iso);
//     return d.toLocaleDateString("en-EG", {
//       year: "numeric",
//       month: "short",
//       day: "numeric",
//       hour: "2-digit",
//       minute: "2-digit",
//     });
//   };

//   return (
//     <div
//       style={{
//         maxWidth: "1100px",
//         margin: "0 auto",
//         padding: "80px 20px 60px",
//         minHeight: "100vh",
//       }}
//     >
//       {/* ── Header ── */}
//       <div style={{ marginBottom: "32px" }}>
//         <h1
//           style={{
//             fontSize: "32px",
//             fontWeight: 800,
//             color: "#1a1a1a",
//             marginBottom: "6px",
//           }}
//         >
//           My Orders
//         </h1>
//         <p style={{ color: "#6b7280", fontSize: "15px" }}>
//           Track all your purchases across bazaars
//         </p>
//       </div>

//       {/* ── Stats ── */}
//       <div
//         style={{
//           display: "flex",
//           gap: "16px",
//           flexWrap: "wrap",
//           marginBottom: "32px",
//         }}
//       >
//         <StatCard
//           icon="🛍️"
//           label="Total Orders"
//           value={data.totalOrders}
//           gradient="linear-gradient(135deg,#50604A,#7a9b71)"
//         />
//         <StatCard
//           icon="💰"
//           label="Total Spent"
//           value={`${data.totalSpent?.toLocaleString()} EGP`}
//           gradient="linear-gradient(135deg,#9A5F4C,#c48866)"
//         />
//         <StatCard
//           icon="🏪"
//           label="Brands Ordered From"
//           value={data.byBrand?.length || 0}
//           gradient="linear-gradient(135deg,#2563eb,#60a5fa)"
//         />
//         <StatCard
//           icon="🎪"
//           label="Bazaars Visited"
//           value={data.byBazaar?.length || 0}
//           gradient="linear-gradient(135deg,#7c3aed,#a78bfa)"
//         />
//       </div>

//       {/* ── Tab Filter ── */}
//       <div
//         style={{
//           display: "flex",
//           gap: "8px",
//           flexWrap: "wrap",
//           marginBottom: "24px",
//           background: "#f9fafb",
//           padding: "6px",
//           borderRadius: "14px",
//           border: "1px solid #f3f4f6",
//         }}
//       >
//         {statusTabs.map((tab) => {
//           const count =
//             tab === "all"
//               ? data.orders.length
//               : data.orders.filter((o) => o.status === tab).length;
//           const isActive = activeTab === tab;
//           return (
//             <button
//               key={tab}
//               onClick={() => handleTabChange(tab)}
//               style={{
//                 background: isActive ? "#50604A" : "transparent",
//                 color: isActive ? "#fff" : "#6b7280",
//                 border: "none",
//                 borderRadius: "10px",
//                 padding: "8px 16px",
//                 fontSize: "13px",
//                 fontWeight: isActive ? 700 : 500,
//                 cursor: "pointer",
//                 transition: "all 0.2s",
//                 display: "flex",
//                 alignItems: "center",
//                 gap: "6px",
//               }}
//             >
//               {tab === "all" ? "All" : (  STATUS_CONFIG[tab]?.label)}
//               {count > 0 && (
//                 <span
//                   style={{
//                     background: isActive ? "rgba(255,255,255,0.2)" : "#e5e7eb",
//                     color: isActive ? "#fff" : "#374151",
//                     borderRadius: "999px",
//                     padding: "1px 7px",
//                     fontSize: "11px",
//                     fontWeight: 700,
//                   }}
//                 >
//                   {count}
//                 </span>
//               )}
//             </button>
//           );
//         })}
//       </div>

//       {/* ── Results count ── */}
//       <div style={{ marginBottom: "16px", fontSize: "13px", color: "#9ca3af" }}>
//         Showing {filteredOrders.length === 0 ? 0 : startIdx + 1}–
//         {Math.min(startIdx + ORDERS_PER_PAGE, filteredOrders.length)} of{" "}
//         {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
//       </div>

//       {/* ── Orders List ── */}
//       <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
//         {paginatedOrders.length === 0 ? (
//           <div
//             style={{
//               textAlign: "center",
//               padding: "60px 20px",
//               color: "#9ca3af",
//               background: "#fff",
//               borderRadius: "20px",
//               border: "1px dashed #e5e7eb",
//             }}
//           >
//             <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
//             <p style={{ fontSize: "15px" }}>No orders in this category</p>
//           </div>
//         ) : (
//           paginatedOrders.map((order) => {
//             const isExpanded = expandedOrder === order.orderId;
//             const cfg = STATUS_CONFIG[order.status] || {};
//             return (
//               <div
//                 key={order.orderId}
//                 style={{
//                   background: "#fff",
//                   borderRadius: "20px",
//                   boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
//                   border: "1px solid #f3f4f6",
//                   overflow: "hidden",
//                   transition: "box-shadow 0.2s",
//                 }}
//               >
//                 {/* Order Header */}
//                 <div
//                   style={{
//                     padding: "20px 24px",
//                     display: "flex",
//                     alignItems: "center",
//                     gap: "16px",
//                     flexWrap: "wrap",
//                     cursor: "pointer",
//                     userSelect: "none",
//                   }}
//                   onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
//                 >
//                   {/* Brand logo / placeholder */}
//                   <div
//                     style={{
//                       width: "52px",
//                       height: "52px",
//                       borderRadius: "14px",
//                       background: "#f3f4f6",
//                       overflow: "hidden",
//                       flexShrink: 0,
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     {order.brandLogoUrl ? (
//                       <img
//                         src={order.brandLogoUrl}
//                         alt={order.brandName}
//                         style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                       />
//                     ) : (
//                       <span style={{ fontSize: "22px" }}>🏷️</span>
//                     )}
//                   </div>

//                   {/* Info */}
//                   <div style={{ flex: 1 }}>
//                     <div
//                       style={{
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "10px",
//                         flexWrap: "wrap",
//                         marginBottom: "6px",
//                       }}
//                     >
//                       <span style={{ fontWeight: 700, fontSize: "16px", color: "#1a1a1a" }}>
//                         {order.brandName}
//                       </span>
//                       <StatusBadge status={order.status} />
//                       <PaymentBadge method={order.paymentMethod} />
//                     </div>
//                     <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
//                       <span style={{ fontSize: "12px", color: "#9ca3af" }}>
//                         🎪 {order.bazaarName}
//                       </span>
//                       <span style={{ fontSize: "12px", color: "#9ca3af" }}>
//                         🕐 {formatDate(order.createdAt)}
//                       </span>
//                       <span style={{ fontSize: "12px", color: "#9ca3af" }}>
//                         🛍️ {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
//                       </span>
//                     </div>
//                   </div>

//                   {/* Total + chevron */}
//                   <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
//                     <div style={{ textAlign: "right" }}>
//                       <div style={{ fontSize: "20px", fontWeight: 800, color: "#50604A" }}>
//                         {order.totalAmount?.toLocaleString()} EGP
//                       </div>
//                     </div>
//                     <div
//                       style={{
//                         width: "32px",
//                         height: "32px",
//                         borderRadius: "8px",
//                         background: "#f3f4f6",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         transition: "transform 0.2s",
//                         transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
//                         flexShrink: 0,
//                       }}
//                     >
//                       <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                         <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                       </svg>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Expanded Items */}
//                 {isExpanded && (
//                   <div
//                     style={{
//                       borderTop: "1px solid #f3f4f6",
//                       padding: "20px 24px",
//                       background: "#fafafa",
//                     }}
//                   >
//                     <h4
//                       style={{
//                         fontSize: "13px",
//                         fontWeight: 700,
//                         color: "#6b7280",
//                         textTransform: "uppercase",
//                         letterSpacing: "0.06em",
//                         marginBottom: "16px",
//                       }}
//                     >
//                       Order Items
//                     </h4>
//                     <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//                       {order.items?.map((item, idx) => (
//                         <div
//                           key={idx}
//                           style={{
//                             display: "flex",
//                             alignItems: "center",
//                             gap: "14px",
//                             background: "#fff",
//                             borderRadius: "14px",
//                             padding: "14px",
//                             border: "1px solid #f3f4f6",
//                           }}
//                         >
//                           {/* Product image */}
//                           <div
//                             style={{
//                               width: "56px",
//                               height: "56px",
//                               borderRadius: "10px",
//                               background: "#f3f4f6",
//                               overflow: "hidden",
//                               flexShrink: 0,
//                               display: "flex",
//                               alignItems: "center",
//                               justifyContent: "center",
//                             }}
//                           >
//                             {item.images?.[0] ? (
//                               <img
//                                 src={item.images[0]}
//                                 alt={item.name}
//                                 style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                               />
//                             ) : (
//                               <span style={{ fontSize: "20px" }}>📦</span>
//                             )}
//                           </div>

//                           <div style={{ flex: 1 }}>
//                             <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "14px" }}>
//                               {item.name}
//                             </div>
//                             <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "3px" }}>
//                               {item.price} EGP × {item.quantity}
//                             </div>
//                           </div>

//                           <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "15px" }}>
//                             {(item.price * item.quantity).toLocaleString()} EGP
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     {/* Order ID */}
//                     <div
//                       style={{
//                         marginTop: "16px",
//                         display: "flex",
//                         alignItems: "center",
//                         gap: "8px",
//                       }}
//                     >
//                       <span style={{ fontSize: "12px", color: "#9ca3af" }}>Order ID:</span>
//                       <code
//                         style={{
//                           fontSize: "11px",
//                           background: "#f3f4f6",
//                           color: "#374151",
//                           padding: "3px 8px",
//                           borderRadius: "6px",
//                           fontFamily: "monospace",
//                         }}
//                       >
//                         {order.orderId}
//                       </code>
//                     </div>
//                   </div>
//                 )}
//               </div>
//             );
//           })
//         )}
//       </div>

//       {/* ── Pagination Controls ── */}
//       <PaginationControls
//         currentPage={safePage}
//         totalPages={totalPages}
//         onPageChange={handlePageChange}
//       />

//       {/* ── Brand Breakdown ── */}
//       {data.byBrand && data.byBrand.length > 0 && (
//         <div
//           style={{
//             marginTop: "40px",
//             background: "#fff",
//             borderRadius: "20px",
//             boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
//             border: "1px solid #f3f4f6",
//             padding: "28px",
//           }}
//         >
//           <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
//             Spending by Brand
//           </h3>
//           <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
//             {data.byBrand.map((brand) => {
//               const pct = Math.round((brand.totalSpent / data.totalSpent) * 100);
//               return (
//                 <div key={brand.brandId}>
//                   <div
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "12px",
//                       marginBottom: "6px",
//                     }}
//                   >
//                     <div
//                       style={{
//                         width: "36px",
//                         height: "36px",
//                         borderRadius: "10px",
//                         background: "#f3f4f6",
//                         overflow: "hidden",
//                         flexShrink: 0,
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                       }}
//                     >
//                       {brand.logoUrl ? (
//                         <img
//                           src={brand.logoUrl}
//                           alt={brand.brandName}
//                           style={{ width: "100%", height: "100%", objectFit: "cover" }}
//                         />
//                       ) : (
//                         <span style={{ fontSize: "16px" }}>🏷️</span>
//                       )}
//                     </div>
//                     <div style={{ flex: 1 }}>
//                       <div
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           marginBottom: "2px",
//                         }}
//                       >
//                         <span style={{ fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
//                           {brand.brandName}
//                         </span>
//                         <span style={{ fontWeight: 700, fontSize: "14px", color: "#50604A" }}>
//                           {brand.totalSpent?.toLocaleString()} EGP
//                         </span>
//                       </div>
//                       <div style={{ fontSize: "11px", color: "#9ca3af" }}>
//                         {brand.ordersCount} order{brand.ordersCount !== 1 ? "s" : ""}
//                       </div>
//                     </div>
//                     <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "32px", textAlign: "right" }}>
//                       {pct}%
//                     </span>
//                   </div>
//                   <div
//                     style={{
//                       height: "6px",
//                       background: "#f3f4f6",
//                       borderRadius: "999px",
//                       overflow: "hidden",
//                     }}
//                   >
//                     <div
//                       style={{
//                         height: "100%",
//                         width: `${pct}%`,
//                         background: "linear-gradient(90deg,#50604A,#7a9b71)",
//                         borderRadius: "999px",
//                         transition: "width 0.6s ease",
//                       }}
//                     />
//                   </div>
//                 </div>
//               );
//             })}
//           </div>
//         </div>
//       )}

//       <style>{`
//         @keyframes spin { to { transform: rotate(360deg); } }
//       `}</style>
//     </div>
//   );
// }
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const ORDERS_PER_PAGE = 6;

// ── Status badge config ──────────────────────
const STATUS_CONFIG = {
  PENDING: {
    label: "Pending",
    bg: "#fff7ed",
    color: "#ea580c",
    border: "#fed7aa",
    dot: "#f97316",
  
  },
  PREPARING: {
    label: "Preparing",
    bg: "#eff6ff",
    color: "#2563eb",
    border: "#bfdbfe",
    dot: "#3b82f6",
   
  },
  READY: {
    label: "Ready",
    bg: "#f0fdf4",
    color: "#16a34a",
    border: "#bbf7d0",
    dot: "#22c55e",
  
  },
  DELIVERED: {
    label: "Delivered",
    bg: "#f0f4ef",
    color: "#50604A",
    border: "#c6d4c3",
    dot: "#50604A",

  },
  CANCELLED: {
    label: "Cancelled",
    bg: "#fef2f2",
    color: "#dc2626",
    border: "#fecaca",
    dot: "#ef4444",
  
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    bg: "#f3f4f6",
    color: "#6b7280",
    border: "#e5e7eb",
    dot: "#9ca3af",
    icon: "•",
  };
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: cfg.bg,
        color: cfg.color,
        border: `1.5px solid ${cfg.border}`,
        borderRadius: "999px",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: 700,
        letterSpacing: "0.02em",
      }}
    >
      <span
        style={{
          width: "7px",
          height: "7px",
          borderRadius: "50%",
          background: cfg.dot,
          flexShrink: 0,
        }}
      />
      {cfg.label}
    </span>
  );
}

function PaymentBadge({ method }) {
  const isVisa = method === "VISA";
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "5px",
        background: isVisa ? "#eff6ff" : "#f0fdf4",
        color: isVisa ? "#1d4ed8" : "#15803d",
        border: `1.5px solid ${isVisa ? "#bfdbfe" : "#bbf7d0"}`,
        borderRadius: "999px",
        padding: "4px 12px",
        fontSize: "12px",
        fontWeight: 700,
      }}
    >
      {isVisa ? "💳" : "💵"} {method}
    </span>
  );
}

// ── Stat Card ────────────────────────────────
function StatCard({ icon, label, value, sub, gradient }) {
  return (
    <div
      style={{
        background: gradient || "linear-gradient(135deg,#50604A,#7a9b71)",
        borderRadius: "18px",
        padding: "24px",
        color: "#fff",
        flex: 1,
        minWidth: "180px",
        position: "relative",
        overflow: "hidden",
        boxShadow: "0 8px 24px rgba(80,96,74,0.25)",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: "-18px",
          right: "-18px",
          width: "80px",
          height: "80px",
          borderRadius: "50%",
          background: "rgba(255,255,255,0.1)",
        }}
      />
      <div style={{ fontSize: "30px", marginBottom: "8px" }}>{icon}</div>
      <div style={{ fontSize: "28px", fontWeight: 800, marginBottom: "4px", lineHeight: 1 }}>
        {value}
      </div>
      <div style={{ fontSize: "13px", opacity: 0.85, fontWeight: 600 }}>{label}</div>
      {sub && <div style={{ fontSize: "11px", opacity: 0.7, marginTop: "4px" }}>{sub}</div>}
    </div>
  );
}

// ── Pagination Controls ──────────────────────
function PaginationControls({ currentPage, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 3) pages.push("...");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);
    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 2) pages.push("...");
    pages.push(totalPages);

    return pages;
  };

  const pageNumbers = getPageNumbers();

  const navBtnStyle = (disabled) => ({
    display: "flex",
    alignItems: "center",
    gap: "6px",
    background: disabled ? "#f9fafb" : "#fff",
    color: disabled ? "#d1d5db" : "#374151",
    border: "1.5px solid #e5e7eb",
    borderRadius: "10px",
    padding: "9px 16px",
    fontSize: "13px",
    fontWeight: 600,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "all 0.15s",
  });

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        marginTop: "28px",
        flexWrap: "wrap",
      }}
    >
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        style={navBtnStyle(currentPage === 1)}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Previous
      </button>

      <div style={{ display: "flex", gap: "4px" }}>
        {pageNumbers.map((p, idx) =>
          p === "..." ? (
            <span
              key={`ellipsis-${idx}`}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "36px",
                fontSize: "13px",
                color: "#9ca3af",
              }}
            >
              …
            </span>
          ) : (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "10px",
                border: "1.5px solid",
                borderColor: p === currentPage ? "#50604A" : "#e5e7eb",
                background: p === currentPage ? "#50604A" : "#fff",
                color: p === currentPage ? "#fff" : "#374151",
                fontSize: "13px",
                fontWeight: 700,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {p}
            </button>
          )
        )}
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        style={navBtnStyle(currentPage === totalPages)}
      >
        Next
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  );
}

// ── Login Required View ──────────────────────
function LoginRequired({ router }) {
  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "16px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: "64px" }}>🔒</div>
      <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>
        Log in to see your orders
      </h2>
      <p style={{ color: "#6b7280", maxWidth: "320px" }}>
        Sign in to your account to track your orders and view your order history.
      </p>
      <button
        onClick={() => router.push("/auth/login")}
        style={{
          background: "linear-gradient(135deg,#50604A,#7a9b71)",
          color: "#fff",
          border: "none",
          borderRadius: "14px",
          padding: "14px 36px",
          fontWeight: 700,
          cursor: "pointer",
          fontSize: "16px",
          boxShadow: "0 8px 24px rgba(80,96,74,0.3)",
        }}
      >
        Login
      </button>
    </div>
  );
}

// ── Main Page ────────────────────────────────
export default function MyOrdersPage() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [needsLogin, setNeedsLogin] = useState(false);
  const [activeTab, setActiveTab] = useState("all");
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchOrders = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setNeedsLogin(true);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("https://bazary-backend.vercel.app/api/events/my-orders", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Invalid / expired token
        if (res.status === 401 || res.status === 403) {
          setNeedsLogin(true);
          setLoading(false);
          return;
        }

        const json = await res.json();
        if (!res.ok || json.status !== "success") {
          throw new Error(json.message || "Failed to load orders");
        }
        setData(json.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
        }}
      >
        <div
          style={{
            width: "48px",
            height: "48px",
            borderRadius: "50%",
            border: "3px solid #e5e7eb",
            borderTopColor: "#50604A",
            animation: "spin 0.9s linear infinite",
          }}
        />
        <p style={{ color: "#6b7280", fontSize: "14px" }}>Loading your orders…</p>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (needsLogin) {
    return <LoginRequired router={router} />;
  }

  if (error) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "56px" }}>😕</div>
        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#1a1a1a" }}>
          Couldn't load orders
        </h2>
        <p style={{ color: "#6b7280" }}>{error}</p>
        <button
          onClick={() => window.location.reload()}
          style={{
            background: "#50604A",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "12px 28px",
            fontWeight: 600,
            cursor: "pointer",
            fontSize: "15px",
          }}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (!data || !data.orders || data.orders.length === 0) {
    return (
      <div
        style={{
          minHeight: "80vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: "16px",
          padding: "20px",
        }}
      >
        <div style={{ fontSize: "72px" }}>🛒</div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1a1a1a" }}>No orders yet</h2>
        <p style={{ color: "#6b7280", textAlign: "center" }}>
          Start shopping and your orders will appear here.
        </p>
        <button
          onClick={() => router.push("/explore")}
          style={{
            background: "linear-gradient(135deg,#50604A,#7a9b71)",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 36px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "16px",
            boxShadow: "0 8px 24px rgba(80,96,74,0.3)",
          }}
        >
          Explore Bazaars
        </button>
      </div>
    );
  }

  // Filter
  const statusTabs = ["all", "PENDING", "PREPARING", "READY", "DELIVERED", "CANCELLED"];
  const filteredOrders =
    activeTab === "all"
      ? data.orders
      : data.orders.filter((o) => o.status === activeTab);

  // ── Pagination math ──
  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / ORDERS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const startIdx = (safePage - 1) * ORDERS_PER_PAGE;
  const paginatedOrders = filteredOrders.slice(startIdx, startIdx + ORDERS_PER_PAGE);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1); // reset to page 1 whenever the filter changes
  };

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    setExpandedOrder(null);
    // scroll back to the top of the list for better UX on page change
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const formatDate = (iso) => {
    const d = new Date(iso);
    return d.toLocaleDateString("en-EG", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div
      style={{
        maxWidth: "1100px",
        margin: "20px auto",
        padding: "80px 20px 60px",
        minHeight: "100vh",
      }}
    >
      {/* ── Header ── */}
      <div style={{ marginBottom: "32px" }}>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: "6px",
          }}
        >
          My Orders
        </h1>
        <p style={{ color: "#6b7280", fontSize: "15px" }}>
          Track all your purchases across bazaars
        </p>
      </div>

      {/* ── Stats ── */}
      <div
        style={{
          display: "flex",
          gap: "16px",
          flexWrap: "wrap",
          marginBottom: "32px",
        }}
      >
        <StatCard
          icon="🛍️"
          label="Total Orders"
          value={data.totalOrders}
          gradient="linear-gradient(135deg,#50604A,#7a9b71)"
        />
        <StatCard
          icon="💰"
          label="Total Spent"
          value={`${data.totalSpent?.toLocaleString()} EGP`}
          gradient="linear-gradient(135deg,#9A5F4C,#c48866)"
        />
        <StatCard
          icon="🏪"
          label="Brands Ordered From"
          value={data.byBrand?.length || 0}
          gradient="linear-gradient(135deg,#2563eb,#60a5fa)"
        />
        <StatCard
          icon="🎪"
          label="Bazaars Visited"
          value={data.byBazaar?.length || 0}
          gradient="linear-gradient(135deg,#7c3aed,#a78bfa)"
        />
      </div>

      {/* ── Tab Filter ── */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          flexWrap: "wrap",
          marginBottom: "24px",
          background: "#f9fafb",
          padding: "6px",
          borderRadius: "14px",
          border: "1px solid #f3f4f6",
        }}
      >
        {statusTabs.map((tab) => {
          const count =
            tab === "all"
              ? data.orders.length
              : data.orders.filter((o) => o.status === tab).length;
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              onClick={() => handleTabChange(tab)}
              style={{
                background: isActive ? "#50604A" : "transparent",
                color: isActive ? "#fff" : "#6b7280",
                border: "none",
                borderRadius: "10px",
                padding: "8px 16px",
                fontSize: "13px",
                fontWeight: isActive ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.2s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {tab === "all" ? "All" : (  STATUS_CONFIG[tab]?.label)}
              {count > 0 && (
                <span
                  style={{
                    background: isActive ? "rgba(255,255,255,0.2)" : "#e5e7eb",
                    color: isActive ? "#fff" : "#374151",
                    borderRadius: "999px",
                    padding: "1px 7px",
                    fontSize: "11px",
                    fontWeight: 700,
                  }}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* ── Results count ── */}
      <div style={{ marginBottom: "16px", fontSize: "13px", color: "#9ca3af" }}>
        Showing {filteredOrders.length === 0 ? 0 : startIdx + 1}–
        {Math.min(startIdx + ORDERS_PER_PAGE, filteredOrders.length)} of{" "}
        {filteredOrders.length} order{filteredOrders.length !== 1 ? "s" : ""}
      </div>

      {/* ── Orders List ── */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {paginatedOrders.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#9ca3af",
              background: "#fff",
              borderRadius: "20px",
              border: "1px dashed #e5e7eb",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "12px" }}>📭</div>
            <p style={{ fontSize: "15px" }}>No orders in this category</p>
          </div>
        ) : (
          paginatedOrders.map((order) => {
            const isExpanded = expandedOrder === order.orderId;
            const cfg = STATUS_CONFIG[order.status] || {};
            return (
              <div
                key={order.orderId}
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
                  border: "1px solid #f3f4f6",
                  overflow: "hidden",
                  transition: "box-shadow 0.2s",
                }}
              >
                {/* Order Header */}
                <div
                  style={{
                    padding: "20px 24px",
                    display: "flex",
                    alignItems: "center",
                    gap: "16px",
                    flexWrap: "wrap",
                    cursor: "pointer",
                    userSelect: "none",
                  }}
                  onClick={() => setExpandedOrder(isExpanded ? null : order.orderId)}
                >
                  {/* Brand logo / placeholder */}
                  <div
                    style={{
                      width: "52px",
                      height: "52px",
                      borderRadius: "14px",
                      background: "#f3f4f6",
                      overflow: "hidden",
                      flexShrink: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    {order.brandLogoUrl ? (
                      <img
                        src={order.brandLogoUrl}
                        alt={order.brandName}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      />
                    ) : (
                      <span style={{ fontSize: "22px" }}>🏷️</span>
                    )}
                  </div>

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        flexWrap: "wrap",
                        marginBottom: "6px",
                      }}
                    >
                      <span style={{ fontWeight: 700, fontSize: "16px", color: "#1a1a1a" }}>
                        {order.brandName}
                      </span>
                      <StatusBadge status={order.status} />
                      <PaymentBadge method={order.paymentMethod} />
                    </div>
                    <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        🎪 {order.bazaarName}
                      </span>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        🕐 {formatDate(order.createdAt)}
                      </span>
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>
                        🛍️ {order.items?.length || 0} item{order.items?.length !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>

                  {/* Total + chevron */}
                  <div style={{ display: "flex", alignItems: "center", gap: "16px", flexShrink: 0 }}>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: "20px", fontWeight: 800, color: "#50604A" }}>
                        {order.totalAmount?.toLocaleString()} EGP
                      </div>
                    </div>
                    <div
                      style={{
                        width: "32px",
                        height: "32px",
                        borderRadius: "8px",
                        background: "#f3f4f6",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "transform 0.2s",
                        transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                        flexShrink: 0,
                      }}
                    >
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M6 9l6 6 6-6" stroke="#6b7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Expanded Items */}
                {isExpanded && (
                  <div
                    style={{
                      borderTop: "1px solid #f3f4f6",
                      padding: "20px 24px",
                      background: "#fafafa",
                    }}
                  >
                    <h4
                      style={{
                        fontSize: "13px",
                        fontWeight: 700,
                        color: "#6b7280",
                        textTransform: "uppercase",
                        letterSpacing: "0.06em",
                        marginBottom: "16px",
                      }}
                    >
                      Order Items
                    </h4>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "14px",
                            background: "#fff",
                            borderRadius: "14px",
                            padding: "14px",
                            border: "1px solid #f3f4f6",
                          }}
                        >
                          {/* Product image */}
                          <div
                            style={{
                              width: "56px",
                              height: "56px",
                              borderRadius: "10px",
                              background: "#f3f4f6",
                              overflow: "hidden",
                              flexShrink: 0,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            {item.images?.[0] ? (
                              <img
                                src={item.images[0]}
                                alt={item.name}
                                style={{ width: "100%", height: "100%", objectFit: "cover" }}
                              />
                            ) : (
                              <span style={{ fontSize: "20px" }}>📦</span>
                            )}
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 600, color: "#1a1a1a", fontSize: "14px" }}>
                              {item.name}
                            </div>
                            <div style={{ fontSize: "12px", color: "#9ca3af", marginTop: "3px" }}>
                              {item.price} EGP × {item.quantity}
                            </div>
                          </div>

                          <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "15px" }}>
                            {(item.price * item.quantity).toLocaleString()} EGP
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order ID */}
                    <div
                      style={{
                        marginTop: "16px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                      }}
                    >
                      <span style={{ fontSize: "12px", color: "#9ca3af" }}>Order ID:</span>
                      <code
                        style={{
                          fontSize: "11px",
                          background: "#f3f4f6",
                          color: "#374151",
                          padding: "3px 8px",
                          borderRadius: "6px",
                          fontFamily: "monospace",
                        }}
                      >
                        {order.orderId}
                      </code>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* ── Pagination Controls ── */}
      <PaginationControls
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* ── Brand Breakdown ── */}
      {data.byBrand && data.byBrand.length > 0 && (
        <div
          style={{
            marginTop: "40px",
            background: "#fff",
            borderRadius: "20px",
            boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
            border: "1px solid #f3f4f6",
            padding: "28px",
          }}
        >
          <h3 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
            Spending by Brand
          </h3>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {data.byBrand.map((brand) => {
              const pct = Math.round((brand.totalSpent / data.totalSpent) * 100);
              return (
                <div key={brand.brandId}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "12px",
                      marginBottom: "6px",
                    }}
                  >
                    <div
                      style={{
                        width: "36px",
                        height: "36px",
                        borderRadius: "10px",
                        background: "#f3f4f6",
                        overflow: "hidden",
                        flexShrink: 0,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      {brand.logoUrl ? (
                        <img
                          src={brand.logoUrl}
                          alt={brand.brandName}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      ) : (
                        <span style={{ fontSize: "16px" }}>🏷️</span>
                      )}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          marginBottom: "2px",
                        }}
                      >
                        <span style={{ fontWeight: 600, fontSize: "14px", color: "#1a1a1a" }}>
                          {brand.brandName}
                        </span>
                        <span style={{ fontWeight: 700, fontSize: "14px", color: "#50604A" }}>
                          {brand.totalSpent?.toLocaleString()} EGP
                        </span>
                      </div>
                      <div style={{ fontSize: "11px", color: "#9ca3af" }}>
                        {brand.ordersCount} order{brand.ordersCount !== 1 ? "s" : ""}
                      </div>
                    </div>
                    <span style={{ fontSize: "12px", color: "#6b7280", minWidth: "32px", textAlign: "right" }}>
                      {pct}%
                    </span>
                  </div>
                  <div
                    style={{
                      height: "6px",
                      background: "#f3f4f6",
                      borderRadius: "999px",
                      overflow: "hidden",
                    }}
                  >
                    <div
                      style={{
                        height: "100%",
                        width: `${pct}%`,
                        background: "linear-gradient(90deg,#50604A,#7a9b71)",
                        borderRadius: "999px",
                        transition: "width 0.6s ease",
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}