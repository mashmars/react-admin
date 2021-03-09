import admin from '../../foundation/admin/img/admin.png'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import Swal from 'sweetalert2'

const Login = () => {   
    let history = useHistory()
    const loginURL = `${baseURL}/api/admin/login`;
    const [formData, setFormData] = useState({
        username: '',
        password: ''
    })
    const handleChange = (event) => {
        setFormData({
            ...formData,
            [event.target.id]: event.target.value
        })
    }
    const handleSubmit = () => {
        httpRequest('post', loginURL, formData).then(data => {
            if (data.code == 0) {
                Swal.fire({
                    //data.msg,
                    text: data.msg,
                    icon:'success',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                }).then(()=>{
                    history.push("/admin")
                })
            } else {
                Swal.fire({
                    //data.msg,
                    text: data.msg,
                    icon:'error',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                })
            }
        })
    }

    return (
        <>
        <div className="grid-container">
            <div className="gird-x grid-margin-x" style={{marginTop: 8 + 'rem'}}>            
               
                <div className="cell">
                    <div className="alert callout" data-closable="slide-out-right">                   
                        <p>本后台系统view层是使用react框架， go提供api服务， go使用jwt验证权限，redux(Todo)存储当前jwt管理登陆登出</p>  
                    </div>
                </div>
                         
                <div className="cell">                
                    <form className="callout text-center"  action="" method="POST" style={{opacity: 0.7, background:'#709f7b'}}>
                        
                    <div className="text-center margin-bottom-1">
                        <img src={admin} />
                    </div>
                        <p className="lead" style={{color:'#f5f5f5'}}>欢迎使用平台管理系统</p>
                        <div className="floated-label-wrapper">
                            <label htmlFor="username">用户名</label>
                            <input type="text" id="username" name="username" placeholder="请输入登录用户名" value={formData.username} onChange={(e)=>handleChange(e)} />                        
                        </div>                    
                        <div className="floated-label-wrapper">
                            <label htmlFor="password">密码</label>
                            <input type="password" id="password" name="password" placeholder="请输入登录密码" value={formData.password} onChange={(e)=>handleChange(e)}/>
                        </div>                        
                        <button className="button expanded" type="button" id="login" onClick={()=>handleSubmit()}>登录</button>
                        <div className="text-left">
                            <input type="checkbox" id="remember_me" name="_remember_me" />   
                            <label htmlFor="remember_me">记住密码</label>
                        </div>
                    </form>                  
                </div>
            </div>
        </div>
        </>
    )
}

export default Login