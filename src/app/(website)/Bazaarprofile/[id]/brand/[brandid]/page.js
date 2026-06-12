"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function BrandProfile() {
  const { id, brandid } = useParams();
  const router = useRouter();

  const [bazaardata, setBazaardata] = useState(null);
  const [branddata, setBranddata] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
   
        const bazaarRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands`
        );
        const bazaarJson = await bazaarRes.json();
        setBazaardata(bazaarJson?.data?.bazaar || null);

        const brands = bazaarJson?.data?.brands || [];
        const thisBrand = brands.find((b) => b._id === brandid) || null;
        setBranddata(thisBrand);

        // fetch products for this brand
        const prodRes = await fetch(
          `https://bazary-backend.vercel.app/api/events/live/${id}/brands/${brandid}/products`
        );
        const prodJson = await prodRes.json();
        console.log("product", prodJson)
        setProducts(prodJson?.data || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    }
    if (id && brandid) fetchAll();
  }, [id, brandid]);

  return (
    <div className="w-[95%] lg:w-[85%] mx-auto px-4 py-6 pb-12">

    
      <div
        className="relative w-full rounded-2xl overflow-hidden mb-6"
        style={{ aspectRatio: "21/9", minHeight: "160px" }}
      >
        <img
          src={bazaardata?.logoUrl || "/default.jpg"}
          alt="bazaar"
          className="w-full h-full object-cover block"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 55%, transparent 100%)",
          }}
        />

        <button
          onClick={() => router.push(`/Bazaarprofile/${id}`)}
          className="absolute top-4 left-4 flex items-center gap-1.5 text-xs text-white/90 px-3 py-1.5 rounded-full transition-all duration-200"
          style={{ background: "rgba(0,0,0,0.35)", border: "0.5px solid rgba(255,255,255,0.25)" }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back to bazaar
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-5 flex flex-col gap-1">
          <span
            className="inline-flex items-center gap-1.5 w-fit text-xs font-medium uppercase tracking-widest px-3 py-1 rounded-full"
            style={{ background: "rgb(80 96 74)", border: "1px solid rgba(212,168,83,0.45)", color: "#D4A853" }}
          >
            ✦ Exclusive Bazaar
          </span>
          {!loading && (
            <h1 className="text-base sm:text-xl font-semibold text-white leading-tight">
              {bazaardata?.bazaarName || "Bazaar Event"}
            </h1>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center gap-4 mb-6 animate-pulse">
          <div className="w-16 h-16 rounded-2xl bg-gray-200 flex-shrink-0" />
          <div className="space-y-2">
            <div className="h-5 w-36 bg-gray-200 rounded" />
            <div className="h-3 w-24 bg-gray-100 rounded" />
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4 mb-6">
          <img
            src={branddata?.logoUrl || "/default.jpg"}
            alt={branddata?.brandName}
            className="w-25 h-25 rounded-full object-cover flex-shrink-0 shadow-sm"
          />
          <div>
            <h2 className="text-lg font-bold text-[#22301D]">
              {branddata?.brandName || "Brand"}
            </h2>
            {branddata?.brandCategory && (
              <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {branddata.brandCategory}
              </span>
            )}
          </div>
        </div>
      )}

  
      <h3 className="font-bold text-base sm:text-lg text-[#22301D] mb-4">
        Products
      </h3>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="w-full animate-pulse">
              <div className="w-full bg-gray-200 rounded-2xl" style={{ paddingBottom: "100%" }} />
              <div className="mt-2 space-y-1.5 px-1">
                <div className="h-4 w-3/4 bg-gray-200 rounded" />
                <div className="h-3 w-1/2 bg-gray-100 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-12">No products available</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 w-full">
              {products.map((product) => (
                <div
                  onClick={() => router.push(`/Bazaarprofile/${id}/brand/${brandid}/product/${product._id}`)}
              key={product._id}
              className="w-full bg-white rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
             
              <div className="relative w-full" style={{ paddingBottom: "100%" }}>
                <img
                  src={product.images?.[0] || "/default.jpg"}
                  alt={product.name}
                  className="absolute inset-0 w-full h-full object-cover"
                />
               
                {product.priceAfterOffer && (
                  <span className="absolute top-2 left-2 text-xs font-semibold text-white  text-[16px] px-2 py-0.5 rounded-full"
                    style={{ background: "green" }}>
                    Sale
                  </span>
                )}
              </div>

            
              <div className="p-3">
                <h4 className="text-sm font-semibold text-[#22301D] leading-tight line-clamp-1">
                  {product.name}
                </h4>
           <p className="text-xs text-gray-400 mt-0.5 overflow-hidden text-ellipsis whitespace-nowrap  cursor-default">
  {product.description}
</p>
                <div className="flex items-center gap-2 mt-2">
                  {product.priceAfterOffer ? (
                    <>
                      <span className="text-sm font-bold text-[#50604A]">
                        {product.priceAfterOffer} EGP
                      </span>
                      <span className="text-xs text-gray-400 line-through">
                        {product.price} EGP
                      </span>
                    </>
                  ) : (
                    <span className="text-sm font-bold text-[#50604A]">
                      {product.price} EGP
                    </span>
                  )}
                </div>
            <div className="w-full mt-3">
  
  {product.quantity === 0 && (
    <p className="text-xs text-red-500 mb-1">Out of stock</p>
  )}

  {product.quantity > 0 && product.quantity <= 5 && (
    <p className="text-xs text-orange-500 mb-1">
      Hurry up! Only {product.quantity} left
    </p>
  )}

  <button
    disabled={product.quantity === 0}
    className={`w-full py-2 rounded-lg text-sm font-medium transition-all duration-200
      ${
        product.quantity === 0
          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
          : "bg-[#50604A] text-white hover:opacity-90 cursor-pointer"
      }
    `}
  >
    {product.quantity === 0
      ? "Out of stock"
      : "Add to cart"}
                  </button>
                    <button
   
    className={`w-full py-2  mt-2 rounded-lg text-sm font-medium  text-[#50604A] transition-all duration-200 border border-[#50604A] hover:scale-[.98] cursor-pointer 
    `}
     onClick={() => router.push(`/product/${product._id}`)}
  >
  See More
  </button>
</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}