import { createContext, useEffect, useState } from "react";

export const AuthContext = createContext();

export const AuthContextprovider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    useEffect(() => {
        
    }, [])
    console.log("here in auth")
    return <AuthContext.Provider value={{isAuth, setIsAuth}}>{children}</AuthContext.Provider>
}