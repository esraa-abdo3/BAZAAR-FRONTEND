// "use client";

// import { useCart } from "../../context/CartContext";
// import Link from "next/link";
// import { FiTrash2 } from "react-icons/fi";

// export default function CartPage() {
//   const { cart, removeFromCart, clearCart, updateCartQuantity, addToCart, loading } = useCart();

//   const hasOutOfStockItems = cart?.items?.some(item => {
//     const maxQty = item.productId?.quantity ?? 0;
//     return maxQty <= 0 || item.quantity > maxQty;
//   });

//   const handleIncrease = async (item) => {
//     const productId = item.productId?._id || item.productId;
//     if (item.quantity === 0) {
//       await addToCart(productId);
//     } else {
//       await updateCartQuantity(productId, item.quantity + 1);
//     }
//   };

//   const handleDecrease = async (item) => {
//     const productId = item.productId?._id || item.productId;
//     if (item.quantity <= 1) {
//       await removeFromCart(productId);
//     } else {
//       await updateCartQuantity(productId, item.quantity - 1);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
//       </div>
//     );
//   }

//   if (!cart || !cart.items || cart.items.length === 0) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
//         <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-6">
//           <FiTrash2 className="w-16 h-16 text-gray-300" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
//         <p className="text-gray-500 mb-8 text-center max-w-md">
//           Looks like you haven't added anything to your cart yet. Explore our bazaars and find
//           something you love!
//         </p>
//         <Link
//           href="/explore"
//           className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
//         >
//           Explore Bazaars
//         </Link>
//       </div>
//     );
//   }

//   return (
//     <div className="container w-[95%] lg:w-[85%] mx-auto py-12 px-4 mt-20 min-h-screen">
//       <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

//       <div className="flex flex-col lg:flex-row gap-8">

//         {/* ── Cart Items ── */}
//         <div className="flex-1 space-y-4">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
//             <div className="p-6 space-y-6">
//               {cart.items.map((item, index) => {
//                 const maxQty = item.productId?.quantity ?? 999;
//                 const productId = item.productId?._id || item.productId;

//                 return (
//                   <div
//                     key={index}
//                     className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
//                   >
//                     {/* Image */}
//                     <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
//                       {item.productId?.images?.[0] ? (
//                         <img
//                           src={item.productId.images[0]}
//                           alt="Product"
//                           className="w-full h-full object-cover"
//                         />
//                       ) : (
//                         <span className="text-xs text-gray-400">No Image</span>
//                       )}
//                     </div>

//                     {/* Name + Price */}
//                     <div className="flex-1 text-center sm:text-left">
//                       <h3 className="text-lg font-semibold text-gray-800">
//                         {item.productId?.name || "Product Item"}
//                       </h3>
//                       <p className="text-sm text-gray-500 mt-1">{item.price} EGP</p>
//                       {maxQty <= 0 ? (
//                         <span className="text-red-500 text-xs font-semibold block mt-1">Out of Stock</span>
//                       ) : item.quantity > maxQty ? (
//                         <span className="text-orange-500 text-xs font-semibold block mt-1">Insufficient stock (only {maxQty} left)</span>
//                       ) : null}
//                     </div>

//                     {/* Quantity Controls */}
//                     <div className="flex items-center gap-4">
//                       <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
//                         {/* − */}
//                         <button
//                           onClick={() => handleDecrease(item)}
//                           className="w-9 h-9 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
//                         >
//                           −
//                         </button>

//                         <span className="w-10 text-center text-sm font-semibold text-gray-800">
//                           {item.quantity}
//                         </span>

//                         {/* + */}
//                         <button
//                           onClick={() => handleIncrease(item)}
//                           disabled={item.quantity >= maxQty}
//                           className={`w-9 h-9 flex items-center justify-center text-lg font-medium transition-colors
//                             ${item.quantity >= maxQty
//                               ? "text-gray-300 cursor-not-allowed"
//                               : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
//                             }`}
//                         >
//                           +
//                         </button>
//                       </div>

//                       {/* Subtotal */}
//                       <p className="font-bold text-gray-900 min-w-[80px] text-right">
//                         {item.price * item.quantity} EGP
//                       </p>

//                       {/* Remove */}
//                       <button
//                         onClick={() => removeFromCart(productId)}
//                         className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
//                         title="Remove Item"
//                       >
//                         <FiTrash2 size={20} />
//                       </button>
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>

//             <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
//               <button
//                 onClick={clearCart}
//                 className="text-sm text-red-500 font-medium hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
//               >
//                 Clear Cart
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* ── Order Summary ── */}
//         <div className="w-full lg:w-96">
//           <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
//             <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

