
// import React, { useState } from 'react';
// import Link from 'next/link';
// import { useCart } from '../../context/CartContext';
// import { useWishlist } from '../../context/WishlistContext';
// import { motion } from 'framer-motion';
// import StarRating from '../StarRating';
// import { FiHeart } from 'react-icons/fi';

// export default function ProductCard({ product, index = 0 }) {
//   const { cart, addToCart, updateCartQuantity, removeFromCart, openLogin, closeLogin } = useCart();
//   const { isInWishlist, toggleWishlist } = useWishlist();
//   const [isAdding, setIsAdding] = useState(false);
//   const brandId = product.brandId?._id || product.brandId;
//   const brandName = product.brandName || product.brandId?.brandName;
//   const bazaarId = product.bazaarId?._id || product.bazaarId;

//   const wishlisted = isInWishlist(product._id);

//   const productHref = bazaarId && brandId
//     ? `/Bazaarprofile/${bazaarId}/brand/${brandId}/product/${product._id}`
//     : `/product/${product._id}`;

//   const cartItem = cart?.items?.find((item) => {
//     const id = item.productId?._id || item.productId;
//     return id === product._id;
//   });

//   const handleAddToCart = async () => {
//     if (isAdding) return;
//     setIsAdding(true);
//     try {
//       await addToCart(product._id, bazaarId, 1);
//     } finally {
//       setIsAdding(false);
//     }
//   };

//   const handleIncrease = () => {
//     if (cartItem.quantity < product.quantity) {
//       updateCartQuantity(product._id, cartItem.quantity + 1);
//     }
//   };

//   const handleDecrease = () => {
//     if (cartItem.quantity <= 1) {
//       removeFromCart(product._id);
//     } else {
//       updateCartQuantity(product._id, cartItem.quantity - 1);
//     }
//   };

//   return (
//     <>
//       {openLogin && (
//         <div className="fixed inset-0  flex items-center justify-center z-50">
//           <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-md">
//             <h2 className="text-lg font-bold mb-2">Please login first</h2>
//             <p className="text-sm text-gray-500 mb-4">
//               You need to login to add products to cart
//             </p>
//             <div className="flex gap-2 justify-center">
//               <button
//                 onClick={() => (window.location.href = "/auth/login")}
//                 className="bg-[#50604A] text-white px-4 py-2 rounded-lg"
//               >
//                 Login
//               </button>
//               <button onClick={closeLogin} className="border px-4 py-2 rounded-lg">
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       <motion.div 
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.3, delay: index * 0.05 }}
//         className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
//       >
        
//         <div className="relative h-64 overflow-hidden bg-gray-50 flex items-center justify-center">
//           <Link href={productHref} className="w-full h-full block">
//             {product.images && product.images.length > 0 ? (
//               <img 
//                 src={product.images[0]} 
//                 alt={product.name} 
//                 className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
//               />
//             ) : (
//               <div className="w-full h-full flex items-center justify-center text-gray-300">
//                 <span className="text-sm uppercase tracking-widest font-medium">No Image</span>
//               </div>
//             )}
//           </Link>
          
//           {/* Badges */}
//           {product.priceAfterOffer && (
//             <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
//               Sale
//             </div>
//           )}

//           {/* Wishlist Heart Button */}
//           <button
//             onClick={(e) => {
//               e.preventDefault();
//               e.stopPropagation();
//               toggleWishlist(product, bazaarId);
//             }}
//             className="absolute top-3 right-3 z-10 w-8 h-8 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95"
//             title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
//           >
//             <FiHeart
//               size={18}
//               className={`transition-colors duration-200 ${
//                 wishlisted 
//                   ? "text-red-500 fill-red-500" 
//                   : "text-gray-600 group-hover/heart:text-red-500"
//               }`}
//             />
//           </button>
//         </div>

//         <div className="p-5 flex flex-col flex-grow">
//           <div className="flex justify-between items-start mb-2">
//             <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{brandName}</span>
//           </div>

//           {/* Rating row - only shows if the product has reviews */}
//           <div className="mb-1.5">
//             <StarRating avgRating={product.avgRating} ratingCount={product.ratingCount} />
//           </div>
          
//           <Link href={productHref}>
//             <h3 className="font-semibold text-gray-800 text-lg mb-1 hover:text-primary transition-colors line-clamp-1">{product.name}</h3>
//           </Link>
          
//           <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
          
