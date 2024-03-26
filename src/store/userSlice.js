import {createSlice} from "@reduxjs/toolkit";


const initialState = {
    userCred : null
}
export const userSlice = createSlice({
    name : "user",
    initialState,
    reducers : {
        login : (state, action)=>{
            state.userCred = action.payload
        },
        logout  : (state)=>{
            state.userCred = null
        },
        
    }
})

export const {login, logout} = userSlice.actions;