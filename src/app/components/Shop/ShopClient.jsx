
"use client";

import React, { useState, useEffect } from 'react';
import ShopHero from './ShopHero';
import ShopSidebar from './ShopSidebar';
import BrandList from './BrandList';
import ProductGrid from './ProductGrid';
import ProductCard from './ProductCard';


export default function ShopClient() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  
  // Filtering state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceFilter, setPriceFilter] = useState('all');
  const [ratingFilter, setRatingFilter] = useState(0); 
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const brandsRes = await fetch('https://bazary-backend.vercel.app/api/events/live/brands');
        const brandsData = await brandsRes.json();
        
        
        const productsRes = await fetch('https://bazary-backend.vercel.app/api/events/live/products');
        const productsData = await productsRes.json();

        
        if (brandsData.status === 'success') {
          setBrands(brandsData.data);
        }
        
        if (productsData.status === 'success') {
          setProducts(productsData.data);
      
        }
      } catch (error) {
        console.error('Error fetching shop data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

 
  useEffect(() => {
    const fetchTopProducts = async () => {
      try {
        setTopLoading(true);
        const res = await fetch('https://bazary-backend.vercel.app/api/events/live/top-products?limit=2');
        const data = await res.json();
        if (data.status === 'success') {
     
          setTopProducts(data.data || []);
          
        }
      } catch (error) {
        console.error('Error fetching top products:', error);
      } finally {
        setTopLoading(false);
      }
    };

    fetchTopProducts();
  }, []);
  

  // Extract unique categories from products/brands
  const categories = Array.from(new Set(brands.map(b => b.brandCategory).filter(Boolean)));

  // Filter products
  const filteredProducts = products.filter(product => {
    let match = true;

    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      match = match && (
        product.name.toLowerCase().includes(q) || 
        (product.description && product.description.toLowerCase().includes(q))
      );
    }

    // Category filter
    if (selectedCategory) {
      const brandForProduct = brands.find(b => b._id === product.brandId || b.brandName === product.brandName);
      if (brandForProduct) {
        match = match && brandForProduct.brandCategory === selectedCategory;
      } else {
        match = false;
      }
    }

    // Price filter
    if (priceFilter !== 'all') {
      const price = product.priceAfterOffer || product.price;
      if (priceFilter === 'under500') {
        match = match && price < 500;
      } else if (priceFilter === '500to1000') {
        match = match && price >= 500 && price <= 1000;
      } else if (priceFilter === 'over1000') {
        match = match && price > 1000;
      }
    }

    // Rating filter - "X & up" means avgRating >= X
    if (ratingFilter > 0) {
      match = match && (product.avgRating || 0) >= ratingFilter;
    }

    return match;
  });

  const hasActiveFilter = searchQuery || selectedCategory || priceFilter !== 'all' || ratingFilter !== 0;

  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <ShopHero />
      
      <div id="shop-main" className="container w-[90%] md:w-[85%] m-auto pt-16">
        
        {/* Search Bar Mobile (Desktop can use it too) */}
        <div className="mb-8 flex justify-between items-center bg-white p-2 rounded-full shadow-sm border border-gray-100 max-w-xl mx-auto md:mx-0 lg:hidden">
          <input 
            type="text" 
            placeholder="Search products..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-2 outline-none rounded-full bg-transparent"
          />
          <button className="bg-primary text-white p-2.5 rounded-full hover:bg-black transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="w-full lg:w-1/4 xl:w-1/5 hidden lg:block">
            {/* Desktop Search */}
            <div className="mb-6 bg-white p-2 rounded-full shadow-sm border border-gray-100 flex">
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 outline-none rounded-full bg-transparent text-sm"
              />
              <div className="text-gray-400 p-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>
            </div>

            <ShopSidebar 
              categories={categories}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              priceFilter={priceFilter}
              onPriceFilterChange={setPriceFilter}
              ratingFilter={ratingFilter}
              onRatingFilterChange={setRatingFilter}
            />
          </div>

          {/* Main Content */}
          <div className="w-full lg:w-3/4 xl:w-4/5">
            {/* Brand List Component */}
            <BrandList 
              brands={brands} 
              loading={loading}
            />

            {/* Top Selling Section - uses the dedicated top-products API */}
            {!topLoading && topProducts.length > 0 && !hasActiveFilter && (
              <div className="mb-12">
                <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">Top Selling</h2>
                    <p className="text-gray-500 mt-1">Our most popular items this week</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {topProducts.map((product, index) => (
                    <ProductCard key={`top-${product._id}`} product={product} index={index} />
                  ))}
                </div>
              </div>
            )}

            {/* Header for Products */}
            <div className="flex justify-between items-end mb-6 border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 uppercase tracking-wider">Our Collection</h2>
                <p className="text-gray-500 mt-1">Showing {filteredProducts.length} results</p>
              </div>
              
              {/* Mobile Filter Button */}
              <button className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-md shadow-sm font-medium text-gray-700">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="4" y1="21" x2="4" y2="14"></line>
                  <line x1="4" y1="10" x2="4" y2="3"></line>
                  <line x1="12" y1="21" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12" y2="3"></line>
                  <line x1="20" y1="21" x2="20" y2="16"></line>
                  <line x1="20" y1="12" x2="20" y2="3"></line>
                  <line x1="1" y1="14" x2="7" y2="14"></line>
                  <line x1="9" y1="8" x2="15" y2="8"></line>
                  <line x1="17" y1="16" x2="23" y2="16"></line>
                </svg>
                Filters
              </button>
            </div>

         
            <ProductGrid 
              products={filteredProducts} 
              loading={loading} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}