import { useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "./Loader";
import { api } from "../utils/api";
import { useToast } from "../context/ToastContext";

export const GoogleOauth = () => {
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);
  const toast = useToast();
  const started = useRef(false);

  useEffect(() => {
    // The code can only be exchanged once; guard against StrictMode double-invoke.
    if (started.current) return;
    started.current = true;

    const code = new URLSearchParams(window.location.search).get("code");
    if (!code) {
      navigate("/accounts/login", { replace: true });
      return;
    }

    api(`/api/users/google_Oauth?code=${encodeURIComponent(code)}`, {
      token: null,
    })
      .then((res) => {
        if (res.success) {
          login(res.token);
          navigate("/", { replace: true });
        } else if (
          res.message === "User already exists with email and password"
        ) {
          toast.error(res.message);
          navigate("/accounts/login", { replace: true });
        } else {
          toast.error(res.message || "Internal Error, please try again later!");
          navigate("/accounts/login", { replace: true });
        }
      })
      .catch((err) => {
        console.log(err, "err");
        toast.error("Internal Error, please try again later!");
        navigate("/accounts/login", { replace: true });
      });
  }, [login, navigate, toast]);

  return <Loader />;
};
