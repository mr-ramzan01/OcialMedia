import React, { useContext } from 'react'
import { AuthContext } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';

export const PrivateRouteAfterLogin = ({children}) => {
    const {isAuth, isLoading} = useContext(AuthContext);
    if(isAuth) {
        return <Navigate to='/'/>
    }
  return isLoading?<Loader/>:children;
}
