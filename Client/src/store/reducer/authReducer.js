import { createSlice } from "@reduxjs/toolkit";

const initialState ={
    token: localStorage.getItem('token') ?? false
}

const authReducer = createSlice({
    name:'auth',
    initialState:initialState,
    reducers:{
        updateAuth(state, action){
            state.token=action;
        }
    }
})

export const {updateAuth} = authReducer.actions
export default authReducer.reducer