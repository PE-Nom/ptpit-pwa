const keyName = 'pendingRequest'

export default {
  clear () {
    if (keyName in sessionStorage) {
      sessionStorage.removeItem(keyName)
    }
  },
  push (req) {
    let request = []
    if (keyName in sessionStorage) {
      request = JSON.parse(sessionStorage.getItem(keyName))
    }
    request.push(req)
    sessionStorage.removeItem(keyName)
    sessionStorage.setItem(keyName, JSON.stringify(request))
  },
  shift () {
    let req = null
    if (keyName in sessionStorage) {
      let request = JSON.parse(sessionStorage.getItem(keyName))
      req = request.shift()
      sessionStorage.removeItem(keyName)
      sessionStorage.setItem(keyName, JSON.stringify(request))
    }
    return req
  }
}
