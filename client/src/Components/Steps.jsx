import React from 'react'
import { stepsData } from '../assets/assets'

const Steps = () => {
  return (
    <div className='flex flex-col items-center justify-center   my-32'>
      <h1 className='text-3xl sm:text-4xl font-semibold mb-2'>How it works</h1>
      <p className='text-gray-600 mb-8 text-lg'>Transform Words Into Stunning Images</p>

      <div className=' space-y-4 w-full max-w-3xl text-sm'>
        {stepsData.map((item,index)=>(
            <div className=' flex items-center gap-4 p-5 px-8 bg-white/20 shadow-lg cursor-pointer hover:scale-[1.02] transitition-all duration-300 border  rounded-xl' key={index}>
                  <img src={item.icon} />
                  <div>
                    <h2 className='text-xl font-medium'>{item.title}</h2>
                    <p className='text-gray-600'>{item.description}</p>
                  </div>
            </div>
        ))}
      </div>
    </div>
  )
}

export default Steps
