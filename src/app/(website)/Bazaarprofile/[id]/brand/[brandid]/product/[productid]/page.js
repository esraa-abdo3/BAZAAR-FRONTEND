"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useCart } from "../../../../../../../context/CartContext";
export default function ProductProfile() {
  const { id, brandid, productid } = useParams();
  const [brand, setBrand] = useState(null);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [imgIndex, setImgIndex] = useState(0);
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    async function fetchAll() {
      try {
        const bazaarRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands`
        );
        const bazaarJson = await bazaarRes.json();
  setBrand(bazaarJson?.data?.brands?.find(b => b._id === brandid) || null);

        const prodRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands/${brandid}/products/${productid}`
        );
        const prodJson = await prodRes.json();
        console.log("product", prodJson);
        setProduct(prodJson?.data || null);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    if (id && brandid && productid) fetchAll();
  }, [id, brandid, productid]);

  const isOutOfStock = product?.quantity === 0;
  const isLowStock = product?.quantity > 0 && product?.quantity <= 5;
  const maxQty = product?.quantity || 1;

  return (
    <div className="w-[95%] lg:w-[85%] mx-auto px-4 py-6 pb-12 mt-15">

 

      {/* ── PRODUCT CONTENT ── */}
      {loading ? (
        // SKELETON
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">
          {/* image skeleton */}
          <div className="w-full lg:w-1/2 animate-pulse">
            <div className="w-full bg-gray-200 rounded-2xl" style={{ paddingBottom: "100%" }} />
            <div className="flex gap-2 mt-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-16 h-16 bg-gray-200 rounded-xl flex-shrink-0" />
              ))}
            </div>
          </div>
          {/* info skeleton */}
          <div className="w-full lg:w-1/2 space-y-4 animate-pulse">
            <div className="h-7 w-3/4 bg-gray-200 rounded" />
            <div className="h-4 w-1/3 bg-gray-100 rounded" />
            <div className="space-y-2 mt-4">
              <div className="h-3 w-full bg-gray-100 rounded" />
              <div className="h-3 w-5/6 bg-gray-100 rounded" />
              <div className="h-3 w-4/6 bg-gray-100 rounded" />
            </div>
            <div className="h-8 w-1/2 bg-gray-200 rounded mt-4" />
            <div className="h-12 w-full bg-gray-200 rounded-xl mt-4" />
            <div className="h-12 w-full bg-gray-100 rounded-xl" />
          </div>
        </div>
      ) : !product ? (
        <p className="text-sm text-gray-400 text-center py-20">Product not found</p>
      ) : (
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10">

        
          <div className="w-full lg:w-1/2">
           
            <div className="relative w-full rounded-2xl overflow-hidden bg-gray-50" style={{ paddingBottom: "100%" }}>
              <img
                src={product.images?.[imgIndex] || "/default.jpg"}
                alt={product.name}
                className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300"
              />
              {product.priceAfterOffer && (
                <span
                  className="absolute top-3 left-3 text-xs font-semibold text-white px-3 py-1 rounded-full"
                  style={{ background: "#50604A" }}
                >
                  Sale
                </span>
              )}
            </div>

            
            {product.images?.length > 1 && (
              <div className="flex justify-center gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImgIndex(i)}
                    className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-200"
                    style={{ borderColor: imgIndex === i ? "#50604A" : "transparent" }}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

        
          <div className="w-full lg:w-1/2 flex flex-col gap-5">
                <h1 className="uppercase">
                  {brand.brandName ||"null"}
</h1>
           
            <h2 className="text-xl sm:text-2xl font-bold text-[#22301D] leading-tight">
              {product.name}
            </h2>

         
            <div className="flex items-baseline gap-3">
              {product.priceAfterOffer ? (
                <>
                  <span className="text-2xl font-bold text-[#50604A]">
                    {product.priceAfterOffer} EGP
                  </span>
                  <span className="text-base text-gray-400 line-through">
                    {product.price} EGP
                  </span>
                  <span
                    className="text-xs font-semibold px-2 py-0.5 rounded-full text-white"
                    style={{ background: "#50604A" }}
                  >
                    {Math.round(((product.price - product.priceAfterOffer) / product.price) * 100)}% OFF
                  </span>
                </>
              ) : (
                <span className="text-2xl font-bold text-[#50604A]">
                  {product.price} EGP
                </span>
              )}
            </div>

      
            <p className="text-sm text-gray-500 leading-relaxed">
              {product.description}
            </p>

            <div className="border-t border-gray-100 my-1" />
            {isOutOfStock && (
              <p className="text-sm font-medium text-red-500">Out of stock</p>
            )}
            {isLowStock && (
              <p className="text-sm font-medium text-orange-500">
                🔥 Hurry up! Only {product.quantity} left
              </p>
            )}

            {!isOutOfStock && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 font-medium">Quantity</span>
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
                  >
                    −
                  </button>
                  <span className="w-10 text-center text-sm font-semibold text-[#22301D]">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => Math.min(maxQty, q + 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors text-lg font-medium"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs text-gray-400">{product.quantity} available</span>
              </div>
            )}

        
            {!isOutOfStock && (
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-4 py-3">
                <span className="text-sm text-gray-500">Total</span>
                <span className="text-base font-bold text-[#22301D]">
                  {(product.priceAfterOffer || product.price) * quantity} EGP
                </span>
              </div>
            )}

         
            <div className="flex flex-col gap-4 mt-1">
              <button
                disabled={isOutOfStock}
                className={`w-full py-3 rounded-xl text-sm font-semibold transition-all duration-200
                  ${isOutOfStock
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-[#50604A] text-white hover:opacity-90 active:scale-[.98] cursor-pointer"
                  }`}
              >
                {isOutOfStock ? "Out of stock" : "Add to cart"}
              </button>

              {!isOutOfStock && (
                <button
                  className="w-full py-3 rounded-xl text-sm font-semibold border border-[#50604A] text-[#50604A] hover:bg-[#50604A]/5 active:scale-[.98] transition-all duration-200 cursor-pointer"
                >
                  Buy now
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}