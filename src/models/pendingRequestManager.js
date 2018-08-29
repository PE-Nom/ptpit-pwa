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
    let tx = db.transaction(objectStoreName, 'readwrite')
    console.log(tx)
    tx.onerror = function (e) {
      console.log('transaction error')
      console.log(e)
      alert('transaction error')
      alert(e.toString())
    }
    tx.onsuccess = function (e) {
      console.log('transaction success')
      console.log(e)
    }
    let objStore = tx.objectStore(objectStoreName)
    objStore.add(req)
  },
  getPendingRequests (cb) {
    console.log('PendingRequestsManager.getPendingRequests')
    let objStore = db.transaction(objectStoreName, 'readwrite').objectStore(objectStoreName)
    let range = IDBKeyRange.lowerBound(0)
    let cur = objStore.openCursor(range)
    let requests = []
    cur.onsuccess = function (e) {
      // console.log(e)
      let cursor = e.target.result
      if (!!cursor === false) {
        cb(requests)
        return
      }
      let rec = {
        key: cursor.key,
        value: cursor.value
      }
      console.log(rec)
      requests.push(rec)
      cursor.continue()
    }
    cur.onerror = function (e) {
      console.log(e)
    }
  },
  deletePendingRequest (key, cb) {
    console.log('PendingRequestsManager.deletePendingRequests')
    console.log('key is ' + key)
    var request = db.transaction(objectStoreName, 'readwrite')
      .objectStore(objectStoreName)
      .delete(key)
    request.onsuccess = function (event) {
      if (cb) {
        cb(event)
      }
    }
  }
}
