// import React from 'react';

// export default function ShopSidebar({ 
//   categories, 
//   selectedCategory, 
//   onSelectCategory,
//   priceFilter,
//   onPriceFilterChange
// }) {
//   return (
//     <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
  
//       <div className="mb-8">
//         <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b uppercase tracking-wider">Categories</h3>
//         <ul className="space-y-3">
//           <li 
//             onClick={() => onSelectCategory(null)}
//             className={`cursor-pointer transition-colors flex items-center justify-between group ${
//               selectedCategory === null ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
//             }`}
//           >
//             <span>All Categories</span>
//             {selectedCategory === null && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
//           </li>
          
//           {categories.map((cat, idx) => (
//             <li 
//               key={idx}
//               onClick={() => onSelectCategory(cat)}
//               className={`cursor-pointer transition-colors flex items-center justify-between group ${
//                 selectedCategory === cat ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
//               }`}
//             >
//               <span className="capitalize">{cat}</span>
//               {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
//             </li>
//           ))}
//         </ul>
//       </div>

//       {/* Price Filter */}
//       <div>
//         <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b uppercase tracking-wider">Filter by Price</h3>
//         <div className="space-y-4">
//           <label className="flex items-center gap-3 cursor-pointer group">
//             <input 
//               type="radio" 
//               name="price" 
//               checked={priceFilter === 'all'} 
//               onChange={() => onPriceFilterChange('all')}
//               className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
//             />
//             <span className="text-gray-600 group-hover:text-primary transition-colors">All Prices</span>
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer group">
//             <input 
//               type="radio" 
//               name="price" 
//               checked={priceFilter === 'under500'} 
//               onChange={() => onPriceFilterChange('under500')}
//               className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
//             />
//             <span className="text-gray-600 group-hover:text-primary transition-colors">Under 500 EGP</span>
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer group">
//             <input 
//               type="radio" 
//               name="price" 
//               checked={priceFilter === '500to1000'} 
//               onChange={() => onPriceFilterChange('500to1000')}
//               className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
//             />
//             <span className="text-gray-600 group-hover:text-primary transition-colors">500 - 1000 EGP</span>
//           </label>
//           <label className="flex items-center gap-3 cursor-pointer group">
//             <input 
//               type="radio" 
//               name="price" 
//               checked={priceFilter === 'over1000'} 
//               onChange={() => onPriceFilterChange('over1000')}
//               className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
//             />
//             <span className="text-gray-600 group-hover:text-primary transition-colors">Over 1000 EGP</span>
//           </label>
//         </div>
//       </div>
      
//       {/* Reset Filters */}
//       {(selectedCategory !== null || priceFilter !== 'all') && (
//         <div className="mt-8 pt-6 border-t border-gray-100">
//           <button 
//             onClick={() => {
//               onSelectCategory(null);
//               onPriceFilterChange('all');
//             }}
//             className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
//           >
//             Clear All Filters
//           </button>
//         </div>
//       )}
//     </div>
//   );
// }
import React from 'react';

export default function ShopSidebar({ 
  categories, 
  selectedCategory, 
  onSelectCategory,
  priceFilter,
  onPriceFilterChange,
  ratingFilter,
  onRatingFilterChange
}) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 sticky top-24">
  
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b uppercase tracking-wider">Categories</h3>
        <ul className="space-y-3">
          <li 
            onClick={() => onSelectCategory(null)}
            className={`cursor-pointer transition-colors flex items-center justify-between group ${
              selectedCategory === null ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
            }`}
          >
            <span>All Categories</span>
            {selectedCategory === null && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
          </li>
          
          {categories.map((cat, idx) => (
            <li 
              key={idx}
              onClick={() => onSelectCategory(cat)}
              className={`cursor-pointer transition-colors flex items-center justify-between group ${
                selectedCategory === cat ? 'text-primary font-medium' : 'text-gray-600 hover:text-primary'
              }`}
            >
              <span className="capitalize">{cat}</span>
              {selectedCategory === cat && <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>}
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b uppercase tracking-wider">Filter by Price</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="price" 
              checked={priceFilter === 'all'} 
              onChange={() => onPriceFilterChange('all')}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors">All Prices</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="price" 
              checked={priceFilter === 'under500'} 
              onChange={() => onPriceFilterChange('under500')}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors">Under 500 EGP</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="price" 
              checked={priceFilter === '500to1000'} 
              onChange={() => onPriceFilterChange('500to1000')}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors">500 - 1000 EGP</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="price" 
              checked={priceFilter === 'over1000'} 
              onChange={() => onPriceFilterChange('over1000')}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors">Over 1000 EGP</span>
          </label>
        </div>
      </div>

      {/* Rating Filter */}
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b uppercase tracking-wider">Filter by Rating</h3>
        <div className="space-y-4">
          <label className="flex items-center gap-3 cursor-pointer group">
            <input 
              type="radio" 
              name="rating" 
              checked={ratingFilter === 0} 
              onChange={() => onRatingFilterChange(0)}
              className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
            />
            <span className="text-gray-600 group-hover:text-primary transition-colors">All Ratings</span>
          </label>
          {[4, 3, 2, 1].map((stars) => (
            <label key={stars} className="flex items-center gap-3 cursor-pointer group">
              <input 
                type="radio" 
                name="rating" 
                checked={ratingFilter === stars} 
                onChange={() => onRatingFilterChange(stars)}
                className="w-4 h-4 text-primary focus:ring-primary border-gray-300"
              />
              <span className="flex items-center gap-1 text-gray-600 group-hover:text-primary transition-colors">
                <span className="flex items-center">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <svg
                      key={i}
                      xmlns="http://www.w3.org/2000/svg"
                      width="14"
                      height="14"
                      viewBox="0 0 24 24"
                      fill={i <= stars ? "#D4A853" : "none"}
                      stroke={i <= stars ? "#D4A853" : "#d1d5db"}
                      strokeWidth="1.5"
                    >
                      <path d="M12 2.5l2.81 6.63 7.19.62-5.46 4.73 1.64 7.02L12 17.77l-6.18 3.73 1.64-7.02-5.46-4.73 7.19-.62L12 2.5z" />
                    </svg>
                  ))}
                </span>
                <span>& Up</span>
              </span>
            </label>
          ))}
        </div>
      </div>
      
      {/* Reset Filters */}
      {(selectedCategory !== null || priceFilter !== 'all' || ratingFilter !== 0) && (
        <div className="mt-8 pt-6 border-t border-gray-100">
          <button 
            onClick={() => {
              onSelectCategory(null);
              onPriceFilterChange('all');
              onRatingFilterChange(0);
            }}
            className="w-full py-2 bg-gray-100 text-gray-700 font-medium rounded-md hover:bg-gray-200 transition-colors"
          >
            Clear All Filters
          </button>
        </div>
      )}
    </div>
  );
}