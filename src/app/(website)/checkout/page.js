// "use client";

// import { useState } from "react";
// import { useRouter } from "next/navigation";
// import { useCart } from "../../context/CartContext";
// import { loadStripe } from "@stripe/stripe-js";
// import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

// const stripePromise = loadStripe("pk_test_51Tfg0qF3X8TkLn5begaNuyALoqNR9MBt85CJHMNdL1W48L5WgXjyBiIustCAtPzttXC6t5qJtHJg0qmcxe13OIxS00WqKYLYpQ");


// const EGYPT_DATA = {
//   "القاهرة": ["مصر الجديدة", "المعادي", "مدينة نصر", "الزيتون", "شبرا", "عين شمس", "حلوان", "المقطم", "التجمع الخامس", "6 أكتوبر (القاهرة)", "الدراسة", "الأزبكية", "الخليفة", "السيدة زينب", "روض الفرج"],
//   "الجيزة": ["الدقي", "العجوزة", "المهندسين", "إمبابة", "فيصل", "الهرم", "بولاق الدكرور", "6 أكتوبر", "الشيخ زايد", "البدرشين", "الصف", "أوسيم"],
//   "الإسكندرية": ["المنتزه", "العجمي", "برج العرب", "الدخيلة", "الجمرك", "الرمل", "اللبان", "سيدي جابر", "باكوس", "ميامي", "كليوباترا", "المعمورة"],
//   "القليوبية": ["بنها", "شبين القناطر", "قليوب", "الخانكة", "طوخ", "القناطر الخيرية", "كفر شكر"],
//   "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "أبو كبير", "منيا القمح", "فاقوس", "ديرب نجم", "الإبراهيمية"],
//   "الدقهلية": ["المنصورة", "طلخا", "ميت غمر", "أجا", "شربين", "السنبلاوين", "بلقاس", "دكرنس"],
//   "البحيرة": ["دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو حمص", "المحمودية", "حوش عيسى", "كوم حمادة"],
//   "الغربية": ["طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة", "بسيون", "قطور", "سمنود"],
//   "المنوفية": ["شبين الكوم", "مينوف", "أشمون", "الشهداء", "قويسنا", "بركة السبع", "سرس الليان"],
//   "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "الحامول", "بيلا", "سيدي سالم"],
//   "الفيوم": ["الفيوم", "سنورس", "إطسا", "أبشواي", "طامية", "يوسف الصديق"],
//   "بني سويف": ["بني سويف", "ناصر", "الواسطى", "ببا", "الفشن", "إهناسيا"],
//   "المنيا": ["المنيا", "ملوي", "مغاغة", "العدوة", "أبو قرقاص", "بني مزار", "سمالوط", "المطانية"],
//   "أسيوط": ["أسيوط", "ديروط", "القوصية", "أبنوب", "منفلوط", "الغنايم", "الفتح", "ساحل سليم"],
//   "سوهاج": ["سوهاج", "طهطا", "جرجا", "دار السلام", "المراغة", "البلينا", "طما", "أخميم"],
//   "قنا": ["قنا", "نجع حمادي", "قوص", "الأقصر", "دشنا", "فرشوط", "أبو تشت"],
//   "الأقصر": ["الأقصر", "القرنة", "إسنا", "الأرمنت", "البياضية"],
//   "أسوان": ["أسوان", "كوم أمبو", "أدفو", "إدفو", "نصر النوبة", "دراو"],
//   "البحر الأحمر": ["الغردقة", "سفاجا", "القصير", "مرسى علم", "رأس غارب"],
//   "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "بريس"],
//   "مطروح": ["مرسى مطروح", "الحمام", "الضبعة", "سيدي براني", "السلوم"],
//   "شمال سيناء": ["العريش", "الشيخ زويد", "رفح", "بئر العبد", "الحسنة"],
//   "جنوب سيناء": ["الطور", "شرم الشيخ", "دهب", "نويبع", "طابا", "أبو رديس"],
//   "بورسعيد": ["بورسعيد", "الضواحي", "الجنوب", "الشرق", "الغرب", "المناخ", "الزهور", "فؤاد"],
//   "الإسماعيلية": ["الإسماعيلية", "القنطرة شرق", "القنطرة غرب", "فايد", "أبو صوير"],
//   "السويس": ["السويس", "عتاقة", "أربعين", "جناكليس"],
//   "دمياط": ["دمياط", "رأس البر", "فارسكور", "الزرقا", "كفر سعد", "الرياض"],
// };


// // ─────────────────────────────────────────────
// // Stripe inline payment step
// // ─────────────────────────────────────────────
// function StripeForm({ onSuccess, totalAmount }) {
//   const stripe = useStripe();
//   const elements = useElements();
//   const [paying, setPaying] = useState(false);
//   const [stripeError, setStripeError] = useState(null);

//   const handlePay = async (e) => {
//     e.preventDefault();
//     if (!stripe || !elements) return;
//     setPaying(true);
//     setStripeError(null);

//     const { error } = await stripe.confirmPayment({
//       elements,
//       redirect: "if_required",
//     });

//     if (error) {
//       setStripeError(error.message);
//       setPaying(false);
//     } else {
//       onSuccess();
//     }
//   };

//   return (
//     <form onSubmit={handlePay}>
//       <div
//         style={{
//           background: "#f9fafb",
//           borderRadius: "16px",
//           padding: "20px",
//           border: "1px solid #e5e7eb",
//           marginBottom: "16px",
//         }}
//       >
//         <PaymentElement options={{ layout: "tabs" }} />
//       </div>

//       {stripeError && (
//         <div
//           style={{
//             background: "#fef2f2",
//             border: "1px solid #fecaca",
//             color: "#dc2626",
//             borderRadius: "12px",
//             padding: "12px 16px",
//             fontSize: "13px",
//             marginBottom: "16px",
//             display: "flex",
//             gap: "8px",
//             alignItems: "center",
//           }}
//         >
//           ⚠️ {stripeError}
//         </div>
//       )}

//       <button
//         type="submit"
//         disabled={!stripe || paying}
//         style={{
//           width: "100%",
//           background: paying
//             ? "#9ca3af"
//             : "linear-gradient(135deg,#50604A 0%,#7a9b71 100%)",
//           color: "#fff",
//           border: "none",
//           borderRadius: "16px",
//           padding: "18px 24px",
//           fontSize: "17px",
//           fontWeight: 700,
//           cursor: paying ? "not-allowed" : "pointer",
//           boxShadow: paying ? "none" : "0 8px 24px rgba(80,96,74,0.35)",
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "10px",
//         }}
//       >
//         {paying ? (
//           <>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
//               <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
//               <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
//             </svg>
//             Processing Payment…
//           </>
//         ) : (
//           <>
//             <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//               <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
//               <path d="M2 10h20" stroke="#fff" strokeWidth="1.8"/>
//             </svg>
//             Pay {totalAmount?.toLocaleString()} EGP
//           </>
//         )}
//       </button>

