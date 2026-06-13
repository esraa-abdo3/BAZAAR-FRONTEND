"use client";

export default function Upcomingbazaar({ upcoming }) {
  const bazaars = upcoming?.data || [];
  const getDaysLeft = (startDate) => {
  const now = new Date();
  const start = new Date(startDate);

  const diff = start - now;

  if (diff <= 0) {
    return "Started";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));

  return `${days} DAYS LEFT`;
};

  return (
    <section id="upcoming-bazaars" className=" w-[100%] lg:w-[90%] py-10">
     
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold">
          Upcoming <span className="text-[#50604a]">BAZAAR</span>
        </h2>
     <p className="text-[#22301D] mt-2">
  Register now and enjoy a unique bazaar experience with amazing vendors, exclusive products, and memorable moments.
</p>
      </div>

      <div className="relative">
      <div className="flex gap-4 overflow-x-auto scroll-smooth custom-scrollbar px-4 py-5">
          {bazaars.map((item, idx) => (
            <div
              key={idx}
              className="w-[180px] lg:w-[300px] bg-white rounded-2xl shadow-md overflow-hidden flex-shrink-0"
            >
           
              <div className=" h-[180px] lg:h-[320px] w-full overflow-hidden">
                <img
                  src={item.logoUrl}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

         
              <div className="p-4">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-[#22301D] mt-1 line-clamp-2">
                  {item.bazaarDescription}
                </p>

                <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
              
                  <span>{getDaysLeft(item.startDate)}</span>
                </div>
                {item.isAcceptingBrands && (
                      <button className="mt-4 w-full bg-[#50604a] text-white py-2 rounded-lg hover:scale-[.98] transition-all duration-300 cursor-pointer">
                  Join now
                </button>
                  
)
}
            
              </div>
            </div>
          ))}
        </div>
      </div>


    </section>
  );
}