import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png"

export default function Navbar() {

    return (<>
      <nav className="navbar p-4">
                <div className="navbar-start">
                    <div className="flex flex-row items-center gap-2">
                              <img src={logo} className="size-8" />
                    <Link to="/" className="font-2 font-bold text-2xl">Clash Of Questions</Link>


                    </div>
                              </div>
                <div className="navbar-center">
                    <div className="menu lg:flex hidden font-semibold font-1 menu-horizontal gap-5  "> 
                        <Link to="/" className="btn-ghost btn">Home</Link>
                        {/* <Link to="/mission" className=" btn btn-ghost">Why does this exist?</Link> */}
                        <a href="https://github.com/XDagging/clash-of-questions" className="btn-ghost btn">Want to help out?</a>
                    </div>
                    
                </div>
                <div className="navbar-end lg:inline-flex hidden">
                    <div className="menu menu-horizontal font-1 gap-2">
                    {/* <Link to="/login" className="btn btn-ghost">Login</Link> */}
                    <Link to="/login" className="btn btn-primary">Play Now<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
  <path fillRule="evenodd" d="M14.615 1.595a.75.75 0 0 1 .359.852L12.982 9.75h7.268a.75.75 0 0 1 .548 1.262l-10.5 11.25a.75.75 0 0 1-1.272-.71l1.992-7.302H3.75a.75.75 0 0 1-.548-1.262l10.5-11.25a.75.75 0 0 1 .913-.143Z" clipRule="evenodd" />
</svg>
</Link>
                    </div>
                    

                </div>
                
            </nav>
    
    
    
    </>)
}