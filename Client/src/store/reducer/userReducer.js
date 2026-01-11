import { createSlice } from '@reduxjs/toolkit'

const userReducer = createSlice({
    name: 'user',
    initialState: [],
    reducers: {
        userAdd(state, action) {
            state.push(action)
        }
    }

})

export const { userAdd } = userReducer.actions
export default userReducer.reducer 