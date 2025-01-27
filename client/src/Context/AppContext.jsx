import { createContext, useState } from "react";

export const AppContext = createContext()

const AppContextProvider = (props) =>{
  
     const backendurl = import.meta.env.VITE_BACKEND_URL
     const [token, setToken] = useState(localStorage.getItem("token") ? localStorage.getItem("token") : '' );
   
  const [showLogin, setShowLogin] = useState(!localStorage.getItem("token"));
  const [credit, setCredit] = useState(false);

    const value = {
       showLogin,setShowLogin,backendurl,token,setToken,credit,setCredit
    }
    return(
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider