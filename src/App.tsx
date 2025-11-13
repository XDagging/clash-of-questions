import './App.css'
import GamePage from './game/page'
import Login from './login/page';
import Dashboard from "./dashboard/page.tsx"
import Review from './review/page.tsx';
import Settings from "./settings/page.tsx"
import { useContext, useEffect, useState } from 'react';
import callApi from './functions.ts';
import { useLocation, useNavigate } from 'react-router-dom';
import UserContext from "./context.ts"
import { Route, Routes, Outlet, Navigate } from "react-router-dom"
import Index from "./page.tsx"
import Credits from './credits/page.tsx';
import Walkout from './components/Walkout.tsx';

const PrivateRoutes = () => {
    const user = useContext(UserContext);
    // If we are here, loading is already done, so safe to check for null
    return user ? <Outlet /> : <Navigate to="/login" />
}

function App() {
    const location = useLocation();
    const navigate = useNavigate()
    
    const [user, setUser] = useState(null);
    // 1. Add a loading state (Start true)
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const path = location.pathname.split("/").filter(Boolean).pop()?.toLowerCase();
      
      // Only fetch if we don't have a user yet
      if (user === null) {
        callApi("/getUser", "GET").then((res) => {
          if (res.code === "ok") {      
            setUser(res.message)
            if (path === "login" || path === "signup") {
              navigate("/dashboard")
            }
          } else {
            setUser(null);
          }      
        })
        .catch(() => setUser(null)) // Catch potential network errors
        .finally(() => {
             // 2. Stop loading regardless of success or failure
             setIsLoading(false);
        });

      } else {
        // If user exists, we aren't loading
        setIsLoading(false); 
      }
  }, [location.pathname]) // Note: usually you only want to check auth on mount, not every path change, but keeping your logic for now.

  // 3. BLOCK rendering until we know the auth status
  if (isLoading) {
      return <div className="h-screen w-full flex justify-center items-center">Loading Application...</div>
  }

  return (
    <>
    <UserContext.Provider value={user}>
        <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Index />} />
            <Route path="/credits" element={<Credits />} />
            <Route path="/test" element={<Walkout opponentOne={ {name: "carlos", trophies: 300}} opponentTwo={ {name: "baca", trophies: 250}} />} />
            
            <Route element={<PrivateRoutes />}>
              <Route path="/settings" element={<Settings />} />
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