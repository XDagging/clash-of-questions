import { useState, useContext } from "react";
import { Gamepad2, ReceiptText, TrophyIcon, CogIcon} from "lucide-react";
import { Github } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import callApi from "../functions";
import UserContext from "../context";
import Instructions from "../components/Instructions";
/* eslint-disable */

// Game Dashboard
export default function Dashboard() {
    
    const user = useContext(UserContext) !== null ? JSON.parse(useContext(UserContext) as any) : {} as any; 
    console.log("this is the user tab", user)
    const nav = useNavigate();
    const x = "/logo.png"; 

    // const [loading, setLoading] = useState(false);
    const [openInstructions, setOpenInstructions] = useState(false);
    const findOpenLobby = () => {
     

  callApi("/findLobby", "GET")
    .then((res) => {
      console.log("Response from findLobby:", res);

      if (res.code === "ok" && res.message) {
        // Navigate directly with the ID from the API response.
        // No need to set local state before navigating away.
        const gameId = res.message;
        nav(`/game?gameId=${encodeURIComponent(gameId.substring(1,gameId.length-1))}`);
      } else {
        // Handle cases where the API returns a success code but no message,
        // or a different code.
        nav("/login");
      }
    })
    .catch((error) => {
      // Handle failed API calls (e.g., network error)
      console.error("Failed to find a lobby:", error);
      nav("/error"); // Or redirect to an error page/login
    })
    .finally(() => {
      // This will run whether the promise is resolved or rejected

    });
};


    const openInstr = () => {
      setOpenInstructions((prev) => !prev);


    }


    return (
        <>

        {(openInstructions) && (

          <Instructions closeInstructions={openInstr} />

        )}
        
         <section className="w-full h-screen bg-[url('/grid.apng')] bg-cover aspect-auto">
         <div className="hero h-[90vh] w-full">
          <div className="hero-content flex flex-col gap-4 items-center">

            <img src={x} className="h-40 mx-auto" alt="DDD gif" />
            <h1 className="text-8xl font-2 mx-auto"><span className="text-primary">C</span>O<span className="text-primary">Q</span></h1>
            <p className="font-2 font-bold flex flex-row items-center justify-center gap-1"><TrophyIcon className="size-4" />{user?.trophies}</p>
            <a href="https://github.com/XDagging/clash-of-questions" className="font-2 flex flex-row items-center gap-2">We're open source on <Github /></a>
            <div className="mt-10 flex flex-col w-full gap-2">
              <button onClick={findOpenLobby} className="btn animate-bounce btn-primary font-2 text-lg scale-150 my-3">Join a Lobby <Gamepad2 /></button>
              
               <Link to="/review" className="btn btn-secondary btn-outline font-2 text-lg scale-150 my-3" onClick={() => {
                
              }}>Review Study Tools <Gamepad2 /></Link>
              <button 
                onClick={openInstr}
                className="btn btn-outline font-2 text-lg scale-150 my-3"

              >Instructions<ReceiptText /></button>

              <Link to="/settings" className="btn btn-outline font-2 text-lg scale-150 my-3">
                Settings <CogIcon />
              </Link>
              
              <Link
                to="/credits"
                className="btn btn-outline font-2 text-lg scale-150 my-3"
              >See credits</Link>
            </div>
          </div>
        </div>
        </section>
        
        
        </>

    )
}