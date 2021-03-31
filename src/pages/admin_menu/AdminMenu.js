import {useState, useEffect} from 'react'
import {Link, useHistory} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Switch from '../../components/Switch'
import Pagination from '../../components/Pagination'
import qs from 'qs'
import Swal from 'sweetalert2'
import {Routes} from '../../routes/Routes'

const AdminMenu = () => { 
    let history = useHistory()
    const addURL = "/admin/menu/add"
    const editURL = "/admin/menu/edit"  
    const menuActionsURL = "/admin/menu/edit/action"  
    const resourceURL = `${baseURL}/api/admin/menu/index` 
    const deleteURL = `${baseURL}/api/admin/menu/delete`
    const statusURL = `${baseURL}/api/admin/menu/status`
    const menuCheckApiURL = `${baseURL}/api/admin/menu/check` 
    const [resource, setResource] = useState([])
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
                })              
            }
        })         
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
            }).then(()=>{
                history.push("/admin/menu/index")
            })              
        })
    }

    const Item = () => {
        return (
            resource.map((row, index) => {
                return (
                    <tr className="text-center" key={index}>
                        <td>{row.name}</td>
                        <td>{row.sign}</td>
                        <td>{row.icon}</td>
                        <td>{row.sorted_by}</td>
                        <td>
                            <Switch id={row.id} active={row.is_enabled} url={statusURL} />
                        </td>
                        <td>
                            <Link to={`${editURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb href-edit"> <i className="fas fa-edit"></i> 编辑</Link>                             
                            <Link to={`${menuActionsURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb warning"> <i className="fas fa-eye"></i> 查看功能</Link>
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
                    <button className="button hollow success small check-action" type="button" onClick={()=>handleMenuCheck()}>
                        <i className="fas fa-check"></i>
                    检查更新菜单功能</button>                     
                    <a className="button info small float-right search">搜索</a>
                    
                    <hr />                                
                    
                    <div className="table-scroll">
                        <table className="hover border gray">
                            <thead>
                                <tr>                                                                             
                                    <th className="text-center">名称</th> 
                                    <th className="text-center">标识</th> 
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


export default AdminMenu