import { Routes, Route } from 'react-router-dom'
import { ForgotPassword } from '../pages/ForgotPassword'
import { Home } from '../pages/Home'
import { Login } from '../pages/Login'
import { NotFound } from '../pages/NotFound'
import { Signup } from '../pages/Signup'

export const AllRoutes = () => {
  return (
    <Routes>
        <Route path='/' element={<Home></Home>}></Route>
        <Route path='/accounts/login' element={<Login></Login>}></Route>
        <Route path='/accounts/signup' element={<Signup/>}></Route>
        <Route path='/accounts/forgotpassword' element={<ForgotPassword/>}></Route>
        <Route path='*' element={<NotFound></NotFound>}></Route>
    </Routes>
  )
}
