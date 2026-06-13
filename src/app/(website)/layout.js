import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { CartProvider } from "../context/CartContext";

export default function MainLayout({ children }) {


  return (
    <div>  
      <CartProvider>
        <Navbar/> 
        {children}
        <Footer/>
     </CartProvider>
      </div>

  

  );
}