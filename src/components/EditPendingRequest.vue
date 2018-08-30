<template>
  <div class="content-fulied">
    <b-navbar type="dark" variant="success">
      <b-navbar-brand to="/pendingrequests">&lt;&lt; 未登録指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-container class="table-row header">
      <label class="currentpath-user" >{{currentPath}} ({{connectStatus}})</label>
    </b-container>

    <div>
      <!-- 情報アコーディオン -->
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion-issue variant="success">{{pendingType}} id:#{{issueId}}</b-btn>
        </b-card-header>
        <b-collapse id="accordion-issue" visible accordion="issue-accordion" role="tabpanel">
          <b-card-body>
            <div class="edit-field">
              <!-- チケットサマリ -->
              <div id="summary">
                <div class="form-group row-top">
                  <div class="col-md-10">
                    <label for="inputSubject" class="control-label">件名</label>
                    <input type="text" class="form-control" id="inputSubject" placeholder="題名" v-model="subject">
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="inputProjectName" class="control-label">プロジェクト名</label>
                    <b-form-select v-model="projectId" :options="projectOptions">
                    </b-form-select>
                  </div>
                </div>
                <!-- 安全巡視用に　指摘対象場所の選択を追加 -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="siteName" class="control-label">指摘対象の現場</label>
                    <b-form-select v-model="site" :options="siteOptions">
                    </b-form-select>
                  </div>
                </div>
                <!-- 安全巡視用 ここまで -->
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="inputDescription" class="control-label">指摘内容</label>
                    <textarea class="form-control" rows="3" id="inputDescription" placeholder="指摘の記述" v-model="description"></textarea>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="inputIssuePriority" class="control-label">優先度</label>
                    <b-form-select v-model="issuePriority" :options="issuePriorities">
                    </b-form-select>
                  </div>
                </div>
                <div class="form-group">
                  <div class="col-md-10">
                    <label for="inputAssigned" class="control-label">担当者</label>
                    <b-form-select v-model="assigned" :options="usersOptions">
                    </b-form-select>
                  </div>
                </div>
              </div>
              <div class="form-group">
                <b-container>
                  <b-row>
                    <div class="col-md-10">
                      <label for="inputDueDate" class="control-label">期日</label>
                    </div>
                  </b-row>
                  <b-row>
                    <div class="col-md-10">
                      <date-selector :format="dateFormat" :start="minDate" v-bind:default="due_date" :end="maxDate" @date-change="dueDate"></date-selector>
                    </div>
                  </b-row>
                </b-container>
              </div>
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-btn block href="#" v-b-toggle.accordion-issue-detail variant="success">進捗状況</b-btn>
                </b-card-header>
                <b-collapse id="accordion-issue-detail" accordion="issue-detail-accordion" role="tabpanel">
                  <b-card-body>
                    <div class="form-group">
                      <div class="col-md-10">
                        <label for="inputIssueStatus" class="control-label">進捗状況</label>
                        <b-form-select v-model="issueStatus" :options="issueStatuses">
                        </b-form-select>
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-md-10">
                        <label for="inputDoneRatio" class="control-label">進捗率</label>
                        <b-form-select v-model="done_ratio" :options="doneRatioOptions">
                        </b-form-select>
                      </div>
                    </div>
                    <div class="h-divider"></div>
                    <div id="notation">
                      <div class="form-group">
                        <div class="col-md-10">
                          <label for="inputNotaion" class="control-label">コメント</label>
                          <textarea class="form-control" rows="3" id="inputNotation" v-model="notation"></textarea>
                        </div>
                      </div>
                    </div>
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>

    <!-- #################################### -->
    <!-- 添付ファイル アコーディオン -->
    <div>
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion-files variant="info">添付ファイル</b-btn>
        </b-card-header>
        <b-collapse id="accordion-files" accordion="issue-accordion" role="tabpanel">
          <b-card-body>
            <div class="attachment-field">
              <!-- 添付ファイルのリスト表示領域 -->
              <b-list-group>
                <b-list-group-item v-for="(val, idx) in attachments" v-bind:key=idx>
                  <!--
                  <a :href="val.content_url">{{val.filename}}</a> ({{val.filesize}}) <br>
                  -->
                  <a href="#!" v-on:click="previewAttachment(val)"> {{val.filename}} </a> ({{val.filesize}}) <br>
                  {{val.description}}
                </b-list-group-item>
              </b-list-group>
              <div class="h-divider"></div>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
// import router from '../router'
import naim from '../models/naim.js'
import editstate from '../models/editState.js'
import dateSelector from './DateSelector.vue'
// import fileUploader from '../models/fileUploader.js'
// import util from '../models/util.js'

