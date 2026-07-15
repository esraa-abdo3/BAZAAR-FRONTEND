// "use client";

// import React, { useState, useEffect, useRef } from "react";
// import { motion, AnimatePresence } from "framer-motion";
// import { X, Copy, Check, Star, Trophy, Award } from "lucide-react";
// import { useRouter } from "next/navigation";

// const SECTORS = [
//   { percent: 5, color: "#8DA9C4", label: "5% OFF" },
//   { percent: 10, color: "#C2948A", label: "10% OFF" },
//   { percent: 15, color: "#E6B89C", label: "15% OFF" },
//   { percent: 20, color: "#C5C392", label: "20% OFF" },
//   { percent: 25, color: "#9B8EB9", label: "25% OFF" },
//   { percent: 30, color: "#D5A6BD", label: "30% OFF" },
//   { percent: 50, color: "#50604A", label: "50% OFF" },
// ];

// export default function SpinWheelModal({ isOpen, onClose }) {
//   const router = useRouter();
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [isSpinning, setIsSpinning] = useState(false);
//   const [mustLoginPrompt, setMustLoginPrompt] = useState(false);
//   const [wheelRotation, setWheelRotation] = useState(0);
//   const [winningSector, setWinningSector] = useState(null);
//   const [promoCode, setPromoCode] = useState("");
//   const [copied, setCopied] = useState(false);
//   const [showConfetti, setShowConfetti] = useState(false);
//   const [hasPlayed, setHasPlayed] = useState(false);

//   const wheelRef = useRef(null);

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("token");
//       setIsLoggedIn(!!token);
      
//       // Load saved promo if any
//       const savedPromo = localStorage.getItem("bazaarna_active_promo");
//       if (savedPromo) {
//         setPromoCode(savedPromo);
//         setHasPlayed(true);
//       }
//     }
//   }, [isOpen]);

//   const spinTheWheel = () => {
//     if (isSpinning) return;

//     setIsSpinning(true);
//     setWinningSector(null);
//     setShowConfetti(false);

//     // Pick random sector
//     const sectorIndex = Math.floor(Math.random() * SECTORS.length);
//     const sector = SECTORS[sectorIndex];

//     const totalSectors = SECTORS.length;
//     const sectorDegrees = 360 / totalSectors;
    
//     // Middle degree of the winning sector
//     const targetSectorDegrees = (sectorIndex * sectorDegrees) + (sectorDegrees / 2);
    
//     const spins = 6 + Math.floor(Math.random() * 4); // 6 to 9 spins
//     const totalRotation = (spins * 360) + (360 - targetSectorDegrees); 

//     setWheelRotation(totalRotation);

//     setTimeout(() => {
//       setIsSpinning(false);
//       setWinningSector(sector);
//       setShowConfetti(true);
//       setHasPlayed(true);

//       // Generate unique promo code: BAZARY[percentage]OFF[6_random_digits]
//       const randomDigits = Math.floor(100000 + Math.random() * 900000);
//       const generatedPromo = `BAZARY${sector.percent}OFF${randomDigits}`;
      
//       setPromoCode(generatedPromo);

//       if (typeof window !== "undefined") {
//         localStorage.setItem("bazaarna_active_promo", generatedPromo);
//         localStorage.setItem("bazaarna_active_discount", sector.percent);
//       }
//     }, 5000); // match transition duration
//   };

//   const copyToClipboard = () => {
//     navigator.clipboard.writeText(promoCode);
//     setCopied(true);
//     setTimeout(() => setCopied(false), 2000);
//   };

//   const checkAuthAndPlay = () => {
//     if (!isLoggedIn) {
//       return (
//         <div className="text-center py-6 px-4">
//           <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">سجل دخولك أولاً</h3>
//           <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
//             يجب عليك تسجيل الدخول أولاً لتتمكن من تدوير العجلة والاستمتاع بالعروض والخصومات المميزة.
//           </p>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={() => {
//                 onClose();
//                 router.push("/auth/login");
//               }}
//               className="px-6 py-2.5 bg-[#50604A] hover:bg-black text-white font-medium rounded-full transition-all text-sm shadow-md"
//             >
//               تسجيل الدخول الآن
//             </button>
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all text-sm"
//             >
//               إلغاء
//             </button>
//           </div>
//         </div>
//       );
//     }

