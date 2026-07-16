import React from 'react';

import { motion } from 'framer-motion';

export default function ShopHero({ onSpinClick }) {
  return (
    <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] overflow-hidden bg-[#f8f9fa] mt-[0px]">
    
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: "url('/shopback.png')" }}
      >
       
        <div className="absolute inset-0 bg-black/30"></div>
      </div>

   
      <div className="relative z-10 container w-[85%] m-auto h-full flex flex-col justify-center items-start text-white">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-2xl"
        >
          <h1 className="text-4xl md:text-5xl lg:text-7xl font-bold mb-4 uppercase tracking-wider leading-tight">
            Wear Your <br/>
            <span className="text-primary">Confidence</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-lg">
            Shop the latest trends from our exclusive live bazaars. Trendy pieces. Timeless style. Support local brands and find unique products crafted just for you.
          </p>
          
          <div className="flex flex-wrap gap-4">
             <button 
               onClick={() => {
                 document.getElementById("shop-main")?.scrollIntoView({ behavior: "smooth" });
               }}
               className="px-8 py-3 bg-primary text-white font-medium uppercase tracking-wider hover:bg-black hover:text-white transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-sm cursor-pointer"
             >
               Shop New In
             </button>
             <button 
               onClick={() => {
                 document.getElementById("shop-brands")?.scrollIntoView({ behavior: "smooth" });
               }}
               className="px-8 py-3 bg-transparent border border-white text-white font-medium uppercase tracking-wider hover:bg-white hover:text-black transition-all duration-300 rounded-full shadow-lg hover:shadow-xl text-sm cursor-pointer"
             >
               Explore Brands
             </button>
        
          </div>
        </motion.div>
      </div>
    </div>
  );
}
