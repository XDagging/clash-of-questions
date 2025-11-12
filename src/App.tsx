
import './App.css'
import GamePage from './game/page'
import Login from './login/page';
import Dashboard from "./dashboard/page.tsx"
import Review from './review/page.tsx';
// import AuthContext from './context.ts';
import { useContext, useEffect, useState } from 'react';
import callApi from './functions.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from "./context.ts"
import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import Index from "./page.tsx"
import Credits from './credits/page.tsx';
import Walkout from './components/Walkout.tsx';
/* eslint-disable */
const PrivateRoutes = () => {
    const user = useContext(UserContext);
    return user ? <Outlet /> : <Navigate to="/login" />
}

function App() {
    const location = useLocation();
    const navigate = useNavigate()
    const [user, setUser] = useState(null);

    useEffect(() => {
      
      const path = location.pathname.split("/").filter(Boolean).pop()?.toLowerCase();
      
      if (user===null) {
        callApi("/getUser", "GET").then((res) => {
          console.log("this is the response from /getUser", res)
          if (res.code === "ok") {
            console.log('we just changed user')          
            setUser(res.message)
            if (path==="login"||path==="signup") {
              navigate("/dashboard")
            }
          } else {
            setUser(null);
          }      
        })

      } else {
        console.log("dont get the user yet (it doesn't matter)")
      // Pretend like nothing happened;
      }


  },[location.pathname])
  



  return (
    <>
    <UserContext.Provider value={user}>

        <Routes>
            <Route path="/login" element={<Login />} />

            <Route path="/" element={<Index />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/test" element={<Walkout opponentOne={ {name: "carlos", trophies: 300}} opponentTwo={ {name: "baca", trophies: 250}} />} />
            <Route element={<PrivateRoutes />}>
              <Route path="/review" element={<Review />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/game" element={<GamePage />} />
            </Route>
        </Routes>
    
       </UserContext.Provider>
    </>
  )
}

export default App