//     if (hasPlayed && !isSpinning && !winningSector) {
//       return (
//         <div className="text-center py-6 px-4">
//           <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
//             <Trophy className="w-8 h-8 text-green-700" />
//           </div>
//           <h3 className="text-xl font-bold text-gray-900 mb-2">لقد حصلت على الكوبون الخاص بك بالفعل!</h3>
//           <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
//             لقد حصلت على الكوبون الخاص بك وهو:
//           </p>
//           <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between max-w-md mx-auto mb-6">
//             <span className="font-mono font-bold text-lg text-primary tracking-wider">{promoCode}</span>
//             <button
//               onClick={copyToClipboard}
//               className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
//               title="Copy promo code"
//             >
//               {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
//             </button>
//           </div>
//           <div className="flex gap-3 justify-center">
//             <button
//               onClick={() => {
//                 onClose();
//                 router.push("/checkout");
//               }}
//               className="px-6 py-2.5 bg-[#50604A] hover:bg-black text-white font-medium rounded-full transition-all text-sm shadow-md cursor-pointer"
//             >
//               ذهاب إلى الدفع
//             </button>
//             <button
//               onClick={onClose}
//               className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all text-sm cursor-pointer"
//             >
//               إغلاق
//             </button>
//           </div>
//         </div>
//       );
//     }

//     return (
//       <div className="flex flex-col items-center">
//         {/* Main Wheel Area */}
//         <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] mb-8 mt-4 select-none">
//           {/* Outer Ring with Lights */}
//           <div className="absolute inset-0 rounded-full border-[8px] border-[#50604A] shadow-[0_10px_30px_rgba(80,96,74,0.3)] bg-[#50604A]">
//             {/* Tiny bulbs style circles */}
//             {[...Array(12)].map((_, i) => (
//               <div
//                 key={i}
//                 className="absolute w-2 h-2 rounded-full bg-amber-300 animate-pulse"
//                 style={{
//                   top: `${50 + 46 * Math.sin((i * 30 * Math.PI) / 180)}%`,
//                   left: `${50 + 46 * Math.cos((i * 30 * Math.PI) / 180)}%`,
//                   transform: "translate(-50%, -50%)",
//                   animationDelay: `${i * 0.1}s`,
//                 }}
//               />
//             ))}
//           </div>

//           {/* Rotating Wheel */}
//           <div
//             ref={wheelRef}
//             className="absolute inset-[6px] rounded-full overflow-hidden bg-white shadow-inner"
//             style={{
//               transform: `rotate(${wheelRotation}deg)`,
//               transition: isSpinning ? "transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)" : "none",
//             }}
//           >
//             <svg viewBox="0 0 200 200" className="w-full h-full">
//               {SECTORS.map((sector, idx) => {
//                 const totalSectors = SECTORS.length;
//                 const angle = 360 / totalSectors;
//                 const startAngle = idx * angle - 90; // Adjust to start at top
//                 const endAngle = (idx + 1) * angle - 90;
                
//                 const radStart = (startAngle * Math.PI) / 180;
//                 const radEnd = (endAngle * Math.PI) / 180;
                
//                 const x1 = 100 + 100 * Math.cos(radStart);
//                 const y1 = 100 + 100 * Math.sin(radStart);
//                 const x2 = 100 + 100 * Math.cos(radEnd);
//                 const y2 = 100 + 100 * Math.sin(radEnd);

//                 const midAngle = startAngle + angle / 2;
//                 const radMid = (midAngle * Math.PI) / 180;
//                 const tx = 100 + 65 * Math.cos(radMid);
//                 const ty = 100 + 65 * Math.sin(radMid);

