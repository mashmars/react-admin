import {useState, useEffect} from 'react'
import {useParams, useHistory} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Swal from 'sweetalert2'

const AdminActionApi = () => { 
    let { id } = useParams()
    let history = useHistory()
    const resourceURL = `${baseURL}/api/admin/action/api`
    const setApiActionURL = `${baseURL}/api/admin/action/api/set`
    const [resource, setResource] = useState([])
    const [ids, setIds] = useState([])
    const [disabled_ids, setDisabledIds] = useState([])
    useEffect(() => {
        httpRequest('get', resourceURL).then((data) => {           
            let temp = []
            let tempDisabled = []
            //如果已经设置了 默认显示选中
            data.data.forEach(row => {
                if (row.action_id == id) {
                    temp.push(row.id)
                } else if (row.action_id != id && row.action_id != 0) {
                    tempDisabled.push(row.id)
                }
            })
            setIds(temp)
            setDisabledIds(tempDisabled)
            setResource(data.data)
        })
    }, [])   
    
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
                typeof node.attributes['disabled']?.nodeValue == 'undefined' && data.push(Number(node.attributes['value'].nodeValue))
            })
        } else {
            data = []
        }
        setIds(data)
    }

    const handleSubmit = () => {
        httpRequest('post', setApiActionURL, {action_id:id, ids:ids}).then((data)=> {
            if (data.code == 0) {
                Swal.fire({
                    //data.msg,
                    text: data.msg,
                    icon:'success',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                }).then(()=>{
                    //history.push("/admin/action/index")
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

    const Item = () => {
        return (
            resource.map((row, index) => {
                return (
                    <tr className="text-center" key={index}>
                        <td><input type="checkbox" className="checkbox-id" value={row.id} onChange={(e)=>handleIdCheck(e)} defaultChecked={ids.includes(row.id)} disabled={disabled_ids.includes(row.id)} /></td>
                        <td>{row.method}</td>
                        <td>{row.path}</td>
                        <td>{row.controller_action}</td>
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
                    <div className="large-1 small-4 cell margin-1">
                        <button type="button" className="button warning  hollow  margin-bottom-0 padding-tb small" onClick={()=>handleSubmit()}>
                            <i className="fas fa-cogs"></i> 确认提交
                        </button>               
                    </div> 
                    <div className="table-scroll">
                        <table className="hover border gray">
                            <thead>
                                <tr>                                                                             
                                    <th className="text-center"><input type="checkbox" onChange={(e)=>handleIdsCheck(e)}/></th>
                                    <th className="text-center">请求方法</th>
                                    <th className="text-center">路径</th>
                                    <th className="text-center">控制器行为</th>
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


export default AdminActionApi