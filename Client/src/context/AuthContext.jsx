import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  api,
  getToken,
  setToken as storeToken,
  clearToken,
} from "../utils/api";
import { client_url, google_client_id } from "../utils/url";
import { useToast } from "./ToastContext";

export const AuthContext = createContext();

const EMPTY_EDIT = {
  full_name: "",
  bio: "",
  username: "",
  email: "",
  mobile_no: "",
};

export const AuthContextprovider = ({ children }) => {
  const toast = useToast();
  const [userToken, setUserToken] = useState(() => getToken());
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState({});
  const [showSinglePost, setShowSinglePost] = useState(false);
  const [postData, setPostData] = useState({});
  const [editData, setEditData] = useState(EMPTY_EDIT);
  const [messagesNotification, setMessagesNotification] = useState([]);
  // true = no unread notifications (drives the "invisible" prop of the badge)
  const [generalNotifications, setGeneralNotifications] = useState(true);

  const hasGeneralNotifications = useCallback(() => {
    api("/api/notifications/has")
      .then((res) => setGeneralNotifications(!res.success))
      .catch((err) => console.log(err, "error"));
  }, []);

  const getAllNotifications = useCallback((id) => {
    if (!id) return;
    api(`/api/messages/notifications/get/${id}`)
      .then((res) => {
        if (res.success) setMessagesNotification(res.data);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  const deleteNotifications = useCallback(
    (fromUserId, userId) => {
      api(`/api/messages/notifications/${fromUserId}`, { method: "DELETE" })
        .then((res) => {
          if (res.success) getAllNotifications(userId);
        })
        .catch((err) => console.log(err, "error"));
    },
    [getAllNotifications],
  );

  const sendMessageNotification = useCallback((message_id, from) => {
    api("/api/messages/notifications/send", {
      method: "POST",
      body: { message_id, from },
    })
      .then((res) => {
        if (res.success) setMessagesNotification((prev) => [res.data, ...prev]);
      })
      .catch((err) => console.log(err, "error"));
  }, []);

  /** Loads the logged-in user's profile into context. */
  const getUser = useCallback(() => {
    api("/api/users/loggedInUser")
      .then((res) => {
        if (res.success) {
          setUserData(res.data);
          setEditData({ ...EMPTY_EDIT, ...res.data });
        }
      })
      .catch((err) => console.log(err, "err"));
  }, []);

  /** Validates the stored token and loads the session. */
  const isLoggedIn = useCallback(() => {
    const token = getToken();
    setUserToken(token);
    if (!token) {
      setIsAuth(false);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    api("/api/users/loggedInUser", { token })
      .then((res) => {
        if (res.success) {
          setUserData(res.data);
          setEditData({ ...EMPTY_EDIT, ...res.data });
          getAllNotifications(res.data._id);
          setIsAuth(true);
        } else {
          clearToken();
          setUserToken(undefined);
          setIsAuth(false);
        }
      })
      .catch((err) => {
        console.log(err, "err");
        setIsAuth(false);
      })
      .finally(() => setIsLoading(false));
  }, [getAllNotifications]);

  useEffect(() => {
    isLoggedIn();
  }, [isLoggedIn]);

  /** Called after login / signup / OAuth with a fresh token. */
  const login = useCallback(
    (token) => {
      storeToken(token);
      setUserToken(token);
      setIsAuth(true);
      isLoggedIn();
    },
    [isLoggedIn],
  );

  const logout = useCallback(() => {
    clearToken();
    setUserToken(undefined);
    setIsAuth(false);
    setUserData({});
    setMessagesNotification([]);
  }, []);

  /** Opens the single-post dialog for a post id. */
  const handleClick = useCallback(async (id) => {
    try {
      const res = await api(`/api/posts/single/${id}`);
      if (res.success) {
        setPostData(res.data);
        setShowSinglePost(true);
      }
    } catch (err) {
      console.log(err, "error");
    }
  }, []);

  const googleRequest = useCallback(() => {
    if (!google_client_id) {
      toast.error("Google sign-in is not configured for this deployment.");
      return;
    }
    const params = new URLSearchParams({
      redirect_uri: `${client_url}/google_Oauth`,
      client_id: google_client_id,
      access_type: "offline",
      response_type: "code",
      prompt: "consent",
      scope: [
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/userinfo.email",
      ].join(" "),
    });
    window.location.assign(
      `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`,
    );
  }, [toast]);

  const value = useMemo(
    () => ({
      userToken,
      isAuth,
      isLoading,
      userData,
      editData,
      showSinglePost,
      postData,
      messagesNotification,
      generalNotifications,
      googleEnabled: Boolean(google_client_id),
      isLoggedIn,
      login,
      logout,
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
    }),
    [
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
      login,
      logout,
      hasGeneralNotifications,
      getAllNotifications,
      deleteNotifications,
      sendMessageNotification,
      handleClick,
      getUser,
      googleRequest,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