//       <div
//         style={{
//           display: "flex",
//           alignItems: "center",
//           justifyContent: "center",
//           gap: "6px",
//           marginTop: "14px",
//           fontSize: "12px",
//           color: "#9ca3af",
//         }}
//       >
//         <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
//           <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round"/>
//         </svg>
//         Secured by Stripe · SSL Encrypted
//       </div>
//     </form>
//   );
// }

// function StripePaymentStep({ clientSecret, totalAmount, onSuccess, onBack }) {
//   return (
//     <div
//       style={{
//         maxWidth: "520px",
//         margin: "80px auto 60px",
//         padding: "0 20px",
//       }}
//     >
//       {/* Back button */}
//       <button
//         onClick={onBack}
//         style={{
//           display: "flex",
//           alignItems: "center",
//           gap: "6px",
//           background: "none",
//           border: "none",
//           color: "#6b7280",
//           fontSize: "14px",
//           fontWeight: 600,
//           cursor: "pointer",
//           marginBottom: "28px",
//           padding: 0,
//         }}
//       >
//         <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//           <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//         </svg>
//         Back to checkout
//       </button>

//       {/* Header */}
//       <div style={{ textAlign: "center", marginBottom: "28px" }}>
//         <div
//           style={{
//             width: "64px",
//             height: "64px",
//             borderRadius: "18px",
//             background: "linear-gradient(135deg,#50604A,#7a9b71)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto 16px",
//             boxShadow: "0 8px 24px rgba(80,96,74,0.3)",
//           }}
//         >
//           <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
//             <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
//             <path d="M2 10h20" stroke="#fff" strokeWidth="1.8"/>
//           </svg>
//         </div>
//         <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>
//           Complete Payment
//         </h2>
//         <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
//           Enter your card details to place your order
//         </p>
//       </div>

//       {/* Stripe card */}
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "20px",
//           boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
//           border: "1px solid #f3f4f6",
//           padding: "28px",
//         }}
//       >
//         <Elements
//           stripe={stripePromise}
//           options={{
//             clientSecret,
//             appearance: {
//               theme: "stripe",
//               variables: {
//                 colorPrimary: "#50604A",
//                 colorBackground: "#ffffff",
//                 colorText: "#1f2937",
//                 borderRadius: "12px",
//                 fontFamily: "inherit",
//               },
//             },
//           }}
//         >
//           <StripeForm onSuccess={onSuccess} totalAmount={totalAmount} />
//         </Elements>
//       </div>
//     </div>
//   );
// }

// // ─────────────────────────────────────────────
// function SuccessOverlay({ onClose }) {
//   return (
//     <div
//       style={{
//         position: "fixed",
//         inset: 0,
//         background: "rgba(0,0,0,0.55)",
//         backdropFilter: "blur(6px)",
//         zIndex: 9999,
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//       }}
//     >
//       <div
//         style={{
//           background: "#fff",
//           borderRadius: "24px",
//           padding: "48px 40px",
//           maxWidth: "420px",
//           width: "90%",
//           textAlign: "center",
//           boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
//           animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
//         }}
//       >
//         {/* Animated checkmark */}
//         <div
//           style={{
//             width: "96px",
//             height: "96px",
//             borderRadius: "50%",
//             background: "linear-gradient(135deg,#50604A,#7a9b71)",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             margin: "0 auto 24px",
//             animation: "scaleIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
//             boxShadow: "0 12px 32px rgba(80,96,74,0.4)",
//           }}
//         >
//           <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
//             <circle cx="26" cy="26" r="26" fill="none" />
//             <path
//               d="M14 27l9 9 15-18"
//               stroke="#fff"
//               strokeWidth="3.5"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               style={{ animation: "drawCheck 0.5s 0.3s ease both" }}
//             />
//           </svg>
//         </div>

//         <h2
//           style={{
//             fontSize: "26px",
//             fontWeight: 800,
//             color: "#1a1a1a",
//             marginBottom: "10px",
//           }}
//         >
//           Payment Successful! 
//         </h2>
//         <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "32px", lineHeight: 1.6 }}>
//           Your order has been placed successfully. We'll notify you when it's on its way!
//         </p>

//         <button
//           onClick={onClose}
//           style={{
//             background: "#50604A",
//             color: "#fff",
//             border: "none",
//             borderRadius: "14px",
//             padding: "14px 40px",
//             fontSize: "16px",
//             fontWeight: 700,
//             cursor: "pointer",
//             width: "100%",
//             transition: "transform 0.15s",
//           }}
//           onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
//           onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
//         >
//           View My Orders
//         </button>
//       </div>

//       <style>{`
//         @keyframes popIn {
//           0%   { opacity: 0; transform: scale(0.7) translateY(30px); }
//           100% { opacity: 1; transform: scale(1) translateY(0); }
//         }
//         @keyframes scaleIn {
//           0%   { transform: scale(0); }
//           100% { transform: scale(1); }
//         }
//         @keyframes drawCheck {
//           from { stroke-dasharray: 0 50; }
//           to   { stroke-dasharray: 50 0; }
//         }
//       `}</style>
//     </div>
//   );
// }


// export default function CheckoutPage() {
//   const router = useRouter();
//   const { cart, clearCart, updateCartQuantity, removeFromCart } = useCart();
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState(null);
//   const [updatingId, setUpdatingId] = useState(null);
//   const [showSuccess, setShowSuccess] = useState(false);
//   const [clientSecret, setClientSecret] = useState(null);
//   const [cartSnapshot, setCartSnapshot] = useState(null); // save total before cart clears

//   const [formData, setFormData] = useState({
 
//     phone: "",
//     address: "",
//     governate: "",
//     city: "",
//     paymentMethod: "CASH",
//   });

