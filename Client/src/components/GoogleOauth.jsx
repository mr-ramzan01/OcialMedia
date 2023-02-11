import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { Loader } from "./Loader";
import { root_url } from "../utils/url";

export const GoogleOauth = () => {
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const { setIsAuth } = useContext(AuthContext);

  useEffect(() => {
    fetch(`${root_url}/api/users/google_Oauth?code=${params.get("code")}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setIsAuth(true);
          navigate("/");
        } else if (
          res.message === "User already exists with email and password"
        ) {
          alert(res.message);
          navigate("/accounts/login");
        } else {
          alert("Internal Error, please try again later!");
          navigate("/accounts/login");
        }
      })
      .catch((err) => {
        console.log(err, "err");
        alert("Internal Error, please try again later!");
        navigate("/accounts/login");
      });
  }, []);
  return <Loader />;
};
