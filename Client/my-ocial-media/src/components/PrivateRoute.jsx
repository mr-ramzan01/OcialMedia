import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'

export const PrivateRoute = ({children}) => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    // const [loggedIn, setLoggedIn] = useState(false);
    // console.log(props, 'auth')
    // useEffect(() => {
        fetch('/users/loggedInUser')
    .then((res) => res.json()) 
    .then((res) => {
        if(res.success) {
            setIsAuth(true);
        }
        console.log(res, 'res')
    })
    .catch((err) => {
        console.log(err, 'err');
        setIsAuth(false);
    })
    // }, [])
    if(!isAuth) {
        console.log("before fetch")
        return <Navigate to='/accounts/login'/>
    }
    return children;
}
