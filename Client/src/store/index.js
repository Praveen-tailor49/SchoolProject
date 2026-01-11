import { configureStore } from '@reduxjs/toolkit'
import  userReducer  from './reducer/userReducer'
import  authReducer  from './reducer/authReducer'


export const store = configureStore({
  reducer: {
    users: userReducer,
    auth: authReducer
  }
})