//             <div className="space-y-4 mb-6">
//               <div className="flex justify-between text-gray-600">
//                 <span>
//                   Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)
//                 </span>
//                 <span>{cart.totalAmount} EGP</span>
//               </div>
//               <div className="flex justify-between text-gray-600">
//                 <span>Shipping</span>
//                 <span className="text-green-500">Free</span>
//               </div>
//               <div className="border-t border-gray-100 pt-4 mt-4">
//                 <div className="flex justify-between items-center">
//                   <span className="text-lg font-bold text-gray-900">Total</span>
//                   <span className="text-2xl font-bold text-primary">{cart.totalAmount} EGP</span>
//                 </div>
//               </div>
//             </div>

//             {hasOutOfStockItems ? (
//               <button
//                 disabled
//                 className="w-full flex items-center justify-center bg-gray-200 text-gray-400 py-4 rounded-xl font-bold text-m cursor-not-allowed border border-gray-300"
//               >
//                 Proceed to Checkout
//               </button>
//             ) : (
//               <Link
//                 href="/checkout"
//                 className="w-full flex items-center justify-center bg-[#50604A] text-white py-4 rounded-xl font-bold text-m hover:brightness-110 transition-all hover:shadow-lg hover:shadow-[#50604A]/30 active:scale-[.98]"
//               >
//                 Proceed to Checkout
//               </Link>
//             )}

//             {hasOutOfStockItems && (
//               <p className="text-xs text-red-500 text-center mt-2 font-medium">
//                 Please adjust quantities of out-of-stock items to proceed.
//               </p>
//             )}

//             <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
//               <span>Secure checkout powered by</span>
//               <span className="font-semibold text-gray-600">stripe</span>
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";

import { useCart } from "../../context/CartContext";
import Link from "next/link";
import { FiTrash2 } from "react-icons/fi";

