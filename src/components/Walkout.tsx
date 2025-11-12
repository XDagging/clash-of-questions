import { useState, useEffect } from 'react';
import { TrophyIcon } from 'lucide-react';
import Crown from "../../public/crown.png"
import Coconut from "../../public/coconut.png"
// You will need to pass the player and opponent names as props

type PlayerStats = {
    name: string;
    trophies: number;

}

interface WalkoutProps {
    opponentOne: PlayerStats,
    opponentTwo: PlayerStats
}

export default function Walkout(props: WalkoutProps) {
    // These states trigger the animations in sequence
    const [showPlayer, setShowPlayer] = useState(false);
    const [showVS, setShowVS] = useState(false);
    const [showOpponent, setShowOpponent] = useState(false);

    // This state controls the entire component, so it can remove itself
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        // --- Animation Sequence ---
        // 1. Show Player
        const timer1 = setTimeout(() => setShowPlayer(true), 100); // 0.1s delay
        // 2. Show VS
        const timer2 = setTimeout(() => setShowVS(true), 400); // 0.4s delay
        // 3. Show Opponent
        const timer3 = setTimeout(() => setShowOpponent(true), 700); // 0.7s delay

        // --- Component Hider ---
        // After 3 seconds, remove the entire overlay
        const hideTimer = setTimeout(() => setIsVisible(false), 4000);

        // Cleanup timers on component unmount
        return () => {
            clearTimeout(timer1);
            clearTimeout(timer2);
            clearTimeout(timer3);
            clearTimeout(hideTimer);
        };
    }, []); // Empty dependency array ensures this runs only once when mounted

    // --- Font Styling ---
    // This mimics the "Clash" font. 
    // IMPORTANT: Make sure you import 'Luckiest Guy' in your main index.html or CSS
    // <link href="https://fonts.googleapis.com/css2?family=Luckiest+Guy&display=swap" rel="stylesheet">
    // const gameFont = { fontFamily: "'Luckiest Guy', cursive" };

    // If not visible, render nothing.
    if (!isVisible) {
        return null;
    }

    return (
        // Main Container: 
        // - `position: fixed` breaks it out of the grid to cover the whole screen.
        // - `inset-0` is shortcut for top-0, left-0, right-0, bottom-0.
        // - `z-50` ensures it's on top of all other elements.
        // - `overflow-hidden` is critical to hide the banners before they slide in.
        <>
        <div className="z-40 fixed h-screen w-screen bg-base-100 opacity-75"></div>

        <div 
            className="fixed inset-0 z-50 overflow-hidden font-2"
        >
            {/* --- Opponent (Top) --- */}
            <div className={`
                absolute w-5/6 top-[15%]  rounded-box bg-base-300 py-2 text-center shadow-lg
                border-t-4 border-green-300 border-4
                transition-transform duration-500 ease-out
                ${showOpponent ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="text-4xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
                    <div className='flex justify-between gap-2 w-full p-10 flex-row items-center'>
                        <div className="flex flex-row items-center gap-2">
                            <img className='w-10 h-10' src={Crown} />
                            <div className='block text-left'>
                                <p className=''>{props.opponentOne.name}</p>
                                <p className='italic text-base'>A demon under the Desmos Keyboard</p>
                            </div>

                        </div>
                  
                        <div className='text-yellow-500 flex flex-row items-center'>
                 
                        
                        <TrophyIcon />
                        <p className=''>{props.opponentOne.trophies}</p>
                        </div>


                    </div>
                    
                    
                </div>
            </div>

            {/* --- VS Shield (Middle) --- */}
            <div className={`
                absolute top-1/2 left-1/2
                bg-[#1e488f] px-8 py-4 rounded-lg border-4 border-yellow-400
                shadow-[0_0_15px_#ffd700]
                transition-transform duration-500 ease-out
                ${showVS ? 'translate-x-[-50%] translate-y-[-50%]' : 'translate-x-[100vw] translate-y-[-50%]'}
            `}>
                <div className="text-8xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
                    VS
                </div>
            </div>

            {/* --- Player (Bottom) --- */}
            <div className={`
                absolute bottom-[15%] w-4/6 self-end justify-self-end bg-base-300 py-2 text-center shadow-lg
                border-t-4 border-primary border-4 rounded-box 
                transition-transform duration-500 ease-out
                ${showPlayer ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="text-4xl text-white drop-shadow-[3px_3px_0px_rgba(0,0,0,0.25)]">
                       <div className='flex justify-between gap-2 w-full p-10 flex-row items-center'>

                        <div className="flex flex-row items-center gap-2">
                            <img className='w-20 h-20 object-cover' src={Coconut} />
                            <div className='block text-left'>
                                <p className=''>{props.opponentTwo.name}</p>
                                <p className='italic text-base'>The unhittable SAT demon</p>
                            </div>
                            
                            

                        </div>
                        
                        <div className='text-yellow-500 flex flex-row items-center'>

                        
                        <TrophyIcon />
                        <p className=''>{props.opponentTwo.trophies}</p>
                        </div>


                    </div>
                </div>
            </div>
        </div>
        </>
    );
}