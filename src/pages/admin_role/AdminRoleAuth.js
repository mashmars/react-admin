import {useState, useEffect} from 'react'
import {useParams} from 'react-router-dom'
import httpRequest, {baseURL} from '../../utils/httpRequest'
import Swal from 'sweetalert2'

const AdminRoleAuth = () => {
    let { id } = useParams()
    const menusURL = `${baseURL}/api/admin/role/rbac/${id}`
    const rbacSetURL = `${baseURL}/api/admin/role/rbac/set1/${id}`
    const [resource, setResource] = useState({})
    const [menus, setMenus] = useState([])
    const [actions, setActions] = useState([])
    const [apis, setApis] = useState([])
    const [firstLoad, setFirstLoad] = useState(true)

    useEffect(() => {
        httpRequest('get', menusURL).then((data) => {
            setResource(data.data)
            setMenus(data.data.roleMenus ? data.data.roleMenus : [])
            setActions(data.data.roleActions ? data.data.roleActions : [])
            setApis(data.data.roleApis ? data.data.roleApis : [])
        })
    }, [])

    const handleMenu = (event) => {
        let menusTemp = [...menus]
        let actionsTemp = [...actions]
        let apisTemp = [...apis]
        
        if (event.target.checked && !menusTemp.includes(Number(event.target.value))) {
            menusTemp.push(Number(event.target.value))
            //如果菜单点击 则下面的action 和 api全部选中或取消            
            document.querySelectorAll(`.action.${event.target.id}`).forEach((node) => {
                !actionsTemp.includes(Number(node.attributes['value'].nodeValue)) && actionsTemp.push(Number(node.attributes['value'].nodeValue))
            })            
            document.querySelectorAll(`.api.${event.target.id}`).forEach((node) => {
                !apisTemp.includes(Number(node.attributes['value'].nodeValue)) && apisTemp.push(Number(node.attributes['value'].nodeValue))
            })
        } else {
            menusTemp = menusTemp.filter((menu) => {
                return menu != Number(event.target.value)
            })
            //如果菜单点击 则下面的action 和 api全部选中或取消 
            document.querySelectorAll(`.action.${event.target.id}`).forEach((node) => {
                actionsTemp = actionsTemp.filter((action) => {
                    return action != Number(node.attributes['value'].nodeValue)
                })
            })
            document.querySelectorAll(`.api.${event.target.id}`).forEach((node) => {
                apisTemp = apisTemp.filter((api) => {
                    return api != Number(node.attributes['value'].nodeValue)
                })
            })
        }        
        
        setMenus(menusTemp)
        setActions(actionsTemp)
        setApis(apisTemp)
        setFirstLoad(false)
    }

    const handleAction = (event) => {
        let menusTemp = [...menus]
        let actionsTemp = [...actions]
        let apisTemp = [...apis]

        if (event.target.checked && !actionsTemp.includes(Number(event.target.value))) {
            actionsTemp.push(Number(event.target.value))
            //apis
            document.querySelectorAll(`.api-${event.target.value}`).forEach((node) => {
                !apisTemp.includes(Number(node.attributes['value'].nodeValue)) && apisTemp.push(Number(node.attributes['value'].nodeValue))
            })
            //menu
            let menu_sign = event.target.id.split('-')[2]
            !menusTemp.includes(Number(document.querySelector(`#${menu_sign}`).attributes['value'].nodeValue)) && menusTemp.push(Number(document.querySelector(`#${menu_sign}`).attributes['value'].nodeValue))            
        } else if (!event.target.checked) {
            actionsTemp = actionsTemp.filter((action) => {
                return action != Number(event.target.value)
            })
            //apis
            document.querySelectorAll(`.api-${event.target.value}`).forEach((node) => {
                apisTemp = apisTemp.filter((api) => {
                    return api != Number(node.attributes['value'].nodeValue)
                })
            })
            //menu
            let menu_sign = event.target.id.split('-')[2]
            let action_check = false
            document.querySelectorAll(`.action.${menu_sign}`).forEach((node) => {
                if (typeof node.attributes['checked'] != 'undefined' && event.target.value != node.attributes['value'].nodeValue) action_check = true
            })            
            if (!action_check) {
                menusTemp = menusTemp.filter((menu) => {
                    return menu != Number(document.querySelector(`#${menu_sign}`).attributes['value'].nodeValue)
                })
            }
        }        
        setMenus(menusTemp)
        setActions(actionsTemp)
        setApis(apisTemp)
        setFirstLoad(false)
    }

    const handleApi = (event) => {
        let menusTemp = [...menus]
        let actionsTemp = [...actions]
        let apisTemp = [...apis]

        let apiId = event.target.id.split('-')
        let menu_sign = apiId[3]
        let action_id = apiId[2]

        if (event.target.checked && !apisTemp.includes(Number(event.target.value))) {
            apisTemp.push(Number(event.target.value))           
            //action
            !actionsTemp.includes(Number(document.querySelector(`#action-${action_id}-${menu_sign}`).attributes['value'].nodeValue)) && actionsTemp.push(Number(document.querySelector(`#action-${action_id}-${menu_sign}`).attributes['value'].nodeValue))                       
            //menu  
            !menusTemp.includes(Number(document.querySelector(`#${menu_sign}`).attributes['value'].nodeValue)) && menusTemp.push(Number(document.querySelector(`#${menu_sign}`).attributes['value'].nodeValue))            
        } else {
            apisTemp = apisTemp.filter((api) => {
                return api != Number(event.target.value)
            })
            //action
            let api_check = false
            document.querySelectorAll(`.api-${action_id}`).forEach((node) => {
                if (typeof node.attributes['checked'] != 'undefined' && event.target.value != node.attributes['value'].nodeValue) api_check = true
            })            
            let action_current = 0
            if (!api_check) {
                actionsTemp = actionsTemp.filter((action) => {
                    return action != Number(document.querySelector(`#action-${action_id}-${menu_sign}`).attributes['value'].nodeValue)
                })
                //当所有api取消后 记录当前action 以便下面使用
                action_current = Number(document.querySelector(`#action-${action_id}-${menu_sign}`).attributes['value'].nodeValue)
            }
            //menu
            let action_check = false
            document.querySelectorAll(`.action.${menu_sign}`).forEach((node) => {
                if (typeof node.attributes['checked'] != 'undefined' && action_current != node.attributes['value'].nodeValue) action_check = true //
            })            
         
            if (!action_check) {
                menusTemp = menusTemp.filter((menu) => {
                    return menu != Number(document.querySelector(`#${menu_sign}`).attributes['value'].nodeValue)
                })
            }
        }
        setMenus(menusTemp)
        setActions(actionsTemp)
        setApis(apisTemp)
        setFirstLoad(false)
    }

    const handleSubmit = () => {       
        if (menus.length == 0) {
            Swal.fire({
                icon: 'warning',
                text: '请选择选项复选框',
                timer: 1500,
                showConfirmButton: false,
            })
            return false
        }
        httpRequest('post', rbacSetURL, {menus:menus, actions:actions, apis:apis}).then(data => {
            Swal.fire({
                //data.msg,
                text: data.msg,
                icon: data.code == 1 ? 'error' : 'success',
                timer: 2000,
                showConfirmButton: false,
                position: 'top-end',
            })            
        })
    }

    const Item = () => {        
        let menuAll = resource.menus ? resource.menus : []
        let roleMenus = resource.roleMenus && firstLoad ? resource.roleMenus : []
        let roleActions = resource.roleActions && firstLoad ? resource.roleActions : []
        let roleApis = resource.roleApis && firstLoad ? resource.roleApis : []
        return (
            menuAll.map((menu, index) => {                
                return (
                    <>
                        <div className="cell large-2 large-offset-1" key={menu.id}>
                            <div className="grid-x">
                                <input type="checkbox" id={menu.sign} defaultValue={menu.id} className={menu.sign} onChange={(e)=>handleMenu(e)}
                                defaultChecked={roleMenus.includes(menu.id) || menus.includes(menu.id)} />
                                <label htmlFor={menu.sign}>{menu.name}</label>
                            </div>
                        </div>
                        <div className="cell large-9"> 
                            <div className="grid-x fieldset largin-up-6 medium-up-6 small-up-3">
                        {
                            menu.actions.map((action, index)=> {
                                let apiIput = action.apis.map((api, index) => {
                                    return (
                                        <>
                                        <input type="checkbox" id={`api-${api.id}-${action.id}-${menu.sign}`} name={`menu_api_${menu.sign}_${action.id}`} defaultValue={api.id}
                                            className={`api ${menu.sign} api-${action.id}`} key={api.id}
                                            defaultChecked={roleApis.includes(api.id) || apis.includes(api.id)} onChange={(e)=>handleApi(e)}/>
                                        <label htmlFor={`api-${api.id}-${action.id}-${menu.sign}`}>{api.method} {api.path} </label>                           
                                        
                                        {((index+1)%3 == 0 && index != 0) ? <br /> : ''}
                                        </>
                                    )
                                })
                                let apisHtml = <fieldset className="cell auto fieldset"> <legend>设置api</legend>{apiIput}</fieldset>
                                return (
                                    <>
                                    <div className="cell large-3" key={action.id}>
                                        <input type="checkbox" id={`action-${action.id}-${menu.sign}`} name={`menu_action_${menu.sign}`} key={action.id}
                                        defaultValue={action.id} className={`action ${menu.sign}`} defaultChecked={roleActions.includes(action.id) || actions.includes(action.id)} onChange={(e)=>handleAction(e)} />
                                        <label htmlFor={`action-${action.id}-${menu.sign}`}>{action.name} </label>                    
                                    </div>
                                    {apisHtml}
                                        <div className="width-100"><hr /></div> 
                                    </>
                                )                              
                            })
                        }  
                            </div>
                        </div>
                    </>
                )
                
            })
        )
    }
   
    return (
        <>
        <div className="cell padding-1 shadow ">  
            <form id="form">
            <div className="grid-x fieldset" id="rbac">
                <Item />
            </div>    
            <div className="cell">
                <button className="button small" type="button" onClick={()=>handleSubmit()}>提交</button>
            </div>
            </form>
        </div>
        </>
    )
}

export default AdminRoleAuth