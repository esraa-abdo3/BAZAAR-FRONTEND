"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
    const [open, setsopen] = useState(false);
    const openfun = () => {
        setsopen(true)
        
    }
    const close = () => {
        setsopen(false)
    }
    return (
        <>
        
       <div className="w-full py-3 shadow-lg shadow-primary/10">
            <div className="container w-[90%] m-auto flex justify-between items-center">
                    <div className="logo uppercase  font-medium text-[23px] text-background cursor-pointer">
                        <Link href={"/"}>
                                 Bazaarna
                        </Link>
               
                </div>
                <div className="links hidden lg:flex justify-center gap-3 items-center px-1 capitalize text-gray-400 font-medium">
                    <Link href={"/"}     
                     className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary  after:transition-all after:duration-300  hover:after:w-full"
                    >Home</Link>
                    <Link href={"/"}
                                             className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                    
                    >Live Bazaars</Link>
                    <Link href={"/"}
                                             className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                    >Upcoming Bazaars</Link>
        
                    <Link href={"/"}
                    
 className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                    >About Us</Link>
                   
                    <Link href={"/"}
                    className="relative hover:text-primary transition-colors duration-300 after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full"
                    >contact us</Link>
              
                </div>
                <div className="auth hidden md:flex gap-4 capitalize ">
                        <button className="rounded-[8px] border border-primary px-4 py-1 text-primary hover:bg-primary hover:text-white flex items-center capitalize transition-all hover:scale-[.98] duration-500  cursor-pointer">
                            <Link href={"/auth/login"}>
                                   login
                            </Link>
                         
                        </button>
                        <button className="rounded-[8px] px-4 py-1 bg-primary text-white flex items-center capitalize transition-all hover:scale-[.98] duration-500 cursor-pointer" >
                          
                            <Link href={'/auth/signup'}>  sign up</Link>
                        </button>
                </div>
                    
            <button
          onClick={openfun}
              className="md:hidden flex flex-col gap-1.5 p-1"
              aria-label="open menu"
            >
              <span className="w-6 h-0.5 bg-background block" />
              <span className="w-6 h-0.5 bg-background block" />
              <span className="w-6 h-0.5 bg-background block" />
            </button>

            </div>
      

        </div>
        
      <div
              onClick={
                  close
              }
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 md:hidden
          ${open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
      />

   
<div
  className={`fixed top-0 left-0 h-full w-[50%] bg-white shadow-2xl transition-all duration-300 ease-in-out z-50
    ${open ? "translate-x-0" : "-translate-x-full"}`}
>
      
        {/* Header */}
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
                    
                     className="relative hover:text-primary transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:w-0 after:bg-primary
    after:transition-all after:duration-300
    hover:after:w-full"
                    >Home</Link>
                    <Link href={"/"}
                                             className="relative hover:text-primary transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:w-0 after:bg-primary
    after:transition-all after:duration-300
    hover:after:w-full"
                    
                    >Live Bazaars</Link>
                    <Link href={"/"}
                                             className="relative hover:text-primary transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:w-0 after:bg-primary
    after:transition-all after:duration-300
    hover:after:w-full"
                    >Upcoming Bazaars</Link>
        
                    <Link href={"/"}
                    
                                         className="relative hover:text-primary transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:w-0 after:bg-primary
    after:transition-all after:duration-300
    hover:after:w-full"
                    >About Us</Link>
                   
                    <Link href={"/"}
                                             className="relative hover:text-primary transition-colors duration-300
    after:content-[''] after:absolute after:bottom-0 after:left-0
    after:h-[2px] after:w-0 after:bg-primary
    after:transition-all after:duration-300
    hover:after:w-full"
                    >contact us</Link>
              
                    </div>
                        <div className="flex flex-col gap-2 px-6  ">
          <button className="rounded-[8px] px-4 py-2 text-primary border border-primary capitalize w-full">
                            <Link href={"/auth/login"}>
                                  login
                            </Link>
                          
          </button>
                        <button className="rounded-[8px] px-4 py-2 bg-primary text-white capitalize w-full">
                            <Link href={"/auth/signup"}>
                                 sign up
                            </Link>
           
          </button>
        </div>
                    
             </div>
         
  

    
      </div>
                </>
    )
}