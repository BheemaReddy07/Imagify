import React, { useContext, useEffect, useState } from "react";
import { assets } from "../assets/assets";
import { AppContext } from "../Context/AppContext";
import { Link, useNavigate } from "react-router-dom";
import {toast} from 'react-toastify'
const Navbar = () => { 
  const {token,setToken,setShowLogin,credits} = useContext(AppContext)
  const navigate = useNavigate();

  const logout = () =>{
    if(token){
      toast.success("Logout Successfully")
      setToken('')
      localStorage.removeItem('token')
    }
  }

 




  return (
    <div className="flex items-center  justify-between py-4">
      <Link to={"/"}>
        <img className="w-28 sm:w-32 lg:w-40" src={assets.logo} />
      </Link>

      <div>
        {token ? (
          <div className="flex items-center justify-between gap-6">
            <button onClick={() => navigate("/buy")} className="flex items-center justify-between gap-2 bg-blue-100 rounded-full px-7 sm:px-6 py-2 hover:scale-105 transition-all duration-700 ">
              <img className="w-5" src={assets.credit_star} />
              <p className="text-xs sm:text-sm font-medium text-gray-600">Credits left:{credits}</p>
            </button>
            <div className="relative group">
              <img className="w-10 drop-shadow" src={assets.profile_icon} />
              <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-12">
                <ul className="list-none m-0 p-2 bg-white rounded-md text-sm">
                    <li onClick={logout} className="py-1 px-2 cursor-pointer pr-10">Logout</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex items-center justify-between gap-2 sm:gap-5">
            <p
              onClick={() => navigate("/buy")}
              className="text-sm text-white cursor-pointer border bg-blue-400 rounded-full px-6 py-2 text-semibold"
            >
              Pricing
            </p>
            <button onClick={()=>setShowLogin(true)} className="bg-zinc-800 text-white rounded-full px-7 sm:px-12 text-sm py-2">
              Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
