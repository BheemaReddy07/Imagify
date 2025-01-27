import React, { useContext } from 'react'
import { assets, plans } from '../assets/assets'
import { AppContext } from '../Context/AppContext'
import { motion } from "motion/react"
const BuyCredit = () => {
 const {user} = useContext(AppContext)


  return (
    <motion.div initial={{opacity:0.2 ,y:100}} transition={{duration:1}} whileInView={{opacity:1,y:0}} viewport={{once:true}} className='min-h-[80vh] text-center pt-14 mb-10'>
          <button className='border border-gray-600 px-10 py-2 rounded-full hover:scale-105 transition-all duration-300 mb-6'>Our Plans</button>
          <h1 className='text-3xl sm:text-4xl font-medium text-center mb-6 sm:mb-10   '>Choose the plan</h1>
          <div className='flex flex-wrap justify-center text-left gap-6'>
            {
              plans.map((item,index)=>(
                <div className='bg-white drop-shadow-lg rounded-lg border py-12 px-10 text-gray-600 hover:scale-110 transition-all duration-500' key={index}>
                   
                  <img width={40} src={assets.logo_icon} />
                  <p className='mt-3 mb-1 font-semibold'>{item.id}</p>
                  <p className='text-sm'>{item.desc}</p>
                  <p className='mt-6'><span className='text-3xl font-medium'> ₹{item.price}</span>/{item.credits} credits</p>
                   
                <button className='w-full bg-gray-800 text-white px-8 py-2 rounded-lg mt-8 text-sm min-w-52'>{user ? 'Purchase' : 'Get Started'}</button>

                </div>
              ))
            }
          </div>
    </motion.div>
  )
}

export default BuyCredit
