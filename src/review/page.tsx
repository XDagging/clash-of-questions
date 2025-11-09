import {useEffect, useState} from "react";
// import ReviewQuestion from "../components/ReviewQuestion";
// import AdminNavbar from "../components/AdminNavbar";
import { Link, useNavigate } from "react-router-dom";
import callApi from "../functions";
// interface ReviewProps {
//     wrongList: string[];
// }


export default function Review(props: any) {
    const nav = useNavigate();

    // After questions, we put a number.
    const url = "https://www.mysatprep.fun/question/";
    const [questions, setQuestions] = useState<string[]>([]);
    // const [rightQuestions, setRightQuestions] = useState<string[]>([]);

    useEffect(() => {
        // lets do an API request here
        // const fakeApiCall = ["1093", "19309", "1293"];

        function x() {
            callApi("/getUser", "GET").then((res: any) => {
                if (res.code === "err") {
                    nav("/login");
                } else {
                    setQuestions(JSON.parse(res.message).wrongQuestionList);
                    console.log("this is a the user", JSON.parse(res.message));
                    



                }
            })

        }  
        x();
        
        // setQuestions(fakeApiCall);
    }, [])

    const dismissQuestion = (i: number) => {
        const question = questions[i];
        

        callApi("/dismissQuestion", "POST", {
            questionId: question
        }).then((res: any) => {
            if (res.code === "err") {
                nav("/login")
            } else {
                setQuestions((prev) => prev.filter((_, k) => i!==k))
            }
        })
        // Do an API call.
      

    }
    


    return (
        <>
        <div className="flex justify-center items-center min-h-screen bg-[#1a1a1a] bg-[url('/grid.apng')] bg-cover font-1 text-white text-center">
            <section className="md:flex md:flex-col w-full">
                <Link to={"/dashboard"} className="text-sm link">Go back to the fun part</Link>
                <p className="font-2 text-4xl mb-4">Listen up, you got these questions <span className="text-error">wrong.</span></p>


                <div className="bg-base-100 mx-auto w-3/6">
                    <div className="font-1 text-left p-4 italic text-sm">
                        <p>Note: I didn't want to fully build a question reviewer (when stuff like that already exists). Therefore, you will get taken to <a href="https://oneprep.xyz" className="underline">oneprep.xyz</a> which is a site that I don't own. There, you can track and log all the stuff you can't really do here.</p>
                        {/* <p className="font-2 text-5xl">asdfg</p> */}


                    </div>

                </div>
            
                <div className="bg-base-100 mt-2 mx-auto w-3/6">
                
                    <p className="my-3">Questions you got wrong (click to open)</p>

                    <div className="flex flex-row gap-2 pb-3 flex-wrap items-center justify-center">
                                            {questions && Array.isArray(questions) && questions.length !== 0 ? (
                                                <>
                                                    {questions.map((question, i) => (
                                                        <div key={i} className="p-5 bg-base-300 hover:bg-neutral select-none cursor-pointer">
                                                            <button onClick={() => window.open(url + question)} className="link">{question}</button>
                                                            <p onClick={() => dismissQuestion(i)} className="text-xs mt-4 text-error">Dismiss</p>
                                                        </div>
                                                    ))}
                                                </>
                                            ) : (
                                                <>
                                                <div className="p-10 font-1 bg-base-300">
                                                    <p>Get a question wrong and come back here!</p>
                                                </div>
                                                    
                                                </>
                                            )}
                        
                    </div>
                   
                    {/* <ReviewQuestion /> */}
                </div>

             

            
        
           


            </section>
        </div>
        
        
        
        </>
    )



}