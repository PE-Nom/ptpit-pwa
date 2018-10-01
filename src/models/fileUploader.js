import axios from 'axios'

// const BASE_URL = 'http://192.168.1.4:8081' // @ Office
// const BASE_URL = 'http://192.168.10.6:8081' // @ home

// const BASE_URL = 'https://192.168.1.4:8081' // @office on dell over https
// const BASE_URL = 'https://192.168.10.6:8081' // @home on dell over https

// const BASE_URL = 'https://www.nomtech-pwa.com/' // @ AWS
const BASE_URL = 'https://pitsan.nomtech-pwa.com/' // @ AWS

export default {
  async uploadFile (issId, attachId, file) {
    console.log('uploadFile @ fileUploader.js')
    let formData = new FormData()
    formData.append('file', file, file.name)
    formData.append('issueId', issId)
    formData.append('attachId', attachId)
    // formData.append('originalname', file.name)
    await axios.post(BASE_URL + '/file_upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        console.log('axios.post success')
        console.log(res)
        return res
      })
      .catch(err => {
        console.log('axios.post error')
        console.log(err)
        throw err
      })
  },
  async pingToServer () {
    console.log('pingToServer @ fileUploader.js')
    let response = null
    await axios.get(BASE_URL + '/dateandtime', { timeout: 2000 })
      .then(res => {
        console.log('axios.get.then')
        console.log(res)
        response = res
      })
      .catch(err => {
        throw (err)
      })
    console.log('return from pingToServer')
    return response
  }
}
