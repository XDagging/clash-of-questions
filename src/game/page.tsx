import { useState, useEffect, useRef } from "react";
import Game from "../components/Game";
import MultipleChoice from "../components/MultipleChoice";
import { BiMicrophone } from "react-icons/bi";
import { formatString } from "../functions";
import coconut from "../../public/coconut.png";
import { ImWarning } from "react-icons/im";
import AnswerPopUp from "../components/AnswerPopUp";
import { useNavigate, useSearchParams } from "react-router-dom";
import callApi from "../functions";
/* eslint-disable */

// All the types for the games

type Player = {
  id: string;
  username: string;
  isMuted: boolean;
  imgUrl: string;
};
import type { Question } from "../types";
import WinCondition from "../components/WinCondition";

export default function GamePage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const websocketRef = useRef<null | WebSocket>(null);
  const clockRef = useRef<number>(0);
  // const websocketState = useRef<"IN-GAME" | "LOCATING-GAME">("LOCATING-GAME");
  // A correct answer adds .1 to the coconut multiplier
  const [coconutMultiply, setCoconutMultiply] = useState<number>(1.4);
  const [allRightQuestions, setAllRightQuestions] = useState<Question[]>([]);
  const [allWrongQuestions, setAllWrongQuestions] = useState<Question[]>([]);
  const [hasWon, setHasWon] = useState<boolean | null>(null);
  const [updateQuestion, setUpdateQuestion] = useState({
    wasRight: false,
    question: {} as Question,
    answer: ""
  })
  const gameId = searchParams.get("gameId");

  // const gameSettings = {
  //   isMath: false,
  //   difficulty: 6,
  //   topic: "Words in Context",
  // };

  useEffect(() => {
    console.log("this useEffect was triggered")
    if (Object.keys(updateQuestion.question).length > 0) {
      // this would mean we have a valid question back her
      // e.
      // console.log()
      console.log("update question was called here fellas",updateQuestion,Object.keys(updateQuestion).length)
      const answer = updateQuestion.question.answer;
      setPopupAnswer(answer ?? "");
      
  
      if (updateQuestion.wasRight) {
          setWasRight(true);
          console.log("this was the right answer")
          setCoconutMultiply((prev) => {
            return prev + 0.4;
          });
        console.log("we are tryna get a new question")
        // const newQuestion = await getNewQuestion();
        // console.log("the new current question is", newQuestion);
        // setCurrentQuestion(newQuestion);
      
        setAllRightQuestions((prev) => {
          return [
            ...prev,
            {
              ...currentQuestion,
              answer: answer,
              studentInput: answerSelected,
            },
          ];
        });
      } else {
        console.log("this was the wrong answer, your coconuts went DOWN to", coconutMultiply-0.4);
        setWasRight(false);
        setCoconutMultiply((prev) => {
            if (prev <= 0.4) {
              return prev;
            } else {
              return prev - 0.4;
            }
        });
        if (currentQuestion.questionId !== "abcd") {
        setAllWrongQuestions((prev) => {
          return [
            ...prev,
            {
              ...currentQuestion,
              answer: answer,
              studentInput: answerSelected,
            },
          ];
        });
        }

     
      }
      
      setAnswerSelected("");
      setCurrentQuestion({...updateQuestion.question, isMcq: updateQuestion.question.type as any === "mcq" ? true : false} as Question)

     



      // regardless of what happens, we need to set it up here
    } else {
      // do nothing honestly
    }


  }, [updateQuestion])


  useEffect(() => {
    function x() {
      if (hasWon !== null) {
        const wrongStr = allWrongQuestions.map((q) => {
          return q.questionId
        })

        const rightStr = allRightQuestions.map((q) => {
          return q.questionId
        })
        console.log("we lowk sent shit")

        callApi("/sendReview", "POST", {
          wrongQuestions: wrongStr,
          rightQuestions: rightStr,
        }).then((res) => {
          // lowk doesn't matter what happens here

          console.log("this was the response from /sendReview", res)

        }) 

      



      } else {
        // do nothing


      }

    }

    x();


  }, [hasWon])

  useEffect(() => {
    
    if (!gameId) {
      nav("/login");
      return;
    } else {
      console.log("this is waht game id is", decodeURI(gameId));
    }

    
  }, []);

  const [popupAnswer, setPopupAnswer] = useState<string>("");
  const [wasRight, setWasRight] = useState<boolean>();
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    stimulus: "this is some text",
    questionId: "abcd",
    stem: "this is a question",
    answerChoices: ["a", "b", "c", "d"],
    isMcq: true,
  });
  const [answerSelected, setAnswerSelected] = useState<string>("");

  const checkAnswer = () => {
    return new Promise(async (resolve) => {
      // let answer = "";
      if (websocketRef.current) {
        websocketRef.current.send(JSON.stringify({
          type: "ANSWER_QUESTION",
          answer: String(answerSelected)
        }))
      }
      resolve;
    });
  };

  useEffect(() => {
    console.log("answer selected is being triggered");
    async function x() {
      if (answerSelected !== "") {
       checkAnswer();
        
      } else {
        console.log("answer selected is empty quotes.");
      }
    }
    x();
  }, [answerSelected]);

  // Removes the popup after it happens
  useEffect(() => {
    if (popupAnswer === "") {
      return;
    }
    console.log("we got to this part of the wasRight", popupAnswer, wasRight)

    const timeout = setTimeout(() => {
      setPopupAnswer("");
      setWasRight(undefined);
    }, 2000);

    return () => {
      clearTimeout(timeout);
    };
  }, [popupAnswer, wasRight]);

  const [lobby, setLobby] = useState<Player[]>([
    {
      id: "12390123",
      username: "Plastuchino",
      imgUrl:
        "https://img.daisyui.com/images/profile/demo/distracted1@192.webp",
      isMuted: false,
    },
    {
      id: "12390123",
      username: "Plastuchino",
      imgUrl:
        "https://img.daisyui.com/images/profile/demo/distracted1@192.webp",
      isMuted: false,
    },
    {
      id: "12390123",
      username: "Plastuchino",
      imgUrl:
        "https://img.daisyui.com/images/profile/demo/distracted1@192.webp",
      isMuted: false,
    },
  ]);

  return (
    <>
      {/* <section className="overflow-hidden w-screen h-screen"> */}
      {(hasWon !== null) && (
        <WinCondition studyingTime={clockRef.current} allQuestionsWrong={allWrongQuestions} allQuestionsRight={allRightQuestions} hasWon={hasWon}/>
      )}
      <div className="grid grid-cols-6 items-start relative justify-start w-screen h-full">
        {popupAnswer && typeof wasRight == "boolean" && (
          <AnswerPopUp
            answer={popupAnswer}
            wasRight={wasRight}
            scoreChange={wasRight ? "+0.4" : "-0.4"}
          />
        )}

        <div className="col-span-3 w-full h-full">
          <Game setHasWon={setHasWon} setUpdateQuestion={setUpdateQuestion} websocketRef={websocketRef} />
        </div>

        <div className="col-span-3 w-full h-full relative">
          <div className="absolute w-full">
            <div className="w-5/6 mx-auto">
              <div className="flex font-1 flex-row items-center justify-center">
                <img src={coconut} className="w-10 h-10" />
                <p>{coconutMultiply.toFixed(2)}x</p>
              </div>

              {(currentQuestion.type === undefined) ? <>
                <div className="bg-base-300 font-1 h-[30vh] w-full flex text-center flex-col items-center justify-center">
                  <p className="font-bold text-2xl">Waiting for your game to start</p>
                  {/* <p className="animate-bounce">...</p> */}

                  <p className="text-sm mt-4 italic">"Patience is the greatest virtue!" - Obama</p>
                </div>
              </> : <>
               <MultipleChoice
                clock={clockRef}
                question={currentQuestion}
                setAnswerSaved={setAnswerSelected}
              />

              
              </>}

             
              <div className="mt-8 font-1 relative">
                <div className="absolute text-center p-10 z-20 bg-base-300 opacity-100 top-[50%] translate-y-[-50%] left-[50%] translate-x-[-50%]">
                  <p className="font-bold text-2xl">Coming Soon.</p>
                  <p>If you want to help out, check out the code <a href="https://github.com/XDagging/clash-of-questions" className="link">here.</a></p>
                </div>
                <p>In your lobby</p>

                <div className="opacity-50">

             
                <div className="flex flex-row items-center gap-4">
                  {lobby.map((player, i) => (
                    <div
                      key={i}
                      className="flex rounded-box items-center gap-3 flex-col mt-2 p-5 bg-base-300 text-center"
                    >
                      <div className="avatar">
                        <div className="w-15 rounded-full">
                          <img src={player.imgUrl}></img>
                        </div>
                      </div>
                      <p>{formatString(player.username ?? "")}</p>

                      {!player.isMuted ? (
                        <button
                          onClick={() =>
                            setLobby((prev) => {
                              const newLobby = [...prev];
                              newLobby[i] = {
                                ...newLobby[i],
                                isMuted: !newLobby[i].isMuted,
                              };
                              return newLobby;
                            })
                          }
                          className="btn btn-ghost btn-error btn-circle"
                        >
                          <BiMicrophone className="size-6" />
                        </button>
                      ) : (
                        <button
                          className="btn btn-error btn-circle"
                          onClick={() =>
                            setLobby((prev) => {
                              const newLobby = [...prev];
                              newLobby[i] = {
                                ...newLobby[i],
                                isMuted: !newLobby[i].isMuted,
                              };
                              return newLobby;
                            })
                          }
                        >
                          <BiMicrophone className="size-6" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                <div className="alert alert-info mt-2">
                  <ImWarning />
                  <p>
                    Every question you get right increases your coconut
                    multiplier. Every wrong answer decreases it. Choose wisely.
                  </p>
                </div>
                   </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* </section> */}
    </>
  );
}
