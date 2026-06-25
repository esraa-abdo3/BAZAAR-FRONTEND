import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function BrandList({ brands, loading }) {
  console.log("all brands", brands)
  const [showAll, setShowAll] = useState(false);
  
  if (loading) {
    return (
      <div className="mb-12">
        <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-2"> Our Brands</h2>
        <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar m-auto justify-center">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="flex flex-col  items-center gap-3 min-w-[100px] animate-pulse ">
              <div className="w-20 h-20 rounded-full bg-gray-200"></div>
              <div className="h-3 w-16 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (!brands || brands.length === 0) return null;

  const displayCount = 8; // How many to show initially
  const displayedBrands = showAll ? brands : brands.slice(0, displayCount);
  const hasMore = brands.length > displayCount;

  return (
    <div id="shop-brands" className="mb-12 p-6 rounded-xl">
      <div className="flex justify-between items-center mb-6 border-b pb-2">
        <h2 className="text-xl font-bold text-gray-800">Explore Brands</h2>
        {hasMore && (
          <button 
            onClick={() => setShowAll(!showAll)}
            className="text-sm font-medium text-primary hover:underline"
          >
            {showAll ? 'Show Less' : 'Show All'}
          </button>
        )}
      </div>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 transition-all duration-500`}
      >
        {displayedBrands.map((brand, index) => (
          <motion.div
            key={brand._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.05 }}
          >
            <Link 
              href={`/Bazaarprofile/${brand.bazaarId}/brand/${brand._id}`}
              className={`flex flex-col items-center justify-center p-4 cursor-pointer rounded-xl transition-all duration-300 hover:bg-gray-50 border border-transparent hover:border-gray-100 hover:shadow-sm`}
            >
            <div className={`w-30 h-30 rounded-full overflow-hidden mb-3 border-2 border-gray-100 shadow-sm group-hover:border-primary transition-all duration-300`}>
              {brand.logoUrl ? (
                <img 
                  src={brand.logoUrl} 
                  alt={brand.brandName} 
                  className="w-full h-full object-cover bg-white hover:scale-110 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                  <span className="text-gray-400 font-bold text-xl">{brand.brandName.charAt(0)}</span>
                </div>
              )}
            </div>
            <span className="text-sm text-center font-medium line-clamp-1 text-gray-700 hover:text-primary transition-colors">
              {brand.brandName}
            </span>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
