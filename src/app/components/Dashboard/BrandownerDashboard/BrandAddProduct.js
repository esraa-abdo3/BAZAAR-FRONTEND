"use client";

import { useState, useRef, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://bazary-backend.vercel.app/api";
function getHeaders() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export default function BrandAddProduct({ product, onBack, onSuccess }) {
  const isEdit  = !!product;
  const fileRef = useRef(null);

  const [form, setForm] = useState({
    name:        product?.name        ?? "",
    description: product?.description ?? "",
    stock:       product?.stock       ?? product?.quantity ?? "",
    price:       product?.price       ?? "",
    discount:    product?.discount    ?? "",
  });
  const [images,   setImages]   = useState([]);
  const [previews, setPreviews] = useState(product?.images ?? []);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  }

  function handleFiles(e) {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    const combined = [...images, ...files].slice(0, 5);
    setImages(combined);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) =>
        setPreviews((prev) => [...prev, ev.target.result].slice(0, 5));
      reader.readAsDataURL(file);
    });
  }

  function removeImage(idx) {
    setImages((prev)   => prev.filter((_, i) => i !== idx));
    setPreviews((prev) => prev.filter((_, i) => i !== idx));
  }

  async function handleSubmit() {
    setError("");
    if (!form.name || !form.price || form.stock === "") {
      setError("Name, price and stock are required.");
      return;
    }
    const fd = new FormData();
    fd.append("name",        form.name);
    fd.append("description", form.description);
    fd.append("quantity",    form.stock);
    fd.append("price",       form.price);
    if (form.discount) fd.append("discount", form.discount);
    images.forEach((img) => fd.append("images", img));

    try {
      setLoading(true);
      if (isEdit) {
        await axios.patch(`${BASE_URL}/brand/products/${product._id}`, fd, {
          headers: getHeaders(),
        });
      } else {
        await axios.post(`${BASE_URL}/brand/products`, fd, {
          headers: getHeaders(),
        });
      }
      onSuccess();
    } catch (err) {
      setError(err?.response?.data?.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  // ── Live preview values ──────────────────────────────────────────────────────
  const previewName  = form.name        || "product title";
  const previewDesc  = form.description || "Narrate the craftsmanship and heritage of this piece...";
  const previewPrice = form.price       ? `$${Number(form.price).toFixed(2)}` : "$0.00";
  const previewStock = form.stock       !== "" ? form.stock : "00";
  const previewImg   = previews[0] ?? null;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <button onClick={onBack} className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-gray-700 transition-colors mb-5">
        <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
        Back to Products
      </button>

      <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1">
        {isEdit ? (product?.name || "Edit Product") : "Add Product"}
      </h1>
      <p className="text-xs text-gray-400 mb-7">
        Populate your boutique digital storefront with precision. Each entry is curated to maintain the premium integrity of your marketplace presence.
      </p>

      {error && (
        <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-sm px-4 py-3 rounded-xl">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* ── Form ── */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 flex flex-col gap-6 shadow-sm">

          {/* Item Name */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
              Item Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="E.g., Silk Pleated Midi Dress"
              className="w-full border-b border-gray-200 pb-2 text-sm text-gray-800 bg-transparent focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-gray-300"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Narrate the craftsmanship and heritage of this piece..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-800 bg-transparent focus:outline-none focus:border-indigo-500 transition-colors resize-none placeholder:text-gray-300"
            />
          </div>

          {/* Visual Assets */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
              Visual Assets
            </label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-indigo-500 transition-colors"
            >
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#9ca3af" strokeWidth={1.5}>
                <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <p className="text-xs text-stone-500 font-medium">Drag and drop high resolution captures</p>
              <p className="text-xs text-stone-400">or click to browse your archive</p>
              <button className="mt-2 text-[10px] font-semibold uppercase tracking-wider border border-stone-200 text-stone-600 px-4 py-1.5 rounded-lg hover:bg-stone-50 transition-colors">
                Select Files
              </button>
            </div>
            <input ref={fileRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFiles} />

            {/* Thumbnails */}
            {previews.length > 0 && (
              <div className="flex gap-2 mt-3 flex-wrap">
                {previews.map((src, i) => (
                  <div key={i} className="relative w-16 h-16 rounded-lg overflow-hidden border border-stone-200 group">
                    <img src={src} alt="" className="w-full h-full object-cover" />
                    <button
                      onClick={() => removeImage(i)}
                      className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2}>
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stock */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-2">
              Stock Quantity
            </label>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setForm((f) => ({ ...f, stock: Math.max(0, Number(f.stock) - 1) }))}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors font-bold text-lg"
              >−</button>
              <input
                name="stock"
                type="number"
                min="0"
                value={form.stock}
                onChange={handleChange}
                placeholder="00"
                className="w-20 text-center border-b border-stone-200 pb-1 text-sm font-semibold text-stone-800 bg-transparent focus:outline-none focus:border-[#3d4f38] transition-colors"
              />
              <button
                onClick={() => setForm((f) => ({ ...f, stock: Number(f.stock) + 1 }))}
                className="w-8 h-8 rounded-lg border border-stone-200 flex items-center justify-center text-stone-600 hover:bg-stone-100 transition-colors font-bold text-lg"
              >+</button>
            </div>
          </div>

          {/* Valuation & Offers */}
          <div>
            <label className="block text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">
              Valuation &amp; Offers
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] text-stone-400 mb-1">Base Price ($)</label>
                <input
                  name="price"
                  type="number"
                  min="0"
                  value={form.price}
                  onChange={handleChange}
                  placeholder="0.00"
                  className="w-full border-b border-stone-200 pb-1.5 text-sm text-stone-800 bg-transparent focus:outline-none focus:border-[#3d4f38] transition-colors"
                />
              </div>
              <div>
                <label className="block text-[10px] text-stone-400 mb-1">Discount (Fixed or %)</label>
                <input
                  name="discount"
                  value={form.discount}
                  onChange={handleChange}
                  placeholder="None"
                  className="w-full border-b border-stone-200 pb-1.5 text-sm text-stone-800 bg-transparent focus:outline-none focus:border-[#3d4f38] transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col gap-2 pt-2">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full py-3 rounded-xl text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                isEdit ? "UPDATE PRODUCT" : "SAVE PRODUCT"
              )}
            </button>
     
          </div>
        </div>

        {/* ── Live Preview ── */}
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-stone-400 mb-3">Live Listing Preview</p>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden sticky top-6 shadow-sm">
            {/* Image area */}
            <div className="aspect-[4/3] bg-stone-100 flex items-center justify-center overflow-hidden">
              {previewImg ? (
                <img src={previewImg} alt="preview" className="w-full h-full object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-stone-300">
                  <svg width="40" height="40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                  <p className="text-xs">No image uploaded</p>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="p-5">
              <h3 className="text-base font-bold text-stone-900 mb-1">{previewName}</h3>
              <p className="text-xs text-stone-400 mb-3 leading-relaxed line-clamp-3">{previewDesc}</p>

              <div className="flex items-center justify-between mb-4">
                <span className="text-xl font-bold text-stone-900">{previewPrice}</span>
                {form.discount && (
                  <span className="text-xs bg-red-50 text-red-600 px-2 py-0.5 rounded font-medium">
                    -{form.discount}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-xs text-stone-500 border-t border-stone-100 pt-3">
                <span>Stock: <strong className="text-stone-800">{previewStock}</strong> units</span>
                <span className={`px-2 py-0.5 rounded font-semibold uppercase text-[10px]
                  ${Number(previewStock) === 0 ? "bg-red-100 text-red-600"
                    : Number(previewStock) <= 5 ? "bg-orange-100 text-orange-600"
                    : "bg-green-100 text-green-600"}`}>
                  {Number(previewStock) === 0 ? "Out of Stock" : Number(previewStock) <= 5 ? "Low Stock" : "In Stock"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}