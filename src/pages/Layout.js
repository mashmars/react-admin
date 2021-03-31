
import '../foundation/css/foundation.min.css'
import '../foundation/admin/css/app.css'
import '../lib/fontawesome-5.8.2/css/all.css'
import avatar from '../foundation/admin/img/avatar.png'
import {
    BrowserRouter as Router,
    Switch,
    Route,
    useHistory,Redirect,
    Link
} from 'react-router-dom'

import Login from './security/Login'
import Dashboard from './dashboard/Dashboard'
import { SwitchRoute, Menu, Routes } from '../routes/Routes'
import {useState} from 'react'
import httpRequest, {baseURL} from '../utils/httpRequest'
import Swal from 'sweetalert2'
import Modal from '../components/Modal'
import {useSelector, useDispatch} from 'react-redux' 
import {clearJwt} from '../redux/reducers/jwtSlice'

const Component = () => {    
    const passwordURL = `${baseURL}/api/admin/password`
    const [formData, setFormData] = useState({
        old_password: '',
        password: '',
        password2: '',
    })
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        })
    }
    const handleSubmit = () => {
        httpRequest('post', passwordURL, formData).then((data) => {
            Swal.fire({
                text: data.msg,
                icon: data.code == 1 ? 'error' : 'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
            }).then(() => {
                setFormData({
                    old_password: '',
                    password: '',
                    password2: '',
                })
            })
        })
    }
    return (
      <div className="grid-padding-x">
        <div>
            <label htmlFor="name" className="required">原始密码</label>
            <input type="password" id="old_password" value={formData.old_password} onChange={(e) => handleChange(e)} />
        </div>
        <div>
            <label htmlFor="name" className="required">新密码</label>
            <input type="password" id="password" value={formData.password} onChange={(e) => handleChange(e)} />
        </div>
        <div>
            <label htmlFor="name" className="required">确认密码</label>
            <input type="password" id="password2" value={formData.password2} onChange={(e) => handleChange(e)} />
        </div>    
        <div>
            <button type="button" className="button small" onClick={()=>handleSubmit()}>提交</button>
        </div>
      </div>              
    )
}

