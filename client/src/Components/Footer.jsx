import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div className='flex items-center justify-between py-3 gap-4 mt-20'>
       
        <img src={assets.logo} width={150} />
        
        <p className='max-sm:hidden flex-1 border-l border-gray-500 pl-4 text-sm text-gray-500 '> Copyright @imagify .  All right reserved</p>
      
      <div className='flex gap-2.5'>
        <img src={assets.facebook_icon} />
        <img src={assets.twitter_icon} />
        <img src={assets.instagram_icon} />
      </div>
    </div>
  )
}

export default Footer
