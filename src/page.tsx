
/* eslint-disable */

import imgOne from "./../public/testimonyOne.webp"
import imgTwo from "./../public/testimonyTwo.webp"
import imgThree from "./../public/testimonyThree.webp"
import './index.css'
// import { ChevronLeftIcon } from '@heroicons/react/24/solid';
// import { PhoneIcon, VideoCameraIcon } from '@heroicons/react/24/outline';
import x from "./../public/mainClip.mov"
import { Link } from 'react-router-dom'
import Footer from "./components/Footer"
import { FiGithub } from 'react-icons/fi'
import { Helmet } from 'react-helmet'
import Navbar from './components/Navbar'
// let interval;
function App() {
  // const [count, setCount] = useState(0)


  return (
    <>

      {/* <Navbar /> */}
      
<Helmet>
            <meta charSet="utf-8" />
            <title>Clash Of Questions - Clash Royale for the SAT</title>
            <meta name="keywords" content="sat, satprep, clash royale, hog rider" />
            <meta
      name="description"
      content="The official SAT that tests your game. You talk the talk, now let's walk the walk."
    />
        </Helmet>
      <Navbar />
      <div className='hero overflow-hidden min-h-screen '>
        <div className='hero-content'>

          <div className='grid grid-cols-1 mt-20 items-center text-center justify-center justify-items-center w-5/6 h-full mx-auto'>
            
            <div className='flex flex-col items-center gap-4 w-fit'>
              <p className="font-2 badge badge-neutral">Last SAT game you'll play. Browser Based, PC</p>
              <h1 className='md:text-8xl text-5xl font-bold font-2 w-full'>Clash Royale as you<br/> score a 1600.</h1>

               <a href="https://github.com/XDagging/clash-of-questions" className='text-center flex flex-row items-center gap-2 font-1 font-semibold hover'>Open Source on <span><FiGithub className='size-7' /></span></a>

                                 <Link to="/login" className='btn btn-accent w-fit font-1 font-bold btn-outline btn-xl'>Play now</Link>


        <div className="mt-8 flex flex-col items-center gap-2">
           <div className="mx-auto flex flex-row items-center gap-2">
                <div className="avatar-group -space-x-6">
  <div className="avatar">
    <div className="w-12">
      <img src={imgOne} />
    </div>
  </div>
  <div className="avatar">
    <div className="w-12">
      <img src={imgTwo} />
    </div>
  </div>
  <div className="avatar">
    <div className="w-12">
      <img src={imgThree} />
    </div>
  </div>
  <div className="avatar avatar-placeholder">
    <div className="w-12 bg-neutral text-neutral-content">
      <p className='font-1'>+99</p>
    </div>
  </div>
</div>
                <p className='font-1 font-bold'>Over 500+ happy players</p>


              </div>


        
        </div>
             
            </div>
            

            <div className='mt-8'>

             
                    <div className='w-full bg-base-100'>
                        <video autoPlay className='h-full object-cover aspect-video rounded-box' playsInline muted loop controlsList="nofullscreen">
                            <source src={x}></source>
                        </video>
                        <p className='mt-2 text-center font-1 italic'>Real gameplay against real people. Real stakes. Real learning.</p>

                    </div>

         
            </div>
         
       
          </div>


          
        
        </div>
        








      </div>
      
      <div>


      </div>


      {/* <div className="carousel carousel-vertical rounded-box h-96">
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp" />
  </div>
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp" />
  </div>
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp" />
  </div>
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp" />
  </div>
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1550258987-190a2d41a8ba.webp" />
  </div>
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1559181567-c3190ca9959b.webp" />
  </div>
  <div className="carousel-item h-full">
    <img src="https://img.daisyui.com/images/stock/photo-1601004890684-d8cbf643f5f2.webp" />
  </div>
</div> */}


     <Footer />
      
    </>
  )
}

export default App;
