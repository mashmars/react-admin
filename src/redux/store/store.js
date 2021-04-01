import {configureStore} from "@reduxjs/toolkit"
import jwtReducer from '../reducers/jwtSlice'
import authorizedReducer from '../reducers/authorizedSlice'


import storage from 'redux-persist/lib/storage'
import {combineReducers} from "redux"; 
import { persistReducer } from 'redux-persist'

const reducers = combineReducers({
    jwt: jwtReducer , 
    authorized: authorizedReducer,
    //todo add ...
});
const persistConfig = {
    key: 'root',
    storage
};
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
    reducer: persistedReducer    
});

store.subscribe(()=>console.log(store.getState()))

export default store;


/*
//由上面的reducers替换
const store = configureStore({
    reducer: {  //{} <=> persistedReducer
        jwt: jwtReducer,
        authorize: authorizeReducer,
    }
})


store.subscribe(()=>console.log(store.getState()))

export default store
*/