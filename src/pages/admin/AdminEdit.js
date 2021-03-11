import {useState, useEffect} from 'react'
import {useHistory, useParams} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Swal from 'sweetalert2'
import qs from 'qs'

const AdminEdit = () => {
    let history = useHistory()
    let {id} = useParams()
    const editURL = `${baseURL}/api/admin/edit/${id}`
    const roleApi = `${baseURL}/api/admin/role/all`
    const [resource, setResource] = useState({is_enabled:1})
    const [roles, setRoles] = useState([])
    useEffect(() => {
        httpRequest("get", roleApi).then((data) => {
            if (data.code == 0) {
                setRoles(data.data)
            }
        })
    }, [])

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
            Swal.fire({
                //data.msg,
                text: data.msg,
                icon:'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
            }).then(()=>{
                history.push("/admin/admin/index")
            })
        })
    }

    const Role = () => {
        return (
            roles.map((row, index) => {
                return <option value={row.id} key={index}>{row.name}</option>
            })
        )
    }

    return (
        <div className="grid-x  padding-1 shadow">                        
            <div className="cell">                                                          
                <form id="form" method="post" noValidate="novalidate">
                <div>
                    <label htmlFor="name" className="required">用户名</label>
                    <input type="text" id="username" name="username" required="required" defaultValue={resource.username} onChange={(e)=>handleChange(e)} />
                </div>
                <div>
                    <label htmlFor="name" className="required">密码</label>
                    <input type="text" id="password" name="password" required="required" onChange={(e)=>handleChange(e)}/>
                </div>
                <div>
                    <label htmlFor="role_id" className="required">分配角色</label>
                    <select id="role_id" name="role_id" onChange={(e)=>handleChange(e)} value={resource.role_id}>
                        <option value="">--请选择--</option>
                        <Role />
                    </select>
                </div>
                
                <div>
                    <label htmlFor="name" className="required">描述</label>
                    <textarea name="descript" id="descript" onChange={(e)=>handleChange(e)} value={resource.descript}></textarea>
                </div>
                <div>
                    <button type="button" id="submit" className="button small" onClick={()=>handleSubmit()}>提交</button>
                </div>
                </form>
            </div>
        </div>
    )
}

export default AdminEdit