//                 // SVG Sector Path
//                 return (
//                   <g key={idx}>
//                     <path
//                       d={`M 100 100 L ${x1} ${y1} A 100 100 0 0 1 ${x2} ${y2} Z`}
//                       fill={sector.color}
//                       stroke="#ffffff"
//                       strokeWidth="1.5"
//                     />
//                     <text
//                       x={tx}
//                       y={ty}
//                       fill="#ffffff"
//                       fontSize="9"
//                       fontWeight="bold"
//                       textAnchor="middle"
//                       dominantBaseline="middle"
//                       transform={`rotate(${midAngle + 90}, ${tx}, ${ty})`}
//                       className="tracking-wider drop-shadow-sm font-sans"
//                     >
//                       {sector.label}
//                     </text>
//                   </g>
//                 );
//               })}
              
//               {/* Inner Circle (Center Cap) */}
//               <circle cx="100" cy="100" r="22" fill="#ffffff" stroke="#50604A" strokeWidth="4" />
//             </svg>
//           </div>

//           {/* Center Pin Button */}
//           <button
//             onClick={spinTheWheel}
//             disabled={isSpinning}
//             className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#50604A] hover:bg-[#f0f4ef] text-primary flex items-center justify-center font-bold text-xs tracking-wider shadow-md active:scale-95 transition-transform z-20 cursor-pointer disabled:cursor-not-allowed"
//           >
//             {isSpinning ? "🌀" : "SPIN"}
//           </button>

//           {/* Top Indicator Triangle Pin */}
//           <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
//             <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
//               <path d="M12 28L0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4L12 28Z" fill="#ff4d4f" />
//               <path d="M12 20L5 4H19L12 20Z" fill="#ffffff" opacity="0.3" />
//             </svg>
//           </div>
//         </div>

//         <h3 className="text-lg font-bold text-[#50604A] mb-1">العب الآن واستمتع بالخصومات الرائعة!</h3>
//         <p className="text-gray-400 text-xs text-center max-w-xs mb-4">
//           اضغط على SPIN لتدوير العجلة والحصول على بروموكود خصم خاص بك يصل حتى 50%.
//         </p>
//       </div>
//     );
//   };

//   return (
//     <>
//       {/* CSS Confetti Overlay */}
//       {showConfetti && (
//         <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
//           {[...Array(90)].map((_, idx) => {
//             const left = Math.random() * 100;
//             const delay = Math.random() * 2.5;
//             const duration = 2.5 + Math.random() * 2.5;
//             const size = 6 + Math.random() * 8;
//             const rotation = Math.random() * 360;
//             const colors = ["#50604A", "#8DA9C4", "#C2948A", "#E6B89C", "#C5C392", "#ff4d4f", "#ffc53d", "#52c41a"];
//             const color = colors[Math.floor(Math.random() * colors.length)];
            
//             return (
//               <div
//                 key={idx}
//                 className="confetti-particle"
//                 style={{
//                   position: "absolute",
//                   left: `${left}%`,
//                   top: "-15px",
//                   width: `${size}px`,
//                   height: `${size}px`,
//                   backgroundColor: color,
//                   opacity: 0.8,
//                   borderRadius: Math.random() > 0.5 ? "50%" : "0%",
//                   transform: `rotate(${rotation}deg)`,
//                   animation: `fall ${duration}s linear ${delay}s infinite`,
//                 }}
//               />
//             );
//           })}
//           <style>{`
//             @keyframes fall {
//               0% {
//                 transform: translateY(0) rotate(0deg);
//                 opacity: 1;
//               }
//               90% {
//                 opacity: 0.9;
//               }
//               100% {
//                 transform: translateY(105vh) rotate(540deg);
//                 opacity: 0;
//               }
//             }
//           `}</style>
//         </div>
//       )}

