import { useState, useEffect } from "react"
// import type { Dispatch, SetStateAction } from "react"
import type { Question } from "../types"
import { FaSpinner } from "react-icons/fa";

type MultipleProps = {
    question: Question
    setAnswerSaved: any;
    clock: any;
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
            setTimer((t) => {
                props.clock.current = t + 1;
                return t + 1;
            });
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

    const convertNumToChar = (num: number) => {
        if (num === 0) return "a";
        if (num === 1) return "b";
        if (num === 2) return "c";
        if (num === 3) return "d";
        return "";


    }

    
   

    return (
        <>


            <section>
                <div className="grid grid-cols-1 w-full mx-auto items-center justify-items-start h-full">
                    <div className="mx-auto text-center mb-2 font-1">
                     
                     
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
                        

                        {currQuestion ? <>
                        <div>
                            <p className="font-1">{currQuestion.stimulus}</p>
                            <p className="font-1 font-semibold">{currQuestion.stem}</p>
                        </div>

                        {currQuestion.isMcq ? <>
                            {currQuestion.answerChoices.map((val, i) => (

                            <div key={i} onClick={() => setOptionClicked(convertNumToChar(i))} className={`border ${optionClicked===convertNumToChar(i) ? "border-info border-2" : ""} hover:bg-base-300 cursor-pointer p-4 rounded-box flex flex-row gap-4 select-none items-center`}>
                                <p className={`w-6 h-6  ${optionClicked===convertNumToChar(i) ? "bg-info" : ""}   rounded-full font-1 border border-neutral text-base-content text-center`}>{convertNumToChar(i).toUpperCase()}</p>
                                <p className="font-1">{val}</p>
                            </div>




                            ))}
                          
                        
                        </> : <>
                            <input className="input" placeholder="" value={optionClicked} onChange={(e) => {
                                setOptionClicked(e.target.value)
                            }} />
                        
                        
                        </>}
                     




                

                    <button className="btn font-1 btn-lg btn-primary mt-2 w-full" onClick={submitAnswer}>
                        Go! Go! Go!
                    </button>
                        
                        </> : <>

                        <div className="h-[30vh] bg-base-300 flex flex-row items-center justify-center relative w-full">
                            <div className="text-center mx-auto font-1">
                                <FaSpinner className="size-12 animate-spin mx-auto" />
                                <p className="mt-2">Loading the next question...</p>
                            </div>
                            

                        </div>
                    
                        
                        </>}

                        





                    </div>
                </div>


            </section>





        
        </>
    )



}