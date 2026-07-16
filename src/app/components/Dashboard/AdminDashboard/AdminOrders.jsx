"use client";

import { useState, useEffect, useCallback } from "react";
import { getAdminOrders, getAdminOneOrder } from "@/app/services/adminService";

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [detailOrder, setDetailOrder] = useState(null);
  const [error, setError] = useState(null);

  const fetchOrdersList = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminOrders({ page, limit: 10 });
      setOrders(res.orders || []);
      setTotal(res.total || 0);
    } catch {
      setError("Failed to fetch orders list.");
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchOrdersList();
  }, [fetchOrdersList]);

  // Client side search
  const filteredOrders = orders.filter((o) =>
    o._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.customerId?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.brandId?.brandName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDetailClick = async (orderId) => {
    try {
      setError(null);
      const details = await getAdminOneOrder(orderId);
      setDetailOrder(details);
    } catch {
      setError("Failed to load order details.");
    }
  };

  const handlePrintOrder = (order) => {
    if (!order) return;
    const itemsRows = (order.items || [])
      .map(
        (item) => `
          <tr>
            <td>${item.name || "Item"}</td>
            <td style="text-align:center;">${item.quantity}</td>
            <td style="text-align:right;">${item.price} EGP</td>
            <td style="text-align:right;">${(item.quantity * item.price).toLocaleString()} EGP</td>
          </tr>`
      )
      .join("");

    const html = `
      <html>
        <head>
          <title>Order #${order._id}</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 32px; color: #1f2937; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            p.sub { color: #6b7280; font-size: 12px; margin-top: 0; margin-bottom: 24px; }
            table { width: 100%; border-collapse: collapse; margin-top: 12px; }
            th, td { padding: 8px 10px; font-size: 12px; border-bottom: 1px solid #e5e7eb; text-align: left; }
            th { background: #f9fafb; text-transform: uppercase; font-size: 10px; color: #6b7280; }
            .meta { display: flex; flex-wrap: wrap; gap: 16px; margin-bottom: 20px; }
            .meta div { font-size: 12px; }
            .meta span { display: block; font-size: 9px; text-transform: uppercase; color: #9ca3af; margin-bottom: 2px; }
            .total-row td { font-weight: bold; border-top: 2px solid #1f2937; border-bottom: none; }
          </style>
        </head>
        <body>
          <h1>Order Receipt</h1>
          <p class="sub">Order #${order._id}</p>

          <div class="meta">
            <div><span>Date</span>${new Date(order.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}</div>
            <div><span>Status</span>${(order.status || "PENDING").toUpperCase()}</div>
            <div><span>Payment</span>${order.paymentMethod || "Credit Card"}</div>
            <div><span>Customer</span>${order.customerId?.fullName || order.customerId || "Platform Customer"}</div>
            <div><span>Brand</span>${order.brandId?.brandName || order.brandId || "N/A"}</div>
            <div><span>Bazaar</span>${order.bazaarId?.bazaarName || order.bazaarId || "N/A"}</div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th style="text-align:center;">Qty</th>
                <th style="text-align:right;">Price</th>
                <th style="text-align:right;">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${itemsRows || `<tr><td colspan="4" style="text-align:center;color:#9ca3af;">No products listed in order</td></tr>`}
              <tr class="total-row">
                <td colspan="3">Total Amount</td>
                <td style="text-align:right;">${order.totalAmount?.toLocaleString()} EGP</td>
              </tr>
            </tbody>
          </table>
        </body>
      </html>`;

    const printWindow = window.open("", "_blank", "width=800,height=900");
    if (!printWindow) return;
    printWindow.document.write(html);
    printWindow.document.close();
    printWindow.focus();
    printWindow.onload = () => {
      printWindow.print();
    };
  };

  const totalPages = Math.ceil(total / 10);

  return (
    <div className="flex flex-col gap-6">
      {/* Error alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium">
          {error}
        </div>
      )}

      {/* Header controls */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold text-gray-800">Orders Log</h2>
          <p className="text-xs text-gray-400">
            View transaction logs, order fulfillment states, and customer payments platform-wide.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col items-end px-4 py-2 rounded-lg bg-indigo-50 border border-indigo-100">
            <span className="text-[9px] text-indigo-400 font-bold uppercase tracking-wider">Total Orders</span>
            <span className="text-sm font-bold text-indigo-700">{total}</span>
          </div>

          <div className="relative w-full sm:w-64">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </span>
          <input
            type="text"
            placeholder="Search by order ID or brand..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-100 rounded-lg text-xs focus:outline-none focus:border-indigo-400 bg-white text-gray-700 placeholder-gray-400"
          />
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-100 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div
              className="w-6 h-6 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#4f46e5", borderTopColor: "transparent" }}
            />
            <p className="text-xs text-gray-400">Loading order history...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-20">
            <span className="mx-auto text-gray-300 mb-3 block w-8 h-8">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="9" cy="21" r="1" />
                <circle cx="20" cy="21" r="1" />
                <path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 001.95-1.57L23 6H6" />
              </svg>
            </span>
            <p className="text-xs font-semibold text-gray-700">No Orders Placed</p>
            <p className="text-[10px] text-gray-400 mt-1">Transaction entries will appear here once checked out.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 border-b border-gray-100 text-[10px] text-gray-400 font-semibold uppercase tracking-widest">
                <tr>
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Customer</th>
                  <th className="px-6 py-3.5">Brand Source</th>
                  <th className="px-6 py-3.5 text-right">Total Amount</th>
                  <th className="px-6 py-3.5 text-center">Fulfillment</th>
                  <th className="px-6 py-3.5">Date</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs">
                {filteredOrders.map((o) => (
                  <tr key={o._id} className="hover:bg-gray-50/40 transition-colors">
                    {/* Order ID */}
                    <td className="px-6 py-4 font-mono font-semibold text-gray-700">
                      #{o._id ? o._id.substring(o._id.length - 8) : "—"}
                    </td>

                    {/* Customer */}
                    <td className="px-6 py-4 text-stone-755">
                      {o.customerId?.fullName || o.customerId || "Anonymous Customer"}
                    </td>

                    {/* Brand Source */}
                    <td className="px-6 py-4 text-gray-700 font-medium">
                      {o.brandId?.brandName || "Platform Brand"}
                    </td>

                    {/* Total Amount */}
                    <td className="px-6 py-4 text-right font-bold text-indigo-600">
                      {o.totalAmount?.toLocaleString()} EGP
                    </td>

                    {/* Status Badge */}
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border uppercase ${
                          o.status === "DELIVERED"
                            ? "bg-green-100 border-green-200 text-green-700"
                            : o.status === "PENDING"
                            ? "bg-orange-100 border-orange-200 text-orange-700"
                            : o.status === "CANCELLED"
                            ? "bg-red-100 border-red-200 text-red-700"
                            : "bg-blue-105 border-blue-200 text-blue-700"
                        }`}
                      >
                        {o.status || "PENDING"}
                      </span>
                    </td>

                    {/* Date */}
                    <td className="px-6 py-4 text-gray-600">
                      <span className="flex items-center gap-1.5 text-[11px]">
                        <span className="text-gray-400">
                          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                            <line x1="16" y1="2" x2="16" y2="6" />
                            <line x1="8" y1="2" x2="8" y2="6" />
                            <line x1="3" y1="10" x2="21" y2="10" />
                          </svg>
                        </span>
                        {new Date(o.createdAt).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </span>
                    </td>

                    {/* Actions button */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDetailClick(o._id)}
                        className="w-7 h-7 flex items-center justify-center rounded bg-gray-50 border border-gray-100 text-gray-500 hover:bg-gray-100 transition-colors inline-block mx-auto text-center"
                        title="View order details"
                      >
                        <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{margin:"0 auto"}}>
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                          <circle cx="12" cy="12" r="3" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100">
            <p className="text-[10px] text-gray-400">
              Page {page} of {totalPages} (Total {total} Orders)
            </p>
            <div className="flex items-center gap-1.5">
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => setPage(i + 1)}
                  className={`w-7 h-7 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                    page === i + 1
                      ? "bg-indigo-600 text-white"
                      : "border border-gray-100 text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-100 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-center mx-auto"
              >
                <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} style={{margin:"0 auto"}}>
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Order Detail Modal Overlay */}
      {detailOrder && (
        <div className="fixed inset-0 bg-black/30 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl border border-gray-100 shadow-xl p-6 w-full max-w-lg flex flex-col gap-4 relative">
            <button
              onClick={() => setDetailOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
            >
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
            <button
              onClick={() => handlePrintOrder(detailOrder)}
              className="absolute top-4 right-12 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold text-indigo-600 bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 cursor-pointer transition-colors"
              title="Print order"
            >
              <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <polyline points="6 9 6 2 18 2 18 9" />
                <path d="M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2" />
                <rect x="6" y="14" width="12" height="8" />
              </svg>
              Print
            </button>
            <h3 className="font-semibold text-gray-800 text-sm flex items-center gap-1.5">
              <span className="text-gray-400">
                <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <line x1="4" y1="9" x2="20" y2="9" />
                  <line x1="4" y1="15" x2="20" y2="15" />
                  <line x1="10" y1="3" x2="8" y2="21" />
                  <line x1="16" y1="3" x2="14" y2="21" />
                </svg>
              </span>
              Order logs: #{detailOrder._id}
            </h3>

            {/* Core facts */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/50">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Date</span>
                <span className="font-semibold text-gray-700">
                  {new Date(detailOrder.createdAt).toLocaleDateString("en-GB", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/50">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Total Amount</span>
                <span className="font-bold text-indigo-600">{detailOrder.totalAmount} EGP</span>
              </div>
              <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/50">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Status</span>
                <span className="font-semibold text-gray-700 uppercase">{detailOrder.status || "PENDING"}</span>
              </div>
              <div className="p-2 border border-gray-100 rounded-lg bg-gray-50/50">
                <span className="text-[9px] text-gray-400 font-bold block uppercase tracking-wider">Payment</span>
                <span className="font-semibold text-stone-750 flex items-center gap-1.5">
                  <span className="text-gray-400">
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <rect x="1" y="4" width="22" height="16" rx="2" ry="2" />
                      <line x1="1" y1="10" x2="23" y2="10" />
                    </svg>
                  </span>
                  {detailOrder.paymentMethod || "Credit Card"}
                </span>
              </div>
            </div>

            {/* Sources details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs mt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
              <div className="flex flex-col gap-1">
                <span className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1.5 tracking-wider">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Customer Details
                </span>
                <p className="font-semibold text-gray-700">
                  {detailOrder.customerId?.fullName || detailOrder.customerId || "Platform Customer"}
                </p>
                <p className="text-[10px] text-gray-400">{detailOrder.customerId?.email || "Email N/A"}</p>
              </div>
              <div className="flex flex-col gap-1 border-t sm:border-t-0 sm:border-l border-gray-100 pt-2 sm:pt-0 sm:pl-4">
                <span className="text-[9px] text-gray-400 font-bold uppercase flex items-center gap-1.5 tracking-wider">
                  <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                    <path d="M16 21V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v16" />
                  </svg>
                  Brand & Bazaar
                </span>
                <p className="font-semibold text-gray-700">
                  Brand: {detailOrder.brandId?.brandName || detailOrder.brandId || "N/A"}
                </p>
                <p className="text-[10px] text-gray-400">
                  Bazaar: {detailOrder.bazaarId?.bazaarName || detailOrder.bazaarId || "N/A"}
                </p>
              </div>
            </div>

            {/* Items list */}
            <div className="mt-2 flex flex-col gap-2">
              <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Ordered Items ({detailOrder.items?.length || 0})</span>
              <div className="border border-gray-100 rounded-xl overflow-hidden max-h-[160px] overflow-y-auto divide-y divide-gray-100 bg-white">
                {(detailOrder.items || []).map((item, index) => (
                  <div key={index} className="flex justify-between items-center px-3 py-2 text-xs hover:bg-gray-50/60">
                    <div>
                      <p className="font-semibold text-gray-700">{item.name || "Item title"}</p>
                      <p className="text-[9px] text-gray-400">Qty: {item.quantity} × {item.price} EGP</p>
                    </div>
                    <span className="font-bold text-gray-700">{(item.quantity * item.price).toLocaleString()} EGP</span>
                  </div>
                ))}
                {(!detailOrder.items || detailOrder.items.length === 0) && (
                  <p className="text-center text-[10px] text-gray-400 py-6 italic">No products listed in order</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
