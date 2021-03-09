import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Swal from 'sweetalert2'
import qs from 'qs'

const AdminActionEdit = () => {
    let history = useHistory()
    let {id} = useParams()
    const editURL = `${baseURL}/api/admin/action/edit/${id}`    
    const [resource, setResource] = useState({is_enabled:1})

    useEffect(() => {
        httpRequest("get", editURL).then((data) => {
            if (data.code == 0) {
                setResource(data.data)
            }
        })
    }, [])

    const handleChange = (event) => {
        setResource({
            ...resource,
            [event.target.id]:event.target.value,
        })
    }

    const handleSubmit = () => {
        httpRequest("post", editURL, qs.stringify(resource)).then((data)=>{
            if (data.code == 0) {
                Swal.fire({
                    //data.msg,
                    text: data.msg,
                    icon:'success',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                }).then(()=>{
                    history.push("/admin/action/index")
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
        <div className="grid-x  padding-1 shadow">                        
            <div className="cell">                                                          
                <form id="form" method="post" noValidate="novalidate">
                <div>
                    <label for="name" class="required">路由名称</label>
                    <input type="text" id="name" name="name" required="required" defaultValue={resource.name} onChange={(e)=>handleChange(e)}/>
                </div>                    
                <div>
                    <label for="icon" class="required">图标</label>
                    <input type="text" id="icon" name="icon" required="required" defaultValue={resource.icon} onChange={(e)=>handleChange(e)}/>
                </div> 
                <div>
                    <label for="sorted_by" class="required">排序</label>
                    <input type="text" id="sorted_by" name="sorted_by" required="required"  defaultValue={resource.sorted_by} onChange={(e)=>handleChange(e)}/>
                    <p class="help-text">值越小越靠前</p>
                </div> 
                
                <div>
                    <fieldset class="large-5 cell">
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
    )
}

export default AdminActionEdit