//   const cities = formData.governate ? EGYPT_DATA[formData.governate] || [] : [];

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     if (name === "governate") {
   
//       setFormData((prev) => ({ ...prev, governate: value, city: "" }));
//     } else {
//       setFormData((prev) => ({ ...prev, [name]: value }));
//     }
//   };

//   const handleUpdateQuantity = async (productId, newQuantity) => {
//     setUpdatingId(productId);
//     if (newQuantity <= 0) {
//       await removeFromCart(productId);
//     } else {
//       await updateCartQuantity(productId, newQuantity);
//     }
//     setUpdatingId(null);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!cart || !cart.items || cart.items.length === 0) return;

//     setLoading(true);
//     setError(null);
//     const token = localStorage.getItem("token");

//     try {
//       const response = await fetch("https://bazary-backend.vercel.app/api/events/checkout", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           paymentMethod: formData.paymentMethod,
//           fullName: formData.fullName,
//           phone: formData.phone,
//           address: formData.address,
//           governate: formData.governate,
//           city: formData.city,
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok || data.status === "fail" || data.status === "error") {
//         throw new Error(data.message || "Checkout failed. Please try again.");
//       }

//       if (formData.paymentMethod === "VISA") {
//         console.log("get res data fron visa",data)
//         // Backend returns a clientSecret → show inline Stripe step
//         const secret = data?.data?.clientSecrets[0].clientSecret
 
//         if (!secret) throw new Error("No payment secret received from server.");
//         // Save cart total before clearing
//         setCartSnapshot({ totalAmount: cart.totalAmount });
//         await clearCart();
//         setClientSecret(secret);
//         return;
//       }

//       // CASH flow → show success overlay then clear cart
//       setShowSuccess(true);
//       await clearCart();
//     } catch (err) {
//       console.error("Checkout error:", err);
//       setError(err.message || "Something went wrong during checkout.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSuccessClose = () => {
//     router.push("/my-orders");
//   };

//   // Show ONLY the overlay after successful checkout (cart is null/empty at this point)
//   if (showSuccess) {
//     return <SuccessOverlay onClose={handleSuccessClose} />;
//   }

//   if (!cart || !cart.items || cart.items.length === 0) {
//     return (
//       <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
//         <div
//           style={{
//             width: "120px",
//             height: "120px",
//             background: "#f3f4f6",
//             borderRadius: "50%",
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "center",
//             marginBottom: "24px",
//           }}
//         >
//           <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
//             <path d="M8 10h4l5.5 28h22l4-18H16" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
//             <circle cx="22" cy="44" r="2.5" fill="#d1d5db"/>
//             <circle cx="36" cy="44" r="2.5" fill="#d1d5db"/>
//           </svg>
//         </div>
//         <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
//           Your cart is empty
//         </h2>
//         <p style={{ color: "#6b7280", marginBottom: "32px", textAlign: "center" }}>
//           Add items to your cart before checking out.
//         </p>
//         <button
//           onClick={() => router.push("/explore")}
//           style={{
//             background: "#50604A",
//             color: "#fff",
//             border: "none",
//             borderRadius: "12px",
//             padding: "14px 32px",
//             fontSize: "15px",
//             fontWeight: 600,
//             cursor: "pointer",
//           }}
//         >
//           Explore Bazaars
//         </button>
//       </div>
//     );
//   }

//   const inputStyle = {
//     width: "100%",
//     border: "1.5px solid #e5e7eb",
//     borderRadius: "12px",
//     padding: "12px 16px",
//     fontSize: "14px",
//     outline: "none",
//     transition: "border-color 0.2s",
//     background: "#fafafa",
//     boxSizing: "border-box",
//     fontFamily: "inherit",
//   };

//   const labelStyle = {
//     display: "block",
//     fontSize: "13px",
//     fontWeight: 600,
//     color: "#374151",
//     marginBottom: "6px",
//   };

//   return (
//     <>
//       {showSuccess && <SuccessOverlay onClose={handleSuccessClose} />}

//       <div
//         style={{
//           maxWidth: "1200px",
//           margin: "0 auto",
//           padding: "80px 20px 60px",
//           minHeight: "100vh",
//         }}
//       >
//         {/* Header */}
//         <div style={{ marginBottom: "36px" }}>
//           <h1
//             style={{
//               fontSize: "32px",
//               fontWeight: 800,
//               color: "#1a1a1a",
//               marginBottom: "6px",
//             }}
//           >
//             Checkout
//           </h1>
//           <p style={{ color: "#6b7280", fontSize: "15px" }}>
//             Complete your order details below
//           </p>
//         </div>

//         <div
//           style={{
//             display: "flex",
//             flexDirection: "column",
//             gap: "24px",
//           }}
//           className="checkout-layout"
//         >
//           {/* ── Left: Form ── */}
//           <div style={{ flex: 1 }}>
//             {/* Error */}
//             {error && (
//               <div
//                 style={{
//                   background: "#fef2f2",
//                   border: "1px solid #fecaca",
//                   color: "#dc2626",
//                   padding: "14px 18px",
//                   borderRadius: "12px",
//                   fontSize: "14px",
//                   marginBottom: "20px",
//                   display: "flex",
//                   alignItems: "center",
//                   gap: "10px",
//                 }}
//               >
//                 <span>⚠️</span> {error}
//               </div>
//             )}

//             <form onSubmit={handleSubmit}>
//               {/* ── Shipping Details Card ── */}
//               <div
//                 style={{
//                   background: "#fff",
//                   borderRadius: "20px",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
//                   border: "1px solid #f3f4f6",
//                   padding: "28px",
//                   marginBottom: "20px",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
//                   <div
//                     style={{
//                       width: "36px",
//                       height: "36px",
//                       borderRadius: "10px",
//                       background: "linear-gradient(135deg,#50604A,#7a9b71)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                       <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#fff"/>
//                       <circle cx="12" cy="9" r="2.5" fill="#50604A"/>
//                     </svg>
//                   </div>
//                   <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
//                     Shipping Details
//                   </h2>
//                 </div>

               
//                 <div
//                   style={{  marginBottom: "16px" }}
//                   className="form-grid"
//                 >
             
//                   <div>
//                     <label style={labelStyle}>Phone Number *</label>
//                     <input
//                       required
//                       type="tel"
//                       name="phone"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       placeholder="01012345678"
//                       style={inputStyle}
//                       onFocus={(e) => (e.target.style.borderColor = "#50604A")}
//                       onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
//                     />
//                   </div>
//                 </div>

//                 {/* Address */}
//                 <div style={{ marginBottom: "16px" }}>
//                   <label style={labelStyle}>Street Address *</label>
//                   <input
//                     required
//                     type="text"
//                     name="address"
//                     value={formData.address}
//                     onChange={handleChange}
//                     placeholder="e.g. 12 Tahrir St, Apt 3"
//                     style={inputStyle}
//                     onFocus={(e) => (e.target.style.borderColor = "#50604A")}
//                     onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
//                   />
//                 </div>

//                 {/* Governorate + City */}
//                 <div
//                   style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
//                   className="form-grid"
//                 >
//                   <div>
//                     <label style={labelStyle}>Governorate *</label>
//                     <div style={{ position: "relative" }}>
//                       <select
//                         required
//                         name="governate"
//                         value={formData.governate}
//                         onChange={handleChange}
//                         style={{
//                           ...inputStyle,
//                           appearance: "none",
//                           cursor: "pointer",
//                           paddingRight: "40px",
//                         }}
//                         onFocus={(e) => (e.target.style.borderColor = "#50604A")}
//                         onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
//                       >
//                         <option value="">اختر المحافظة</option>
//                         {Object.keys(EGYPT_DATA).map((gov) => (
//                           <option key={gov} value={gov}>
//                             {gov}
//                           </option>
//                         ))}
//                       </select>
//                       <div
//                         style={{
//                           position: "absolute",
//                           right: "14px",
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           pointerEvents: "none",
//                           color: "#9ca3af",
//                         }}
//                       >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                       </div>
//                     </div>
//                   </div>

//                   <div>
//                     <label style={labelStyle}>
//                       City *{" "}
//                       {!formData.governate && (
//                         <span style={{ color: "#9ca3af", fontWeight: 400 }}>(اختر المحافظة أولاً)</span>
//                       )}
//                     </label>
//                     <div style={{ position: "relative" }}>
//                       <select
//                         required
//                         name="city"
//                         value={formData.city}
//                         onChange={handleChange}
//                         disabled={!formData.governate}
//                         style={{
//                           ...inputStyle,
//                           appearance: "none",
//                           cursor: formData.governate ? "pointer" : "not-allowed",
//                           paddingRight: "40px",
//                           opacity: formData.governate ? 1 : 0.5,
//                         }}
//                         onFocus={(e) => (e.target.style.borderColor = "#50604A")}
//                         onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
//                       >
//                         <option value="">اختر المدينة</option>
//                         {cities.map((city) => (
//                           <option key={city} value={city}>
//                             {city}
//                           </option>
//                         ))}
//                       </select>
//                       <div
//                         style={{
//                           position: "absolute",
//                           right: "14px",
//                           top: "50%",
//                           transform: "translateY(-50%)",
//                           pointerEvents: "none",
//                           color: "#9ca3af",
//                         }}
//                       >
//                         <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
//                           <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                         </svg>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* ── Payment Method Card ── */}
//               <div
//                 style={{
//                   background: "#fff",
//                   borderRadius: "20px",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
//                   border: "1px solid #f3f4f6",
//                   padding: "28px",
//                   marginBottom: "20px",
//                 }}
//               >
//                 <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
//                   <div
//                     style={{
//                       width: "36px",
//                       height: "36px",
//                       borderRadius: "10px",
//                       background: "linear-gradient(135deg,#50604A,#7a9b71)",
//                       display: "flex",
//                       alignItems: "center",
//                       justifyContent: "center",
//                     }}
//                   >
//                     <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
//                       <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
//                       <path d="M2 10h20" stroke="#fff" strokeWidth="1.8"/>
//                     </svg>
//                   </div>
//                   <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
//                     Payment Method
//                   </h2>
//                 </div>

//                 <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="form-grid">
//                   {/* CASH */}
//                   <label
//                     htmlFor="pay-cash"
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "14px",
//                       border: `2px solid ${formData.paymentMethod === "CASH" ? "#50604A" : "#e5e7eb"}`,
//                       borderRadius: "14px",
//                       padding: "16px 18px",
//                       cursor: "pointer",
//                       background: formData.paymentMethod === "CASH" ? "#f0f4ef" : "#fafafa",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       id="pay-cash"
//                       name="paymentMethod"
//                       value="CASH"
//                       checked={formData.paymentMethod === "CASH"}
//                       onChange={handleChange}
//                       style={{ accentColor: "#50604A", width: "18px", height: "18px" }}
//                     />
//                     <div>
//                       <div style={{ fontSize: "22px", marginBottom: "2px" }}>💵</div>
//                       <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "14px" }}>Cash on Delivery</div>
//                       <div style={{ fontSize: "12px", color: "#6b7280" }}>Pay when you receive</div>
//                     </div>
//                   </label>

//                   {/* VISA */}
//                   <label
//                     htmlFor="pay-visa"
//                     style={{
//                       display: "flex",
//                       alignItems: "center",
//                       gap: "14px",
//                       border: `2px solid ${formData.paymentMethod === "VISA" ? "#50604A" : "#e5e7eb"}`,
//                       borderRadius: "14px",
//                       padding: "16px 18px",
//                       cursor: "pointer",
//                       background: formData.paymentMethod === "VISA" ? "#f0f4ef" : "#fafafa",
//                       transition: "all 0.2s",
//                     }}
//                   >
//                     <input
//                       type="radio"
//                       id="pay-visa"
//                       name="paymentMethod"
//                       value="VISA"
//                       checked={formData.paymentMethod === "VISA"}
//                       onChange={handleChange}
//                       style={{ accentColor: "#50604A", width: "18px", height: "18px" }}
//                     />
//                     <div>
//                       <div style={{ fontSize: "22px", marginBottom: "2px" }}>💳</div>
//                       <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "14px" }}>Credit / Debit Card</div>
//                       <div style={{ fontSize: "12px", color: "#6b7280" }}>Visa, Mastercard</div>
//                     </div>
//                   </label>
//                 </div>
//               </div>

//               {/* ── Order Summary (mobile) visible inside form on small screens ── */}
//               <div
//                 style={{
//                   background: "#fff",
//                   borderRadius: "20px",
//                   boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
//                   border: "1px solid #f3f4f6",
//                   padding: "28px",
//                   marginBottom: "20px",
//                 }}
//                 className="order-summary-mobile"
//               >
//                 <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
//                   Order Summary
//                 </h2>
//                 <div style={{ maxHeight: "260px", overflowY: "auto", marginBottom: "16px" }}>
//                   {cart.items.map((item, idx) => {
//                     const pid = item.productId?._id || item.productId;
//                     return (
//                       <div
//                         key={idx}
//                         style={{
//                           display: "flex",
//                           justifyContent: "space-between",
//                           alignItems: "flex-start",
//                           padding: "12px 0",
//                           borderBottom: idx < cart.items.length - 1 ? "1px solid #f3f4f6" : "none",
//                           gap: "12px",
//                         }}
//                       >
//                         <div style={{ flex: 1 }}>
//                           <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>
//                             {item.productId?.name || "Product"}
//                           </div>
//                           <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
//                             <div
//                               style={{
//                                 display: "flex",
//                                 alignItems: "center",
//                                 border: "1px solid #e5e7eb",
//                                 borderRadius: "8px",
//                                 overflow: "hidden",
//                               }}
//                             >
//                               <button
//                                 type="button"
//                                 disabled={updatingId === pid}
//                                 onClick={() => handleUpdateQuantity(pid, item.quantity - 1)}
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   background: "none",
//                                   border: "none",
//                                   cursor: "pointer",
//                                   fontSize: "16px",
//                                   color: "#374151",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 −
//                               </button>
//                               <span style={{ width: "32px", textAlign: "center", fontSize: "13px", fontWeight: 600 }}>
//                                 {item.quantity}
//                               </span>
//                               <button
//                                 type="button"
//                                 disabled={updatingId === pid}
//                                 onClick={() => handleUpdateQuantity(pid, item.quantity + 1)}
//                                 style={{
//                                   width: "28px",
//                                   height: "28px",
//                                   background: "none",
//                                   border: "none",
//                                   cursor: "pointer",
//                                   fontSize: "16px",
//                                   color: "#374151",
//                                   display: "flex",
//                                   alignItems: "center",
//                                   justifyContent: "center",
//                                 }}
//                               >
//                                 +
//                               </button>
//                             </div>
//                             <span style={{ fontSize: "12px", color: "#9ca3af" }}>{item.price} EGP / item</span>
//                           </div>
//                         </div>
//                         <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "15px", whiteSpace: "nowrap" }}>
//                           {item.price * item.quantity} EGP
//                         </span>
//                       </div>
//                     );
//                   })}
//                 </div>

//                 <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: "16px" }}>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
//                     <span style={{ color: "#6b7280", fontSize: "14px" }}>Subtotal</span>
//                     <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{cart.totalAmount} EGP</span>
//                   </div>
//                   <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
//                     <span style={{ color: "#6b7280", fontSize: "14px" }}>Shipping</span>
//                     <span style={{ fontWeight: 600, color: "#16a34a", fontSize: "14px" }}>Free</span>
//                   </div>
//                   <div
//                     style={{
//                       display: "flex",
//                       justifyContent: "space-between",
//                       borderTop: "1px solid #e5e7eb",
//                       paddingTop: "14px",
//                     }}
//                   >
//                     <span style={{ fontWeight: 800, fontSize: "18px", color: "#1a1a1a" }}>Total</span>
//                     <span style={{ fontWeight: 800, fontSize: "22px", color: "#50604A" }}>
//                       {cart.totalAmount} EGP
//                     </span>
//                   </div>
//                 </div>
//               </div>

           
//               <button
//                 type="submit"
//                 disabled={loading}
//                 style={{
//                   width: "100%",
//                   background: loading
//                     ? "#9ca3af"
//                     : "#50604A ",
//                   color: "#fff",
//                   border: "none",
//                   borderRadius: "16px",
//                   padding: "18px 24px",
//                   fontSize: "17px",
//                   fontWeight: 700,
//                   cursor: loading ? "not-allowed" : "pointer",
//                   boxShadow: loading ? "none" : "0 8px 24px rgba(80,96,74,0.35)",
//                   transition: "transform 0.15s, box-shadow 0.15s",
//                   display: "flex",
//                   alignItems: "center",
//                   justifyContent: "center",
//                   gap: "10px",
//                 }}
//                 onMouseOver={(e) => {
//                   if (!loading) e.currentTarget.style.transform = "translateY(-2px)";
//                 }}
//                 onMouseOut={(e) => {
//                   e.currentTarget.style.transform = "translateY(0)";
//                 }}
//               >
//                 {loading ? (
//                   <>
//                     <svg
//                       width="20"
//                       height="20"
//                       viewBox="0 0 24 24"
//                       fill="none"
//                       style={{ animation: "spin 1s linear infinite" }}
//                     >
//                       <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
//                       <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
//                     </svg>
//                     Processing…
//                   </>
//                 ) : (
//                   <>
//                     <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
//                       <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
//                     </svg>
//                     Place Order · {cart.totalAmount} EGP
//                   </>
//                 )}
//               </button>
//             </form>
//           </div>
//         </div>
//       </div>

//       <style>{`
//         @keyframes spin {
//           from { transform: rotate(0deg); }
//           to   { transform: rotate(360deg); }
//         }
//         @media (min-width: 1024px) {
//           .checkout-layout {
//             flex-direction: row !important;
//           }
//           .order-summary-mobile {
//             display: none !important;
//           }
//         }
//         @media (max-width: 640px) {
//           .form-grid {
//             grid-template-columns: 1fr !important;
//           }
//         }
//       `}</style>
//     </>
//   );
// }
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe("pk_test_51Tfg0qF3X8TkLn5begaNuyALoqNR9MBt85CJHMNdL1W48L5WgXjyBiIustCAtPzttXC6t5qJtHJg0qmcxe13OIxS00WqKYLYpQ");


const EGYPT_DATA = {
  "القاهرة": ["مصر الجديدة", "المعادي", "مدينة نصر", "الزيتون", "شبرا", "عين شمس", "حلوان", "المقطم", "التجمع الخامس", "6 أكتوبر (القاهرة)", "الدراسة", "الأزبكية", "الخليفة", "السيدة زينب", "روض الفرج"],
  "الجيزة": ["الدقي", "العجوزة", "المهندسين", "إمبابة", "فيصل", "الهرم", "بولاق الدكرور", "6 أكتوبر", "الشيخ زايد", "البدرشين", "الصف", "أوسيم"],
  "الإسكندرية": ["المنتزه", "العجمي", "برج العرب", "الدخيلة", "الجمرك", "الرمل", "اللبان", "سيدي جابر", "باكوس", "ميامي", "كليوباترا", "المعمورة"],
  "القليوبية": ["بنها", "شبين القناطر", "قليوب", "الخانكة", "طوخ", "القناطر الخيرية", "كفر شكر"],
  "الشرقية": ["الزقازيق", "العاشر من رمضان", "بلبيس", "أبو كبير", "منيا القمح", "فاقوس", "ديرب نجم", "الإبراهيمية"],
  "الدقهلية": ["المنصورة", "طلخا", "ميت غمر", "أجا", "شربين", "السنبلاوين", "بلقاس", "دكرنس"],
  "البحيرة": ["دمنهور", "كفر الدوار", "رشيد", "إدكو", "أبو حمص", "المحمودية", "حوش عيسى", "كوم حمادة"],
  "الغربية": ["طنطا", "المحلة الكبرى", "كفر الزيات", "زفتى", "السنطة", "بسيون", "قطور", "سمنود"],
  "المنوفية": ["شبين الكوم", "مينوف", "أشمون", "الشهداء", "قويسنا", "بركة السبع", "سرس الليان"],
  "كفر الشيخ": ["كفر الشيخ", "دسوق", "فوه", "مطوبس", "الحامول", "بيلا", "سيدي سالم"],
  "الفيوم": ["الفيوم", "سنورس", "إطسا", "أبشواي", "طامية", "يوسف الصديق"],
  "بني سويف": ["بني سويف", "ناصر", "الواسطى", "ببا", "الفشن", "إهناسيا"],
  "المنيا": ["المنيا", "ملوي", "مغاغة", "العدوة", "أبو قرقاص", "بني مزار", "سمالوط", "المطانية"],
  "أسيوط": ["أسيوط", "ديروط", "القوصية", "أبنوب", "منفلوط", "الغنايم", "الفتح", "ساحل سليم"],
  "سوهاج": ["سوهاج", "طهطا", "جرجا", "دار السلام", "المراغة", "البلينا", "طما", "أخميم"],
  "قنا": ["قنا", "نجع حمادي", "قوص", "الأقصر", "دشنا", "فرشوط", "أبو تشت"],
  "الأقصر": ["الأقصر", "القرنة", "إسنا", "الأرمنت", "البياضية"],
  "أسوان": ["أسوان", "كوم أمبو", "أدفو", "إدفو", "نصر النوبة", "دراو"],
  "البحر الأحمر": ["الغردقة", "سفاجا", "القصير", "مرسى علم", "رأس غارب"],
  "الوادي الجديد": ["الخارجة", "الداخلة", "الفرافرة", "بريس"],
  "مطروح": ["مرسى مطروح", "الحمام", "الضبعة", "سيدي براني", "السلوم"],
  "شمال سيناء": ["العريش", "الشيخ زويد", "رفح", "بئر العبد", "الحسنة"],
  "جنوب سيناء": ["الطور", "شرم الشيخ", "دهب", "نويبع", "طابا", "أبو رديس"],
  "بورسعيد": ["بورسعيد", "الضواحي", "الجنوب", "الشرق", "الغرب", "المناخ", "الزهور", "فؤاد"],
  "الإسماعيلية": ["الإسماعيلية", "القنطرة شرق", "القنطرة غرب", "فايد", "أبو صوير"],
  "السويس": ["السويس", "عتاقة", "أربعين", "جناكليس"],
  "دمياط": ["دمياط", "رأس البر", "فارسكور", "الزرقا", "كفر سعد", "الرياض"],
};


// ─────────────────────────────────────────────
// Stripe inline payment step
// ─────────────────────────────────────────────
function StripeForm({ onSuccess, totalAmount }) {
  const stripe = useStripe();
  const elements = useElements();
  const [paying, setPaying] = useState(false);
  const [stripeError, setStripeError] = useState(null);

  const handlePay = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setPaying(true);
    setStripeError(null);

    const { error } = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (error) {
      setStripeError(error.message);
      setPaying(false);
    } else {
      onSuccess();
    }
  };

  return (
    <form onSubmit={handlePay}>
      <div
        style={{
          background: "#f9fafb",
          borderRadius: "16px",
          padding: "20px",
          border: "1px solid #e5e7eb",
          marginBottom: "16px",
        }}
      >
        <PaymentElement options={{ layout: "tabs" }} />
      </div>

      {stripeError && (
        <div
          style={{
            background: "#fef2f2",
            border: "1px solid #fecaca",
            color: "#dc2626",
            borderRadius: "12px",
            padding: "12px 16px",
            fontSize: "13px",
            marginBottom: "16px",
            display: "flex",
            gap: "8px",
            alignItems: "center",
          }}
        >
          ⚠️ {stripeError}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || paying}
        style={{
          width: "100%",
          background: paying
            ? "#9ca3af"
            : "linear-gradient(135deg,#50604A 0%,#7a9b71 100%)",
          color: "#fff",
          border: "none",
          borderRadius: "16px",
          padding: "18px 24px",
          fontSize: "17px",
          fontWeight: 700,
          cursor: paying ? "not-allowed" : "pointer",
          boxShadow: paying ? "none" : "0 8px 24px rgba(80,96,74,0.35)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        {paying ? (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" style={{ animation: "spin 1s linear infinite" }}>
              <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
              <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
            </svg>
            Processing Payment…
          </>
        ) : (
          <>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
              <path d="M2 10h20" stroke="#fff" strokeWidth="1.8"/>
            </svg>
            Pay {totalAmount?.toLocaleString()} EGP
          </>
        )}
      </button>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: "6px",
          marginTop: "14px",
          fontSize: "12px",
          color: "#9ca3af",
        }}
      >
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#9ca3af" strokeWidth="2" strokeLinejoin="round"/>
        </svg>
        Secured by Stripe · SSL Encrypted
      </div>
    </form>
  );
}

