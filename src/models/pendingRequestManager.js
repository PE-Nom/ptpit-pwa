const keyName = 'pendingRequest'

export default {
  clear () {
    if (keyName in localStorage) {
      localStorage.removeItem(keyName)
    }
  },
  push (req) {
    let request = []
    if (keyName in localStorage) {
      request = JSON.parse(localStorage.getItem(keyName))
    }
    request.push(req)
    localStorage.removeItem(keyName)
    localStorage.setItem(keyName, JSON.stringify(request))
  },
  shift () {
    let req = null
    if (keyName in localStorage) {
      let request = JSON.parse(localStorage.getItem(keyName))
      req = request.shift()
      localStorage.removeItem(keyName)
      localStorage.setItem(keyName, JSON.stringify(request))
    }
    return req
  }
}
