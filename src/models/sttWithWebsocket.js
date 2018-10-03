import axios from 'axios'
import store from '../store.js'
import config from '../config.js'
import URLjoin from 'url-join'

export default {
  wsURI: config.WSUri,
  ws: null,
  connected: false,
  wssendcnt: 0,
  TOKEN: null,
  listeningCount: 0,
  async wsopen (openingMsg) {
    let wsURI = null
    if (!this.TOKEN) {
      let url = URLjoin(config.UploadBaseURL, '/token')
      await axios.get(url)
        .then((response, body) => {
          console.log('token get')
          console.log(response)
          this.TOKEN = response.data.token
        })
        .catch(err => {
          console.log('err @ wsopen')
          console.log(err)
          alert(err)
        })
    }
    if (this.TOKEN) {
      wsURI = this.wsURI.replace('[TOKEN]', this.TOKEN)
      this.ws = new WebSocket(wsURI)
      this.resetListeningCount()
      this.ws.onmessage = function (evt) {
        console.log('onmessage event')
        // console.log(evt.data)
        let data = JSON.parse(evt.data)
        if (data.state) {
          if (data.state === 'listening') {
            this.setListening(true)
            this.incrementListeningCount()
            this.connected = true
          }
        }
        if (data.results) {
          this.setTranscript(data.results)
        }
        if (data.error) {
          console.log(data.error)
          // alert(data.error)
        }
      }.bind(this)
      this.ws.onerror = function (evt) {
        console.log('onerror event')
        console.log(evt)
        alert(evt)
      }
      this.ws.onconnection = function (evt) {
        console.log('onconnection event')
        console.log(evt)
      }
      this.ws.onopen = function (evt) {
        console.log('onopen event')
        console.log(evt)
        console.log(openingMsg)
        let msg = JSON.stringify(openingMsg)
        console.log(msg)
        this.ws.send(msg)
      }.bind(this)
      this.ws.onclose = function (evt) {
        console.log('onclose event')
        console.log(evt)
        this.setListening(false)
        this.connected = false
      }.bind(this)
    }
    this.wssendcnt = 0
  },
  setTranscript (results) {
    let length = results[0].alternatives.length
    let transcript = results[0].alternatives[length - 1].transcript
    store.commit('setTranscript', {transcript: transcript})
    if (results[0].final) {
      console.log(results)
      store.commit('setTranscribed', {transcribed: transcript})
    }
  },
  setListening (mode) {
    console.log('setListening : ' + mode)
    store.commit('setListening', {listening: mode})
  },
  resetListeningCount () {
    console.log('resetListeningCount')
    this.listeningCount = 0
    this.setListeningCount()
  },
  incrementListeningCount () {
    console.log('incrementListeningCount')
    this.listeningCount++
    this.setListeningCount()
  },
  setListeningCount () {
    store.commit('setListeningCount', {listeningCount: this.listeningCount})
  },
  async wssend (chunk) {
    if (this.connected && this.ws.readyState === 1) {
      await this.ws.send(chunk, {
        binary: true,
        // mask: false,
        mask: true
      })
      this.wssendcnt++
      if (this.wssendcnt % 20 === 0) {
        // console.log('store.commit')
        store.commit('setWsSendCount', {sendcnt: this.wssendcnt})
      }
    }
  },
  async wsclose () {
    console.log('wsclose')
    if (this.connected && this.ws.readyState === 1) {
      let closingMessage = { action: 'stop' }
      await this.wssend(JSON.stringify(closingMessage))
      await this.ws.close()
    }
  }
}
