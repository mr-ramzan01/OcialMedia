import React, { useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'
import { Login } from '../pages/Login';
import { useNavigate } from 'react-router-dom';

export const PrivateRoute = ({children}) => {
    const {isAuth, setIsAuth} = useContext(AuthContext);
    const navigate = useNavigate();
    // if(!isAuth) {
    //     // console.log("before fetch")
    //     return <Navigate to='/accounts/login'/>
    // }
    return children;
}
