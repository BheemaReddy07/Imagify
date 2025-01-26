import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col items-center justify-center text-center my-20 '>
       <div className='text-stone-500 inline-flex text-center gap-2 bg-white px-6 border border-neutral-500 rounded-full items-center py-1'>
        <p className='text-md'>Best text to image generator</p>
        <img src={assets.star_icon} />
       </div>
       <h1 className='text-4xl max-w-[300px] sm:text-7xl sm:max-w-[590px] mx-auto mt-10 text-center'>Turn text to <span className='text-blue-600'>image</span>, in seconds.</h1>
       <p className='text-md text-gray-500 max-w-xl mt-5 text-center mx-auto'>Unleash your creativity with AI. Turn your imagination into visual art in seconds – just type, and watch the magic happen.</p>

       <button className='flex gap-2 w-auto bg-black items-center text-white px-12 rounded-full py-2 mt-8 sm:text-lg'> Generate Images <img className='w-5' src={assets.star_group} /></button>
       <div className='flex flex-wrap justify-center gap-3 mt-16'>
        {
            Array(6).fill('').map((item,index)=>(
                <img className='rounded hover:scale-105 transition-all duration-300 cursor-pointer max-sm:w-10' src={index%2==0 ?assets.sample_img_1 :assets.sample_img_2}  key={index} width={70}/>
            ))
        }
       </div>

       <p className='mt-3 text-sm text-gray-600'>Generated images from imagify</p>
    </div>
  )
}

export default Header
