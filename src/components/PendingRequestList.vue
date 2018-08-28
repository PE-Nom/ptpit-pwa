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
            <label class="currentpath-user" >未登録の指摘一 ({{connectStatus}})</label>
          </b-col>
          <b-col cols="4">
            <label class="currentpath-user" >選択リクエスト ({{selectedRequest}})</label>
          </b-col>
          <b-col cols="2">
            <img :src="icon_new_issue" class="new_issue" width='30px' height='30px' @click="createIssue"/>
          </b-col>
          <b-col cols="2">
            <img :src="icon_upload" class="up-load" width='30px' height='30px' @click="upload"/>
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
import iconUpload from '../assets/upload.png'
import iconNew from '../assets/new.png'

export default {
  data () {
    return {
      columns: ['key', 'request', 'id', 'subject', 'description'],
      requestObjs: [],
      requestStrs: [],
      msg: 'Pending Requests',
      connectStatus: this.$store.getters.connectStat ? 'on-line' : 'off-line',
      icon_new_issue: iconNew,
      icon_upload: iconUpload,
      selectedRequest: ''
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
            subject: element.value.properties.name,
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
      this.selectedRequest = entry.key
    },
    upload () {
      console.log('upload')
      this.requestObjs.forEach(request => {
        // ここでrequestObjsを一件づつ登録していく
        console.log(request)
      })
      if (this.selectedRequest !== '') {
        prm.deletePendingRequest(this.selectedRequest, this.retrievePendingRequests)
      }
    },
    retrievePendingRequests (e) {
      if (e) {
        console.log(e)
        this.selectedRequest = ''
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