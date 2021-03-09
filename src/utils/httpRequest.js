import axios from 'axios'

const httpRequest = async function(method, url, data='') {
    return new Promise((resolve,reject)=>{
        let token = localStorage.getItem("token")
        let logout = ""
        axios({
            method: method,
            url: url,
            data: data,
            headers: {'Authorization': "{{app.request.session.get('token')}}"}
        }).then((response) => {
            let data = response.data
            if (data.code === 40001) {
               
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