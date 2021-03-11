import {configureStore} from "@reduxjs/toolkit"
import jwtReducer from '../reducers/jwtSlice'

const store = configureStore({
    reducer: {
        jwt: jwtReducer,
    }
})

store.subscribe(()=>console.log(store.getState()))

export default store