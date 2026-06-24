"use client";

export default function BrandOrderDetail({ order, onBack }) {
  if (!order) return null;

  const orderId = `#ORD-${(order._id ?? "").slice(-4).toUpperCase()}`;
  const customer =
    order.customerId?.fullName ??
    order.customer?.fullName ??
    order.customer?.name ??
    "Customer";
  const email = order.customerId?.email ?? order.customer?.email ?? "—";
  const phone = order.customerId?.phone ?? order.customer?.phone ?? "—";
  const address =
    order.customerId?.address ??
    order.customer?.address ??
    order.shippingAddress ??
    "—";
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
  const status = (order.status ?? "pending").toLowerCase();
  const isPaid = status !== "pending" && status !== "cancelled";

  const STATUS_COLORS = {
    confirmed: "text-blue-600 bg-blue-50",
    preparing: "text-blue-600 bg-blue-50",
    shipped: "text-teal-600 bg-teal-50",
    delivered: "text-green-600 bg-green-50",
    cancelled: "text-red-600 bg-red-50",
    pending: "text-orange-600 bg-orange-50",
  };

  return (
    <div className="max-w-6xl m-auto">
   
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-700 transition-colors mb-5"
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

      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-[10px] uppercase tracking-widest text-stone-400 mb-1">
            Transaction Receipt
          </p>
          <h1 className="text-3xl font-bold text-stone-900">{orderId}</h1>
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
        <button className="flex items-center gap-1.5 text-xs bg-[#3d4f38] text-white px-4 py-2 rounded-lg hover:bg-[#22301D] transition-colors font-medium">
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
          <div className="bg-white rounded-xl border border-stone-200 p-6">
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
                    {item.product?.images?.[0] ? (
                      <img
                        src={item.product.images[0]}
                        alt=""
                        className="w-16 h-16 rounded-lg object-cover border border-stone-100 shrink-0"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-lg bg-stone-100 shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-stone-800">
                        {item.product?.name ?? item.name ?? "Product"}
                      </p>
                      {item.variant && (
                        <p className="text-xs text-stone-400 mt-0.5">
                          {item.variant}
                        </p>
                      )}
                      <p className="text-xs text-stone-400">
                        SKU: {item.product?.sku ?? "—"} · QTY:{" "}
                        {item.quantity ?? 1}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-stone-800 shrink-0">
                      $
                      {Number(
                        (item.product?.price ?? item.price ?? 0) *
                          (item.quantity ?? 1),
                      ).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Financial Summary */}
          <div className="bg-white rounded-xl border border-stone-200 p-6">
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
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-stone-600">
                <span>Estimated Tax (8%)</span>
                <span>${tax.toFixed(2)}</span>
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
          <div className="bg-white rounded-xl border border-stone-200 p-5">
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
            <button className="mt-4 w-full text-[10px] font-semibold uppercase tracking-wider border border-stone-200 text-stone-600 py-2 rounded-lg hover:bg-stone-50 transition-colors">
              View Customer Profile
            </button>
          </div>

          {/* Order History */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-4">
              Order History
            </h3>
            <div className="relative pl-4">
              <div className="absolute left-1.5 top-0 bottom-0 w-px bg-stone-200" />
              {[
                { label: "Processing", sub: "Received, preparing..." },
                {
                  label: "Payment Confirmed",
                  sub: "Via AMEX Platinum",
                  done: isPaid,
                },
                { label: "Order Placed", sub: date, done: true },
              ].map((step, i) => (
                <div key={i} className="relative mb-4 last:mb-0">
                  <div
                    className={`absolute -left-2.5 top-0.5 w-2 h-2 rounded-full border-2 ${step.done ? "bg-[#3d4f38] border-[#3d4f38]" : "bg-white border-stone-300"}`}
                  />
                  <p className="text-xs font-medium text-stone-800">
                    {step.label}
                  </p>
                  <p className="text-[10px] text-stone-400">{step.sub}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Update Status */}
          <div className="bg-white rounded-xl border border-stone-200 p-5">
            <h3 className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Update Status
            </h3>
            <div className="flex flex-col gap-2">
              <div className="flex gap-2">
                <button className="flex-1 py-2 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                  PREPARE
                </button>
                <button className="flex-1 py-2 rounded-lg text-xs font-semibold border border-stone-200 text-stone-600 hover:bg-stone-50 transition-colors">
                  SHIP
                </button>
              </div>
              <button className="w-full py-2 rounded-lg text-xs font-bold bg-[#3d4f38] text-white hover:bg-[#22301D] transition-colors uppercase tracking-wide">
                Mark as Delivered
              </button>
              <button className="w-full py-2 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors">
                Cancel Order
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
