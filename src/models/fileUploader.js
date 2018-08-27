import axios from 'axios'

// const BASE_URL = 'http://192.168.1.4:8081' // @ Office
const BASE_URL = 'http://192.168.10.9:8081' // @ home

export default {
  async uploadFile (issId, attachId, file, data, callback) {
    console.log('uploadFile @ fileUploader.js')
    console.log(data)
    let formData = new FormData()
    formData.append('file', file, file.name)
    formData.append('issueId', issId)
    formData.append('attachId', attachId)
    // formData.append('originalname', file.name)
    await axios.post(BASE_URL + '/file_upload', formData, {headers: {'Content-Type': 'multipart/form-data'}})
      .then(res => {
        console.log('axios.post success')
        console.log(res)
      })
      .catch(err => {
        console.log('axios.post error')
        console.log(err)
        throw err
      })
  }
}
