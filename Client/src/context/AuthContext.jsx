import { createContext, useEffect, useRef, useState } from "react";

export const AuthContext = createContext();

export const AuthContextprovider = ({children}) => {
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({});
    const [showSinglePost, setShowSinglePost] = useState(false);
    const [postData, setPostData] = useState([]);
    const [editData, setEditData] = useState({full_name: 'dfa', bio: ``, username:'', email: '', mobile_no: '' });
    const [messagesNotification, setMessagesNotification] = useState([]);
    


    const getAllNotifications = (id) => {
        fetch(`/messages/notifications/get/${id}`)
        .then(res => res.json())
        .then(res => {
            if(res.success) {
                setMessagesNotification(res.data);
            }
        })
        .catch(err => {
            console.log(err, 'error');
        })
    }

    const deleteNotifications = (id, userId) => {
        fetch(`/messages/notifications/${id}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(res => {
            if(res.success) {
                getAllNotifications(userId);
            }
        })
        .catch(err => {
            console.log(err, 'error');
        })
    }

    const sendMessageNotification = (message_id, from) => {
        fetch(`/messages/notifications/send`, {
            method: 'POST',
            body: JSON.stringify({
                message_id,
                from
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        .then(res => res.json())
        .then(res => {
            if(res.success) {
                setMessagesNotification([res.data, ...messagesNotification]);
            }
        })
        .catch(err => {
            console.log(err, 'error');
        })
    }

    const isLoggedIn = () => {
        setIsLoading(true);
        fetch('/users/loggedInUser')
        .then((res) => res.json()) 
        .then((res) => {
            if(res.success) {
                getAllNotifications(res.data._id);
                setIsAuth(true);
            }
            else {
                setIsAuth(false);
            }
        })
        .catch((err) => {
            console.log(err, 'err');
            setIsAuth(false);
        })
        .finally(() => {
            setIsLoading(false);
        })
    }
    useEffect(() => {
        isLoggedIn();
    },[]);

    const getUser = () => {
        fetch('/users/loggedInUser')
        .then((res) => res.json()) 
        .then((res) => {
            if(res.success) {
                setUserData(res.data);
                setEditData(res.data);
            }
        })
        .catch((err) => {
            console.log(err, 'err');
        })
    }

    const handleClick = async (id) => {
        await fetch(`/posts/single/${id}`)
        .then(res => res.json())
        .then(res => {
          if(res.success) {
            setPostData(res.data);
          }
        })
        .catch(err => {
          console.log(err, 'error');
        })
        setShowSinglePost(true);
      }

    const googleRequest = () => {

        const rootUrl = 'https://accounts.google.com/o/oauth2/v2/auth';
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
    return <AuthContext.Provider value={{isAuth, isLoading, userData, editData, showSinglePost, postData, messagesNotification, getAllNotifications, deleteNotifications, setMessagesNotification, sendMessageNotification, handleClick, setShowSinglePost, setEditData, getUser, setIsAuth, googleRequest}}>{children}</AuthContext.Provider>
}