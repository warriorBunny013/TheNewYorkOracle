import { motion } from "framer-motion";
function Home() {
  return (
    <div className="">
      <div initial={{y:-100}}
           animate={{y:0}}
           transition={{type: "spring", stiffness: 100 }}  className="navbar lg:text-lg bg-black-variation bg-base-100">
  <div className="navbar-start">
    <div className="dropdown">
      <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M4 6h16M4 12h8m-8 6h16" />
        </svg>
      </div>
      <ul
        
        className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About me</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
       
      </ul>
    </div>
    <button className="w-[15rem]"><img src='https://i.postimg.cc/NFy9qjgS/Group-1991.png' alt='logo'/></button>

  </div>
  <div tabIndex={0}
            className="navbar-center hidden lg:flex">
    <ul className="menu menu-horizontal text-white px-1">
      
        <li><a href="#home">Home</a></li>
        <li><a href="#about">About me</a></li>
        <li><a href="#services">Services</a></li>
        <li><a href="#testimonials">Testimonials</a></li>
    </ul>
  </div>
  <div className="navbar-end ">
    <button className="btn border-2 border-white">Contact me</button>
  </div>
      </div>

{/* HERO SECTION STARTS FROM HERE!! */}
<div className="container mx-auto flex flex-wrap md:flex-nowrap pl-10 pr-10 md:pt-20 justify-center ">
  {/* HERO INTRO STARTS */}
  <motion.div
    initial={{y:-100}}
    animate={{y:0}}
    transition={{type: "spring", stiffness: 100 }}
   className='pt-10 lg:pt-20 lg:pr-[10rem] lg:flex-col justify-center'>
   <div className='rubik-wet-paint-regular mb-2 text-white'>Marina Smargiannakis</div>
   <div className='ultra-regular text-[3rem] text-4xl lg:text-5xl mb-8 text-white'>The New York <br/> Oracle<span className='text-[0.48rem] font-mono'>TM</span></div>
   <div className=' text-white mb-8 lg:w-[65vh] lg:text-lg'>Utilizing tarot, intuition, and channeling guides to give clarity, bring you back into alignment and help manifest your best life.</div>
  
    <button className="btn btn-neutral mb-10 text-white">Subscribe for free</button>
  </motion.div>
  {/* HERO INTRO ENDS */}
  <div className='w-[77vh]'>
    <img src='https://i.postimg.cc/XN9Cnp3c/image-1-2.png' alt='hero'/>
  </div>
</div>
{/* HERO SECTION ENDS FROM HERE!! */}

    </div>
  );
}

export default Home;
