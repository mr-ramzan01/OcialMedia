import { createContext, useState } from "react";

export const AuthContext = createContext();

export const AuthContextprovider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);

    // const isLoggedIn = () => {
    //     fetch('/users/loggedInUser')
    //     .then((res) => res.json()) 
    //     .then((res) => {
    //         if(res.success) {
    //             setIsAuth(true);
    //         }
    //         else {
    //             setIsAuth(false);
    //         }
    //         console.log(res, 'res')
    //     })
    //     .catch((err) => {
    //         // console.log(err, 'err');
    //         setIsAuth(false);
    //     })
    // }
    // isLoggedIn();

    const googleRequest = () => {

        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
        // const redirect_uri= `https://flipkartclone04.netlify.app/google_OAuth`
        const redirect_uri = `http://localhost:3000/google_Oauth`
        const client_id = '200704460983-v8rd6imcnmpumhqijgormivb1nnsd05s.apps.googleusercontent.com'
        const access_type = 'offline'
        const response_type = 'code'
        const prompt = 'consent'
        const scope = [
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        ].join(' ')

        window.location = `${rootUrl}?redirect_uri=${redirect_uri}&client_id=${client_id}&access_type=${access_type}&response_type=${response_type}&prompt=${prompt}&scope=${scope}`
    }
    // console.log("here in auth")
    return <AuthContext.Provider value={{isAuth, setIsAuth, googleRequest}}>{children}</AuthContext.Provider>
}