import { useState, useEffect} from "react"
import callApi, { isEmail, isPassword, } from "../functions"

import { FaGoogle } from "react-icons/fa"
import Notif from "../components/Notif"
import { useNavigate, Link } from "react-router-dom"
import Navbar from "../components/Navbar"
import Footer from "../components/Footer"

import type { NotifType, Timeout } from "../types"
import { Helmet } from "react-helmet"
type LoginUser = {
    email: string;
    password: string;

}

let timeout: Timeout;
export default function Login() {
    const nav = useNavigate();
    const url = window.location.href.includes("localhost") ? "https://localhost:443" : "https://api.clashofquestions.com";
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<LoginUser>({
        email: "",
        password: ""
    })

    const [notif, setNotif] = useState<NotifType>({
        type: "",
        message: ""
    })

    useEffect(() => {
        console.log("this was called", notif);
   
        timeout = setTimeout(() => {
            setNotif({ type: "", message: "" });
        }, 5000);
   
        return () => {
            clearTimeout(timeout);
        };

     }, [notif]);
   

    const doSubmit = () => {    
        console.log("check")
        try {
            if (!isEmail(user.email)) {
                setNotif({
                    type: "err",
                    message: "Invalid Email"
                })

            } else if (!isPassword(user.password || "")) {
                setNotif({
                    type: "err",
                    message: "Invalid Password"
                })
            }
            
            else {
                setLoading(true);
                callApi("/login", "POST", user).then((res) => {
                    console.log("this was the response from the request", res)
                    if (res.code === "err") {
                        console.log("something went wrong");
                        setNotif({
                            type: "err",
                            message: "Invalid Message"
                        })
                    }  else if (res.code === "ok") {
                        
                        setNotif({
                            type: "success",
                            message: "Successfully created your account."
                        })
                        nav("/dashboard");
                    } else {
                        console.log("something went wrong", res);
                        setNotif({
                            type: "err",
                            message: "Invalid Message"
                        })
                    }
                    setLoading(false);
                    
                    
                })
            }
        } catch(e) {
            console.log(e);
            setNotif({
                type: "err",
                message: "Invalid Error"
            })
        }
    }



    return (
        <>

        
<Helmet>
            <meta charSet="utf-8" />
            <title>Login - Clash Of Questions</title>
            <meta name="keywords" content="sat, clash royale, sat, satprep" />
            <meta
      name="description"
      content="Play Clash of Questions now!"
    />
        </Helmet>
        <Notif type={notif.type} message={notif.message} />
        

        <div className="md:hero min-h-screen w-screen">

            <div className="hero-content font-1 md:w-4/6 bg-black md:h-5/6 h-full rounded-box border border-primary">
                <div className="md:w-4/6 mx-auto text-center flex flex-col gap-2">
                
                    <h1 className="text-5xl font-bold">
                        start clashing! 
                    </h1>
                    <p>join hundreds improving their SAT game while becoming the best</p>

                    <div className="divider"></div>
                    <div>
                        <a href={url + "/auth/google"} className="btn btn-lg btn-secondary ">
                            <FaGoogle />
                            <p>Continue with Google</p>
                        </a>

                    </div>


                    <div className="justify-self-end mt-4">
                        <Link to="/" className="btn btn-ghost btn-xs">Go back to home</Link>
                    </div>
                 
                  
                </div>
                
            </div>
       
            
   
        </div>

        <Footer />
     
        

        
        
        
        </>
    )

}