function StripePaymentStep({ clientSecret, totalAmount, onSuccess, onBack }) {
  return (
    <div
      style={{
        maxWidth: "520px",
        margin: "80px auto 60px",
        padding: "0 20px",
      }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "6px",
          background: "none",
          border: "none",
          color: "#6b7280",
          fontSize: "14px",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: "28px",
          padding: 0,
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path d="M19 12H5M12 5l-7 7 7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        Back to checkout
      </button>

      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div
          style={{
            width: "64px",
            height: "64px",
            borderRadius: "18px",
            background: "linear-gradient(135deg,#50604A,#7a9b71)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            boxShadow: "0 8px 24px rgba(80,96,74,0.3)",
          }}
        >
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
            <path d="M2 10h20" stroke="#fff" strokeWidth="1.8"/>
          </svg>
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#1a1a1a", margin: "0 0 6px" }}>
          Complete Payment
        </h2>
        <p style={{ color: "#6b7280", fontSize: "14px", margin: 0 }}>
          Enter your card details to place your order
        </p>
      </div>

      {/* Stripe card */}
      <div
        style={{
          background: "#fff",
          borderRadius: "20px",
          boxShadow: "0 1px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.06)",
          border: "1px solid #f3f4f6",
          padding: "28px",
        }}
      >
        <Elements
          stripe={stripePromise}
          options={{
            clientSecret,
            appearance: {
              theme: "stripe",
              variables: {
                colorPrimary: "#50604A",
                colorBackground: "#ffffff",
                colorText: "#1f2937",
                borderRadius: "12px",
                fontFamily: "inherit",
              },
            },
          }}
        >
          <StripeForm onSuccess={onSuccess} totalAmount={totalAmount} />
        </Elements>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
function SuccessOverlay({ onClose }) {
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.55)",
        backdropFilter: "blur(6px)",
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          background: "#fff",
          borderRadius: "24px",
          padding: "48px 40px",
          maxWidth: "420px",
          width: "90%",
          textAlign: "center",
          boxShadow: "0 32px 80px rgba(0,0,0,0.2)",
          animation: "popIn 0.45s cubic-bezier(0.34,1.56,0.64,1) forwards",
        }}
      >
        {/* Animated checkmark */}
        <div
          style={{
            width: "96px",
            height: "96px",
            borderRadius: "50%",
            background: "linear-gradient(135deg,#50604A,#7a9b71)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 24px",
            animation: "scaleIn 0.5s 0.1s cubic-bezier(0.34,1.56,0.64,1) both",
            boxShadow: "0 12px 32px rgba(80,96,74,0.4)",
          }}
        >
          <svg width="52" height="52" viewBox="0 0 52 52" fill="none">
            <circle cx="26" cy="26" r="26" fill="none" />
            <path
              d="M14 27l9 9 15-18"
              stroke="#fff"
              strokeWidth="3.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ animation: "drawCheck 0.5s 0.3s ease both" }}
            />
          </svg>
        </div>

        <h2
          style={{
            fontSize: "26px",
            fontWeight: 800,
            color: "#1a1a1a",
            marginBottom: "10px",
          }}
        >
          Payment Successful! 
        </h2>
        <p style={{ color: "#6b7280", fontSize: "15px", marginBottom: "32px", lineHeight: 1.6 }}>
          Your order has been placed successfully. We'll notify you when it's on its way!
        </p>

        <button
          onClick={onClose}
          style={{
            background: "#50604A",
            color: "#fff",
            border: "none",
            borderRadius: "14px",
            padding: "14px 40px",
            fontSize: "16px",
            fontWeight: 700,
            cursor: "pointer",
            width: "100%",
            transition: "transform 0.15s",
          }}
          onMouseOver={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
          onMouseOut={(e) => (e.currentTarget.style.transform = "scale(1)")}
        >
          View My Orders
        </button>
      </div>

      <style>{`
        @keyframes popIn {
          0%   { opacity: 0; transform: scale(0.7) translateY(30px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes scaleIn {
          0%   { transform: scale(0); }
          100% { transform: scale(1); }
        }
        @keyframes drawCheck {
          from { stroke-dasharray: 0 50; }
          to   { stroke-dasharray: 50 0; }
        }
      `}</style>
    </div>
  );
}