export default {
  components: {
    dateSelector
  },
  data () {
    return {
      test_url: 'http://192.168.10.8/JS/data/', // @ home on dell
      // test_url: 'http://192.168.1.4/JS/data/', // @ office

      currentPath: '',
      issueId: '',
      requestObj: null,
      projectOptions: [{value: '', text: ''}],
      usersOptions: [{value: '', text: ''}],
      trackerOptions: [{value: '', text: ''}],
      issueStatuses: [{value: '', text: ''}],
      issuePriorities: [{value: '', text: ''}],
      activities: [{value: '', text: ''}],
      documentCategries: [{value: '', text: ''}],
      siteOptions: [{value: '', text: ''}],
      doneRatioOptions: [
        {value: 0, text: '0%'},
        {value: 10, text: '10%'},
        {value: 20, text: '20%'},
        {value: 30, text: '30%'},
        {value: 40, text: '40%'},
        {value: 50, text: '50%'},
        {value: 60, text: '60%'},
        {value: 70, text: '70%'},
        {value: 80, text: '80%'},
        {value: 90, text: '90%'},
        {value: 100, text: '100%'}
      ],

      subject: '',
      projectId: '',
      site: '',
      description: '',
      issuePriority: '',
      assigned: '', // 担当者

      due_date: '2018-08-11',
      done_ratio: '',
      issueStatus: '',
      notation: '',

      attachments: [],
      file: null,
      token: '',
      mediaData: null,

      pendingType: '',
      errorMessage: '',
      // for date selector
      dateFormat: 'YYYY-MM-DD',
      minDate: '2018-01-01',
      maxDate: '2030-12-31'

    }
  },
  computed: {
    connectStatus: function () {
      return this.$store.getters.connectStat ? 'on-line' : 'off-line'
    }
  },
  methods: {
    dueDate: function (date) {
      this.due_date = date.format(this.dateFormat)
      // console.log('期日' + this.due_date)
    },
    previewAttachment: function (attachmentFile) {
      console.log('EditPendingRequest.previewAttachment')
      // Chrome では Base64 で window.open すると何も表示されない
      // Chrome 60 以降の現象で 59 までであれば表示される様。
      // iOS safariではきちんと表示されるので、これで行く。（動画もOK）
      window.open(attachmentFile.attachment.value.mediaData)
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
    getIssueDetail: async function () {
      console.log('EditPendingRequest.getIssueDetail')
      console.log(this.requestObj)
      this.pendingType = this.requestObj.value.request === 'create' ? '指摘' : '更新'
      if (this.requestObj.value.id === '-1') {
        this.issueId = '**'
      } else {
        this.issueId = this.requestObj.value.id
      }
      this.subject = this.requestObj.value.query.issue.subject
      this.projectId = this.requestObj.value.query.issue.project_id
      this.site = this.requestObj.value.query.issue.custom_fields[0].value
      this.description = this.requestObj.value.query.issue.description
      this.issuePriority = this.requestObj.value.query.issue.priority_id
      this.assigned = this.requestObj.value.query.issue.assigned_to_id

      this.due_date = this.requestObj.value.query.issue.due_date
      this.done_ratio = this.requestObj.value.query.issue.done_ratio
      this.issueStatus = this.requestObj.value.query.issue.status_id
      this.notation = this.requestObj.value.query.issue.notes

      if (editstate.attachment) {
        let attachmentItems = []
        let attachment = editstate.attachment
        console.log(attachment)
        let item = {
          attachment: attachment,
          filename: attachment.value.name,
          filesize: parseInt(attachment.value.size / 1000) + 'kbyte',
          description: attachment.value.description,
          content_type: attachment.value.type,
          id: '***'
        }
        attachmentItems.push(item)
        this.attachments = attachmentItems
      }
    }
  },
  async created () {
    console.log('/editPendingRequest created')
    this.issueId = '**'
    this.currentPath = '未登録の指摘内容'
    this.requestObj = editstate.currentPendingRequest
    this.projectOptions = naim.getProjects()
    this.usersOptions = naim.getUsers()
    this.trackerOptions = naim.getTrackers()
    this.issueStatuses = naim.getIssueStatuses()
    this.issuePriorities = naim.getIssuePriorities()
    this.activities = naim.getTimeEntryActivities()
    this.documentCategries = naim.getDocumentCategories()
    this.siteOptions = naim.getCustomeFileds('巡視場所')
    await this.getIssueDetail()
  }
}
</script>

<style scoped>
  .control-label {
    float: left;
  }
  .control-button {
    float: right;
  }
  .row-top {
    margin-top: 0em;
  }
  .control-label {
    margin-bottom: 0.1em;
  }
  .form-group {
    margin-bottom: 0.5em;
  }
  .form-dummy {
    height: 0px;
  }
  .button-group {
    margin-top: 1em;
  }
  .update {
    margin-left: 1em;
  }
  .edit-field {
    height: 500px;
    overflow-y: auto;
  }
  .attachment-field {
    height: 500px;
    overflow-y: auto;
  }
  .history-field {
    height: 500px;
    overflow-y: auto;
  }
  .button-group .attachment {
    margin-bottom: 1em;
  }
  .h-divider {
    margin-top:5px;
    margin-bottom:5px;
    height:1px;
    width:100%;
    border-top:1px solid gray;
  }
</style>