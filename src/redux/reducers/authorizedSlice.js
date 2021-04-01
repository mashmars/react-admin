import {createSlice} from '@reduxjs/toolkit'

const initialState = {
    /*roleMenus: [],      //已经授权的菜单
    roleActions: [],    //已经授权的操作
    roleApis: [],       //已经授权的api
    */
    authorized: {}
}

const authorizedSlice = createSlice({
    name: "authorized", //通过调用 state.authorize[.roleMenus] 获取
    initialState,
    reducers: {
        grantPrivilege(state, action) {
            state.authorized.roleMenus = action.payload.roleMenus ?? []
            state.authorized.roleActions = action.payload.roleActions ?? []
            state.authorized.roleApis = action.payload.roleApis ?? []
        },
        revokePrivilege(state, action) {
            state.authorized.roleMenus = []
            state.authorized.roleActions = []
            state.authorized.roleApis = []
        }
    }
})

export const {grantPrivilege, revokePrivilege} = authorizedSlice.actions
export default authorizedSlice.reducer