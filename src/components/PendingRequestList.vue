<template>
  <div class="container-fluid">
    <!-- #### Desktop用 #### -->
    <div class="desktop table-row header">
      <b-row>
        <b-col cols="2">
            <label class="currentpath-user" >未登録の指摘一 ({{connectStatus}})</label>
        </b-col>
        <b-col cols="2">
            <img :src="icon_upload" class="up-load" width='30px' height='30px' @click="upload"/>
        </b-col>
        <b-col cols="8">
        </b-col>
      </b-row>
    </div>
    <!-- #### tablet用 #### -->
    <div class="tablet">
      <b-container class="table-row header">
        <b-row>
          <b-col cols="4">
            <label>未登録指摘一覧</label>
          </b-col>
          <b-col cols="4">
            <label>({{connectStatus}})</label>
          </b-col>
          <b-col cols="4">
          </b-col>
        </b-row>
        <b-row>
          <b-col cols="4">
            <label class="currentpath-user" >選択リクエスト ({{selectRequestKey}})</label>
          </b-col>
          <b-col cols="2">
            <img :src="icon_trash" class="trash" width='25px' height='25px' @click="remove"/>
          </b-col>
          <b-col cols="2">
            <img :src="icon_connection" class="trash" width='25px' height='25px' @click="checkServerAccess"/>
          </b-col>
          <b-col cols="2">
            <img :src="icon_new_issue" class="new_issue" width='30px' height='30px' @click="createIssue"/>
          </b-col>
          <b-col cols="2">
            <img :src="icon_upload" v-if="connected" class="up-load" width='30px' height='30px' @click="upload"/>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div class="data-field">
      <div v-for="(entry, idx) in requestStrs" v-bind:key=idx @click="select(entry)">
        <div class="table-row data">
          <div class="wrapper attributes data">
            <div v-for="(val, idx) in columns" v-bind:key=idx :class="[val]">
              <span>
                {{entry[val]}}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script>
import editstate from '../models/editState.js'
import prm from '../models/pendingRequestManager.js'
import naim from '../models/naim.js'
import fileUploader from '../models/fileUploader.js'
import iconUpload from '../assets/upload.png'
import iconNew from '../assets/new.png'
import iconTrash from '../assets/trash.png'
import iconConnection from '../assets/connection.png'

