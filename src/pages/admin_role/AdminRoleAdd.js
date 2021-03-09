import {useState} from 'react'
import {useHistory} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Swal from 'sweetalert2'

const AdminRoleAdd = () => {
    let history = useHistory()    
    const addURL = `${baseURL}/api/admin/role/add`
    const [resource, setResource] = useState({})
    const handleChange = (event) => {
        setResource({
            ...resource,
            [event.target.id]: event.target.value
        })
    }
    const handleSubmit = () => {
        httpRequest("post", addURL, resource).then((data) => {
            if (data.code == 0) {
                Swal.fire({
                    //data.msg,
                    text: data.msg,
                    icon:'success',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                }).then(()=>{
                    history.push("/admin/role/index")
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
        <div className="grid-x  padding-1 shadow">
            <div className="cell">                                                          
                <form id="form" method="post" novalidate="noValidate">
                    <div>
                        <label htmlFor="name" className="required">角色名称</label>
                        <input type="text" id="name" name="name" required="required" onChange={(e)=>handleChange(e)}/>
                    </div>    
                    <div>
                        <fieldset className="large-5 cell">
                            <legend>状态</legend>
                            <input type="radio" name="is_enabled" defaultValue="1" id="is_enabled_1" checked
                             onChange={()=>{setResource({...resource, is_enabled:1})}}
                            /><label htmlFor="is_enabled_1">启用</label>
                            <input type="radio" name="is_enabled" defaultValue="0" id="is_enabled_0"
                             onChange={()=>{setResource({...resource, is_enabled:0})}}
                            /><label htmlFor="is_enabled_0">禁用</label>
                        </fieldset>
                    </div>                            
                    <div>
                        <button type="button" id="submit" className="button small" onClick={()=>handleSubmit()}>提交</button>
                    </div>
                </form>
            </div>
        </div>
        </>
    )
}

export default AdminRoleAdd