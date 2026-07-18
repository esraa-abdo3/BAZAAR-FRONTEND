
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { FiShoppingCart, FiHeart } from "react-icons/fi";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";

export default function Navbar() {
    const [open, setOpen] = useState(false);
    const { cartCount } = useCart();
    const { wishlistCount } = useWishlist();
    const pathname = usePathname();
    const router = useRouter();

    const [token, setToken] = useState(null);
    const [role, setRole] = useState(null);


    useEffect(() => {
        setToken(localStorage.getItem("token"));
        try {
            const storedUser = JSON.parse(localStorage.getItem("user"));
            setRole(storedUser?.role || null);
        } catch (e) {
            setRole(null);
        }
    }, [pathname]);

    const dashboardHrefByRole = {
        ADMIN: "/AdminDashboard",
        BAZAAR_OWNER: "/BazaarOwnerDashboard",
        BRAND_OWNER: "/BrandOwnerDashboard",
    };
    const dashboardHref = dashboardHrefByRole[role];

    useEffect(() => {
        document.body.style.overflow = open ? "hidden" : "";
        return () => {
            document.body.style.overflow = "";
        };
    }, [open]);

    useEffect(() => {
        const onKeyDown = (e) => {
            if (e.key === "Escape") close();
        };
        document.addEventListener("keydown", onKeyDown);
        return () => document.removeEventListener("keydown", onKeyDown);
    }, []);

    const openMenu = () => setOpen(true);
    const close = () => setOpen(false);

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setToken(null);
        setRole(null);
        close();
        router.push("/auth/login");
    };

    // Returns the active classes when the current path matches the link's href
    const isActive = (href) => pathname === href;

    const linkClass = (href) =>
        `relative transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:bg-primary after:transition-all after:duration-300 hover:text-primary hover:after:w-full ${
            isActive(href) ? "text-primary after:w-full" : "after:w-0"
        }`;

    return (
        <>
        
<div className="fixed top-0 left-0 w-full z-50 bg-white h-[60px] flex items-center shadow-lg shadow-primary/10">
            <div className="container w-[95%] lg:w-[85%] mx-auto flex items-center relative">
                    <div className="logo uppercase font-medium text-[23px] text-background cursor-pointer flex-1">
                        <Link href={"/"}>
                                 Bazaarna
                        </Link>
               
                </div>
                <div className="links hidden lg:flex justify-center gap-5 items-center px-1 capitalize text-gray-400 font-medium absolute left-1/2 -translate-x-1/2">
                    <Link href={"/"}     
                     className={linkClass("/")}
                    >Home</Link>
                    <Link   href="/explore"

                     className={linkClass("/explore")}
                    
                    >Explore Bazaars</Link>

                    <Link   href="/shop"

                     className={linkClass("/shop")}
                    
                    >Shop</Link>
    
        
                    <Link href="/my-orders"

 className={linkClass("/my-orders")}
                    >my orders</Link>
                   
                    <Link href="/#contact"
  onClick={(e) => {
    e.preventDefault();
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  }}
                    className={linkClass("/#contact")}
                    >contact us</Link>
              
                </div>
                    <div className="auth hidden md:flex gap-4 capitalize flex-1 justify-end items-center">
                    <div className="auth hidden md:flex gap-4 capitalize items-center">
                        {token && dashboardHref && (
                            <Link
                                href={dashboardHref}
                                className="rounded-[8px] bg-primary px-4 py-1 text-white flex items-center capitalize transition-all hover:scale-[.98] duration-500 cursor-pointer"
                            >
                                go to dashboard
                            </Link>
                        )}
                        {!token ? (
                            <Link
                                href="/auth/login"
                                className="rounded-[8px] border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white flex items-center capitalize transition-all hover:scale-[.98] duration-500 cursor-pointer"
                            >
                                login
                            </Link>
                        ) : (
                            <button
                                onClick={logout}
                                className="rounded-[8px] border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white flex items-center capitalize transition-all hover:scale-[.98] duration-500 cursor-pointer"
                            >
                                logout
                            </button>
                        )}
                
  <Link
    href="/wishlist"
    className="relative flex items-center mr-4"
  >
    <div>
      <FiHeart
        size={24}
        className={isActive("/wishlist") ? "text-red-500 fill-red-500" : "text-red-500 hover:fill-red-500 transition-colors duration-200"}
      />
    </div>
    <div
      className="
        absolute
        -top-[8px]
        -right-3
        w-5
        h-5
        rounded-full
        bg-primary
        text-white
        text-xs
        flex
        items-center
        justify-center
      "
    >
      <span> {wishlistCount}</span>  
    </div>
  </Link>

  <Link
    href="/cart"
    className="relative flex items-center"
  >
    <div>
      <FiShoppingCart
        size={24}
        className={isActive("/cart") ? "text-primary" : "text-background"}
      />
    </div>

    <div
      className="
        absolute
        -top-[8px]
        -right-3
        w-5
        h-5
        rounded-full
        bg-primary
        text-white
        text-xs
        flex
        items-center
        justify-center
      "
    >
      <span> {cartCount}</span>  
    </div>
  </Link>
</div>

                    
     

            </div>
                   <button
          onClick={openMenu}
              className="lg:hidden flex flex-col gap-1.5 p-1 ml-auto"
              aria-label="open menu"
            >
              <span className="w-6 h-0.5 bg-background block" />
              <span className="w-6 h-0.5 bg-background block" />
              <span className="w-6 h-0.5 bg-background block" />
            </button>
      

        </div>
        
      <div
              onClick={
                  close
              }
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 lg:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

   
<div
  className={`fixed top-0 left-0 w-full z-50 h-full  bg-white shadow-2xl transition-all duration-300 ease-in-out z-50
    ${open ? "translate-x-0" : "-translate-x-full"}`}
>
      
      
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <span className="uppercase font-medium text-[23px] text-background">
            Bazaarna
          </span>
          <button onClick={close} aria-label="close menu" className="text-gray-400 hover:text-primary transition-colors">
            ✕
          </button>
        </div>

            <div className=" flex flex-col justify-between h-[90%]">
                               <div className="links  flex  flex-col py-4  gap-5  px-2 capitalize text-gray-400 font-medium">
                    <Link href={"/"}
                     onClick={close}
                     className={linkClass("/")}
                    >Home</Link>

                    <Link href="/explore"
                     onClick={close}
                     className={linkClass("/explore")}
                    >Explore Bazaars</Link>

                    <Link href="/shop"
                     onClick={close}
                     className={linkClass("/shop")}
                    >Shop</Link>

                    <Link href="/my-orders"
                     onClick={close}
                     className={linkClass("/my-orders")}
                    >My orders</Link>

                     <Link href="/wishlist"
                      onClick={close}
                      className={linkClass("/wishlist")}
                >Wishlist ({wishlistCount})</Link>
                <Link href="/cart"
  onClick={close}
  className={linkClass("/cart")}
>Cart ({cartCount})</Link>

                    <Link href="/#contact"
                     onClick={(e) => {
                        e.preventDefault();
                        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
                        close();
                     }}
                     className={linkClass("/#contact")}
                    >contact us</Link>

                    </div>
                        <div className="flex flex-col gap-2 px-6  ">
          {token && dashboardHref && (
            <Link
              href={dashboardHref}
              onClick={close}
              className="rounded-[8px] px-4 py-2 bg-primary text-white capitalize w-full text-center"
            >
              go to dashboard
            </Link>
          )}
          {!token ? (
            <>
              <Link
                href="/auth/login"
                onClick={close}
                className="rounded-[8px] px-4 py-2 text-primary border border-primary capitalize w-full text-center"
              >
                login
              </Link>
              <Link
                href="/auth/signup"
                onClick={close}
                className="rounded-[8px] px-4 py-2 bg-primary text-white capitalize w-full text-center"
              >
                sign up
              </Link>
            </>
          ) : (
            <button
              onClick={logout}
              className="rounded-[8px] px-4 py-2 bg-primary text-white capitalize w-full"
            >
              logout
            </button>
          )}
        </div>
                    
             </div>
         
  

    
                </div>
                </div>
                </>
    )
}