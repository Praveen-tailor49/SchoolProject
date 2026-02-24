import { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import AppRoute from './app/routes';
import { LanguageProvider } from './app/contexts/LanguageContext';

function App() {
  const navigate = useNavigate()
  const {token :auth} = useSelector((state) => state.auth, shallowEqual)

  useEffect(() => {
    if(!auth) navigate('/login') 
  }, [auth])

  return (
    <LanguageProvider>
      <AppRoute {...{auth}}/>
    </LanguageProvider>
  )
}

export default App;