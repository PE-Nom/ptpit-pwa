import axios from 'axios'

const BASE_URL = 'http://192.168.10.5:8081' // for demo
// const BASE_URL = 'http://192.168.1.4:8081' // @ Office
// const BASE_URL = 'http://192.168.10.8:8081' // @ home
// const BASE_URL = 'http://nomsan-elb-2142077815.ap-northeast-1.elb.amazonaws.com' // @ AWS

// const BASE_URL = 'http://192.168.10.9:8081' // @ home let's note
// const BASE_URL = 'https://192.168.1.4:8081' // @office on dell over https
// const BASE_URL = 'https://192.168.10.6:8081' // @home on dell over https
// ---
// const BASE_URL = 'https://192.168.10.6' // @home on dell over https for proxy test
// const BASE_URL = 'https://192.168.10.5' // @home on let's-note over https for proxy test
// const BASE_URL = 'https://nomsan-elb-2142077815.ap-northeast-1.elb.amazonaws.com' // @ AWS

// const BASE_URL = 'https://www.nomtech-pwa.com/' // @ AWS

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
    await axios.get(BASE_URL + '/dateandtime', { timeout: 500 })
      .then(res => {
        console.log(res)
        response = res
      })
      .catch(err => {
        throw (err)
      })
    return response
  }
}
