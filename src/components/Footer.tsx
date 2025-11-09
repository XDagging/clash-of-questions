import { FaInstagram, FaEnvelope } from "react-icons/fa";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";



export default function Footer() {





    return (
        <>

            
            <div className="footer sm:footer-horizontal footer-vertical  p-10">
                <nav>
                    {/* <p className="">Clash of Questions</p> */}
                    <img src={logo} className="size-8 object-cover"/>
                    <p className="font-1 text-lg"><span className="font-bold">Clash of Questions</span>,<br/> Clash Royale for the SAT</p>
                
                    <div className="flex flex-row gap-1">
                    
                    <a href="https://www.instagram.com/heyimseba/?hl=en" className="btn btn-circle btn-ghost"><FaInstagram/></a>
                    {/* <a href="#" className="btn btn-circle btn-ghost"><FaTiktok/></a> */}
                    <a href="mailto:xdagging@gmail.com" className="btn btn-circle btn-ghost"><FaEnvelope/></a>

                
            </div>
                </nav>
                


        
            </div>

            <footer className="footer bg-neutral footer-center text-neutral-content border-t p-2">
  <aside>
    <p className="font-1"><a href="https://plastuchino.xyz/">Made with ❤️ as a Hernandez Production</a></p>
  </aside>
</footer>
        
        </>
    )
}