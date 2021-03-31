import axios from 'axios'
import store from '../redux/store/store'
import Swal from 'sweetalert2'

const httpRequest = async function(method, url, data='') {  
    const state = store.getState()

    return new Promise((resolve,reject)=>{        
        axios({
            method: method,
            url: url,
            data: data,
            params: method == 'get' ?  data : '',
            headers: {'Authorization':  state.jwt.jwtToken ? state.jwt.jwtToken.token :''}
        }).then((response) => {
            let data = response.data
            if (data.code === 40001) {
               window.location.href="/admin/login"
            } else if (data.code == 1) {                
                Swal.fire({
                    //data.msg,
                    text: data.msg,
                    icon:'info',
                    timer: 2000,
                    showConfirmButton: false,
                    position: 'top-end',
                })
            } else {
                resolve(data);
            }
        })
        .catch((error) => {
            console.log(error)
        })
    })
}  

export const baseURL = 'http://127.0.0.1:8080'

export default httpRequest