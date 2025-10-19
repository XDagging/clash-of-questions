import { useState, useEffect } from "react"
// import type { Dispatch, SetStateAction } from "react"

type Question = {
    question: string;
    optionA?: string;
    optionB?: string;
    optionC?: string;
    optionD?: string;
    answer?: string;
    studentInput?: string;
    isMcq: boolean;
}


type MultipleProps = {
    question: Question
    setAnswerSaved: any;
}


export default function MultipleChoice(props: MultipleProps) {
    const [timer, setTimer] = useState(0); // elapsed seconds
    const [blink, setBlink] = useState(true);
    const [optionClicked, setOptionClicked] = useState<string>("");
    const [currQuestion, setCurrQuestion] = useState(props.question)



    // Reset current question when prop changes
    



    // Start timers on mount: one for elapsed seconds, one for blinking
    useEffect(() => {
        const tickId = window.setInterval(() => {
            setTimer((t) => t + 1);
        }, 1000);

        const blinkId = window.setInterval(() => {
            setBlink((b) => !b);
        }, 500);

        return () => {
            clearInterval(tickId);
            clearInterval(blinkId);
        };
    }, []);

    useEffect(() => {
        setCurrQuestion(props.question)

    }, [props.question])


    const submitAnswer = () => {
        props.setAnswerSaved(optionClicked);
        setOptionClicked("")


    }

    
   

    return (
        <>


            <section className="">
                <div className="grid grid-cols-1 w-full mx-auto items-center justify-items-start h-full">
                    <div className="mx-auto text-center mb-2 font-1">
                        {/* Display minutes:seconds with blinking colon */}
                        <p>
                            Time Elapsed:{' '}
                            <span className="font-1 font-mono">
                                {Math.floor(timer / 60)}
                                <span style={{ opacity: blink ? 1 : 0, transition: 'opacity 0.1s' }}>:</span>
                                {String(timer % 60).padStart(2, '0')}
                            </span>
                        </p>

                    </div>
                    <div className="w-full flex flex-col gap-4 md:min-h-0 min-h-screen">
                        <div className="flex flex-row bg-base-300 items-center font-1 gap-4 w-full">
                            <p className="p-2 bg-neutral text-neutral-content font-1 font-bold">99</p>
                            <p>Multiple Choice Question</p>
                        </div>


                        <div>
                            <p className="font-1 font-semibold">{currQuestion.question}</p>
                        </div>

                        {currQuestion.isMcq ? <>
                           <div onClick={() => setOptionClicked("a")} className={`border ${optionClicked==="a" ? "border-info border-2" : ""} hover:bg-base-300 cursor-pointer p-4 rounded-box flex flex-row gap-4 select-none items-center`}>
                            <p className={`w-6 h-6  ${optionClicked==="a" ? "bg-info" : ""}   rounded-full font-1 border border-neutral text-base-content text-center`}>A</p>
                            
                            <p className="font-1">{currQuestion.optionA}</p>

                        </div>

                        <div onClick={() => setOptionClicked("b")} className={`border ${optionClicked==="b" ? "border-info border-2" : ""} hover:bg-base-300 cursor-pointer p-4 rounded-box flex flex-row gap-4 select-none items-center`}>
                            <p className={`w-6 h-6  ${optionClicked==="b" ? "bg-info" : ""}   rounded-full font-1 border border-neutral text-base-content text-center`}>B</p>
                            
                            <p className="font-1">{currQuestion.optionB}</p>

                        </div>


 <div onClick={() => setOptionClicked("c")} className={`border ${optionClicked==="c" ? "border-info border-2" : ""} hover:bg-base-300 cursor-pointer p-4 rounded-box flex flex-row gap-4 select-none items-center`}>
                            <p className={`w-6 h-6  ${optionClicked==="c" ? "bg-info" : ""}   rounded-full font-1 border border-neutral text-base-content text-center`}>C</p>
                            
                            <p className="font-1">{currQuestion.optionC}</p>

                        </div>

 <div onClick={() => setOptionClicked("d")} className={`border ${optionClicked==="d" ? "border-info border-2" : ""} hover:bg-base-300 cursor-pointer p-4 rounded-box flex flex-row gap-4 select-none items-center`}>
                            <p className={`w-6 h-6  ${optionClicked==="d" ? "bg-info" : ""}   rounded-full font-1 border border-neutral text-base-content text-center`}>D</p>
                        
                            <p className="font-1">{currQuestion.optionD}</p>

                        </div>

                        
                        </> : <>
                            <input className="input" placeholder="" value={optionClicked} onChange={(e) => {
                                setOptionClicked(e.target.value)
                            }} />
                        
                        
                        </>}
                     




                    </div>

                    <button className="btn font-1 btn-lg btn-primary mt-2 w-full" onClick={submitAnswer}>
                        Go! Go! Go!
                    </button>






                </div>


            </section>





        
        </>
    )



}