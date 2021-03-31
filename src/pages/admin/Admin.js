import {useState, useEffect} from 'react'
import {Link} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Switch from '../../components/Switch'
import Pagination from '../../components/Pagination'
import qs from 'qs'
import Swal from 'sweetalert2'

const Admin = () => { 
    const addURL = "/admin/admin/add"
    const editURL = "/admin/admin/edit"  
    const resourceURL = `${baseURL}/api/admin/index` 
    const deleteURL = `${baseURL}/api/admin/delete`
    const statusURL = `${baseURL}/api/admin/status`
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

    const Item = () => {
        return (
            resource.map((row, index) => {
                return (
                    <tr className="text-center" key={index}>
                        <td>{row.username}</td>
                        <td>{row.role_name}</td>
                        <td>{row.descript}</td>
                        <td>
                            <Switch id={row.id} active={row.is_enabled} url={statusURL} />
                        </td>
                        <td>
                            <Link to={`${editURL}/${row.id}`} className="hollow button small margin-bottom-0 padding-tb href-edit"> <i className="fas fa-edit"></i> 编辑</Link>                     
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
                    <Link to={addURL} className="button hollow primary small"><i className="fas fa-plus"></i>
                    添加</Link> 
                    <a className="button info small float-right search">搜索</a>                   
                    
                    <hr />                                
                    
                    <div className="table-scroll">
                        <table className="hover border gray">
                            <thead>
                                <tr>                                                                             
                                    <th className="text-center">用户名</th>   
                                    <th className="text-center">角色</th> 
                                    <th className="text-center">描述</th> 
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


export default Admin