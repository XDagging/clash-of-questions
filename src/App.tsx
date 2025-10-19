
import './App.css'
import GamePage from './game/page'
import Login from './login/page';

// import { useLocation, useNavigate } from 'react-router-dom';
import { Route, Routes, BrowserRouter } from "react-router-dom"

function App() {
  

  return (
    <>


    {/* <section className="overflow-hidden w-screen h-screen"> */}
      <BrowserRouter>
        <Routes>
            <Route path="/" element={<GamePage />} />
            <Route path="/login" element={<Login />} />
        </Routes>

      </BrowserRouter>
     
    {/* </section> */}
  
    


    </>
  )
}

export default App
