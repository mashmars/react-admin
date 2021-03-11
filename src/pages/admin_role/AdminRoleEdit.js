import {useEffect, useState} from 'react'
import {
    useParams,
    useHistory
} from "react-router-dom";
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Swal from 'sweetalert2'
import qs from 'qs'

const AdminRoleEdit = () => {
    let { id } = useParams()
    let history = useHistory();
    const [resource, setResource] = useState({})   
    const editURL = `${baseURL}/api/admin/role/edit/${id}` 
    useEffect(()=>{
        httpRequest('get', editURL).then((data)=>{
            setResource(data.data)
        })
    }, [])

    const handleChange = (event) => {
        setResource({
            ...resource,
            [event.target.id]: event.target.value
        })
    }

    const handleSubmit = () => {
        httpRequest('post', editURL, qs.stringify(resource)).then((data)=>{
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
        })
    }

    return (
        <>
        <div className="grid-x  padding-1 shadow">           
            <div className="cell">                                                          
                <form id="form" method="post" noValidate="novalidate">
                    <div>
                        <label htmlFor="name" className="required">角色名称</label>
                        <input type="text" id="name" name="name" required="required" defaultValue={resource.name} 
                        onChange={(e)=>handleChange(e)} />
                    </div>
                    
                    <div>
                        <fieldset className="large-5 cell">
                            <legend>状态</legend>
                            <input type="radio" name="is_enabled" defaultValue="1" id="is_enabled_1" checked={resource.is_enabled ? true : false}
                            onChange={()=>{setResource({...resource, is_enabled:1})}}
                            /><label htmlFor="is_enabled_1">启用</label>
                            <input type="radio" name="is_enabled" defaultValue="0" id="is_enabled_0" checked={resource.is_enabled ? false : true}
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

export default AdminRoleEdit