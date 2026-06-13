"use client";

import { useEffect, useState } from "react";
import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";
function getHeaders() {
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function StockBadge({ stock }) {
  if (stock === 0)
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-100 text-red-600 uppercase">
        Out
      </span>
    );
  if (stock <= 5)
    return (
      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-600 uppercase">
        Low Stock
      </span>
    );
  return (
    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-green-100 text-green-600 uppercase">
      In Stock
    </span>
  );
}

export default function BrandProducts({ onAddNew, onEdit }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);

  async function load() {
    try {
      const res = await axios.get(`${BASE_URL}/brand/products`, {
        headers: getHeaders(),
      });
      const list = res.data?.data?.products ?? res.data?.data ?? res.data ?? [];
      setProducts(Array.isArray(list) ? list : []);
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    load();
  }, []);

  async function handleDelete(id) {
    if (!confirm("Delete this product?")) return;
    setDeleting(id);
    try {
      await axios.delete(`${BASE_URL}/brand/products/${id}`, {
        headers: getHeaders(),
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } finally {
      setDeleting(null);
    }
  }

  async function adjustStock(id, delta) {
    const product = products.find((p) => p._id === id);
    if (!product) return;
    const newQuantity = Math.max(
      0,
      (product.stock ?? product.quantity ?? 0) + delta,
    );
    // optimistic update
    setProducts((prev) =>
      prev.map((p) =>
        p._id === id ? { ...p, quantity: newQuantity, stock: newQuantity } : p,
      ),
    );
    try {
      await axios.patch(
        `${BASE_URL}/brand/products/${id}`,
        { quantity: newQuantity },
        { headers: getHeaders() },
      );
    } catch (err) {
      // revert on failure
      setProducts((prev) =>
        prev.map((p) =>
          p._id === id
            ? { ...p, quantity: product.quantity, stock: product.stock }
            : p,
        ),
      );
      alert(
        err?.response?.data?.message ?? "Failed to update stock. Try again.",
      );
    }
  }

  const active = products.filter(
    (p) => (p.stock ?? p.quantity ?? 0) > 5,
  ).length;
  const lowStock = products.filter((p) => {
    const s = p.stock ?? p.quantity ?? 0;
    return s > 0 && s <= 5;
  }).length;
  const outStock = products.filter(
    (p) => (p.stock ?? p.quantity ?? 0) === 0,
  ).length;

  return (
    <div className="max-w-6xl m-auto">
      <div className="flex items-start justify-between mb-6">
        <div>
          <p className="text-xs text-stone-400 mb-1">Dashboard / products</p>
          <h1 className="text-2xl font-bold text-stone-900">
            products Management
          </h1>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center gap-1.5 text-xs bg-[#3d4f38] text-white px-4 py-2 rounded-lg hover:bg-[#22301D] transition-colors font-medium"
        >
          <svg
            width="13"
            height="13"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path d="M12 5v14M5 12h14" />
          </svg>
          + Add Product
        </button>
      </div>

      {/* Mini stats */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          {
            label: "Active",
            value: active,
            icon: "✓",
            color: "text-green-600 bg-green-50",
          },
          {
            label: "Low Stock Items",
            value: lowStock,
            icon: "⚠",
            color: "text-orange-600 bg-orange-50",
          },
          {
            label: "Out of Stock Items",
            value: outStock,
            icon: "✕",
            color: "text-red-600 bg-red-50",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="bg-white rounded-xl border border-stone-200 p-4 flex items-center gap-3"
          >
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${s.color}`}
            >
              {s.icon}
            </span>
            <div>
              <p className="text-xl font-bold text-stone-900">{s.value}</p>
              <p className="text-[10px] text-stone-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Priority restock alert */}
      {lowStock > 0 && (
        <div className="bg-white rounded-xl border border-orange-200 p-4 mb-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg
              width="16"
              height="16"
              fill="none"
              viewBox="0 0 24 24"
              stroke="#f59e0b"
              strokeWidth={2}
            >
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0zM12 9v4M12 17h.01" />
            </svg>
            <p className="text-xs font-semibold text-stone-700">
              Priority Restock Needed
            </p>
          </div>
          <p className="text-xs text-stone-500 flex-1 mx-4 hidden md:block">
            The following items are running low and will likely sell out within
            48 hours.
          </p>
          <button className="text-xs border border-stone-200 px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-50 transition-colors font-medium shrink-0">
            View Urgent Items
          </button>
        </div>
      )}

      {/* Inventory Catalog */}
      <div className="bg-white rounded-xl border border-stone-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-stone-100">
          <h2 className="text-sm font-semibold text-stone-800">
            Inventory Catalog
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div
              className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
              style={{ borderColor: "#50604A", borderTopColor: "transparent" }}
            />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-stone-400 text-sm mb-3">No products yet</p>
            <button
              onClick={onAddNew}
              className="text-xs bg-[#3d4f38] text-white px-5 py-2 rounded-lg"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-stone-100 text-[10px] text-stone-400 uppercase tracking-wider">
                  <th className="px-5 py-3 text-left font-medium">Product</th>
                  <th className="px-5 py-3 text-left font-medium">SKU</th>
                  <th className="px-5 py-3 text-left font-medium">Demand</th>
                  <th className="px-5 py-3 text-left font-medium">Price</th>
                  <th className="px-5 py-3 text-left font-medium">
                    Stock Level
                  </th>
                  <th className="px-5 py-3 text-left font-medium">Status</th>
                  <th className="px-5 py-3 text-right font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product, i) => {
                  const stock = product.stock ?? product.quantity ?? 0;
                  return (
                    <tr
                      key={product._id ?? i}
                      className="border-b border-stone-50 last:border-0 hover:bg-stone-50/40 transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2.5">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-9 h-9 rounded-lg object-cover border border-stone-100 shrink-0"
                            />
                          ) : (
                            <div className="w-9 h-9 rounded-lg bg-stone-100 shrink-0" />
                          )}
                          <div>
                            <p className="font-semibold text-stone-800">
                              {product.name}
                            </p>
                            <p className="text-[10px] text-stone-400">
                              {product.category ?? "No category"}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3 text-stone-500 font-mono">
                        {product.sku ??
                          `SKU-${(product._id ?? String(i)).slice(-4).toUpperCase()}`}
                      </td>
                      <td className="px-5 py-3 text-stone-600">
                        {product.demand ?? product.sold ?? 0}
                      </td>
                      <td className="px-5 py-3 font-semibold text-stone-800">
                        ${Number(product.price ?? 0).toFixed(2)}
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => adjustStock(product._id, -1)}
                            className="w-5 h-5 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors font-bold"
                          >
                            −
                          </button>
                          <span className="w-8 text-center font-semibold text-stone-800">
                            {stock}
                          </span>
                          <button
                            onClick={() => adjustStock(product._id, +1)}
                            className="w-5 h-5 rounded border border-stone-200 flex items-center justify-center text-stone-500 hover:bg-stone-100 transition-colors font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                      <td className="px-5 py-3">
                        <StockBadge stock={stock} />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => onEdit(product)}
                            className="p-1.5 text-stone-400 hover:text-[#3d4f38] hover:bg-stone-100 rounded-lg transition-colors"
                          >
                            <svg
                              width="13"
                              height="13"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              strokeWidth={2}
                            >
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            disabled={deleting === product._id}
                            className="p-1.5 text-stone-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            {deleting === product._id ? (
                              <div className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                            ) : (
                              <svg
                                width="13"
                                height="13"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                              >
                                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                              </svg>
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="px-5 py-3 border-t border-stone-100 text-xs text-stone-400">
              Showing {products.length} of {products.length} products
            </div>
          </>
        )}
      </div>
    </div>
  );
}
