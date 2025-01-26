import React from 'react'
import { assets } from '../assets/assets'

const GenerateBtn = () => {
  return (
    <div className='flex flex-col items-center justify-center pb-40 mt-10 '>
      <h1 className='text-2xl sm:text-3xl font-semibold my-4 mb-10 pt-10'>See the magic. Try now</h1>
      <button className='flex flex-row bg-black text-white px-10 py-2 m-auto hover:scale-110 transition-all duration-300 rounded-full '>Generate Images <img className='w-5' src={assets.star_group} /></button>
    </div>
  )
}

export default GenerateBtn
