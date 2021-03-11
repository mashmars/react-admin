import {useEffect, useState} from 'react'
import {Link, Switch as SwitchRouter} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Switch  from '../../components/Switch'
import qs from 'qs'
import Swal from 'sweetalert2'


const AdminRole = () => {
    const addURL = "/admin/role/add"
    const editURL = "/admin/role/edit"
    const authURL = "/admin/role/auth"
    const resourceURL = `${baseURL}/api/admin/role/index`
    const deleteURL = `${baseURL}/api/admin/role/delete`
    const statusURL = `${baseURL}/api/admin/role/status`       
    const [resource, setResource] = useState([])
    useEffect(() => {
        httpRequest('get', resourceURL).then((data) => {
            setResource(data.data)
        })          
    }, [])

    const handleDelete = (id) => {
        Swal.fire({
            //title: '是否确认删除?',
            text: "是否确认删除?",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '确认删除',
            cancelButtonText: '取消',
          }).then((result) => {
            if (result.isConfirmed) {
                httpRequest('post', deleteURL, qs.stringify({id:id})).then((data)=>{
                    const resourceDiff = resource.filter((v)=>{
                        if (v.id != id) return true
                    })
                    setResource(resourceDiff)
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
        })       
    }
    
    const Item = () => {
        return (
            resource.map((row, index) => {
                return (
                    <tr className="text-center" key={index}>
                        <td>{row.name}</td>
                        <td>
                            <Switch id={row.id} active={row.is_enabled} url={statusURL} />
                        </td>
                        <td>
                           <Link to={`${editURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb"> <i className="fas fa-edit"></i> 编辑</Link>                       
                           <Link to={`${authURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb"> <i className="fas fa-edit"></i> 角色授权</Link>                       
                            <button className="hollow button small alert margin-bottom-0 padding-tb ajax-delete" onClick={()=>handleDelete(row.id)}>
                                <i className="far fa-trash-alt"></i>
                                删除</button>
                        </td>
                    </tr>
                )
            })
        )
    }
    
    return (
        <>       
        <div className="grid-x padding-1 shadow">
            <div className="cell">
                <SwitchRouter>
                <Link to={addURL} className="button hollow primary small"><i className="fas fa-plus"></i>添加</Link></SwitchRouter>
                <a href="/#" className="button info small float-right search">搜索</a>
                <div id="search" className="clearfix">
                    <form action="" method="get" id="form-search">
                        <div className="grid-x grid-padding-x">                                       
                            <div className="large-1 small-3 cell">
                                <label htmfor="" className="text-right middle">编号:</label>
                            </div>
                            <div className="large-2 small-9 cell">
                                <input type="text" id="" name="" placeholder="" defaultValue="" />
                            </div> 
                            <div className="large-1 small-3 cell">
                                <label htmfor="" className="text-right middle">下拉框:</label>
                            </div>
                            <div className="large-2 small-9 cell">
                                <select name="" id="">
                                    <option defaultValue="">全部</option>                                                    
                                </select>
                            </div> 
                            <div className="large-1 small-3 cell">
                                <label htmfor="" className="text-right middle">输入框:</label>
                            </div>
                            <div className="large-1 small-9 cell">
                                <input type="text" id="" name="" placeholder="年份" defaultValue="" />
                            </div>                                            
                            <div className="large-2 small-12 cell">
                                <button type="button" className="button alert hollow margin-bottom-0 padding-tb small" id="button-search"><i className="fas fa-search"></i> 查询</button>
                            </div>                                                                        
                        </div>                        
                    </form>
                </div>               
                <hr />    
              
                <div className="table-scroll">
                    <table className="hover border gray">
                        <thead>
                            <tr>                                  
                                <th className="text-center">角色</th> 
                                <th className="text-center">状态</th>
                                <th className="text-center">操作</th>
                            </tr>
                        </thead>
                        <tbody id="tbody">  
                            <Item />             
                        </tbody>
                    </table>
                </div>
                                                                    
            </div>
        </div>
        {/** pagination */}
        <div className="grid-x margin-top-2 align-center"></div>
        </>
    )
}


export default AdminRole