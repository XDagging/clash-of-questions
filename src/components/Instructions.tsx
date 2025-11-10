/* eslint-disable */
import Coconut from "../../public/coconut.png"


interface InstructionsProps {
    closeInstructions: any;
}

export default function Instructions(props: InstructionsProps) {




    return (
        <>
        
        <div className="font-1 fixed top-0 left-0 w-screen h-screen opacity-85 z-20 bg-base-300"></div>

        <div className="absolute z-30 font-1 top-[50%] translate-y-[-50%]  left-[50%] translate-x-[-50%]">
             {/* <Ad /> */}
            <div className="flex flex-col text-center h-full gap-2 justify-center items-center">
                <h1 className="font-bold text-2xl">This is literally Clash Royale but with SAT questions</h1>
                <div className="flex flex-row items-center justify-center">
                    <p className="font-semibold">You pay for your troops using </p>
                    <img src={Coconut} className="" />

                </div>
               
                <h3 className="text-lg">Question Right = <span className="text-success font-bold text-2xl">+0.1</span> Coconut Multiplier</h3>

                <h3 className="text-lg">Question Wrong = <span className="text-error font-bold text-2xl">-0.4</span> Coconut Multiplier</h3>


                <h4>The game continues until one person <span className="text-error">loses all </span>their coconuts</h4>

                    
                <div className="mt-32" onClick={props.closeInstructions}>
                    <button className="btn btn-lg btn-primary">Go back</button>
                </div>
                
               
            </div>
          
        </div>
        
        
        
        </>
    )



}