export default {
  data () {
    return {
      columns: ['key', 'request', 'id', 'subject', 'description'],
      requestObjs: [],
      requestStrs: [],
      msg: 'Pending Requests',
      icon_trash: iconTrash,
      icon_new_issue: iconNew,
      icon_upload: iconUpload,
      icon_connection: iconConnection,
      selectRequestKey: '',
      connectStatus: ''
    }
  },
  computed: {
    connected: function () {
      if (this.$store.getters.connectStat) {
        this.connectStatus = 'on-line'
      } else {
        this.connectStatus = 'off-line'
      }
      return this.$store.getters.connectStat
    }
  },
  methods: {
    complete (result) {
      this.requestObjs = result
      console.log('****** PendingRequestList.complete() ******')
      console.log(this.requestObjs)
      let req = []
      this.requestObjs.forEach(element => {
        let rec = null
        if (element.value.request === 'file attach') {
          rec = {
            key: element.key,
            id: element.value.id,
            request: element.value.request,
            subject: element.value.name,
            description: element.value.description
          }
        } else {
          rec = {
            key: element.key,
            id: element.value.id,
            request: element.value.request,
            subject: element.value.query.issue.subject,
            description: element.value.query.issue.description
          }
        }
        req.push(rec)
      })
      this.requestStrs = req
    },
    createIssue: function () {
      console.log('createIssue')
      editstate.currentIssueId = -1
      this.$router.push('/editissue')
    },
    select (entry) {
      console.log('selected request key is ' + entry.key)
      this.selectRequestKey = entry.key
    },
    async checkServerAccess () {
      console.log('checkServerAccess')
      let resp
      try {
        resp = await fileUploader.pingToServer()
      } catch (err) {
        alert(err)
        this.$store.commit('setConnectStat', {connectStat: false})
      }
      alert(resp.data.dateandtime)
      this.$store.commit('setConnectStat', {connectStat: true})
    },
    remove () {
      console.log('remove')
      if (this.selectRequestKey !== '') {
        prm.deletePendingRequest(this.selectRequestKey, this.retrievePendingRequests)
      }
    },
    // 引数はbase64形式の文字列と作成するファイルオブジェクトのファイル名
    createFile (request) {
      let mediaData = request.value.mediaData
      let name = request.value.name
      let filePropertyBag = request.value.filePropertyBag
      // base64のデコード
      let bin = atob(mediaData.replace(/^.*,/, ''))
      // バイナリデータ化
      let buffer = new Uint8Array(bin.length)
      for (let i = 0; i < bin.length; i++) {
        buffer[i] = bin.charCodeAt(i)
      }
      // ファイルオブジェクト生成(この例ではjpegファイル)
      return new File([buffer.buffer], name, filePropertyBag)
    },
    async uploadFile (id, request) {
      try {
        // ここでFileオブジェクトを再構築してproperties にセットする。
        let file = this.createFile(request)
        let res = await naim.uploadFile(file, request.value.mediaData, request.value.description)
        if (res) {
          let token = res.data.upload.token
          let attachId = res.data.upload.id
          console.log('uploaded file')
          console.log('token : ' + token)
          console.log('id : ' + attachId)
          let qobj = {
            'issue': {
              'uploads': [{
                'token': token,
                'filename': request.value.name,
                'description': request.value.description,
                'content_type': request.value.file_property_bag.type
              }]
            }
          }
          await naim.updateIssue(id, qobj)
          await fileUploader.uploadFile(id, attachId, file)
        }
      } catch (err) {
        console.log('error has occured @ attachingFile')
        console.log(err)
        this.errorMessage = err.toString()
      }
    },
    async upload () {
      console.log('upload')
      // ここでrequestObjsを一件づつ登録していく
      // this.requestObjs.forEach では
      // asyn/awaitのコンテキストが不整合になるため
      // ここではあえてfor ループで実装している
      if (!this.connected) {
        alert('オフラインモード　指摘情報をアップロードできません')
      } else {
        let id = null
        for (let i = 0; i < this.requestObjs.length; i++) {
          let request = this.requestObjs[i]
          console.log(request)
          if (request.value.request === 'create') {
            console.log('upload create request')
            let ret = null
            ret = await naim.createIssue(request.value.query)
            id = ret.data.issue.id
          } else if (request.value.request === 'update') {
            console.log('upload update request')
            id = request.value.id
            await naim.updateIssue(id, request.value.query)
          } else if (request.value.request === 'file attach') {
            console.log('upload attachingFile request')
            await this.uploadFile(id, request)
          } else {
            console.log('unknown request')
          }
          prm.deletePendingRequest(request.key)
        }
        await naim.retrieveIssues()
        this.retrievePendingRequests()
      }
    },
    retrievePendingRequests (e) {
      if (e) {
        console.log(e)
        this.selectRequestKey = ''
      }
      prm.getPendingRequests(this.complete)
    }
  },
  created () {
    this.retrievePendingRequests()
  }
}
</script>

<style scoped>
  .container-fluid{
    padding: 5px;
    width: 100%;
  }
  .table-row {
    border-bottom: 1px solid #e0e0e0;
    border-collapse: collapse;
  }
  .table-row.header {
    background-color: rgb(229, 255, 219);
    font-weight: bold;
    padding-top: 6px;
    padding-bottom: 6px;
  }
  .up-load {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    -webkit-transform: translateY(-50%) translateX(-50%);
    /* float: right; */
  }
  .data-field {
    height: 100vh;
    overflow-y: auto;
  }

  .desktop {
    font-size: 80%;
    font-weight: bold;
    display: block;
  }
  .tablet {
    font-size: 80%;
    font-weight: bold;
    display: none;
  }

  /*
   * Media queries: optimize for different screen widths.
   */
  @media screen and (max-device-width: 768px),screen and (max-width: 768px)
  {
    .desktop {
      font-size: 80%;
      font-weight: bold;
      display: none;
    }
    .tablet {
      font-size: 80%;
      font-weight: bold;
      display: inline;
    }
    .new_issue {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
    .trash {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
    .up-load {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
    .data-field {
      height: 600px;
      overflow-y: auto;
    }
  }

</style>