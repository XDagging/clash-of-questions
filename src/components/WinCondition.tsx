// This component marks when this will be triggered
// import Crown from "../../public/crown.png"
/* eslint-disable */
import { Link } from "react-router-dom"

type WinConditionProps = {
    // friendlyTower: number;
    hasWon: boolean
    allQuestionsWrong: any[];
    allQuestionsRight: any[];
    studyingTime: number;

    //Studying time is in seconds


}


export default function WinCondition(props: WinConditionProps) {



    

    return (
        <>
        
        <div className="w-screen h-screen bg-black opacity-75 fixed z-20">

        </div>
        

        <div className="absolute top-[50%] rounded-box w-2/6 h-5/6 bg-base-300 z-30 translate-y-[-50%] left-[50%] translate-x-[-50%]">
            <section className=" p-3">
            <div>
                <h1 className={`font-1 text-3xl font-semibold text-center`}>You <span className={`${props.hasWon ? "text-success" : "text-error"}`}>{props.hasWon ? "won" : "lost"}</span></h1>

            </div>

            <div className="flex flex-col mx-auto w-4/6 items-center gap-4">


                <div className="stats">
                    <div className="stat font-1 text-center">
                        {/* <p className="stat-title">Total Wrong</p> */}
                        <p className="stat-value">{props.allQuestionsRight.length}/{props.allQuestionsRight.length + props.allQuestionsWrong.length}</p>
                        <p className="stat-title font-1 text-lg text-error">Total Questions</p>
                    </div>

                </div>


                 <div className="stats">
                    <div className="stat font-1 text-center">
                        {/* <p className="stat-title">Total Wrong</p> */}
                        <p className="stat-value">{
                        Number(100*(props.allQuestionsRight.length/((Number(props.allQuestionsRight.length + props.allQuestionsWrong.length)===0 ? 1 : Number(props.allQuestionsRight.length + props.allQuestionsWrong.length)) ))).toFixed(2)}%</p>
                        <p className="stat-title font-1 text-lg text-error">Accuracy</p>
                    </div>

                </div>

                 <div className="stats">
                    <div className="stat font-1 text-center">
                        {/* <p className="stat-title">Total Wrong</p> */}
                        <p className="stat-value">
                             <span className="font-1 font-mono">
                                {Math.floor(props.studyingTime / 60)}
                                <span>:</span>
                                {String(props.studyingTime % 60).padStart(2, '0')}
                            </span>
                        </p>

                    <p className="stat-title font-1 text-lg text-error">Total Studying Time</p>
                    </div>

                </div>
                

                

                
            

            </div>
            </section>

            <section className="bg-base-100 p-1">
                

                <div className=" gap-2 flex-col mx-auto flex mt-4">
                    <Link to="/review" className="btn btn-primary font-1 btn-lg">Review Concepts</Link>
                    <Link to="/dashboard" className="btn btn-secondary font-1 btn-lg">Play Again</Link>
                </div>
                </section>
               
        </div>
        
        
        
        </>
    )



}