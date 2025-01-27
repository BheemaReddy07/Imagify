import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { motion } from "motion/react"
import { AppContext } from '../Context/AppContext'
import {useNavigate} from 'react-router-dom'
const Header = () => {


  const {token,setShowLogin} = useContext(AppContext)
  const navigate = useNavigate()

  const onclickHandler = ()=>{
    if(token){
      navigate('/result')
    }
    else{
      setShowLogin(true)
    }

  }

  return (


    <motion.div className='flex flex-col items-center justify-center text-center my-20 ' initial={{opacity:0.2 ,y:100}} transition={{duration:1}} whileInView={{opacity:1,y:0}} viewport={{once:true}} >
       <motion.div initial={{opacity:0,y:-20}} animate={{opacity:1,y:0}} transition={{delay:0.2,duration:0.8}} className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 border border-neutral-500 rounded-full items-center py-1'>
        <motion.p className='text-md'>Best text to image generator</motion.p>
        <img src={assets.star_icon} />
       </motion.div>
       <motion.h1 initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.4,duration:2}} className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'>Turn text to <span className='text-blue-600'>image</span>, in seconds.</motion.h1>
       <motion.p initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.6,duration:0.8}} className='text-md text-gray-500 max-w-xl mt-5 text-center mx-auto'>Unleash your creativity with AI. Turn your imagination into visual art in seconds – just type, and watch the magic happen.</motion.p>

       <motion.button initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{delay:0.8,duration:0.6}} className='flex gap-2 w-auto bg-black items-center text-white px-12 rounded-full py-2 mt-8 sm:text-lg hover:scale-105 trnansition-all duration-300' onClick={onclickHandler}> Generate Images <img className='w-5' src={assets.star_group} /></motion.button>
       <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1,duration:1}} className='flex flex-wrap justify-center gap-3 mt-16'>
        {
            Array(6).fill('').map((item,index)=>(
                <motion.img whileHover={{scale:1.05,duration:0.1}} className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' src={index%2==0 ?assets.sample_img_1 :assets.sample_img_2}  key={index} width={70}/>
            ))
        }
       </motion.div>

       <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{delay:1.2,duration:0.8}} className='mt-3 text-sm text-gray-600'>Generated images from imagify</motion.p>
    </motion.div>
  )
}

export default Header