//           <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
//             <div className="flex flex-col">
//               {product.priceAfterOffer ? (
//                 <div className="flex items-center gap-2">
//                   <span className="text-lg font-bold text-[#50604A]">{product.priceAfterOffer} EGP</span>
//                   <span className="text-sm text-gray-400 line-through">{product.price} EGP</span>
//                 </div>
//               ) : (
//                 <span className="text-lg font-bold text-[#50604A]">{product.price} EGP</span>
//               )}
//             </div>
            
//             {cartItem ? (
//               <div className="flex items-center bg-gray-100 rounded-full h-10 px-2 shadow-sm border border-gray-200">
//                 <button 
//                   onClick={handleDecrease}
//                   className="w-8 h-8 flex items-center justify-center text-lg font-medium text-gray-700 hover:text-black transition-colors"
//                 >
//                   −
//                 </button>
//                 <span className="w-8 text-center text-sm font-semibold text-gray-900">
//                   {cartItem.quantity}
//                 </span>
//                 <button 
//                   onClick={handleIncrease}
//                   disabled={cartItem.quantity >= product.quantity}
//                   className={`w-8 h-8 flex items-center justify-center text-lg font-medium transition-colors ${
//                     cartItem.quantity >= product.quantity ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-black'
//                   }`}
//                 >
//                   +
//                 </button>
//               </div>
//             ) : (
//               <button 
//                 onClick={handleAddToCart}
//                 disabled={!product.quantity || product.quantity <= 0 || isAdding}
//                 className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
//                   product.quantity > 0 
//                   ? 'bg-[#50604A] text-white hover:scale-[.98] shadow-md hover:shadow-lg  duration-200 cursor-pointer' 
//                   : 'bg-gray-200 text-gray-400 cursor-not-allowed'
//                 }`}
//                 title={product.quantity > 0 ? "Add to Cart" : "Out of Stock"}
//               >
//                 {isAdding ? (
//                   <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
//                     <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
//                     <line x1="3" y1="6" x2="21" y2="6"></line>
//                     <path d="M16 10a4 4 0 0 1-8 0"></path>
//                   </svg>
//                 )}
//               </button>
//             )}
//           </div>
//         </div>
//       </motion.div>
//     </>
//   );
// }
import React, { useState } from 'react';
import Link from 'next/link';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { motion } from 'framer-motion';
import StarRating from '../StarRating';
import { FiHeart } from 'react-icons/fi';

