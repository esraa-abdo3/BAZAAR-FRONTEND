import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { CartProvider } from "../context/CartContext";
import { WishlistProvider } from "../context/WishlistContext";
import AIAssistantButton from "../components/AIAssistant/Aiassistantbutton";
export default function MainLayout({ children }) {


  return (
    <div>  

      <CartProvider>
        <WishlistProvider>
          <Navbar /> 
             <div className="fixed top-[60px] left-0 w-full z-40 bg-black text-white py-2 overflow-hidden whitespace-nowrap pointer-events-none">
        <div className="flex w-max ticker-track">
          {[...Array(10)].map((_, i) => (
            <span key={i} className="mx-8 text-sm md:text-base font-semibold tracking-wide uppercase">
              Buy now and get free shipping! 
            </span>
          ))}
        </div>
      </div>
          {children}
          <Footer />
          <AIAssistantButton />
        </WishlistProvider>
      </CartProvider>
      </div>

  

  );
}