export default function CheckoutPage() {
  const router = useRouter();
  const { cart, clearCart, updateCartQuantity, removeFromCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [clientSecret, setClientSecret] = useState(null);
  const [cartSnapshot, setCartSnapshot] = useState(null); 

  const [formData, setFormData] = useState({
 
    phone: "",
    address: "",
    governate: "",
    city: "",
    paymentMethod: "CASH",
  });

  const cities = formData.governate ? EGYPT_DATA[formData.governate] || [] : [];

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "governate") {
   
      setFormData((prev) => ({ ...prev, governate: value, city: "" }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    setUpdatingId(productId);
    if (newQuantity <= 0) {
      await removeFromCart(productId);
    } else {
      await updateCartQuantity(productId, newQuantity);
    }
    setUpdatingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cart || !cart.items || cart.items.length === 0) return;

    setLoading(true);
    setError(null);
    const token = localStorage.getItem("token");

    try {
      const response = await fetch("https://bazary-backend.vercel.app/api/events/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentMethod: formData.paymentMethod,
          fullName: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          governate: formData.governate,
          city: formData.city,
        }),
      });

      const data = await response.json();

      if (!response.ok || data.status === "fail" || data.status === "error") {
        throw new Error(data.message || "Checkout failed. Please try again.");
      }

      if (formData.paymentMethod === "VISA") {
       
        const secret = data?.data?.clientSecrets?.[0]?.clientSecret;

        if (!secret) throw new Error("No payment secret received from server.");

        setCartSnapshot({ totalAmount: cart.totalAmount });
        setClientSecret(secret);
        return;
      }

    
      setShowSuccess(true);
    
    } catch (err) {
      console.error("Checkout error:", err);
      setError(err.message || "Something went wrong during checkout.");
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessClose = async () => {
    
    router.push("/my-orders");
      await clearCart();
    
  };

  // Show ONLY the overlay after successful checkout (cart is null/empty at this point)
  if (showSuccess) {
    return (
      <>
        <div style={{ minHeight: "100vh" }} />
        <SuccessOverlay onClose={handleSuccessClose} />
      </>
    );
  }

  // Show the inline Stripe payment step once we have a clientSecret (VISA flow)
  if (clientSecret) {
    return (
      <StripePaymentStep
        clientSecret={clientSecret}
        totalAmount={cartSnapshot?.totalAmount}
        onBack={() => setClientSecret(null)}
        onSuccess={() => {
          setClientSecret(null);
          setShowSuccess(true);
        }}
      />
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center px-4">
        <div
          style={{
            width: "120px",
            height: "120px",
            background: "#f3f4f6",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginBottom: "24px",
          }}
        >
          <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
            <path d="M8 10h4l5.5 28h22l4-18H16" stroke="#d1d5db" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            <circle cx="22" cy="44" r="2.5" fill="#d1d5db"/>
            <circle cx="36" cy="44" r="2.5" fill="#d1d5db"/>
          </svg>
        </div>
        <h2 style={{ fontSize: "24px", fontWeight: 700, color: "#1f2937", marginBottom: "8px" }}>
          Your cart is empty
        </h2>
        <p style={{ color: "#6b7280", marginBottom: "32px", textAlign: "center" }}>
          Add items to your cart before checking out.
        </p>
        <button
          onClick={() => router.push("/explore")}
          style={{
            background: "#50604A",
            color: "#fff",
            border: "none",
            borderRadius: "12px",
            padding: "14px 32px",
            fontSize: "15px",
            fontWeight: 600,
            cursor: "pointer",
          }}
        >
          Explore Bazaars
        </button>
      </div>
    );
  }

  const inputStyle = {
    width: "100%",
    border: "1.5px solid #e5e7eb",
    borderRadius: "12px",
    padding: "12px 16px",
    fontSize: "14px",
    outline: "none",
    transition: "border-color 0.2s",
    background: "#fafafa",
    boxSizing: "border-box",
    fontFamily: "inherit",
  };

  const labelStyle = {
    display: "block",
    fontSize: "13px",
    fontWeight: 600,
    color: "#374151",
    marginBottom: "6px",
  };

  return (
    <>
      {showSuccess && <SuccessOverlay onClose={handleSuccessClose} />}

      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "80px 20px 60px",
          minHeight: "100vh",
        }}
      >
        {/* Header */}
        <div style={{ marginBottom: "36px" }}>
          <h1
            style={{
              fontSize: "32px",
              fontWeight: 800,
              color: "#1a1a1a",
              marginBottom: "6px",
            }}
          >
            Checkout
          </h1>
          <p style={{ color: "#6b7280", fontSize: "15px" }}>
            Complete your order details below
          </p>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "24px",
          }}
          className="checkout-layout"
        >
          {/* ── Left: Form ── */}
          <div style={{ flex: 1 }}>
            {/* Error */}
            {error && (
              <div
                style={{
                  background: "#fef2f2",
                  border: "1px solid #fecaca",
                  color: "#dc2626",
                  padding: "14px 18px",
                  borderRadius: "12px",
                  fontSize: "14px",
                  marginBottom: "20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                }}
              >
                <span>⚠️</span> {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              {/* ── Shipping Details Card ── */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
                  border: "1px solid #f3f4f6",
                  padding: "28px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg,#50604A,#7a9b71)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#fff"/>
                      <circle cx="12" cy="9" r="2.5" fill="#50604A"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                    Shipping Details
                  </h2>
                </div>

               
                <div
                  style={{  marginBottom: "16px" }}
                  className="form-grid"
                >
             
                  <div>
                    <label style={labelStyle}>Phone Number *</label>
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="01012345678"
                      style={inputStyle}
                      onFocus={(e) => (e.target.style.borderColor = "#50604A")}
                      onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                    />
                  </div>
                </div>

                {/* Address */}
                <div style={{ marginBottom: "16px" }}>
                  <label style={labelStyle}>Street Address *</label>
                  <input
                    required
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="e.g. 12 Tahrir St, Apt 3"
                    style={inputStyle}
                    onFocus={(e) => (e.target.style.borderColor = "#50604A")}
                    onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                  />
                </div>

                {/* Governorate + City */}
                <div
                  style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}
                  className="form-grid"
                >
                  <div>
                    <label style={labelStyle}>Governorate *</label>
                    <div style={{ position: "relative" }}>
                      <select
                        required
                        name="governate"
                        value={formData.governate}
                        onChange={handleChange}
                        style={{
                          ...inputStyle,
                          appearance: "none",
                          cursor: "pointer",
                          paddingRight: "40px",
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#50604A")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      >
                        <option value="">اختر المحافظة</option>
                        {Object.keys(EGYPT_DATA).map((gov) => (
                          <option key={gov} value={gov}>
                            {gov}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9ca3af",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={labelStyle}>
                      City *{" "}
                      {!formData.governate && (
                        <span style={{ color: "#9ca3af", fontWeight: 400 }}>(اختر المحافظة أولاً)</span>
                      )}
                    </label>
                    <div style={{ position: "relative" }}>
                      <select
                        required
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        disabled={!formData.governate}
                        style={{
                          ...inputStyle,
                          appearance: "none",
                          cursor: formData.governate ? "pointer" : "not-allowed",
                          paddingRight: "40px",
                          opacity: formData.governate ? 1 : 0.5,
                        }}
                        onFocus={(e) => (e.target.style.borderColor = "#50604A")}
                        onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
                      >
                        <option value="">اختر المدينة</option>
                        {cities.map((city) => (
                          <option key={city} value={city}>
                            {city}
                          </option>
                        ))}
                      </select>
                      <div
                        style={{
                          position: "absolute",
                          right: "14px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          pointerEvents: "none",
                          color: "#9ca3af",
                        }}
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* ── Payment Method Card ── */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
                  border: "1px solid #f3f4f6",
                  padding: "28px",
                  marginBottom: "20px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
                  <div
                    style={{
                      width: "36px",
                      height: "36px",
                      borderRadius: "10px",
                      background: "linear-gradient(135deg,#50604A,#7a9b71)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                      <rect x="2" y="5" width="20" height="14" rx="3" stroke="#fff" strokeWidth="1.8"/>
                      <path d="M2 10h20" stroke="#fff" strokeWidth="1.8"/>
                    </svg>
                  </div>
                  <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", margin: 0 }}>
                    Payment Method
                  </h2>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }} className="form-grid">
                  {/* CASH */}
                  <label
                    htmlFor="pay-cash"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      border: `2px solid ${formData.paymentMethod === "CASH" ? "#50604A" : "#e5e7eb"}`,
                      borderRadius: "14px",
                      padding: "16px 18px",
                      cursor: "pointer",
                      background: formData.paymentMethod === "CASH" ? "#f0f4ef" : "#fafafa",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      id="pay-cash"
                      name="paymentMethod"
                      value="CASH"
                      checked={formData.paymentMethod === "CASH"}
                      onChange={handleChange}
                      style={{ accentColor: "#50604A", width: "18px", height: "18px" }}
                    />
                    <div>
                      <div style={{ fontSize: "22px", marginBottom: "2px" }}>💵</div>
                      <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "14px" }}>Cash on Delivery</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Pay when you receive</div>
                    </div>
                  </label>

                  {/* VISA */}
                  <label
                    htmlFor="pay-visa"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      border: `2px solid ${formData.paymentMethod === "VISA" ? "#50604A" : "#e5e7eb"}`,
                      borderRadius: "14px",
                      padding: "16px 18px",
                      cursor: "pointer",
                      background: formData.paymentMethod === "VISA" ? "#f0f4ef" : "#fafafa",
                      transition: "all 0.2s",
                    }}
                  >
                    <input
                      type="radio"
                      id="pay-visa"
                      name="paymentMethod"
                      value="VISA"
                      checked={formData.paymentMethod === "VISA"}
                      onChange={handleChange}
                      style={{ accentColor: "#50604A", width: "18px", height: "18px" }}
                    />
                    <div>
                      <div style={{ fontSize: "22px", marginBottom: "2px" }}>💳</div>
                      <div style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "14px" }}>Credit / Debit Card</div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Visa, Mastercard</div>
                    </div>
                  </label>
                </div>
              </div>

              {/* ── Order Summary (mobile) visible inside form on small screens ── */}
              <div
                style={{
                  background: "#fff",
                  borderRadius: "20px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.07), 0 4px 16px rgba(0,0,0,0.05)",
                  border: "1px solid #f3f4f6",
                  padding: "28px",
                  marginBottom: "20px",
                }}
                className="order-summary-mobile"
              >
                <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#1a1a1a", marginBottom: "20px" }}>
                  Order Summary
                </h2>
                <div style={{ maxHeight: "260px", overflowY: "auto", marginBottom: "16px" }}>
                  {cart.items.map((item, idx) => {
                    const pid = item.productId?._id || item.productId;
                    return (
                      <div
                        key={idx}
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          padding: "12px 0",
                          borderBottom: idx < cart.items.length - 1 ? "1px solid #f3f4f6" : "none",
                          gap: "12px",
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: 600, color: "#1a1a1a", marginBottom: "4px" }}>
                            {item.productId?.name || "Product"}
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                            <div
                              style={{
                                display: "flex",
                                alignItems: "center",
                                border: "1px solid #e5e7eb",
                                borderRadius: "8px",
                                overflow: "hidden",
                              }}
                            >
                              <button
                                type="button"
                                disabled={updatingId === pid}
                                onClick={() => handleUpdateQuantity(pid, item.quantity - 1)}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: "#374151",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                −
                              </button>
                              <span style={{ width: "32px", textAlign: "center", fontSize: "13px", fontWeight: 600 }}>
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                disabled={updatingId === pid}
                                onClick={() => handleUpdateQuantity(pid, item.quantity + 1)}
                                style={{
                                  width: "28px",
                                  height: "28px",
                                  background: "none",
                                  border: "none",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  color: "#374151",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                }}
                              >
                                +
                              </button>
                            </div>
                            <span style={{ fontSize: "12px", color: "#9ca3af" }}>{item.price} EGP / item</span>
                          </div>
                        </div>
                        <span style={{ fontWeight: 700, color: "#1a1a1a", fontSize: "15px", whiteSpace: "nowrap" }}>
                          {item.price * item.quantity} EGP
                        </span>
                      </div>
                    );
                  })}
                </div>

                <div style={{ borderTop: "2px solid #f3f4f6", paddingTop: "16px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Subtotal</span>
                    <span style={{ fontWeight: 600, color: "#1a1a1a" }}>{cart.totalAmount} EGP</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
                    <span style={{ color: "#6b7280", fontSize: "14px" }}>Shipping</span>
                    <span style={{ fontWeight: 600, color: "#16a34a", fontSize: "14px" }}>Free</span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      borderTop: "1px solid #e5e7eb",
                      paddingTop: "14px",
                    }}
                  >
                    <span style={{ fontWeight: 800, fontSize: "18px", color: "#1a1a1a" }}>Total</span>
                    <span style={{ fontWeight: 800, fontSize: "22px", color: "#50604A" }}>
                      {cart.totalAmount} EGP
                    </span>
                  </div>
                </div>
              </div>

           
              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  background: loading
                    ? "#9ca3af"
                    : "#50604A ",
                  color: "#fff",
                  border: "none",
                  borderRadius: "16px",
                  padding: "18px 24px",
                  fontSize: "17px",
                  fontWeight: 700,
                  cursor: loading ? "not-allowed" : "pointer",
                  boxShadow: loading ? "none" : "0 8px 24px rgba(80,96,74,0.35)",
                  transition: "transform 0.15s, box-shadow 0.15s",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
                onMouseOver={(e) => {
                  if (!loading) e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                {loading ? (
                  <>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      style={{ animation: "spin 1s linear infinite" }}
                    >
                      <circle cx="12" cy="12" r="10" stroke="rgba(255,255,255,0.3)" strokeWidth="3"/>
                      <path d="M12 2a10 10 0 0 1 10 10" stroke="#fff" strokeWidth="3" strokeLinecap="round"/>
                    </svg>
                    Processing…
                  </>
                ) : (
                  <>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M9 12l2 2 4-4M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Place Order · {cart.totalAmount} EGP
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @media (min-width: 1024px) {
          .checkout-layout {
            flex-direction: row !important;
          }
          .order-summary-mobile {
            display: none !important;
          }
        }
        @media (max-width: 640px) {
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </>
  );
}