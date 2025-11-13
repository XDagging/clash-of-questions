import React, {useContext, useState} from "react";
import UserContext from "../context";
import { Link } from "react-router-dom";
// import AdminNavbar from "../components/AdminNavbar";
import { Cog8ToothIcon,UserIcon, ArrowRightStartOnRectangleIcon, FireIcon, InformationCircleIcon } from "@heroicons/react/24/solid";
import type { User } from "../types";
import { useNavigate } from "react-router-dom";
import callApi from "../functions";



export default function Settings() {
    const navigation = useNavigate();
    console.log("this is being called")
    const contextUser = useContext(UserContext);

    const [user, setUser] = useState<User | null>(JSON.parse(contextUser as any) ?? null);
    

    React.useEffect(() => {

        console.log("this is what user is", user)
        
     
        if (contextUser) {
            setUser(JSON.parse(contextUser as any));
        } else {
            // navigation("/login");
        }

        return () => {
            setUser(contextUser || null);
        }


    },[contextUser]);

      const signOut = () => {
            console.log("clicked signout")
            callApi("/logout", "GET").then((res) => {
                if (res.code === "err") {
                    // idfk
                } else if (res.code === "ok") {
                    navigation("/login")
                } else {
                    navigation("/login")
                }
            })
        }

    const changeQuestionPreferences = () => {
        callApi("/updateQuestionType", "POST", user?.questionType).then((res) => {
            if (res.code === "err") {
                // idfk
            } else if (res.code === "") {
                navigation("/dashboard")
            } else {
                navigation("/dashboard")
            }

        })




    }


    if (!user) {
        return <p>Loading Card Data</p>
    }


    return (
        <>
            <Link to="/dashboard" className="font-1 my-4 ml-1 btn btn-ghost">Go Back To The Game</Link>
               <div className="md:flex md:flex-row font-1">
            {/* <AdminNavbar /> */}
            <div className="p-4 flex flex-col gap-2 w-full">

                <div className="flex flex-row items-center gap-2">
                    <Cog8ToothIcon className="size-8 text-secondary" />
                    <h4 className="font-1 text-3xl font-bold">Settings</h4>
                </div>

                <div>
                    <p className="font-1">Change stuff about your account</p>


                </div>

                <div>
                    <img className="rounded-full w-20 h-20 border-2 border-secondary" src={user?.imgUrl} />
                </div>

                <div className="bg-base-200 flex flex-col gap-4 w-full rounded-box p-4">
                    <div className="flex flex-row items-center gap-2">
                        <UserIcon className="size-5" />
                        <p>Account Info</p>
                    </div>

                    <div className="flex md:flex-row flex-col gap-4 items-center w-full">
                        <fieldset className="fieldset w-full">
  <legend className="fieldset-legend">Username</legend>
        <input value={user.name} onChange={(e) => {
            setUser((prev: any) => {
                return {...prev, name: e.target.value}
            })
        }}  type="text" className="input w-full" placeholder="Type here" />
  <p className="label">Required</p>
</fieldset>

<fieldset className="fieldset w-full">
  <legend className="fieldset-legend">Email</legend>
        <input value={user.email} disabled  type="text" className="input w-" placeholder="Type here" />
  <p className="label">Cannot be changed</p>
</fieldset>



                    </div>


                  

                  
                    


                </div>


                <div className="bg-base-200 flex flex-col gap-4 w-full rounded-box p-4">
                    <div>
                        <p>Question Type</p>
                        <p className="text-xs italic">We only support english questions for right now</p>
                        
                    </div>


                      <div className="flex md:flex-row flex-col gap-4 items-center w-full">
                        <fieldset className="fieldset w-full">
  <legend className="fieldset-legend">Question Topic</legend>


        <select value={user.questionType.topic} onChange={(e) => {
            setUser((prev: any) => {
                return {...prev, questionType: {...prev.questionType, topic: e.target.value}}
            })
        }} className="select">
            <option value="Central Ideas and Details">Central Ideas and Details</option>
            <option value="Inferences">Inferences</option>
            <option value="Command of Evidence">Command of Evidence</option>
            <option value="Words in Context">Words in Context</option>
            <option value="Text Structure in Purpose">Text Structure in Purpose</option>
            <option value="Cross-Text Connection">Cross-Text Connection</option>
            <option value="Rhetorical Synthesis">Rhetorical Synthesis</option>
            <option value="Transitions">Transitions</option>
            <option value="Boundaries">Boundaries</option>
            <option value="Form, Structure, and Sense">Form, Structure, and Sense</option>
        </select>
        {/* <input value={user.questionType.topic} onChange={(e) => {
            setUser((prev: any) => {
                return {...prev, questionType: {...prev.questionType, topic: e.target.value}}
            })
        }}  type="text" className="input w-full" placeholder="Type here" /> */}
  <p className="label">Required</p>
</fieldset>
 <fieldset className="fieldset w-full">
  <legend className="fieldset-legend">Difficulty</legend>
        <input value={user.questionType.difficulty} onChange={(e) => {
            setUser((prev: any) => {
                return {...prev, questionType: {...prev.questionType, difficulty: e.target.value}}
            })
        }}  type="number" className="input w-full" placeholder="Type here" />
  <p className="label">Put a number between 4-7</p>
</fieldset>



                    </div>
                    
                    <button onClick={changeQuestionPreferences} className="btn btn-primary">
                        Change Preferences

                    </button>
                </div>

                  <div className="flex flex-col gap-2 p-4">
                        <div className="flex flex-row gap-2 items-center">
                            <FireIcon className="size-6" />
                            <p className="">Account Actions</p>
                        </div>
                         
                        <div className="p-3 flex flex-col gap-2 w-full">

                            <div>
                                <div className="btn btn-error btn-outline gap-2 w-fit" onClick={signOut}>
                                <ArrowRightStartOnRectangleIcon className="size-4" />
                                <p>Log out</p>
                            </div>

                            </div>
                            <div>
                                <div className="btn btn-error gap-2 w-fit">
                                {/* <TrashIcon className="size-4" /> */}
                                <p>Delete Account</p>
                            </div>

                            </div>

                            <div className="alert alert-error alert-dash mt-2">
                                <InformationCircleIcon className="size-4" />
                                <p>This action deletes your account and account activity.</p>

                            </div>

                           
                        </div>
                    </div>


           


               
            </div>
            
        
        </div>   


        

        
        
        
        
        
        
        </>
    )
}