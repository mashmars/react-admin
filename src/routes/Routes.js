import AdminRole from '../pages/admin_role/AdminRole'
import AdminRoleAdd from '../pages/admin_role/AdminRoleAdd'
import AdminRoleEdit from '../pages/admin_role/AdminRoleEdit'
import AdminRoleAuth from '../pages/admin_role/AdminRoleAuth'

import Admin from '../pages/admin/Admin'
import AdminAdd from '../pages/admin/AdminAdd'
import AdminEdit from '../pages/admin/AdminEdit'

import AdminMenu from '../pages/admin_menu/AdminMenu'
import AdminMenuEdit from '../pages/admin_menu/AdminMenuEdit'
import AdminMenuAction from '../pages/admin_menu/AdminMenuAction'

import AdminAction from '../pages/admin_action/AdminAction'
import AdminActionEdit from '../pages/admin_action/AdminActionEdit'
import AdminActionApi from '../pages/admin_action/AdminActionApi'

import {
    Route,
    Link,
    NavLink,
    Router
} from 'react-router-dom'
import {useState} from 'react'
import {useSelector} from 'react-redux'

const Routes = [
    {
        menuName: "权限管理",
        sign: 'auth',
        subRoutes: [
            {
                name: "角色列表",
                path: "/admin/role/index",
                prefix: "/admin/role",
                component: AdminRole,
                exact: true,
                subMenu: true, // 是否是子菜单， true是左侧菜单  false是页面内部菜单 
                subMenus:[
                    {
                        name: "角色新增",
                        path: "/admin/role/add",
                        component: AdminRoleAdd,
                        exact: true,
                        subMenu: false,  
                    },
                    {
                        name: "角色编辑",
                        path: "/admin/role/edit/:id",
                        component: AdminRoleEdit,
                        exact: true,
                        subMenu: false,  
                    },
                    {
                        name: "角色授权",
                        path: "/admin/role/auth/:id",
                        component: AdminRoleAuth,
                        exact: true,
                        subMenu: false,  
                    },
                ]
            },
            {
                name: "管理员列表",
                path: "/admin/admin/index",
                prefix: "/admin/admin",
                component: Admin,
                exact: true,
                subMenu: true, // 是否是子菜单， true是左侧菜单  false是页面内部菜单 
                subMenus:[
                    {
                        name: "管理员新增",
                        path: "/admin/admin/add",
                        component: AdminAdd,
                        exact: true,
                        subMenu: false,  
                    },
                    {
                        name: "管理员编辑",
                        path: "/admin/admin/edit/:id",
                        component: AdminEdit,
                        exact: true,
                        subMenu: false,  
                    },
                ]
            },
            {
                name: "菜单列表",
                path: "/admin/menu/index",
                prefix: "/admin/menu",
                component: AdminMenu,
                exact: true,
                subMenu: true, // 是否是子菜单， true是左侧菜单  false是页面内部菜单 
                subMenus:[                    
                    {
                        name: "菜单编辑",
                        path: "/admin/menu/edit/:id",
                        component: AdminMenuEdit,
                        exact: true,
                        subMenu: false,  
                    },
                    {
                        name: "查看功能",
                        path: "/admin/menu/edit/action/:id",
                        component: AdminMenuAction,
                        exact: true,
                        subMenu: false,  
                    },
                ]
            },
            {
                name: "菜单功能列表",
                path: "/admin/action/index",
                prefix: "/admin/action",
                component: AdminAction,
                exact: true,
                subMenu: true, // 是否是子菜单， true是左侧菜单  false是页面内部菜单 
                subMenus:[                    
                    {
                        name: "菜单功能编辑",
                        path: "/admin/action/edit/:id",
                        component: AdminActionEdit,
                        exact: true,
                        subMenu: false,  
                    },
                    {
                        name: "设置api",
                        path: "/admin/action/api/:id",
                        component: AdminActionApi,
                        exact: true,
                        subMenu: false,  
                    },
                ]
            },
        ]
    },
    {
        menuName: "系统管理",
        sign: 'system',
        subRoutes: []
    },
]


const Menu = () => {
    const authorized = useSelector((state) => state.authorized.authorized)
    const [leftSubMenu, setLeftSubMenu] = useState('none')
    return (
        <>
        {
            Routes.map((route, index) => {
                //一级菜单
                let isAuthorized = false
                for (let authorizedMenu of authorized.roleMenus) {
                    if (authorizedMenu.sign == route.sign) {
                        isAuthorized = true
                        break;
                    }
                }
                if (!isAuthorized) return

                return (
                    <li key={index}>                    
                    <Link to="#" className="parent" onClick={()=>setLeftSubMenu(leftSubMenu == 'block' ? 'none' : 'block')}><i className="fas fa-users-cog"></i>{route.menuName}</Link>
                        <ul className="menu vertical nested" style={{ display: `${leftSubMenu}` }}>                                 
                            {
                                route.subRoutes.map((subRoute, key) => {
                                    //二级菜单
                                    let isAuthorized = false
                                    for (let authorizedAction of authorized.roleActions) {
                                        if (authorizedAction.router_name == subRoute.path) {
                                            isAuthorized = true
                                            break;
                                        }
                                    }                    
                                    if (!isAuthorized) return

                                    return (
                                        <li key={key}>
                                            <NavLink to={subRoute.path} exact={subRoute.exact}
                                            isActive={(match, location) => {
                                                if (!location.pathname.startsWith(subRoute.prefix)) {
                                                    return false
                                                }
                                                return true
                                            }}
                                            ><i className="far fa-file"></i>{subRoute.name}
                                            </NavLink>
                                        </li>   
                                    )
                                })
                            }
                        </ul>
                    </li>
                )
            })
        }
        </>
    )
}


const SwitchRoute = () => {
    const authorized = useSelector((state) => state.authorized.authorized)
    return (
        <>
        {
            Routes.map((route, index) => {               
                return route.subRoutes.map((subRoute, key) => {   
                    //没有权限的都不给route
                    let isAuthorized = false
                    for (let authorizedAction of authorized.roleActions) {
                        if (authorizedAction.router_name == subRoute.path) {
                            isAuthorized = true
                            break;
                        }
                    }                    
                    if (!isAuthorized) return
                     
                    let routes = []
                    let route = subRoute.subMenus.map((subMenu, index) => {
                        return <Route key={index} path={subMenu.path} component={subMenu.component} exact={subMenu.exact} />
                    })
                    routes.push(route)
                    routes.push(<Route key={key} path={subRoute.path} component={subRoute.component} exact={subRoute.exact} />)
                  
                    return routes
                })
            })
        }
        </>
    )
}

export {SwitchRoute, Menu, Routes}