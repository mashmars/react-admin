import {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Switch from '../../components/Switch'
import Pagination from '../../components/Pagination'
import qs from 'qs'
import Swal from 'sweetalert2'

const AdminAction = () => { 
    let history = useHistory()
    const editURL = "/admin/action/edit"  
    const actionApiURL = "/admin/action/api"  
    const resourceURL = `${baseURL}/api/admin/action/index` 
    const deleteURL = `${baseURL}/api/admin/action/delete`
    const statusURL = `${baseURL}/api/admin/action/status`
    const menusApiURL = `${baseURL}/api/admin/menu/all` 
    const setMenuURL = baseURL + "/api/admin/action/menu"
    const [resource, setResource] = useState([])
    const [menus, setMenus] = useState([])

    const [totalPage, setTotalPage] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [searchForm, setSearchForm] = useState({
        name: "",
        is_enabled: '',
        page: 1,
        pageSize: 10,
    })

    const paginateRequest = (url) => { 
        httpRequest('get', url, searchForm).then((data) => {
            setResource(data.data)
            setTotalPage(data.totalPage)
        })
    }
    useEffect(() => paginateRequest(resourceURL), [currentPage])
    useEffect(() => {
        httpRequest('get', menusApiURL).then((data) => {
            setMenus(data.data)
        })
    }, [])  

    const handleSearchChange = (event) => {
        setSearchForm({
            ...searchForm,
            [event.target.id]: event.target.value,
        })
    }    
    const handleSearchSubmit = () => handleCurrentPageChange(currentPage == 1 ? 0 : 1) //you known why
    const handleCurrentPageChange = (page) => {        
        //目前两个都必须 
        setSearchForm({
            ...searchForm,
            page: page
        })
        setCurrentPage(page) 
    }   

    const [ids, setIds] = useState([])
    const [menu, setMenu] = useState()

    const handleIdCheck = (event) => {
        let data = ids
        if (event.target.checked ) {
            data.push(Number(event.target.value))
        } else {
            data = data.filter((id) => {           
                return id != Number(event.target.value)
            })           
        }
        setIds(data)
    }

    const handleIdsCheck = (event) => {
        let data = []
        if (event.target.checked) {
            document.querySelectorAll('.checkbox-id').forEach((node) => {
                data.push(Number(node.attributes['value'].nodeValue))
            })
        } else {
            data = []
        }
        setIds(data)
    }
    
    const handleMenu = (event) => {
        setMenu(event.target.value)
    }

    const handleMenuSet = () => {
        httpRequest('post', setMenuURL, {menu:menu, ids:ids}).then((data) => {
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
        })
    }
    

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
                    if (data.code == 0) {
                        const resourceDiff = resource.filter((row)=>{
                            if (row.id != id) return true
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
                    } else {
                        Swal.fire({
                            //data.msg,
                            text: data.msg,
                            icon:'info',
                            timer: 2000,
                            showConfirmButton: false,
                            position: 'top-end',
                        })
                    }
                })              
            }
        })         
    }

    const Item = () => {
        return (
            resource.map((row, index) => {
                return (
                    <tr className="text-center" key={index}>
                        <td><input type="checkbox" className="checkbox-id" value={row.id} onChange={(e)=>handleIdCheck(e)} defaultChecked={ids.includes(row.id)} /></td>
                        <td>{row.menu_name}</td>
                        <td>{row.name}</td>
                        <td>{row.router_name}</td>
                        <td>{row.router_short_name}</td>
                        <td><label className={`label ${row.is_sub_menu ? "success" : "alert"}`}>{row.is_sub_menu ? "是" : "否"}</label></td>
                        <td><i className={row.icon}></i></td>
                        <td>{row.sorted_by}</td>
                        <td>
                            <Switch id={row.id} active={row.is_enabled} url={statusURL} />
                        </td>
                        <td>
                            <Link to={`${editURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb"> <i className="fas fa-edit"></i> 编辑</Link>
                            <Link to={`${actionApiURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb warning"> <i className="fas fa-eye"></i> 设置api</Link>
                            <button className="hollow button small alert margin-bottom-0 padding-tb ajax-delete" onClick={()=>handleDelete(row.id)}>
                                <i className="far fa-trash-alt"></i>
                                删除</button>
                        </td>
                    </tr>
                )
            })
        )
    }

    const MenuItem = () => {
        return (
            menus.map((menu, index)=> {
                return <option value={menu.id} key={index}>{menu.name}</option>
            })
        )
    }

    return (
        <>
            <div className="grid-x padding-1 shadow">
                <div className="cell">                                         
                    <a className="button info small float-right search">搜索</a>
                    
                    <hr />                                
                    
                    <div className="grid-x grid-padding-x">                                       
                        <div className="large-1 small-4 cell">
                            <label htmlFor="start_date" className="text-right middle">选择菜单:</label>
                        </div>
                        <div className="large-2 small-8 cell">
                        <select id="menu" onChange={(e)=>handleMenu(e)} value={menu}>
                            <option value="">--请选择--</option>
                            <MenuItem />
                        </select>               
                        </div>    
                        <div className="large-1 small-4 cell">
                            <button type="button" className="button warning  hollow  margin-bottom-0 padding-tb small" onClick={()=>handleMenuSet()}><i className="fi-folder"></i> 设置菜单</button>               
                        </div>                                                                               
                                                                                                      
                    </div>  
                    <div className="table-scroll">
                        <table className="hover border gray">
                            <thead>
                                <tr>                                                                             
                                    <th className="text-center"><input type="checkbox" onChange={(e)=>handleIdsCheck(e)} /></th>
                                    <th className="text-center">菜单名称</th>
                                    <th className="text-center">功能名称</th>
                                    <th className="text-center">路由全称</th>
                                    <th className="text-center">路由简称</th>
                                    <th className="text-center">是否子菜单</th>
                                    <th className="text-center">图标</th>
                                    <th className="text-center">排序</th>
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
            <div className="grid-x margin-top-2 align-center">
            <Pagination                
                totalPage={totalPage} 
                currentPage={currentPage} 
                handleCurrentPageChange={(page)=>handleCurrentPageChange(page)}
            />
            </div>
        </>
    )
}


export default AdminAction