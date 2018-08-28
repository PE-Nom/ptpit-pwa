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
          <b-col cols="5">
            <label class="currentpath-user" >未登録の指摘一 ({{connectStatus}})</label>
          </b-col>
          <b-col cols="5">
            <label class="currentpath-user" >選択リクエスト ({{selectedRequest}})</label>
          </b-col>
          <b-col cols="2">
            <img :src="icon_upload" class="up-load" width='30px' height='30px' @click="upload"/>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div class="data-field">
        <div>
        <li v-for="(request, idx) in requestStrs" v-bind:key=idx @click="select(request)">{{request}}</li>
        </div>
    </div>
  </div>
</template>

<script>
import prm from '../models/pendingRequestManager.js'
import iconUpload from '../assets/upload.png'

export default {
  data () {
    return {
      requestObjs: [],
      requestStrs: [],
      msg: 'Pending Requests',
      connectStatus: this.$store.getters.connectStat ? 'on-line' : 'off-line',
      icon_upload: iconUpload,
      selectedRequest: ''
    }
  },
  methods: {
    complete (result) {
      this.requestObjs = result
      console.log('****** PendingRequestList.complete() ******')
      console.log(this.requestObjs)
      this.requestStr = []
      this.requestObjs.forEach(element => {
        let str = element.key
        this.requestStrs.push(str)
      })
    },
    select (key) {
      console.log('selected request key is ' + key)
      this.selectedRequest = key
    },
    upload () {
      console.log('upload')
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
    .up-load {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
  }

</style>