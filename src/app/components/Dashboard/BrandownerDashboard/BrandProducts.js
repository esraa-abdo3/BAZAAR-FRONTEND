
"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import BrandPagination from "./BrandPagination";

const BASE_URL = "https://bazary-backend.vercel.app/api";
const PAGE_SIZE = 8;

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
  const [page, setPage] = useState(1);
  const [confirmDelete, setConfirmDelete] = useState(null); // المنتج المطلوب حذفه (لعرض الـ popup)

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

  function requestDelete(product) {
    setConfirmDelete(product);
  }

  async function handleDelete(id) {
    setConfirmDelete(null);
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

  const totalPages = Math.max(1, Math.ceil(products.length / PAGE_SIZE));
  const paginated = products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
        <div>
          <p className="text-xs text-gray-400 mb-1">Dashboard / Products</p>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
            Products Management
          </h1>
        </div>
        <button
          onClick={onAddNew}
          className="flex items-center justify-center gap-1.5 text-xs bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors font-medium cursor-pointer shrink-0"
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
          Add Product
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
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
            className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3 shadow-sm"
          >
            <span
              className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold ${s.color}`}
            >
              {s.icon}
            </span>
            <div>
              <p className="text-xl font-bold text-gray-800">{s.value}</p>
              <p className="text-[10px] text-gray-400">{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {lowStock > 0 && (
        <div className="bg-white rounded-xl border border-orange-200 p-4 mb-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
            <p className="text-xs font-semibold text-gray-700">
              Priority Restock Needed
            </p>
          </div>
          <p className="text-xs text-gray-500 flex-1">
            {lowStock} item{lowStock !== 1 ? "s are" : " is"} running low and may
            sell out soon.
          </p>
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-800">
            Inventory Catalog
          </h2>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="w-5 h-5 border-2 border-indigo-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 text-center">
            <p className="text-gray-400 text-sm mb-3">No products yet</p>
            <button
              onClick={onAddNew}
              className="text-xs bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Add Product
            </button>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[800px]">
                <thead>
                  <tr className="border-b border-gray-100 text-[10px] text-gray-400 uppercase tracking-wider">
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Product
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      SKU
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Demand
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Price
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Stock Level
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 sm:px-5 py-3 text-right font-semibold">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((product, i) => {
                    const stock = product.stock ?? product.quantity ?? 0;
                    return (
                      <tr
                        key={product._id ?? i}
                        className="border-b border-gray-50 last:border-0 hover:bg-gray-50/40 transition-colors"
                      >
                        <td className="px-4 sm:px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name}
                                className="w-9 h-9 rounded-lg object-cover border border-gray-100 shrink-0"
                              />
                            ) : (
                              <div className="w-9 h-9 rounded-lg bg-gray-100 shrink-0" />
                            )}
                            <div className="min-w-0">
                              <p className="font-semibold text-gray-800 truncate max-w-[140px]">
                                {product.name}
                              </p>
                              <p className="text-[10px] text-gray-400">
                                {product.category ?? "No category"}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-gray-500 font-mono text-xs">
                          {product.sku ??
                            `SKU-${(product._id ?? String(i)).slice(-4).toUpperCase()}`}
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-gray-600">
                          {product.demand ?? product.sold ?? 0}
                        </td>
                        <td className="px-4 sm:px-5 py-3 font-semibold text-gray-800">
                          ${Number(product.price ?? 0).toFixed(2)}
                        </td>
                        <td className="px-4 sm:px-5 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => adjustStock(product._id, -1)}
                              className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors font-bold"
                            >
                              −
                            </button>
                            <span className="w-8 text-center font-semibold text-gray-800">
                              {stock}
                            </span>
                            <button
                              onClick={() => adjustStock(product._id, +1)}
                              className="w-5 h-5 rounded border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 transition-colors font-bold"
                            >
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-4 sm:px-5 py-3">
                          <StockBadge stock={stock} />
                        </td>
                        <td className="px-4 sm:px-5 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => onEdit(product)}
                              className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
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
                              onClick={() => requestDelete(product)}
                              disabled={deleting === product._id}
                              className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
            </div>
            <BrandPagination
              page={page}
              totalPages={totalPages}
              totalItems={products.length}
              pageSize={PAGE_SIZE}
              onPageChange={setPage}
              itemLabel="products"
            />
          </>
        )}
      </div>

      {/* Delete confirmation popup */}
      {confirmDelete && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onClick={() => setConfirmDelete(null)}
        >
          <div
            className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center mb-4 text-center mx-auto ">
              <svg
                width="20"
                height="20"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ef4444"
                strokeWidth={2}
              >
                <path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-center text-gray-800 mb-1">
             Delete Product
            </h3>
            <p className="text-sm text-gray-500 mb-6 text-center">
            Are you sure you want to delete Traditional Om Ali Dessert with Nuts?
              <span className="font-medium text-gray-700">
                {confirmDelete.name}
              </span>
         
            </p>
            <div className="flex items-center justify-between gap-2">
              <button
                onClick={() => setConfirmDelete(null)}
                className="px-4 py-2 text-xs font-semibold rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
              >
               cancel
              </button>
              <button
                onClick={() => handleDelete(confirmDelete._id)}
                className="px-4 py-2 text-xs font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
             delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
