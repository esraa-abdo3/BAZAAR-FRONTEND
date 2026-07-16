"use client";

import { useState } from "react";
import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";
function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function BrandOrderDetail({ order, onBack }) {
  const [status, setStatus] = useState(
    (order?.status ?? "pending").toLowerCase(),
  );
  console.log("orderdetalis", order)
  const [updating, setUpdating] = useState(null);

  if (!order) return null;

  const orderMongoId = order.orderId ?? order._id;

  async function updateStatus(newStatus) {
    setUpdating(newStatus);
    try {
      await axios.patch(
        `${BASE_URL}/brand/orders/${orderMongoId}/status`,
        { status: newStatus.toUpperCase() },
        { headers: getHeaders() },
      );
      setStatus(newStatus);
    } catch (err) {
      alert(
        err?.response?.data?.message ??
          "Failed to update order status. Try again.",
      );
    } finally {
      setUpdating(null);
    }
  }

  const orderId = `#ORD-${(order.orderId ?? order._id ?? "").slice(-4).toUpperCase()}`;
  const customer =
    order.customer?.fullName ??
    order.customer?.name ??
    order.customerId?.fullName ??
    "Customer";
  const email = order.customer?.email ?? order.customerId?.email ?? "—";
  const phone = order.customer?.phone ?? order.customerId?.phone ?? "—";
  const address = (() => {
    const c = order.customer ?? order.customerId ?? {};
    const parts = [c.address, c.city, c.governate].filter(Boolean);
    return parts.length ? parts.join(", ") : (order.shippingAddress ?? "—");
  })();
  const items = order.items ?? order.products ?? [];
  const subtotal = Number(
    order.totalAmount ?? order.totalPrice ?? order.total ?? 0,
  );
  const shipping = Number(order.shippingFee ?? 45);
  const tax = subtotal * 0.08;
  const totalAmt = subtotal + shipping + tax;
  const date = order.createdAt
    ? new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";
  const isPaid = status !== "pending" && status !== "cancelled";
  const isDone = status === "delivered" || status === "cancelled";

  function handlePrint() {
    const win = window.open("", "_blank", "width=800,height=900");
    if (!win) return;
    const itemsRows = items
      .map((item) => {
        const name = item.name ?? item.product?.name ?? "Product";
        const qty = item.quantity ?? 1;
        const lineTotal = Number(
          item.subTotal ?? (item.price ?? item.product?.price ?? 0) * qty,
        ).toFixed(2);
        return `<tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">${name}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:center;">${qty}</td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">$${lineTotal}</td>
        </tr>`;
      })
      .join("");

    win.document.write(`
      <html>
        <head>
          <title>Invoice ${orderId}</title>
          <style>
            body { font-family: Arial, sans-serif; color: #292524; padding: 32px; }
            h1 { font-size: 20px; margin: 0 0 4px; }
            .muted { color: #78716c; font-size: 12px; }
            table { width: 100%; border-collapse: collapse; margin-top: 16px; }
            th { text-align: left; font-size: 11px; text-transform: uppercase; color: #78716c; border-bottom: 1px solid #ccc; padding-bottom: 8px; }
            .totals td { padding: 4px 0; }
            .totals .label { color: #78716c; }
            .grand { font-weight: bold; font-size: 15px; border-top: 1px solid #ccc; }
          </style>
        </head>
        <body>
          <h1>Invoice ${orderId}</h1>
          <p class="muted">Placed on ${date} &middot; Status: ${status.toUpperCase()}</p>
          <p style="margin-top:16px;"><strong>${customer}</strong><br/>
          ${email}<br/>${phone}<br/>${address}</p>
          <table>
            <thead>
              <tr><th>Item</th><th style="text-align:center;">Qty</th><th style="text-align:right;">Amount</th></tr>
            </thead>
            <tbody>${itemsRows}</tbody>
          </table>
          <table class="totals" style="max-width:260px;margin-left:auto;margin-top:16px;">
            <tr><td class="label">Subtotal</td><td style="text-align:right;">$${subtotal.toFixed(2)}</td></tr>
            <tr><td class="label">Shipping</td><td style="text-align:right;">free</td></tr>

            <tr class="grand"><td>Total</td><td style="text-align:right;">$${totalAmt.toFixed(2)}</td></tr>
          </table>
        </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.print();
  }

  const STATUS_COLORS = {
    confirmed: "text-blue-600 bg-blue-50",
    preparing: "text-blue-600 bg-blue-50",
    shipped: "text-teal-600 bg-teal-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    pending: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-5"
      >
        <svg
          width="14"
          height="14"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Orders
      </button>

      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-wider text-gray-400 mb-1">
            Transaction Receipt
          </p>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">{orderId}</h1>
          <div className="flex items-center gap-3 mt-2">
            {isPaid && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
                <svg
                  width="11"
                  height="11"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path d="M5 13l4 4L19 7" />
                </svg>
                Payment Confirmed
              </span>
            )}
            <span className="text-xs text-stone-400">Placed on {date}</span>
          </div>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center justify-center gap-1.5 text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium shrink-0"
        >
          <svg
            width="13"
            height="13"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Print Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5">
        {/* Left — manifest + financial */}
        <div className="xl:col-span-2 flex flex-col gap-5">
          {/* Items */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-stone-800">
                The Manifest
              </h2>
              <span className="text-xs text-stone-400">
                {items.length} items
              </span>
            </div>
            {items.length === 0 ? (
              <p className="text-sm text-stone-400">
                No item details available
              </p>
            ) : (
              <div className="flex flex-col gap-4">
                {items.map((item, i) => (
                  <div key={i} className="flex items-center gap-4">
                    {(item.images?.[0] ?? item.product?.images?.[0]) ? (
                      <img
                        src={item.images?.[0] ?? item.product?.images?.[0]}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover border border-stone-100 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-800">
                        {item.name ?? item.product?.name ?? "Product"}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-stone-400">
                        SKU: {item.sku ?? item.product?.sku ?? "—"} · QTY:{" "}
                        {item.quantity ?? 1}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800 shrink-0">
                      $
                      {Number(
                        item.subTotal ??
                          (item.price ?? item.product?.price ?? 0) *
                            (item.quantity ?? 1),
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 shadow-sm">
            <h2 className="text-sm font-semibold text-stone-800 mb-4">
              Financial Summary
            </h2>
            <div className="flex flex-col gap-2 text-sm">
              <div className="flex justify-between text-stone-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Express Shipping</span>
                <span>free</span>
              </div>
    
              <div className="border-t border-stone-100 my-1" />
              <div className="flex justify-between font-bold text-stone-900 text-base">
                <span>Total Amount</span>
                <span>${totalAmt.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right — customer + order history + status */}
        <div className="flex flex-col gap-4">
          {/* Customer Intelligence */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Customer Intelligence
            </h3>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-stone-200 flex items-center justify-center text-sm font-semibold text-stone-600 shrink-0">
                {customer[0]?.toUpperCase()}
              </div>
              <div>
                <p className="text-sm font-semibold text-stone-800">
                  {customer}
                </p>
                <p className="text-[10px] text-stone-400 uppercase tracking-wide">
                  Loyalty: Tier One
                </p>
              </div>
            </div>
            <div className="flex flex-col gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#9ca3af"
                  strokeWidth={2}
                >
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="truncate">{email}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#9ca3af"
                  strokeWidth={2}
                >
                  <path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span>{phone}</span>
              </div>
              <div className="flex items-start gap-2">
                <svg
                  width="12"
                  height="12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="#9ca3af"
                  strokeWidth={2}
                  className="mt-0.5 shrink-0"
                >
                  <path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <circle cx="12" cy="11" r="3" />
                </svg>
                <span className="leading-relaxed">{address}</span>
              </div>
            </div>

          </div>

          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Order History
            </h3>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-stone-200" />
              {(() => {
                const PIPELINE = ["pending", "preparing", "shipped", "delivered"];
                const STAGE_LABELS = {
                  pending: { label: "Payment Confirmed", sub: "Order received" },
                  preparing: { label: "Preparing", sub: "Getting your order ready" },
                  shipped: { label: "Shipped", sub: "On its way" },
                  delivered: { label: "Delivered", sub: "Order completed" },
                };

                let steps;
                if (status === "cancelled") {
                  steps = [
                    { label: "Cancelled", sub: "Order was cancelled", done: true, isCancel: true },
                    { label: "Order Placed", sub: date, done: true },
                  ];
                } else {
                  const currentIdx = Math.max(PIPELINE.indexOf(status), 0);
                  const reached = PIPELINE.slice(0, currentIdx + 1).map((stage) => ({
                    label: STAGE_LABELS[stage].label,
                    sub: STAGE_LABELS[stage].sub,
                    done: true,
                  }));
                  steps = [
                    ...reached.reverse(),
                    { label: "Order Placed", sub: date, done: true },
                  ];
                }
                return steps.map((step, i) => (
                  <div key={i} className="relative mb-4 last:mb-0">
                    <div
                      className={`absolute -left-2.5 top-0.5 w-2 h-2 rounded-full border-2 ${
                        step.isCancel
                          ? "bg-red-500 border-red-500"
                          : step.done
                            ? "bg-indigo-600 border-indigo-600"
                            : "bg-white border-stone-300"
                      }`}
                    />
                    <p className="text-xs font-medium text-stone-800">
                      {step.label}
                    </p>
                    <p className="text-[10px] text-stone-400">{step.sub}</p>
                  </div>
                ));
              })()}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-5 shadow-sm">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Update Status
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus("preparing")}
                  disabled={isDone || updating === "preparing"}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors
                    ${status === "preparing" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}
                    ${isDone ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {updating === "preparing" ? "..." : "PREPARE"}
                </button>
                <button
                  onClick={() => updateStatus("shipped")}
                  disabled={isDone || updating === "shipped"}
                  className={`flex-1 py-2 rounded-lg text-xs font-semibold border transition-colors
                    ${status === "shipped" ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 text-gray-600 hover:bg-gray-50"}
                    ${isDone ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  {updating === "shipped" ? "..." : "SHIP"}
                </button>
              </div>
              <button
                onClick={() => updateStatus("delivered")}
                disabled={isDone || updating === "delivered"}
                className="w-full py-2 rounded-lg text-xs font-bold bg-indigo-600 text-white hover:bg-indigo-700 transition-colors uppercase tracking-wide disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating === "delivered" ? "Updating..." : "Mark as Delivered"}
              </button>
              <button
                onClick={() => {
                  if (confirm("Cancel this order?")) updateStatus("cancelled");
                }}
                disabled={isDone || updating === "cancelled"}
                className="w-full py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {updating === "cancelled" ? "Cancelling..." : "Cancel Order"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}