function CartSkeleton() {
  return (
    <div className="container w-[95%] lg:w-[85%] mx-auto py-12 px-4 mt-20 min-h-screen animate-pulse">
      <div className="h-8 w-48 bg-gray-200 rounded-lg mb-8" />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* ── Cart Items skeleton ── */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {[...Array(3)].map((_, index) => (
                <div
                  key={index}
                  className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b border-gray-50 last:border-0 last:pb-0"
                >
                  <div className="w-24 h-24 bg-gray-200 rounded-xl flex-shrink-0" />

                  <div className="flex-1 w-full space-y-2">
                    <div className="h-4 w-40 bg-gray-200 rounded mx-auto sm:mx-0" />
                    <div className="h-3 w-20 bg-gray-200 rounded mx-auto sm:mx-0" />
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="h-9 w-28 bg-gray-200 rounded-xl" />
                    <div className="h-4 w-16 bg-gray-200 rounded" />
                    <div className="h-9 w-9 bg-gray-200 rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 bg-gray-50 border-t border-gray-100">
              <div className="h-4 w-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* ── Order Summary skeleton ── */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            <div className="h-6 w-36 bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="h-4 w-full bg-gray-200 rounded" />
            <div className="border-t border-gray-100 pt-4 mt-4">
              <div className="h-6 w-full bg-gray-200 rounded" />
            </div>
            <div className="h-12 w-full bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CartPage() {
  const { cart, removeFromCart, clearCart, updateCartQuantity, addToCart, loading } = useCart();

  const outOfStockItems = cart?.items?.filter(item => {
    const maxQty = item.productId?.quantity ?? 999;
    return maxQty <= 0 || item.quantity > maxQty;
  }) || [];

  const hasOutOfStockItems = outOfStockItems.length > 0;

  const handleIncrease = async (item) => {
    const productId = item.productId?._id || item.productId;
    if (item.quantity === 0) {
      await addToCart(productId);
    } else {
      await updateCartQuantity(productId, item.quantity + 1);
    }
  };

  const handleDecrease = async (item) => {
    const productId = item.productId?._id || item.productId;
    if (item.quantity <= 1) {
      await removeFromCart(productId);
    } else {
      await updateCartQuantity(productId, item.quantity - 1);
    }
  };

  if (loading) {
    return <CartSkeleton />;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4 mt-20">
        <div className="w-40 h-40 bg-gray-50 rounded-full flex items-center justify-center mb-6">
          <FiTrash2 className="w-16 h-16 text-gray-300" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8 text-center max-w-md">
          Looks like you haven't added anything to your cart yet. Explore our bazaars and find
          something you love!
        </p>
        <Link
          href="/explore"
          className="bg-primary text-white px-8 py-3 rounded-xl font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
        >
          Explore Bazaars
        </Link>
      </div>
    );
  }

  return (
    <div className="container w-[95%] lg:w-[85%] mx-auto py-12 px-4 mt-20 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

      <div className="flex flex-col lg:flex-row gap-8">

        {/* ── Cart Items ── */}
        <div className="flex-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 space-y-6">
              {cart.items.map((item, index) => {
                const maxQty = item.productId?.quantity ?? 999;
                const productId = item.productId?._id || item.productId;
                const isFlagged = maxQty <= 0 || item.quantity > maxQty;

                return (
                  <div
                    key={index}
                    className={`flex flex-col sm:flex-row items-center gap-6 pb-6 border-b last:border-0 last:pb-0 ${
                      isFlagged
                        ? "border-red-100 bg-red-50/40 -mx-6 px-6 rounded-xl"
                        : "border-gray-50"
                    }`}
                  >
                    {/* Image */}
                    <div className="w-24 h-24 bg-gray-100 rounded-xl flex-shrink-0 overflow-hidden flex items-center justify-center">
                      {item.productId?.images?.[0] ? (
                        <img
                          src={item.productId.images[0]}
                          alt="Product"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs text-gray-400">No Image</span>
                      )}
                    </div>

                    {/* Name + Price */}
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {item.productId?.name || "Product Item"}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1">{item.price} EGP</p>
                      {maxQty <= 0 ? (
                        <span className="text-red-500 text-xs font-semibold block mt-1">Out of Stock</span>
                      ) : item.quantity > maxQty ? (
                        <span className="text-orange-500 text-xs font-semibold block mt-1">Insufficient stock (only {maxQty} left)</span>
                      ) : null}
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4">
                      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                        {/* − */}
                        <button
                          onClick={() => handleDecrease(item)}
                          className="w-9 h-9 flex items-center justify-center text-lg font-medium text-gray-600 hover:bg-gray-50 active:bg-gray-100 transition-colors"
                        >
                          −
                        </button>

                        <span className="w-10 text-center text-sm font-semibold text-gray-800">
                          {item.quantity}
                        </span>

                        {/* + */}
                        <button
                          onClick={() => handleIncrease(item)}
                          disabled={item.quantity >= maxQty}
                          className={`w-9 h-9 flex items-center justify-center text-lg font-medium transition-colors
                            ${item.quantity >= maxQty
                              ? "text-gray-300 cursor-not-allowed"
                              : "text-gray-600 hover:bg-gray-50 active:bg-gray-100"
                            }`}
                        >
                          +
                        </button>
                      </div>

                      {/* Subtotal */}
                      <p className="font-bold text-gray-900 min-w-[80px] text-right">
                        {item.price * item.quantity} EGP
                      </p>

                      {/* Remove */}
                      <button
                        onClick={() => removeFromCart(productId)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        title="Remove Item"
                      >
                        <FiTrash2 size={20} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-4 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
              <button
                onClick={clearCart}
                className="text-sm text-red-500 font-medium hover:text-red-600 px-4 py-2 hover:bg-red-50 rounded-lg transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
        </div>

        {/* ── Order Summary ── */}
        <div className="w-full lg:w-96">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between text-gray-600">
                <span>
                  Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)
                </span>
                <span>{cart.totalAmount} EGP</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span className="text-green-500">Free</span>
              </div>
              <div className="border-t border-gray-100 pt-4 mt-4">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-bold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-primary">{cart.totalAmount} EGP</span>
                </div>
              </div>
            </div>

            {hasOutOfStockItems ? (
              <button
                disabled
                className="w-full flex items-center justify-center bg-gray-200 text-gray-400 py-4 rounded-xl font-bold text-m cursor-not-allowed border border-gray-300"
              >
                Proceed to Checkout
              </button>
            ) : (
              <Link
                href="/checkout"
                className="w-full flex items-center justify-center bg-[#50604A] text-white py-4 rounded-xl font-bold text-m hover:brightness-110 transition-all hover:shadow-lg hover:shadow-[#50604A]/30 active:scale-[.98]"
              >
                Proceed to Checkout
              </Link>
            )}

            {hasOutOfStockItems && (
              <p className="text-xs text-red-500 text-center mt-2 font-medium">
                Please remove or adjust the item{outOfStockItems.length > 1 ? "s" : ""} marked in red above to proceed.
              </p>
            )}

            <p className="text-xs text-gray-400 text-center mt-4 flex items-center justify-center gap-1">
              <span>Secure checkout powered by</span>
              <span className="font-semibold text-gray-600">stripe</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}