//       {/* Modal Dialog */}
//       <AnimatePresence>
//         {isOpen && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
//             {/* Backdrop */}
//             <motion.div
//               initial={{ opacity: 0 }}
//               animate={{ opacity: 1 }}
//               exit={{ opacity: 0 }}
//               onClick={isSpinning ? undefined : onClose}
//               className="absolute inset-0 bg-black/60 backdrop-blur-sm"
//             />

//             {/* Modal Container */}
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               transition={{ type: "spring", duration: 0.5 }}
//               className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-gray-100 flex flex-col items-center p-6 md:p-8"
//             >
//               {/* Close Button */}
//               {!isSpinning && (
//                 <button
//                   onClick={onClose}
//                   className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer z-50"
//                   aria-label="Close lucky draw modal"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               )}

//               {/* Title / Header */}
//               {!winningSector && (
//                 <div className="text-center mb-2">
//                   <div className="inline-flex items-center gap-1 bg-[#f0f4ef] px-3 py-1 rounded-full text-xs font-semibold text-[#50604A] mb-2">
//                     <Star className="w-3.5 h-3.5 fill-[#50604A]" />
//                     <span>SUMMER TIME SPIN</span>
//                   </div>
//                   <h2 className="text-2xl font-bold text-gray-900 tracking-tight">عجلة الحظ الكبرى</h2>
//                 </div>
//               )}

//               {/* Check auth and render logic */}
//               {mustLoginPrompt ? (
//                 <div className="text-center py-6 px-4">
//                   <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
//                     </svg>
//                   </div>
//                   <h3 className="text-xl font-bold text-gray-900 mb-2">سجل دخولك أولاً</h3>
//                   <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
//                     يجب عليك تسجيل الدخول أولاً لتتمكن من تدوير العجلة والاستمتاع بالعروض والخصومات المميزة.
//                   </p>
//                   <div className="flex gap-3 justify-center">
//                     <button
//                       onClick={() => {
//                         onClose();
//                         router.push("/auth/login");
//                       }}
//                       className="px-6 py-2.5 bg-[#50604A] hover:bg-black text-white font-medium rounded-full transition-all text-sm shadow-md cursor-pointer"
//                     >
//                       تسجيل الدخول الآن
//                     </button>
//                     <button
//                       onClick={onClose}
//                       className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all text-sm cursor-pointer"
//                     >
//                       إلغاء
//                     </button>
//                   </div>
//                 </div>
//               ) : winningSector ? (
//                 /* Celebration / Winning State */
//                 <motion.div
//                   initial={{ opacity: 0, scale: 0.9 }}
//                   animate={{ opacity: 1, scale: 1 }}
//                   className="text-center py-6 px-2 flex flex-col items-center w-full"
//                 >
//                   <div className="relative mb-6">
//                     {/* Outer glowing effect */}
//                     <div className="absolute inset-0 bg-[#50604A]/20 blur-xl rounded-full scale-125 animate-pulse" />
//                     <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-200 shadow-md">
//                       <Award className="w-10 h-10 text-green-700" />
//                     </div>
//                   </div>

//                   <h3 className="text-2xl font-bold text-gray-900 mb-1">ألف مبروك! 🎉</h3>
//                   <p className="text-gray-500 text-sm mb-6">
//                     لقد ربحت خصم بقيمة <span className="font-extrabold text-lg text-primary">{winningSector.percent}%</span> على مشترياتك القادمة.
//                   </p>

//                   {/* Promo Code Display */}
//                   <div className="w-full bg-gray-50 rounded-2xl border border-gray-200/80 p-5 flex flex-col gap-3 mb-6 shadow-inner relative overflow-hidden">
//                     <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#50604A]/5 rounded-full" />
//                     <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#50604A]/5 rounded-full" />
                    
//                     <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold font-sans">
//                       رمز الخصم الخاص بك (PROMO CODE)
//                     </div>
//                     <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm gap-2">
//                       <span className="font-mono font-bold text-lg text-[#50604A] tracking-wider select-all">
//                         {promoCode}
//                       </span>
//                       <button
//                         onClick={copyToClipboard}
//                         className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 active:scale-95 transition-all cursor-pointer"
//                         title="Copy code"
//                       >
//                         {copied ? (
//                           <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
//                             <Check className="w-4 h-4" />
//                             <span>تم النسخ!</span>
//                           </div>
//                         ) : (
//                           <Copy className="w-4.5 h-4.5" />
//                         )}
//                       </button>
//                     </div>
//                   </div>