export default function ProductCard({ product, index = 0, compact = false }) {
  const { cart, addToCart, updateCartQuantity, removeFromCart, openLogin, closeLogin } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [isAdding, setIsAdding] = useState(false);
  const brandId = product.brandId?._id || product.brandId;
  const brandName = product.brandName || product.brandId?.brandName;
  const bazaarId = product.bazaarId?._id || product.bazaarId;

  // The wishlist endpoint returns a trimmed-down product object that often
  // doesn't include `quantity`/`stock` at all. Defaulting a missing value to
  // 0 made every wishlisted product look "Out of Stock" even when it had
  // plenty of stock. So: read whichever field is present, and only treat the
  // product as out of stock when we actually have a number and it's <= 0.
  const rawStock = product.stock ?? product.quantity;
  const hasStockInfo = rawStock !== undefined && rawStock !== null;
  const stockCount = hasStockInfo ? rawStock : Infinity;
  const isOutOfStock = hasStockInfo && stockCount <= 0;

  const wishlisted = isInWishlist(product._id);

  const productHref = bazaarId && brandId
    ? `/Bazaarprofile/${bazaarId}/brand/${brandId}/product/${product._id}`
    : `/product/${product._id}`;

  const cartItem = cart?.items?.find((item) => {
    const id = item.productId?._id || item.productId;
    return id === product._id;
  });

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addToCart(product._id, bazaarId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  const handleIncrease = () => {
    if (cartItem.quantity < stockCount) {
      updateCartQuantity(product._id, cartItem.quantity + 1);
    }
  };

  const handleDecrease = () => {
    if (cartItem.quantity <= 1) {
      removeFromCart(product._id);
    } else {
      updateCartQuantity(product._id, cartItem.quantity - 1);
    }
  };

  return (
    <>
      {openLogin && (
        <div className="fixed inset-0  flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[90%] max-w-sm text-center shadow-md">
            <h2 className="text-lg font-bold mb-2">Please login first</h2>
            <p className="text-sm text-gray-500 mb-4">
              You need to login to add products to cart
            </p>
            <div className="flex gap-2 justify-center">
              <button
                onClick={() => (window.location.href = "/auth/login")}
                className="bg-[#50604A] text-white px-4 py-2 rounded-lg"
              >
                Login
              </button>
              <button onClick={closeLogin} className="border px-4 py-2 rounded-lg">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: index * 0.05 }}
        className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full border border-gray-100"
      >
        
        <div className={`relative ${compact ? "h-36" : "h-64"} overflow-hidden bg-gray-50 flex items-center justify-center`}>
          <Link href={productHref} className="w-full h-full block">
            {product.images && product.images.length > 0 ? (
              <img 
                src={product.images[0]} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-300">
                <span className="text-sm uppercase tracking-widest font-medium">No Image</span>
              </div>
            )}
          </Link>
          
          {/* Badges */}
          {product.priceAfterOffer && (
            <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-sm uppercase tracking-wider">
              Sale
            </div>
          )}

          {/* Wishlist Heart Button */}
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleWishlist(product, bazaarId);
            }}
            className={`absolute ${compact ? "top-2 right-2 w-6 h-6" : "top-3 right-3 w-8 h-8"} z-10 rounded-full bg-white/80 hover:bg-white flex items-center justify-center shadow-md backdrop-blur-xs transition-all duration-200 cursor-pointer group/heart hover:scale-110 active:scale-95`}
            title={wishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            <FiHeart
              size={compact ? 14 : 18}
              className={`transition-colors duration-200 ${
                wishlisted 
                  ? "text-red-500 fill-red-500" 
                  : "text-gray-600 group-hover/heart:text-red-500"
              }`}
            />
          </button>
        </div>

        <div className={`${compact ? "p-3" : "p-5"} flex flex-col flex-grow`}>
          <div className="flex justify-between items-start mb-2">
            <span className="text-xs text-gray-500 uppercase tracking-wider font-medium">{brandName}</span>
          </div>

          {/* Rating row - only shows if the product has reviews */}
          {!compact && (
            <div className="mb-1.5">
              <StarRating avgRating={product.avgRating} ratingCount={product.ratingCount} />
            </div>
          )}
          
          <Link href={productHref}>
            <h3 className={`font-semibold text-gray-800 ${compact ? "text-sm" : "text-lg"} mb-1 hover:text-primary transition-colors line-clamp-1`}>{product.name}</h3>
          </Link>
          
          {!compact && (
            <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">{product.description}</p>
          )}
          
          <div className={`flex items-center justify-between mt-auto ${compact ? "pt-2" : "pt-4"} border-t border-gray-100`}>
            <div className="flex flex-col">
              {product.priceAfterOffer ? (
                <div className="flex items-center gap-2">
                  <span className={`${compact ? "text-sm" : "text-lg"} font-bold text-[#50604A]`}>{product.priceAfterOffer} EGP</span>
                  <span className="text-xs text-gray-400 line-through">{product.price} EGP</span>
                </div>
              ) : (
                <span className={`${compact ? "text-sm" : "text-lg"} font-bold text-[#50604A]`}>{product.price} EGP</span>
              )}
            </div>
            
            {cartItem ? (
              <div className={`flex items-center bg-gray-100 rounded-full ${compact ? "h-8 px-1" : "h-10 px-2"} shadow-sm border border-gray-200`}>
                <button 
                  onClick={handleDecrease}
                  className={`${compact ? "w-6 h-6 text-base" : "w-8 h-8 text-lg"} flex items-center justify-center font-medium text-gray-700 hover:text-black transition-colors`}
                >
                  −
                </button>
                <span className={`${compact ? "w-6" : "w-8"} text-center text-sm font-semibold text-gray-900`}>
                  {cartItem.quantity}
                </span>
                <button 
                  onClick={handleIncrease}
                  disabled={cartItem.quantity >= stockCount}
                  className={`${compact ? "w-6 h-6 text-base" : "w-8 h-8 text-lg"} flex items-center justify-center font-medium transition-colors ${
                    cartItem.quantity >= stockCount ? 'text-gray-300 cursor-not-allowed' : 'text-gray-700 hover:text-black'
                  }`}
                >
                  +
                </button>
              </div>
            ) : (
              <button 
                onClick={handleAddToCart}
                disabled={isOutOfStock || isAdding}
                className={`${compact ? "w-8 h-8" : "w-10 h-10"} rounded-full flex items-center justify-center transition-all ${
                  !isOutOfStock 
                  ? 'bg-[#50604A] text-white hover:scale-[.98] shadow-md hover:shadow-lg  duration-200 cursor-pointer' 
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                }`}
                title={!isOutOfStock ? "Add to Cart" : "Out of Stock"}
              >
                {isAdding ? (
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width={compact ? "14" : "18"} height={compact ? "14" : "18"} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                )}
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </>
  );
}