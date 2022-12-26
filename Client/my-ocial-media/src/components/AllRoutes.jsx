import { Routes, Route } from 'react-router-dom'
import { CreateNewPassword } from '../pages/CreateNewPassword'
import { ForgotPassword } from '../pages/ForgotPassword'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import { Signup } from '../pages/Signup'
import { PrivateRoute } from './PrivateRoute'

export const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<PrivateRoute><Home/></PrivateRoute>}></Route>
        <Route path='/accounts/login' element={<Login></Login>}></Route>
        <Route path='/accounts/signup' element={<Signup/>}></Route>
        <Route path='/accounts/forgot-password' element={<ForgotPassword/>}></Route>
        <Route path='/accounts/forgot-password/create-new-password' element={<CreateNewPassword/>}></Route>
        <Route path='*' element={<NotFound></NotFound>}></Route>
    </Routes>
  )
}
