import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import { Loader } from './Loader';

export const GoogleOauth = () => {
    const navigate = useNavigate();
    const params = new URLSearchParams(window.location.search);



    useEffect(() => {
        fetch(`/users/google_Oauth?code=${params.get('code')}`)
        .then((res) => res.json())
        .then((res) => {
            if(res.success) {
                navigate('/');
            }
            else if(res.message === 'User already exists with email and password') {
                alert(res.message);
                navigate('/accounts/login');
            }
            else {
                alert("Internal Error, please try again later!");
                navigate('/accounts/login');
            }
        })
        .catch((err) => {
            console.log(err, 'err');
            alert("Internal Error, please try again later!")
            navigate('/accounts/login');
        })
    },[])
  return (
    <Loader/>
  )
}
