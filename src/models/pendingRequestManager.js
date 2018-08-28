const keyName = 'pendingRequest'
const dbName = 'pedndingRequests'
const objectStoreName = 'requests'

let db = null
let req = null

export default {
  init () {
    req = indexedDB.open(dbName, 1)
    req.onupgradeneeded = function (ev) {
      db = ev.target.result
      ev.target.transaction.onerror = function (err) {
        console.log('XXX0', err)
      }
      if (db.objectStoreNames.contains(objectStoreName)) {
        db.deleteObjectStore(objectStoreName)
      }
      // 改めてつくる
      // var store = db.createObjectStore(objectStoreName, {keyPath: 'timeStamp'})
      db.createObjectStore(objectStoreName, {autoIncrement: true})
    }
    req.onsuccess = function (ev) {
      console.log('indexedDB.open onsuccess')
      db = (ev.target) ? ev.target.result : ev.result
      console.log(db)
    }
  },
  clear () {
    console.log('pedingRequestManager clear')
    if (keyName in sessionStorage) {
      console.log('pedingRequestManager clear')
      sessionStorage.removeItem(keyName)
    }
  },
  push (req) {
    console.log('pendingRequestManager.push')
    console.log(db)
    /*
    let request = []
    if (keyName in sessionStorage) {
      request = JSON.parse(sessionStorage.getItem(keyName))
    }
    request.push(req)
    sessionStorage.removeItem(keyName)
    sessionStorage.setItem(keyName, JSON.stringify(request))
    */

    let transaction = db.transaction(objectStoreName, 'readwrite')
    console.log(transaction)
    transaction.onerror = function (e) {
      console.log('transaction error')
      console.log(e)
    }
    transaction.onsuccess = function (e) {
      console.log('transaction success')
      console.log(e)
    }
    let objStore = transaction.objectStore(objectStoreName)
    objStore.add(req)
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
