import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from '../auth/AuthPage'
import PageNotFound from '../components/Common/PageNotFound'

const PublicRutes = (props) => {
  return (
    <Routes>
      <Route path='/login' element={ <AuthPage {...props}/>} />
      <Route path='/testing' element={ <AuthPage {...props}/>}/>
      <Route path='*' element={ <PageNotFound/>}/>
      <Route path='/' element={<Navigate to='/login'/>} />

    </Routes>
  )
}

export default PublicRutes