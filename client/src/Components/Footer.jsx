import React, { Profiler } from 'react'
import { assets } from '../assets/assets'
import {useNavigate} from 'react-router-dom'
import {GithubOutlined,LinkedinOutlined,MailOutlined ,MobileOutlined} from '@ant-design/icons'
const Footer = () => {
  const navigate = useNavigate()
  return (
    <div className='md:mx-10'>


      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_2fr] gap-14 my-10 mt-40 text-sm '>
          {/**------------------left section--------------------------- */}
      <div>
        <img onClick={()=>{navigate('/');scrollTo(0,0)}} className='mb-5 w-40' src={assets.logo} alt="" />
        <p className='w-full md:w-2/3 text-gray-600 leading-6'>Easily bring your ideas to life with our free AI image generator. Whether you need stunning visuals or unique imagery, our tool transforms your text into eye-catching images with just a few clicks. Imagine it, describe it, and watch it come to life instantly.

Simply type in a text prompt, and our cutting-edge AI will generate high-quality images in seconds. From product visuals to character designs and portraits, even concepts that don’t yet exist can be visualized effortlessly. Powered by advanced AI technology, the creative possibilities are limitless!</p>
      </div>


        {/**------------------middle section--------------------------- */}
      <div>
        <p className='text-xl font-medium mb-5'>Company</p>
        <ul className='flex flex-col gap-2 text-gray-600'>
            <li className='cursor-pointer' onClick={()=>{navigate('/');scrollTo(0,0)}}>Home</li>
            <li className='cursor-pointer' onClick={()=>{navigate('/');scrollTo(0,0)}}>About Us</li>
            <li className='cursor-pointer' onClick={()=>{navigate('/');scrollTo(0,0)}}>Contact Us</li>
            <li className='cursor-pointer' onClick={()=>{navigate('/');scrollTo(0,0)}}>Privacy policy</li>
        </ul>
      </div>

        {/**------------------right section--------------------------- */}
        <div>
             <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
             <ul>
                  <li><a href='mailto:bheemareddy29102003@gmail.com'><MailOutlined /> bheemareddy29102003@gmail.com</a></li>
                  <li><a href='mailto:imagify2025@gmail.com'><MailOutlined /> imagify2025@gmail.com</a></li>
                  <li><a href='https://github.com/BheemaReddy07/' target='_blank'><GithubOutlined /> BheemaReddy07</a></li>
                  <li><a href='www.linkedin.com/in/bheema-subramanyeswar-reddy-tatiparthi-541104344' target='_blank'><LinkedinOutlined /> Bheema Subramanyeswar Reddy Tatiparthi</a></li>
                      <li><MobileOutlined/> +91 77994 47698</li>
                      <li><MobileOutlined/> +91 81214 47698</li>   
                  </ul>
        </div>
      </div>

   
     {/**------------------copy right rtext--------------------------- */}

        <div>
        < hr />
        <p className='py-5 text-sm text-center'>Copyright 2025@ Prescripto -All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer