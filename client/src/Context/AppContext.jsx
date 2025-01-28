import { createContext, useEffect, useState } from "react";
import {toast} from  'react-toastify'
import axios from 'axios'
import { useNavigate } from "react-router-dom";
export const AppContext = createContext()

const AppContextProvider = (props) =>{
    const navigate = useNavigate()
  
     const backendurl = import.meta.env.VITE_BACKEND_URL
     const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : '' );
   
  const [showLogin, setShowLogin] = useState(!localStorage.getItem("token"));
  const [credits, setCredits] = useState(false);




  const loadCreditBalance = async () =>{
    try {
        const {data} = await axios.get(backendurl+"/api/user/credits",{headers:{token}})
        if(data){
            setCredits(data.credits)
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.message)
        
    }
  }

  const generateImage = async (prompt) =>{
    try {
        const {data} = await axios.post(backendurl+'/api/image/generate-image',{prompt},{headers:{token}})
        if(data.success){
            loadCreditBalance()
            return data.resultImage

        }else{
            toast.error(data.message)
            loadCreditBalance()
            if(data.creditBalance===0){
                Navigate('/buy')
            }
        }
        
    } catch (error) {
        console.log(error)
        toast.error(error.message)
    }
  }


  useEffect(()=>{
   if(token){
    loadCreditBalance()
   }
  },[token,loadCreditBalance])

    const value = {
       showLogin,setShowLogin,backendurl,token,setToken,credits,setCredits,loadCreditBalance,generateImage
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider