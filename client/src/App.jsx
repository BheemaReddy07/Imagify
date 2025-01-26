 import React from 'react' 
 import {Route,Routes} from 'react-router-dom'
 import {ToastContainer ,toast} from 'react-toastify'
 import 'react-toastify/dist/ReactToastify.css'
 import Home from './Pages/Home'
 import BuyCredit from './Pages/BuyCredit'
 import Result from './Pages/Result'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import Login from './Components/Login'
 const App = () => {
   return (
     <div className='px-4 sm:px-10 md:px-14  lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50' >
        <ToastContainer />
        <Navbar />
        <Login />
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/buy' element={<BuyCredit />} />
          <Route path='/result' element={<Result />} />
        </Routes>
        <Footer />
     </div>
   )
 }
 
 export default App
 