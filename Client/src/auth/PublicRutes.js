import { Routes, Route, Navigate } from 'react-router-dom'
import AuthPage from './AuthPage'
import PageNotFound from '../components/Common/PageNotFound'

const PublicRutes = ({navigate}) => {
  return (
    <Routes>
      <Route path='/login' element={ <AuthPage {...{navigate}}/>} />
      <Route path='/testing' element={ <AuthPage {...{navigate}}/>}/>
      <Route path='*' element={ <PageNotFound/>}/>
      <Route path='/' element={<Navigate to='/login'/>} />

    </Routes>
  )
}

export default PublicRutes