import {useState} from 'react'


const Modal = (props) => {    
    const handleClick = () => {
        props.handleModalToggle()
    }

    return (
        <div className="reveal-overlay" style={{display: props.toggle ? 'block' : 'none' }}>
            <div className="reveal" style={{display: props.toggle ? 'block' : 'none' }}>
            <props.component />
            <button className="close-button" type="button" onClick={handleClick}>
                <span aria-hidden="true">&times;</span>
            </button>
        </div>
        </div>
    )
}


export default Modal

