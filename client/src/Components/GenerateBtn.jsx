import React from 'react'
import { assets } from '../assets/assets'
import {motion} from 'framer-motion'
import { AppContext } from '../Context/AppContext'
import { useContext } from 'react'
import {useNavigate} from 'react-router-dom'
const GenerateBtn = () => {

  const {user,setShowLogin} = useContext(AppContext)
  const navigate = useNavigate()

  const onclickHandler = ()=>{
    if(user){
      navigate('/result')
    }
    else{
      setShowLogin(true)
    }

  }



  return (
    <motion.div initial={{opacity:0.2 ,y:100}} transition={{duration:1}} whileInView={{opacity:1,y:0}} viewport={{once:true}}  className='flex flex-col items-center justify-center pb-40 mt-10 '>
      <h1 className='text-2xl sm:text-3xl font-semibold my-4 mb-10 pt-10'>See the magic. Try now</h1>
      <button onClick={onclickHandler} className='flex flex-row bg-black text-white px-10 py-2 m-auto hover:scale-110 transition-all duration-300 rounded-full '>Generate Images <img className='w-5' src={assets.star_group} /></button>
    </motion.div>
  )
}

export default GenerateBtn
