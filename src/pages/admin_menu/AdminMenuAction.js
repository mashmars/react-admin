import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'

const AdminMenuAction = () => { 
    let { id } = useParams()
    const resourceURL = `${baseURL}/api/admin/menu/action/${id}` 
    const [resource, setResource] = useState([])
    useEffect(() => {
        httpRequest('get', resourceURL).then((data) => {
            setResource(data.data)
        })
    }, [])    

    const Item = () => {
        return (
            resource.map((row, index) => {
                return (
                    <tr className="text-center" key={index}>
                        <td>{row.name}</td>
                        <td>{row.router_name}</td>
                        <td>{row.router_short_name}</td>
                    </tr>
                )
            })
        )
    }

   
    return (
        <>
            <div className="grid-x padding-1 shadow">
                <div className="cell">                                         
                    <a className="button info small float-right search">搜索</a>
                    <div id="search" className="clearfix">
                        <form action="" method="get" id="form-search">
                            <div className="grid-x grid-padding-x">                                       
                                <div className="large-1 small-3 cell">
                                    <label htmlFor="" className="text-right middle">编号:</label>
                                </div>
                                <div className="large-2 small-9 cell">
                                    <input type="text" id="" name="" placeholder="" defaultValue="" />
                                </div> 
                                <div className="large-1 small-3 cell">
                                    <label htmlFor="" className="text-right middle">下拉框:</label>
                                </div>
                                <div className="large-2 small-9 cell">
                                    <select name="" id="">
                                        <option defaultValue="">全部</option>                                                    
                                    </select>
                                </div> 
                                <div className="large-1 small-3 cell">
                                    <label htmlFor="" className="text-right middle">输入框:</label>
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
                                    <th className="text-center">路由名称</th>
                                    <th className="text-center">路由标识</th>
                                    <th className="text-center">路由短标识</th>
                                </tr>
                            </thead>
                            <tbody id="tbody">                         
                                <Item />                         
                            </tbody>
                        </table>
                    </div>                                                           
                </div>
            </div>
            <div className="grid-x margin-top-2 align-center"></div>
        </>
    )
}


export default AdminMenuAction