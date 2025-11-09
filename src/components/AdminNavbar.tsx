import {useContext, useEffect, useState} from "react";
// import { FaGoogle } from "react-icons/fa";
import { BoltIcon, Cog6ToothIcon, ArchiveBoxIcon, LifebuoyIcon, ChevronRightIcon, CogIcon, CloudIcon, ArrowRightStartOnRectangleIcon, Square3Stack3DIcon, LockClosedIcon } from "@heroicons/react/24/solid";
// import type { User } from "../types";
import { Link, useNavigate } from "react-router-dom";
import callApi from "../functions";
import { PiDotsThreeOutlineFill } from "react-icons/pi";
import UserContext from "../context";
// import { sign } from "crypto";
// import logo from "../assets/logo.png"

export default function AdminNavbar() {
    const [navOpen, setNavOpen] = useState<boolean>(true)
    const [viewport, setViewport] = useState<boolean>(window.innerWidth>640 ? true : false);
    const navigation = useNavigate()
    let user = null;
    if (useContext(UserContext)) {
        user = useContext(UserContext)
    } else {
        navigation("/login")
    }
    useEffect(() => {
        setViewport(window.innerWidth>640 ? true : false)
        console.log("viewport", window.innerWidth>640 ? true : false)
        if (viewport) {
            setNavOpen(true)
        } else {
            setNavOpen(false);
        }
        
    },[])
   




    const signOut = () => {
        console.log("clicked signout")
        callApi("/logout", "GET").then((res) => {
            if (res.code === "err") {
                // idfk
            } else if (res.code === "ok") {
                navigation("/login")
            } else {
                navigation("/login")
            }
        })
    }


    // const [user, setUser] = useState<User>({
    //     name: "Sebastian Hernandezadsfasdf",
    //     imgUrl: imgOne,
    //     email: "maracuchoamericano@gmail.com",
    //     timesTaken: 4,
    //     allTests: [],
    //     uuid: ""
    // })






    return (
        <>
        
        <div className="md:hidden fixed btn btn-ghost z-50 bottom-2 left-2" onClick={() => setNavOpen((prev) => !prev)}>
            <PiDotsThreeOutlineFill className="size-6" />
        </div>
        

        {(navOpen) && (
        <div className={`${viewport ? "w-1/6 " : "w-full fixed top-0 left-0 z-40"} flex font-1 bg-base-200 p-2 h-full flex-col gap-2 sticky top-0 left-0 min-h-screen border-r shadow-md border-secondary`}>

            <div className="flex flex-row items-center gap-4 p-3 hover:bg-base-100 select-none cursor-pointer rounded-box">
                {/* <img src={logo} className="size-5 object-cover" /> */}
                {/* <FaGoogle /> */}
                <p className="font-bold text-lg">clashOfQuestions</p>
            </div>



            <div className="flex flex-col gap-1 mt-4 flex-grow">

                
                <Link to="/dashboard" className="flex flex-row items-center gap-2 p-3 hover:bg-base-100 select-none cursor-pointer rounded-box">
                    <BoltIcon className="size-4" />
                    <p className="font-semibold">Play Now</p>
                </Link>


                {/* <div className="flex flex-row items-center gap-2 p-3 hover:bg-base-100 select-none cursor-not-allowed rounded-box">
                    <LifebuoyIcon className="size-4" />
                    <p className="font-semibold">Practice</p>
                    <div className="badge badge-primary">
                        <p className="text-xs">Soon</p>

                    </div>
                </div> */}

                <Link to="/dashboard" className="flex flex-row items-center gap-2 p-3 hover:bg-base-100 select-none cursor-pointer rounded-box">
                    <Square3Stack3DIcon className="size-4" />
                    <p className="font-semibold">Dashboard</p>
                    
                </Link>


                  <Link to="/scores" className="flex flex-row items-center gap-2 p-3 hover:bg-base-100 select-none cursor-pointer rounded-box">
                    <ArchiveBoxIcon className="size-4" />
                    <p className="font-semibold">Previous Scores</p>
                </Link>
            
            
                <Link to="/settings" className="flex flex-row items-center gap-2 p-3 hover:bg-base-100 select-none cursor-pointer rounded-box">
                    <Cog6ToothIcon className="size-4" />
                    <p className="font-semibold">Settings</p>
                </Link>


             
            
            
            </div>
               <div className="dropdown dropdown-top">
                    <div tabIndex={0} role="button" className="w-full h-full flex  flex-row items-center p-3 rounded-box border-2 border-base-300 gap-2 hover:bg-base-300 select-none">
                    <img src={user?.imgUrl} className="w-8 h-8 rounded-full">
                    </img>
                    <div className="flex flex-col gap-1">
                        <p className="text-sm font-1">{user?.name.substring(0,15)}{user&&user?.name.length>20 ? "..." : ""}</p>
                        <p className="font-1 text-xs">{user?.email.substring(0,15)}{user&&user.email.length>20 ? "..." : ""}</p>
                    </div>

                    <div className="ml-auto">
                        <ChevronRightIcon  className="size-4" />
                    </div>
                    </div>

                    <div className="dropdown-content">
                    <ul className="menu bg-base-100 rounded-box w-50 z-20 shadow-lg">
  <li className=""><Link to="/settings"><CogIcon className="size-5"/>Settings</Link></li>
    <li className="" onClick={() => signOut()}>
        <Link to={""}>
            <ArrowRightStartOnRectangleIcon className="size-5"/>
            <p className="text-error">Sign out</p>
        </Link>
    </li>
    <li className=""><Link to="/terms"><CloudIcon className="size-5"/>Terms of Service</Link></li>
    <li className=""><Link to="/privacy"><LockClosedIcon className="size-5"/>Privacy Policy</Link></li>
</ul>
                    </div>
                    
                 
                </div>
         



        </div>
        
        
        )}
      
        </>
    )



}