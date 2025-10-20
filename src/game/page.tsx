import { useState, useEffect, useRef } from "react";
import Game from "../components/Game";
import MultipleChoice from "../components/MultipleChoice";
import { BiMicrophone } from "react-icons/bi";
import { formatString } from "../functions";
import coconut from "../../public/coconut.png";
import { ImWarning } from "react-icons/im";
import AnswerPopUp from "../components/AnswerPopUp";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";


// All the types for the games

type Player = {
  id: string;
  username: string;
  isMuted: boolean;
  imgUrl: string;
};

type Question = {
  question: string;
  optionA?: string;
  optionB?: string;
  optionC?: string;
  optionD?: string;
  answer?: string;
  isMcq: boolean;
  studentInput?: string;
};

export default function GamePage() {
  const nav = useNavigate();
  const [searchParams] = useSearchParams();
  const websocketRef = useRef<null | WebSocket>(null);
  const websocketState = useRef<"IN-GAME" | "LOCATING-GAME">("LOCATING-GAME");
  // A correct answer adds .1 to the coconut multiplier
  const [coconutMultiply, setCoconutMultiply] = useState<number>(1);
  const [allRightQuestions, setAllRightQuestions] = useState<Question[]>([]);
  const [allWrongQuestions, setAllWrongQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const gameId = searchParams.get("gameId")
    if (!gameId) {
      nav("/login");
      return;
    } else {
        
        console.log("this is waht game id is", decodeURI(gameId))
    }

    // if (websocketRef.current === 

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
    };
  }, []);

  const [popupAnswer, setPopupAnswer] = useState<string>("");
  const [wasRight, setWasRight] = useState<boolean>();

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    question: "this is a question?",
    optionA: "a",
    optionB: "b",
    optionC: "c",
    optionD: "d",
    isMcq: true,
  });

  const [answerSelected, setAnswerSelected] = useState<string>("");

  const getNewQuestion = () => {
    // would be an api request btw.
    return {
      question: "this is a question btw?" + Math.ceil(Math.random() * 100),
      optionA: "a",
      optionB: "b",
      optionC: "c",
      optionD: "d",
      isMcq: false,
    };
  };

  const checkAnswer = () => {
    // api call later
    const answer = "a";
    setPopupAnswer(answer);
    if (answerSelected === answer) {
      setWasRight(true);
      setAllRightQuestions((prev) => {
        return [
          ...prev,
          { ...currentQuestion, answer: answer, studentInput: answerSelected },
        ];
      });
      return true;
    } else {
      setWasRight(false);
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
      return false;
    }
  };

  useEffect(() => {
    console.log("answer selected is being triggered");
    if (answerSelected !== "") {
      const isRight = checkAnswer();

      if (isRight) {
        setCoconutMultiply((prev) => {
          return prev + 0.1;
        });
      } else {
        setCoconutMultiply((prev) => {
          if (prev <= 0.4) {
            return prev;
          } else {
            return prev - 0.4;
          }
        });
      }

      console.log("the new current question is", getNewQuestion());
      setCurrentQuestion(getNewQuestion());
      setAnswerSelected("");
    } else {
      console.log("answer selected is empty quotes.");
    }
  }, [answerSelected]);

  // Removes the popup after it happens
  useEffect(() => {
    if (popupAnswer === "") {
      return;
    }

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
      <div className="grid grid-cols-6 items-start relative justify-start w-screen h-full">
        {popupAnswer && typeof wasRight == "boolean" && (
          <AnswerPopUp
            answer={popupAnswer}
            wasRight={wasRight}
            scoreChange={wasRight ? "+0.1" : "-0.4"}
          />
        )}

        <div className="col-span-3 w-full h-full">
          <Game />
        </div>

        <div className="col-span-3 w-full h-full relative">
          <div className="absolute w-full">
            <div className="w-5/6 mx-auto">
              <div className="flex font-1 flex-row items-center justify-center">
                <img src={coconut} className="w-10 h-10" />
                <p>{coconutMultiply.toFixed(2)}x</p>
              </div>

              <MultipleChoice
                question={currentQuestion}
                setAnswerSaved={setAnswerSelected}
              />

              <div className="mt-8 font-1">
                <p>In your lobby</p>

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

      {/* </section> */}
    </>
  );
}