//                   <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
//                     <button
//                       onClick={() => {
//                         onClose();
//                         router.push("/checkout");
//                       }}
//                       className="px-8 py-3 bg-[#50604A] hover:bg-black text-white font-semibold rounded-full transition-all text-sm shadow-lg hover:shadow-xl shadow-[#50604A]/25 cursor-pointer"
//                     >
//                       شراء الآن واستخدام الكود
//                     </button>
//                     <button
//                       onClick={() => {
//                         setWinningSector(null);
//                         setShowConfetti(false);
//                         onClose();
//                       }}
//                       className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition-all text-sm cursor-pointer"
//                     >
//                       إغلاق
//                     </button>
//                   </div>
//                 </motion.div>
//               ) : (
//                 /* Standard Wheel view */
//                 checkAuthAndPlay()
//               )}
//             </motion.div>
//           </div>
//         )}
//       </AnimatePresence>
//     </>
//   );
// }
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Copy, Check, Star, Trophy, Award } from "lucide-react";
import { useRouter } from "next/navigation";

const SECTORS = [
  { percent: 5, color: "#8DA9C4", label: "5% OFF" },
  { percent: 10, color: "#C2948A", label: "10% OFF" },
  { percent: 15, color: "#E6B89C", label: "15% OFF" },
  { percent: 20, color: "#C5C392", label: "20% OFF" },
  { percent: 25, color: "#9B8EB9", label: "25% OFF" },
  { percent: 30, color: "#D5A6BD", label: "30% OFF" },
  { percent: 50, color: "#50604A", label: "50% OFF" },
];

