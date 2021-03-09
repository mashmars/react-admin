import {useState} from 'react'
import httpRequest, {baseURL} from '../utils/httpRequest'
import qs from 'qs'

/**
 * 
 * @param {*} props 
 * id
 * active
 * url
 */
const Switch = (props) => {
    const [status, setStatus] = useState(props.active)
    const statusClick = (id) => {    
        httpRequest('post', props.url, qs.stringify({id:id, status:status?0:1}))    
        setStatus(status ? false : true)        
    }
    return (
        <div className="switch small" >
            <input className="switch-input" id={'yes-no-' + props.id} type="checkbox" checked={status ? true : false} onChange={()=>{}}/>
            <label className={'switch-paddle switch-paddle-' + props.id} htmfor={'yes-no-' + props.id} onClick={() => statusClick(props.id)}>
                <span className="show-for-sr">状态?</span>
                <span className="switch-active" aria-hidden="true">启用</span>
                <span className="switch-inactive" aria-hidden="true">禁用</span>
            </label>
        </div>
    )
}

export default Switch