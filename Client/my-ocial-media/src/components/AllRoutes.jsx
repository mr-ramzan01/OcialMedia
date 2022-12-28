import { Routes, Route } from 'react-router-dom'
import { CreateNewPassword } from '../pages/CreateNewPassword'
import { Explore } from '../pages/Explore'
import { ForgotPassword } from '../pages/ForgotPassword'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { Messages } from '../pages/Messages'
import { NotFound } from '../pages/NotFound'
import { Notifications } from '../pages/Notifications'
import { Profile } from '../pages/Profile'
import { Search } from '../pages/Search'
import { Settings } from '../pages/Settings'
import { Signup } from '../pages/Signup'
import { GoogleOauth } from './GoogleOauth'
import { PrivateRoute } from './PrivateRoute'

export const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>}></Route>
        <Route path='/accounts/login' element={<Login/>}></Route>
        <Route path='/accounts/signup' element={<Signup/>}></Route>
        <Route path='/accounts/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/google_Oauth' element={<GoogleOauth/>}></Route>
        <Route path='/accounts/forgot-password/create-new-password' element={<CreateNewPassword/>}></Route>
        <Route path='/explore' element={<PrivateRoute><Explore/></PrivateRoute>}></Route>
        <Route path='/search' element={<PrivateRoute><Search/></PrivateRoute>}></Route>
        <Route path='/messages' element={<PrivateRoute><Messages/></PrivateRoute>}></Route>
        <Route path='/notifications' element={<PrivateRoute><Notifications/></PrivateRoute>}></Route>
        <Route path='/profile' element={<PrivateRoute><Profile/></PrivateRoute>}></Route>
        <Route path='/settings' element={<PrivateRoute><Settings/></PrivateRoute>}></Route>
        <Route path='*' element={<NotFound/>}></Route>
    </Routes>
  )
}
