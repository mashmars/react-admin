import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    jwtToken: {}
}

const jwtSlice = createSlice({
    name: "jwt", //通过调用 state.jwt[.jwtToken] 获取
    initialState,
    reducers: {
        createJwt(state, action) {
            state.jwtToken = action.payload
        },
        clearJwt(state, action) {
            state.jwtToken = {}
        }
    }
})

export const {createJwt, clearJwt} = jwtSlice.actions
export default jwtSlice.reducer