export default function SpinWheelModal({ isOpen, onClose }) {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const [mustLoginPrompt, setMustLoginPrompt] = useState(false);
  const [wheelRotation, setWheelRotation] = useState(0);
  const [winningSector, setWinningSector] = useState(null);
  const [promoCode, setPromoCode] = useState("");
  const [copied, setCopied] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [spinError, setSpinError] = useState(null);

  const wheelRef = useRef(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      
      // Load saved promo if any
      const savedPromo = localStorage.getItem("bazaarna_active_promo");
      if (savedPromo) {
        setPromoCode(savedPromo);
        setHasPlayed(true);
      }
    }
  }, [isOpen]);

  const spinTheWheel = async () => {
    if (isSpinning) return;

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token || token === "undefined" || token === "null") {
      setIsLoggedIn(false);
      return;
    }

    setIsSpinning(true);
    setWinningSector(null);
    setShowConfetti(false);
    setSpinError(null);

    try {
      const res = await fetch("https://bazary-backend.vercel.app/api/promo/spin", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    

      const data = await res.json();
        console.log(data)

      if (!res.ok || data.status !== "success") {
        setIsSpinning(false);
        setSpinError(data?.message || "Couldn't spin the wheel right now. Please try again.");
        return;
      }

      const { code, discountPercentage } = data.data;

      // Find the sector matching (or closest to) the discount we actually won
      let sectorIndex = SECTORS.findIndex((s) => s.percent === discountPercentage);
      if (sectorIndex === -1) {
        sectorIndex = SECTORS.reduce(
          (closest, s, idx) =>
            Math.abs(s.percent - discountPercentage) < Math.abs(SECTORS[closest].percent - discountPercentage)
              ? idx
              : closest,
          0
        );
      }

      const totalSectors = SECTORS.length;
      const sectorDegrees = 360 / totalSectors;
      const targetSectorDegrees = (sectorIndex * sectorDegrees) + (sectorDegrees / 2);

      const spins = 6 + Math.floor(Math.random() * 4); // 6 to 9 spins
      const totalRotation = (spins * 360) + (360 - targetSectorDegrees);

      setWheelRotation(totalRotation);

      setTimeout(() => {
        setIsSpinning(false);
        setWinningSector({
          percent: discountPercentage,
          color: SECTORS[sectorIndex]?.color || "#50604A",
          label: `${discountPercentage}% OFF`,
        });
        setShowConfetti(true);
        setHasPlayed(true);
        setPromoCode(code);

        if (typeof window !== "undefined") {
          localStorage.setItem("bazaarna_active_promo", code);
          localStorage.setItem("bazaarna_active_discount", discountPercentage);
        }
      }, 5000); // match transition duration
    } catch (err) {
      setIsSpinning(false);
      setSpinError("Network error. Please check your connection and try again.");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(promoCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const checkAuthAndPlay = () => {
    if (!isLoggedIn) {
      return (
        <div className="text-center py-6 px-4">
          <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">سجل دخولك أولاً</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            يجب عليك تسجيل الدخول أولاً لتتمكن من تدوير العجلة والاستمتاع بالعروض والخصومات المميزة.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                onClose();
                router.push("/auth/login");
              }}
              className="px-6 py-2.5 bg-[#50604A] hover:bg-black text-white font-medium rounded-full transition-all text-sm shadow-md"
            >
              تسجيل الدخول الآن
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all text-sm"
            >
              إلغاء
            </button>
          </div>
        </div>
      );
    }

    if (hasPlayed && !isSpinning && !winningSector) {
      return (
        <div className="text-center py-6 px-4">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-200">
            <Trophy className="w-8 h-8 text-green-700" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">لقد حصلت على الكوبون الخاص بك بالفعل!</h3>
          <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
            لقد حصلت على الكوبون الخاص بك وهو:
          </p>
          <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex items-center justify-between max-w-md mx-auto mb-6">
            <span className="font-mono font-bold text-lg text-primary tracking-wider">{promoCode}</span>
            <button
              onClick={copyToClipboard}
              className="p-2 hover:bg-gray-200 rounded-lg text-gray-500 transition-colors"
              title="Copy promo code"
            >
              {copied ? <Check className="w-5 h-5 text-green-600" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <div className="flex gap-3 justify-center">
            <button
              onClick={() => {
                onClose();
                router.push("/checkout");
              }}
              className="px-6 py-2.5 bg-[#50604A] hover:bg-black text-white font-medium rounded-full transition-all text-sm shadow-md cursor-pointer"
            >
              ذهاب إلى الدفع
            </button>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all text-sm cursor-pointer"
            >
              إغلاق
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center">
        {/* Main Wheel Area */}
        <div className="relative w-[280px] h-[280px] md:w-[340px] md:h-[340px] mb-8 mt-4 select-none">
          {/* Outer Ring with Lights */}
          <div className="absolute inset-0 rounded-full border-[8px] border-[#50604A] shadow-[0_10px_30px_rgba(80,96,74,0.3)] bg-[#50604A]">
            {/* Tiny bulbs style circles */}
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="absolute w-2 h-2 rounded-full bg-amber-300 animate-pulse"
                style={{
                  top: `${50 + 46 * Math.sin((i * 30 * Math.PI) / 180)}%`,
                  left: `${50 + 46 * Math.cos((i * 30 * Math.PI) / 180)}%`,
                  transform: "translate(-50%, -50%)",
                  animationDelay: `${i * 0.1}s`,
                }}
              />
            ))}
          </div>

          {/* Rotating Wheel */}
          <div
            ref={wheelRef}
            className="absolute inset-[6px] rounded-full overflow-hidden bg-white shadow-inner"
            style={{
              transform: `rotate(${wheelRotation}deg)`,
              transition: isSpinning ? "transform 5s cubic-bezier(0.1, 0.8, 0.1, 1)" : "none",
            }}
          >
            <svg viewBox="0 0 200 200" className="w-full h-full">
              {SECTORS.map((sector, idx) => {
                const totalSectors = SECTORS.length;
                const angle = 360 / totalSectors;
                const startAngle = idx * angle - 90; // Adjust to start at top
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

                // SVG Sector Path
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
              
              {/* Inner Circle (Center Cap) */}
              <circle cx="100" cy="100" r="22" fill="#ffffff" stroke="#50604A" strokeWidth="4" />
            </svg>
          </div>

          {/* Center Pin Button */}
          <button
            onClick={spinTheWheel}
            disabled={isSpinning}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white border-4 border-[#50604A] hover:bg-[#f0f4ef] text-primary flex items-center justify-center font-bold text-xs tracking-wider shadow-md active:scale-95 transition-transform z-20 cursor-pointer disabled:cursor-not-allowed"
          >
            {isSpinning ? "🌀" : "SPIN"}
          </button>

          {/* Top Indicator Triangle Pin */}
          <div className="absolute top-[-8px] left-1/2 -translate-x-1/2 z-30 filter drop-shadow-md">
            <svg width="24" height="28" viewBox="0 0 24 28" fill="none">
              <path d="M12 28L0 4C0 1.79086 1.79086 0 4 0H20C22.2091 0 24 1.79086 24 4L12 28Z" fill="#ff4d4f" />
              <path d="M12 20L5 4H19L12 20Z" fill="#ffffff" opacity="0.3" />
            </svg>
          </div>
        </div>

        <h3 className="text-lg font-bold text-[#50604A] mb-1">العب الآن واستمتع بالخصومات الرائعة!</h3>
        <p className="text-gray-400 text-xs text-center max-w-xs mb-4">
          اضغط على SPIN لتدوير العجلة والحصول على بروموكود خصم خاص بك يصل حتى 50%.
        </p>
        {spinError && (
          <div className="w-full max-w-xs bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl px-4 py-3 text-center mb-2">
            ⚠️ {spinError}
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* CSS Confetti Overlay */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
          {[...Array(90)].map((_, idx) => {
            const left = Math.random() * 100;
            const delay = Math.random() * 2.5;
            const duration = 2.5 + Math.random() * 2.5;
            const size = 6 + Math.random() * 8;
            const rotation = Math.random() * 360;
            const colors = ["#50604A", "#8DA9C4", "#C2948A", "#E6B89C", "#C5C392", "#ff4d4f", "#ffc53d", "#52c41a"];
            const color = colors[Math.floor(Math.random() * colors.length)];
            
            return (
              <div
                key={idx}
                className="confetti-particle"
                style={{
                  position: "absolute",
                  left: `${left}%`,
                  top: "-15px",
                  width: `${size}px`,
                  height: `${size}px`,
                  backgroundColor: color,
                  opacity: 0.8,
                  borderRadius: Math.random() > 0.5 ? "50%" : "0%",
                  transform: `rotate(${rotation}deg)`,
                  animation: `fall ${duration}s linear ${delay}s infinite`,
                }}
              />
            );
          })}
          <style>{`
            @keyframes fall {
              0% {
                transform: translateY(0) rotate(0deg);
                opacity: 1;
              }
              90% {
                opacity: 0.9;
              }
              100% {
                transform: translateY(105vh) rotate(540deg);
                opacity: 0;
              }
            }
          `}</style>
        </div>
      )}

      {/* Modal Dialog */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={isSpinning ? undefined : onClose}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Modal Container */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl z-10 border border-gray-100 flex flex-col items-center p-6 md:p-8"
            >
              {/* Close Button */}
              {!isSpinning && (
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 cursor-pointer z-50"
                  aria-label="Close lucky draw modal"
                >
                  <X className="w-5 h-5" />
                </button>
              )}

              {/* Title / Header */}
              {!winningSector && (
                <div className="text-center mb-2">
                  <div className="inline-flex items-center gap-1 bg-[#f0f4ef] px-3 py-1 rounded-full text-xs font-semibold text-[#50604A] mb-2">
                    <Star className="w-3.5 h-3.5 fill-[#50604A]" />
                    <span>SUMMER TIME SPIN</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight">عجلة الحظ الكبرى</h2>
                </div>
              )}

              {/* Check auth and render logic */}
              {mustLoginPrompt ? (
                <div className="text-center py-6 px-4">
                  <div className="w-16 h-16 bg-amber-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m0 0v3m0-3h3m-3 0H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">سجل دخولك أولاً</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                    يجب عليك تسجيل الدخول أولاً لتتمكن من تدوير العجلة والاستمتاع بالعروض والخصومات المميزة.
                  </p>
                  <div className="flex gap-3 justify-center">
                    <button
                      onClick={() => {
                        onClose();
                        router.push("/auth/login");
                      }}
                      className="px-6 py-2.5 bg-[#50604A] hover:bg-black text-white font-medium rounded-full transition-all text-sm shadow-md cursor-pointer"
                    >
                      تسجيل الدخول الآن
                    </button>
                    <button
                      onClick={onClose}
                      className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-full transition-all text-sm cursor-pointer"
                    >
                      إلغاء
                    </button>
                  </div>
                </div>
              ) : winningSector ? (
                /* Celebration / Winning State */
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-6 px-2 flex flex-col items-center w-full"
                >
                  <div className="relative mb-6">
                    {/* Outer glowing effect */}
                    <div className="absolute inset-0 bg-[#50604A]/20 blur-xl rounded-full scale-125 animate-pulse" />
                    <div className="relative w-20 h-20 bg-green-50 rounded-full flex items-center justify-center border-4 border-green-200 shadow-md">
                      <Award className="w-10 h-10 text-green-700" />
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 mb-1">ألف مبروك! 🎉</h3>
                  <p className="text-gray-500 text-sm mb-6">
                    لقد ربحت خصم بقيمة <span className="font-extrabold text-lg text-primary">{winningSector.percent}%</span> على مشترياتك القادمة.
                  </p>

                  {/* Promo Code Display */}
                  <div className="w-full bg-gray-50 rounded-2xl border border-gray-200/80 p-5 flex flex-col gap-3 mb-6 shadow-inner relative overflow-hidden">
                    <div className="absolute -top-6 -right-6 w-12 h-12 bg-[#50604A]/5 rounded-full" />
                    <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-[#50604A]/5 rounded-full" />
                    
                    <div className="text-xs uppercase tracking-wider text-gray-400 font-semibold font-sans">
                      رمز الخصم الخاص بك (PROMO CODE)
                    </div>
                    <div className="flex items-center justify-between bg-white px-4 py-3 rounded-xl border border-gray-100 shadow-sm gap-2">
                      <span className="font-mono font-bold text-lg text-[#50604A] tracking-wider select-all">
                        {promoCode}
                      </span>
                      <button
                        onClick={copyToClipboard}
                        className="p-2.5 hover:bg-gray-100 rounded-lg text-gray-500 active:scale-95 transition-all cursor-pointer"
                        title="Copy code"
                      >
                        {copied ? (
                          <div className="flex items-center gap-1 text-green-600 text-xs font-semibold">
                            <Check className="w-4 h-4" />
                            <span>تم النسخ!</span>
                          </div>
                        ) : (
                          <Copy className="w-4.5 h-4.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-3 w-full justify-center">
                    <button
                      onClick={() => {
                        onClose();
                        router.push("/checkout");
                      }}
                      className="px-8 py-3 bg-[#50604A] hover:bg-black text-white font-semibold rounded-full transition-all text-sm shadow-lg hover:shadow-xl shadow-[#50604A]/25 cursor-pointer"
                    >
                      شراء الآن واستخدام الكود
                    </button>
                    <button
                      onClick={() => {
                        setWinningSector(null);
                        setShowConfetti(false);
                        onClose();
                      }}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition-all text-sm cursor-pointer"
                    >
                      إغلاق
                    </button>
                  </div>
                </motion.div>
              ) : (
                /* Standard Wheel view */
                checkAuthAndPlay()
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
