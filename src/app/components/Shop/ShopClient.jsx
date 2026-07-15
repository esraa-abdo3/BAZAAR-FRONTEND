
"use client";

import React, { useState, useEffect } from 'react';
import ShopHero from './ShopHero';
import ShopSidebar from './ShopSidebar';
import BrandList from './BrandList';
import ProductGrid from './ProductGrid';
import ProductCard from './ProductCard';
import SpinWheelModal from './SpinWheelModal';
import { Sparkles } from "lucide-react";


export default function ShopClient() {
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [topLoading, setTopLoading] = useState(true);
  const [isSpinModalOpen, setIsSpinModalOpen] = useState(false);
  
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
  
  // Auto-open Spin Wheel Modal if user is logged in and hasn't played yet
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      const hasPlayed = localStorage.getItem("bazaarna_active_promo");
      if (token && !hasPlayed) {
        const timer = setTimeout(() => {
          setIsSpinModalOpen(true);
        }, 1500); // 1.5 seconds delay
        return () => clearTimeout(timer);
      }
    }
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


  return (
    <div className="bg-[#f8f9fa] min-h-screen pb-20">
      <ShopHero onSpinClick={() => setIsSpinModalOpen(true)} />
      
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
          
            <BrandList 
              brands={brands} 
              loading={loading}
            />


{/* Lucky Spin Promo Banner - Wheel peeking from the side */}
<div className="mb-10 rounded-3xl shadow-lg relative overflow-hidden bg-gradient-to-br from-[#F7F1E3] to-[#EDE0C8] border border-[#50604A]/10 min-h-[220px] flex items-center">

  {/* Background decorative blobs */}
  <div className="absolute top-[-60px] right-[-60px] w-52 h-52 bg-[#50604A]/5 rounded-full blur-2xl pointer-events-none" />
  <div className="absolute bottom-[-40px] right-[20%] w-32 h-32 bg-[#50604A]/5 rounded-full blur-xl pointer-events-none" />

  {/* Wheel bleeding off the left edge */}
  <div className="absolute left-8 top-1/2 -translate-y-1/2 -translate-x-[62%] md:-translate-x-[55%]">
    <div className="relative w-[240px] h-[240px] md:w-[300px] md:h-[300px] select-none">

      {/* Outer ring */}
      <div className="absolute inset-0 rounded-full border-[6px] border-[#50604A] shadow-2xl bg-[#50604A]" />

      {/* Wheel with real sectors + labels (SVG, same as SpinWheelModal) */}
      <div className="absolute inset-[5px] rounded-full overflow-hidden bg-white animate-[spin_25s_linear_infinite]">
        <svg viewBox="0 0 200 200" className="w-full h-full">
          {[
            { percent: 5, color: "#8DA9C4", label: "5% OFF" },
            { percent: 10, color: "#C2948A", label: "10% OFF" },
            { percent: 15, color: "#E6B89C", label: "15% OFF" },
            { percent: 20, color: "#C5C392", label: "20% OFF" },
            { percent: 25, color: "#9B8EB9", label: "25% OFF" },
            { percent: 30, color: "#D5A6BD", label: "30% OFF" },
            { percent: 50, color: "#50604A", label: "50% OFF" },
          ].map((sector, idx, arr) => {
            const totalSectors = arr.length;
            const angle = 360 / totalSectors;
            const startAngle = idx * angle - 90;
            const endAngle = (idx + 1) * angle - 90;

            const radStart = (startAngle * Math.PI) / 180;
            const radEnd = (endAngle * Math.PI) / 180;

            const x1 = 100 + 100 * Math.cos(radStart);
            const y1 = 100 + 100 * Math.sin(radStart);
            const x2 = 100 + 100 * Math.cos(radEnd);
            const y2 = 100 + 100 * Math.sin(radEnd);

            const midAngle = startAngle + angle / 2;
            const radMid = (midAngle * Math.PI) / 180;
            const tx = 100 + 65 * Math.cos(radMid);
            const ty = 100 + 65 * Math.sin(radMid);

            return (
              <g key={idx}>
                <path
                  d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
                  fill={sector.color}
                  stroke="#ffffff"
                  strokeWidth="1.5"
                />
                <text
                  x={tx}
                  y={ty}
                  fill="#ffffff"
                  fontSize="9"
                  fontWeight="bold"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
                  className="tracking-wider drop-shadow-sm font-sans"
                >
                  {sector.label}
                </text>
              </g>
            );
          })}
          <circle cx="100" cy="100" r="22" fill="#ffffff" stroke="#50604A" strokeWidth="4" />
        </svg>
      </div>

      {/* Center "SPIN" pin - static, doesn't rotate with the wheel */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#50604A] flex items-center justify-center font-bold text-[10px] tracking-wider text-[#50604A] shadow-md z-20">
        SPIN
      </div>
    </div>
  </div>

  {/* Content */}
  <div className="relative z-10 w-full md:w-3/5 lg:w-1/2 ml-auto text-left px-6 py-10 md:py-12 pl-[150px] sm:pl-[170px] md:pl-8">
    <div className="inline-flex items-center gap-1.5 bg-[#50604A] text-white px-3 py-1 rounded-full text-xs font-semibold w-max mb-2">
      <span>⭐ Summer Time Spin</span>
    </div>
    <h3 className="text-xl md:text-2xl font-bold text-[#2f3a29] mt-1">
      Spin the Wheel & Win!
    </h3>
    <p className="text-[#5c5648] text-sm max-w-xl leading-relaxed mt-2 mb-5">
      Take your chance on the Wheel of Fortune and unlock an exclusive
      discount code — up to 50% off, ready to use instantly at checkout.
    </p>

    <button
      onClick={() => setIsSpinModalOpen(true)}
      className="px-8 py-3.5 bg-[#9A5F4C] hover:bg-[#50604A] text-white font-bold rounded-full transition-all duration-300 shadow-md hover:shadow-lg active:scale-95 cursor-pointer border-none text-sm whitespace-nowrap"
    >
      Spin Now! 🎁
    </button>
  </div>
</div>

            {/* Top Selling Section - uses the dedicated top-products API */}
            {!topLoading && topProducts.length > 0 && (
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

      <SpinWheelModal 
        isOpen={isSpinModalOpen} 
        onClose={() => setIsSpinModalOpen(false)} 
      />
    </div>
  );
}