const Layout = () => {
    const currentUser = useSelector(state => state.jwt.jwtToken.username)
  
    const dispatch = useDispatch()
    const history = useHistory();
    
    const menuCheckApiURL = `${baseURL}/api/admin/menu/check` 
    const [userMenu, setUserMenu] = useState(false)
    const [modalToggle, setModalToggle] = useState(false)
    const handleModalToggle = () => {
        setModalToggle(false)
    }
    const handleMenuCheck = () => {
        httpRequest('post', menuCheckApiURL, Routes).then((data)=>{
            Swal.fire({
                //data.msg,
                text: data.msg,
                icon:'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
            })
        })
    }

    const handleLogout = () => {
        dispatch(clearJwt())
        //history.push("/admin/action/index")
        //window.location.href="/admin/login"
    }

    return (
        <>
        <Router>
       
        {currentUser ?
        <div>
            {/** header menu*/}
            <div className="top-bar show-for-small-only">                    
                <div className="show-for-small-only">
                    <ul className="dropdown menu" data-dropdown-menu="data-dropdown-menu">                
                        <li className="is-action">
                            <a data-toggle="offCanvasLeft"><i className="fi-list-thumbnails"></i> </a>
                        </li>   
                        <li className="menu-text">后台管理系统</li>                                                   
                    </ul>
                </div>            
            </div>        
        
            {/** Set up Off-canvas */}
            <div className="off-canvas-wrapper">
                <div className="off-canvas-wrapper-inner" data-off-canvas-wrapper="data-off-canvas-wrapper">
                    <div className="off-canvas position-left" id="offCanvasLeft" data-off-canvas="data-off-canvas" style={{top:55 + 'px'}}>
                        {/** left off-canvas markup */}
                        <div className="cell large-2 medium-2" style={{backgroundColor:'#3c444d'}}>
                            <ul className="vertical menu accordion-menu left-menu-large" data-accordion-menu="data-accordion-menu"> 
                                <li>
                                    <a className="check-action" onClick={()=>handleMenuCheck()}><i className="fas fa-tasks"></i> 初始化菜单action</a>
                                </li>                                
                                <li>
                                    <a onClick={()=>setModalToggle(true)}><i className="fi fi-key"></i> 修改密码</a>
                                </li>
                            
                                <li>
                                    <a onClick={()=>handleLogout()}><i className="fi fi-power"></i>退出</a>
                                </li> 
                                
                                                                
                            </ul>
                        </div>
                    </div>
                    <div className="off-canvas position-right" id="offCanvasRight" data-off-canvas="data-off-canvas" data-position="right">
                        {/** right off-canvas markup */}
                    
                    </div>
                    <div className="off-canvas-content" data-off-canvas-content="data-off-canvas-content">
                        {/** page content */}
                    
                    </div>
                </div>
            </div>

            <nav className="hide-for-small-only">
                <div className="left">
                平台系统
                </div>
                <div className="hide-for-small-only right"  style={{width:200+'px', zIndex:101}}>                
                    <ul className="dropdown menu text-align" data-dropdown-menu="data-dropdown-menu"
                    onMouseOver={()=>setUserMenu(true)} onMouseOut={()=>setUserMenu(false)}>               
                        <li className="width-100">
                            <a><img src={avatar} width="20" style={{borderRadius: '50%'}} /> {currentUser || 'anonymous'}</a>
                            <ul className={`menu vertical user-menu ${userMenu ? 'show' : 'hide'}`} >
                                <li>
                                    <a onClick={()=>handleMenuCheck()}><i className="fas fa-tasks"></i> 初始化菜单action</a>
                                </li>
                            
                                <li>
                                    <a onClick={()=>setModalToggle(true)}><i className="fi fi-key"></i> 修改密码</a>
                                </li>                                
                                <li>
                                    <a onClick={()=>handleLogout()}><i className="fi fi-power"></i>退出</a>
                                </li> 
                            </ul>
                        </li>                    
                    </ul>
                </div>
            </nav>

            <div className="grid-x" style={{maxHeight: 'calc(100vh - 95px)', minHeight: 'calc(100vh - 95px)'}}>      
                <div className="cell large-2 left-sidebar hide-for-small-only" style={{overflowY:'scroll'}}>
                    {/** left menu */}
                    <aside className="">
                        <div className="grid-x">
                            <div className="cell" >                    
                                <ul className="vertical menu accordion-menu left-menu-large" data-accordion-menu>
                                    <li className="header"><i className="fas fa-tachometer-alt"></i> 主导航</li>
                                    {/**<li>
                                        <a className="parent"><i className="fas fa-users-cog"></i>权限管理</a>
                                        <ul className="menu vertical nested">
                                            <li><a data-router="admin.admin"><i className="far fa-file"></i>管理员管理</a></li>                                    
                                            <li><NavLink to="/admin/role/index"><i className="far fa-file"></i>角色管理</NavLink></li>                                    
                                            <li><a data-router="admin.admin_menu"><i className="far fa-file"></i>菜单管理</a></li>                                    
                                            <li><a data-router="admin.admin_action"><i className="far fa-file"></i>菜单功能管理</a></li>                                    
                                        </ul>
                                    </li>
                                    */}
                                    <Menu />                                                     
                                </ul>
                            </div>
                        </div>
                    </aside>
                    {/** left menu end */}
                </div>

                <div className="cell auto overflow-y-scroll">
                    {/** main body */}
                    <div className="grid-x main">
                        <div className="cell">
                            {/** breadcrumbs */}                               
                            <div className="grid-x " style={{position:'absolute', top:50, width:'100%', zIndex:100}}>
                                <div className="cell">                                
                                    <div className="callout callout-breadcrumbs" >
                                        <ul className="breadcrumbs">
                                        <li><Link to="/"><i className="fas fa-home"></i> 后台首页</Link></li>                                           
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            {/** breadcrumbs end */}
                            {/** content */}                        
                            <div style={{marginTop:'50px'}}>
                            <Switch>
                                <Route path="/" exact component={Dashboard} />
                                
                                <SwitchRoute />
                            </Switch>
                            </div>
                            {/** content end */}
                        </div>
                    
                    </div> 
                    
                    {/** footer */}
                    <div className="grid-x margin-top-3">
                        <div className="cell">
                            <footer className="main-footer width-100">
                                <div className="padding-left-1 padding-right-1">
                                    <b>Version</b> 6.5.3
                                    <strong>Copyright © 2019 <Link to="/">后台管理系统</Link>.</strong> All rights reserved.
                                </div>
                            </footer>
                        </div>
                    </div>
                    {/** footer end */}
                </div>
            
            </div>
            <Modal component={Component} toggle={modalToggle} handleModalToggle={handleModalToggle} />
        </div>
        : 
            <Redirect
            to={{
              pathname: "/admin/login",
            }}
          />
        
        }
    
        <div>
        <Switch>
        <Route path="/admin/login" exact component={Login} />
        </Switch>
        </div>
        </Router>
        
        </>
    )
}


export default Layout