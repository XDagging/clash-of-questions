import {useState, useEffect} from "react";
import type { Question } from "../types";
/* eslint-disable */

export default function ReviewQuestion() {
    
    const [currQuestion] = useState<Question | null>({
        isMcq: true,
        stem: "People",
        questionId: "123",
        type: "mcq",
        answerChoices: ["Option A", "Option B", "Option C", "Option D"],
        stimulus: "This is why",
    });
    

    useEffect(() => {





    },[]);
    




    return (
        <>

        
            {(currQuestion) && (
                <div className="w-full flex flex-col gap-4 md:min-h-0 min-h-screen">
                    <div className="flex flex-row bg-base-300 items-center font-1 gap-4 w-full">
                        <p className="p-2 bg-neutral text-neutral-content font-1 font-bold">{currQuestion.questionId}</p>
                        <p>Multiple Choice Question</p>
                    </div>

                        <div>
                            <p className="font-1">{currQuestion.stimulus}</p>
                            <p className="font-1 font-semibold">{currQuestion.stem}</p>
   
                        </div>

                        {currQuestion.answerChoices.map((option, i) => (
                            <div key={i} className={`border hover:bg-base-300 cursor-pointer p-4 rounded-box flex flex-row gap-4 select-none items-center`}>
                                <p className={`w-6 h-6 rounded-full font-1 border border-neutral text-base-content text-center`}>{i===0 ? "A" : i===1 ? "B" : i===2 ? "C" : i===3 ? "D" : ""}</p>
                                <p className="font-1">{option}</p>
                            </div>
                        ))}



                    




                    </div>

            )}

             
        
        </>
    )
}