import { createContext, useEffect, useState } from "react";
import { root_url } from "../utils/url";
// import { useCookies } from "react-cookie";
import Cookies from 'universal-cookie';

export const AuthContext = createContext();

export const AuthContextprovider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [showSinglePost, setShowSinglePost] = useState(false);
  const [postData, setPostData] = useState([]);
  const [editData, setEditData] = useState({
    full_name: "dfa",
    bio: ``,
    username: "",
    email: "",
    mobile_no: "",
  });
  const [messagesNotification, setMessagesNotification] = useState([]);
  const [generalNotifications, setGeneralNotifications] = useState(true);

  // const [cookies, setCookies] = useCookies(["user"]);
  const cookies = new Cookies();
  const userToken = cookies.get('ocialMedia_token');

  const hasGeneralNotifications = () => {
    fetch(`${root_url}/api/notifications/has`, {
      method: "GET",
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setGeneralNotifications(false);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const getAllNotifications = (id) => {
    fetch(`${root_url}/api/messages/notifications/get/${id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setMessagesNotification(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const deleteNotifications = (id, userId) => {
    fetch(`${root_url}/api/messages/notifications/${id}`, {
      method: "DELETE",
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getAllNotifications(userId);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const sendMessageNotification = (message_id, from) => {
    fetch(`${root_url}/api/messages/notifications/send`, {
      method: "POST",
      body: JSON.stringify({
        message_id,
        from,
      }),
      headers: {
        "Content-Type": "application/json",
        authorization: `Bearer ${userToken}`
      },
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setMessagesNotification([res.data, ...messagesNotification]);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };

  const isLoggedIn = () => {
    setIsLoading(true);
    fetch(`${root_url}/api/users/loggedInUser`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          getAllNotifications(res.data._id);
          setIsAuth(true);
        } else {
          setIsAuth(false);
        }
      })
      .catch((err) => {
        console.log(err, "err");
        setIsAuth(false);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  useEffect(() => {
    isLoggedIn();
  }, []);

  const getUser = () => {
    fetch(`${root_url}/api/users/loggedInUser`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setUserData(res.data);
          setEditData(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };

  const handleClick = async (id) => {
    await fetch(`${root_url}/api/posts/single/${id}`, {
      method: 'GET',
      headers: {
        authorization: `Bearer ${userToken}`
      }
    })
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setPostData(res.data);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
    setShowSinglePost(true);
  };

  const googleRequest = () => {
    const rootUrl = "https://accounts.google.com/o/oauth2/v2/auth";
    const redirect_uri = `https://ocialmedia.netlify.app/google_Oauth`;
    const client_id =
      "200704460983-v8rd6imcnmpumhqijgormivb1nnsd05s.apps.googleusercontent.com";
    const access_type = "offline";
    const response_type = "code";
    const prompt = "consent";
    const scope = [
      "https://www.googleapis.com/auth/userinfo.profile",
      "https://www.googleapis.com/auth/userinfo.email",
    ].join(" ");

    window.location = `${rootUrl}?redirect_uri=${redirect_uri}&client_id=${client_id}&access_type=${access_type}&response_type=${response_type}&prompt=${prompt}&scope=${scope}`;
  };
  return (
    <AuthContext.Provider
      value={{
        userToken,
        isAuth,
        isLoading,
        userData,
        editData,
        showSinglePost,
        postData,
        messagesNotification,
        generalNotifications,
        isLoggedIn,
        hasGeneralNotifications,
        setGeneralNotifications,
        getAllNotifications,
        deleteNotifications,
        setMessagesNotification,
        sendMessageNotification,
        handleClick,
        setShowSinglePost,
        setEditData,
        getUser,
        setIsAuth,
        googleRequest,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
