import Footer from "../components/Footer/Footer";
import Navbar from "../components/Navbar/Navbar";
import { CartProvider } from "../context/CartContext";
import AIAssistantButton from "../components/AIAssistant/Aiassistantbutton";
export default function MainLayout({ children }) {


  return (
    <div>  
      <CartProvider>
        <Navbar/> 
        {children}
        <Footer />
         <AIAssistantButton />
     </CartProvider>
      </div>

  

  );
}