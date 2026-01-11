import { useEffect } from 'react';
import { useSelector, shallowEqual } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import AppRoute from './app/routes';

function App() {
  const navigate = useNavigate()
  const {token :auth} = useSelector((state) => state.auth, shallowEqual)

  useEffect(() => {
    if(!auth) navigate('/login') 
  }, [auth])

  return <AppRoute {...{auth}}/>
}

export default App;