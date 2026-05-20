"use client"

import axios from "axios";
import Link from "next/link";
import {  useState } from "react";

export default function Signup() {
    const [form, setform] = useState({
        email: "",
        password:""
    })

    const [loading, setloading] = useState(false)
    const [error,seterror]=useState({})
   function handlechange(e) {
    setform({    ...form,
        [e.target.name]: e.target.value
    })
    }
    
  async function handleSubmit(e) {

    e.preventDefault();

    const errors = {};

    if ( !form.password || !form.email) {
        errors.fields = "All fields are required";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(form.email)) {
        errors.email = "Invalid email address";
    }
     seterror(errors)
     
     if (Object.keys(errors).length > 0) {
         return;
      }
  
      try {
                setloading(true)
       
    let res = await axios.post(
  "https://iti-graduration-projrct.vercel.app/api/v1/auth/login",
  form,
  {
    headers: {
      "Content-Type": "application/json",
    },
  }
);
           setloading(false)
      
     }
catch (error) {
           setloading(false)

    seterror({
        server:
            error.response?.data?.msg?.data ||
            "oops something went wrong"
    });
}
   
    }
     console.log("state",error);
  return (
   <section className="min-h-screen w-full bg-stone-50 flex items-start md:items-center justify-center p-8">
      <div className="bg-white rounded-2xl border border-stone-200 p-10 w-full max-w-md">

     <div className="text-center mb-8">
  <h2 className="text-2xl font-medium mb-1">Welcome Back</h2>
  <p className="text-sm text-stone-400">
    Login to continue to your account.
  </p>
</div>

        <div className="flex flex-col gap-5">

          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Email Address
            </label>
                      <input
                          onChange={handlechange}
                          type="email"
                          value={form.email}
                          name="email"
              placeholder="elias@atelier.com"
                        className={`w-full border-0 border-b ${
  error.email ? "border-red-500" : "border-stone-300"
} p-2 rouned-sm bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />
        
          </div>
    {error.email && (
                      <p className="text-red-500 text-xs">{ error.email}</p>
                  )}
          <div>
            <label className="block text-xs font-medium uppercase tracking-widest text-stone-400 mb-2">
              Password
            </label>
                      <input 
                            onChange={handlechange}
                          type="password"
                          value={form.password}
                          name="password"
              placeholder="••••••••"
            className={`w-full border-0 border-b ${
  error.password ? "border-red-500" : "border-stone-300"
} p-2 rouned-sm  bg-transparent text-sm focus:outline-none focus:border-stone-600`}
            />
                  </div>
                      {error.password && (
                      <p className="text-red-500 text-xs">{ error.password}</p>
                  )}
                         {error.server && (
                      <p className="text-red-500 text-xs">{ error.server}</p>
                  )}
                  

                  <button
                      onClick={handleSubmit}
                      className="w-full mt-2 py-3 bg-primary text-white text-xs font-medium uppercase tracking-widest rounded-lg hover:bg-stone-700 hover:scale-[0.98] transition-all duration-500 cursor-pointer flex justify-center ">
       {loading ? <div className="w-4 h-4 border-2 border-gray-300 border-t-white rounded-full animate-spin"></div>:"Create Account"}     
          </button>

          <div className="text-center">
            <p className="text-xs text-stone-400 mb-3">Or continue with</p>
                      <button
                          className="w-full py-2.5 border border-stone-200 rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-stone-50 hover:scale-[.98] transition-all cursor-pointer">
          
              Continue with Google
            </button>
          </div>

          <p className="text-center text-sm text-stone-500">
             Don't have an account?{" "}
            < Link href="/auth/signup" className="text-stone-800 font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}