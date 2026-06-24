import React, { useState, useEffect } from 'react';
import ProductCard from './ProductCard';

export default function ProductGrid({ products, loading }) {
  const [visibleCount, setVisibleCount] = useState(8);


  useEffect(() => {
    setVisibleCount(8);
  }, [products]);

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((item) => (
          <div key={item} className="bg-white rounded-xl overflow-hidden shadow-sm border border-gray-100 animate-pulse h-[400px]">
            <div className="bg-gray-200 h-64 w-full"></div>
            <div className="p-5 flex flex-col gap-3">
              <div className="h-3 bg-gray-200 w-1/4 rounded"></div>
              <div className="h-5 bg-gray-200 w-3/4 rounded"></div>
              <div className="h-4 bg-gray-200 w-full rounded"></div>
              <div className="h-4 bg-gray-200 w-2/3 rounded"></div>
              <div className="flex justify-between mt-auto pt-4">
                <div className="h-6 bg-gray-200 w-1/3 rounded"></div>
                <div className="h-10 w-10 bg-gray-200 rounded-full"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div className="w-full h-64 flex flex-col items-center justify-center bg-gray-50 rounded-xl border border-gray-100">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-gray-300 mb-4">
          <circle cx="11" cy="11" r="8"></circle>
          <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
        </svg>
        <h3 className="text-xl font-medium text-gray-500 mb-2">No products found</h3>
        <p className="text-gray-400">Try adjusting your filters to find what you're looking for.</p>
      </div>
    );
  }

  const visibleProducts = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="flex flex-col gap-8 items-center">
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
        {visibleProducts.map((product, index) => (
          <ProductCard key={product._id} product={product} index={index} />
        ))}
      </div>
      
      {hasMore && (
        <button 
          onClick={() => setVisibleCount(prev => prev + 8)}
          className="px-8 py-3 bg-white border border-gray-200 text-gray-700 font-medium hover:border-primary hover:text-primary transition-colors duration-300 rounded-full shadow-sm cursor-pointer"
        >
          Show More Products
        </button>
      )}
    </div>
  );
}
