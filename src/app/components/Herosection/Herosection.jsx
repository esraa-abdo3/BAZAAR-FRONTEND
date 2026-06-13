export default function HeroSection() {
  return (
    <section className="relative w-[90%] m-auto my-2 h-screen min-h-[600px] overflow-hidden font-sans rounded-[8px]  mt-20">
      <div className="absolute inset-0">
        <img
          src="/Hero Section.png"
          alt="Bazar marketplace"
                  className="w-full h-full object-cover  "
                 
        />
     
      
      </div>

  
      <div className="absolute bottom-6 left-6 z-10">
        <span
          className="text-[#4C5B45] text-[10px] tracking-[0.2em] uppercase border border-white/30 rounded-full px-3 py-1 bg-[#DFF0D4] cursor-default"
        >
          The Future of Commerce
        </span>
      </div>

    
           
 <div className="relative z-10 flex flex-col justify-center items-center text-center h-full px-10 md:px-16 max-w-3xl mx-auto">
  <h1 className="text-white text-5xl md:text-6xl font-light leading-tight mb-8">
                  From Offline{" "}
                    <br/>
    <span
      className="font-bold italic"
      style={{ color: "#A8B87A" }}
    >
      BAZAAR
 </span>
  
    <br />
    to Online  Marketplace
  </h1>

  <div className="flex gap-4 flex-wrap justify-center">
    <button
      className="px-6 py-3 rounded-[8px] text-white text-m font-medium  backdrop-blur-sm transition-all duration-300 hover:scale-[.98]  cursor-pointer"
      style={{ background: "rgba(90, 100, 70, 0.55)" }}
    >
      Create a Bazaar
    </button>

    <button
      className="px-6 py-3 rounded-[8px] text-gray-900 text-m font-medium bg-white transition-all duration-300 hover:bg-white/90 cursor-pointer"
    >
      Learn More
    </button>
  </div>
</div>
                
    </section>
  );
}