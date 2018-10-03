import axios from 'axios'
import URLjoin from 'url-join'
import config from '../config.js'

export default {
  async uploadFile (issId, attachId, file) {
    console.log('uploadFile @ fileUploader.js')
    let formData = new FormData()
    formData.append('file', file, file.name)
    formData.append('issueId', issId)
    formData.append('attachId', attachId)
    // formData.append('originalname', file.name)
    let url = URLjoin(config.UploadBaseURL, '/file_upload')
    await axios.post(url, formData, {headers: {'Content-Type': 'multipart/form-data'}})
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
    let url = URLjoin(config.UploadBaseURL, '/dateandtime')
    await axios.get(url, { timeout: 2000 })
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
