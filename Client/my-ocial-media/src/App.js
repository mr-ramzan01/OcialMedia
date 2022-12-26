import { useContext, useEffect, useState } from 'react';
import './App.css';
import { AllRoutes } from './components/AllRoutes';
import { AuthContext } from './context/AuthContext';

function App() {
  // const {setIsAuth} = useContext(AuthContext);
  // const [loggedIn, setLoggedIn] = useState(false);
  // useEffect(() => {
  //   fetch('/users/loggedInUser')
  //   .then((res) => res.json()) 
  //   .then((res) => {
  //       if(res.success) {
  //           setLoggedIn(true);
  //       }
  //       console.log(res, 'res')
  //   })
  //   .catch((err) => {
  //       console.log(err, 'err');
  //       setLoggedIn(false);
  //   })
  // },[])
  return (
    <div className="App">
      <AllRoutes/>
    </div>
  );
}

export default App;
