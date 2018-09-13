<template>
  <div class="content-fulied">
    <b-navbar v-if="showNavbar" type="dark" variant="success">
      <b-navbar-brand to="/tickets">&lt;&lt; 指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-navbar v-else type="dark" variant="success">
      <b-navbar-brand to="/pendingrequests">&lt;&lt; 未登録指摘一覧</b-navbar-brand>
    </b-navbar>
    <b-container class="table-row header">
      <label class="currentpath-user" >{{currentPath}} ({{connectStatus}})</label>
    </b-container>

    <div>
      <!-- 情報アコーディオン -->
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion-issue variant="success">安全指摘 id:#{{issueId}}</b-btn>
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
              <!-- 画像・動画の添付 -->
              <b-card no-body class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-btn block href="#" v-b-toggle.accordion-image-and-vide variant="success">画像・動画の添付</b-btn>
                </b-card-header>
                <b-collapse id="accordion-image-and-vide" accordion="issue-detail-accordion" role="tabpanel">
                  <b-card-body>
                    <div class="form-group">
                      <div class="col-md-10">
                        <!--
                        <label for="inputImageAndVideo" class="control-label">画像・動画</label>
                        -->
                        <input type="file" class="form-control" id="inputImageAndVideo" variant="success" accept="image/*,video/*" capture="camera" @change="onImageAndVideoChanged">
                      </div>
                    </div>
                    <div class="form-group">
                      <div class="col-md-10">
                        <label for="inputImageDescription" class="control-label">画像の説明</label>
                        <textarea class="form-control" rows="3" id="inputImageDescription" placeholder="画像の説明記述" v-model="imageDescription"></textarea>
                      </div>
                    </div>
                  </b-card-body>
                </b-collapse>
              </b-card>
              <!-- 更新・登録 -->
              <div class="button-group">
                <div class="col-md-8">
                  <p v-if=errorMessage class="message-field">{{errorMessage}}</p>
                </div>
                <div class="col-md-2">
                  <b-button class="control-button create" variant="success" v-if="this.new" @click='createIssue'>新規登録</b-button>
                  <b-button class="control-button update" variant="success" v-else @click='updateIssue'>更新</b-button>
                </div>
              </div>
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
                <b-list-group-item v-for="(attachment, idx) in attachments" v-bind:key=idx>
                  <!--
                  <a :href="val.content_url">{{val.filename}}</a> ({{val.filesize}}) <br>
                  -->
                  <a href="#!" v-on:click="previewAttachment(attachment)"> {{attachment.filename}} </a> ({{attachment.filesize}}) <br>
                  {{attachment.description}}
                </b-list-group-item>
              </b-list-group>
              <div class="h-divider"></div>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
      <!-- 履歴 アコーディオン -->
      <b-card no-body class="mb-1">
        <b-card-header header-tag="header" class="p-1" role="tab">
          <b-btn block href="#" v-b-toggle.accordion-history variant="info">更新履歴</b-btn>
        </b-card-header>
        <b-collapse id="accordion-history" accordion="issue-accordion" role="tabpanel">
          <b-card-body>
            <div class="history-field">
              <!--履歴の表示領域 -->
              <b-card no-body v-for="(val, idx) in journals" v-bind:key=idx class="mb-1">
                <b-card-header header-tag="header" class="p-1" role="tab">
                  <b-btn block v-b-toggle="'accordion-history-item'+val.id" variant="default">{{val.created_on}}</b-btn>
                </b-card-header>
                <b-collapse v-bind:id="'accordion-history-item'+val.id" accordion="my-history-item-accordion" role="tabpanel">
                  <b-card-body v-for="(item, id) in val.details" v-bind:key=id>
                    {{item}}
                  </b-card-body>
                </b-collapse>
              </b-card>
            </div>
          </b-card-body>
        </b-collapse>
      </b-card>
    </div>
  </div>
</template>

<script>
import router from '../router'
import naim from '../models/naim.js'
import editstate from '../models/editState.js'
import dateSelector from './DateSelector.vue'
import fileUploader from '../models/fileUploader.js'
import util from '../models/util.js'

export default {
  components: {
    dateSelector
  },
  data () {
    return {
      test_url: 'http://192.168.10.5/JS/data/', // @ for demo
      // test_url: 'http://192.168.1.4/JS/data/', // @ office
      // test_url: 'http://192.168.10.8/JS/data/', // @ home on dell
      // test_url: 'http://192.168.10.9/JS/data/', // @ home on let's note
      // test_url: 'http://nomsan-elb-2142077815.ap-northeast-1.elb.amazonaws.com/data/', // @ home on let's note

      // test_url: 'https://192.168.1.4/data/', // @office on dell over https
      // ------
      // test_url: 'https://192.168.10.6/data/', // @home on dell over https
      // test_url: 'https://192.168.10.5/data/', // @home on let's-note over https
      // test_url: 'https://nomsan-elb-2142077815.ap-northeast-1.elb.amazonaws.com/data/', // @ home on let's note

      // test_url: 'https://www.nomtech-pwa.com/data/', // @ home on let's note

      new: false,
      currentPath: '',
      issId: null,
      issueId: '',
      issDetail: null,
      projectId: '',
      projectOptions: [{value: '', text: ''}],
      subject: '',
      description: '',

      trackerOptions: [{value: '', text: ''}],
      tracker: '',

      issueStatuses: [{value: '', text: ''}],
      issueStatus: '',

      issuePriorities: [{value: '', text: ''}],
      issuePriority: '',

      siteOptions: [{value: '', text: ''}],
      site: '',

      usersOptions: [{value: '', text: ''}],
      assigned: '', // 担当者

      activities: [{value: '', text: ''}],
      activity: null,
      workingTime: '',
      comment: '',
      notation: '',
      documentCategries: [{value: '', text: ''}],
      start_date: '2018-07-11',
      due_date: '2018-08-11',
      done_ratio: '',
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
      update_on: '',
      attachments: [],
      journals: [],
      errorMessage: '',
      // for date selector
      dateFormat: 'YYYY-MM-DD',
      currentDate: '2018-07-25',
      minDate: '2018-01-01',
      maxDate: '2030-12-31',
      file: null,
      token: '',
      mediaData: null,
      uploading: false,
      imageDescription: '',
      creating: false,
      updating: false
    }
  },
  computed: {
    connectStatus: function () {
      return this.$store.getters.connectStat ? 'on-line' : 'off-line'
    },
    showNavbar: function () {
      let show = true
      if (editstate.previousPath === '/pendingrequests') {
        show = false
      }
      return show
    }
  },
  watch: {
    tracker: function (newVal, oldVal) {
      // console.log('tracker changed : new = ' + newVal + ', old = ' + oldVal + ', this.tracker : ' + this.tracker)
    },
    projectId: function (newVal, oldVal) {
      // console.log('projectId changed : new = ' + newVal + ', old = ' + oldVal + ', this.projectId : ' + this.projectId)
    },
    issueStatus: function (newVal, oldVal) {
      // console.log('issueStatus changed : new = ' + newVal + ', old = ' + oldVal + ', this.issueStatus : ' + this.issueStatus)
    },
    issuePriority: function (newVal, oldVal) {
      // console.log('issuePriority changed : new = ' + newVal + ', old = ' + oldVal + ', this.issuePriority : ' + this.issuePriority)
    },
    assigned: function (newVal, oldVal) {
      // console.log('assigned changed : new = ' + newVal + ', old = ' + oldVal + ', this.assigned : ' + this.assigned)
    }
    // author: function (newVal, oldVal) {
    // console.log('author changed : new = ' + newVal + ', old = ' + oldVal + ', this.author : ' + this.author)
    // }
  },
  methods: {
    startDate: function (date) {
      this.start_date = date.format(this.dateFormat)
      // console.log('開始日' + this.start_date)
    },
    dueDate: function (date) {
      this.due_date = date.format(this.dateFormat)
      // console.log('期日' + this.due_date)
    },
    onImageAndVideoChanged: function (event) {
      console.log('onImageAndVideoChanged')
      if (event.target.files.length) {
        // 選択されたファイル情報を取得
        this.file = event.target.files[0]
        console.log(this.file)
        this.mediaData = new Image()
        let reader = new FileReader()
        reader.onload = (e) => {
          console.log('reader.onload')
          this.mediaData = e.target.result
          console.log(this.mediaData)
        }
        reader.readAsDataURL(this.file)
      } else {
        console.log('no file selected')
      }
    },
    async uploadFile () {
      if (this.uploading) {
        this.errorMessage = 'Now uploading'
      } else {
        this.uploading = true
        if (this.file) {
          try {
            let res = await naim.uploadFile(this.file, this.mediaData, this.imageDescription)
            if (res) {
              this.token = res.data.upload.token
              let attachId = res.data.upload.id
              console.log('uploaded file')
              console.log('token : ' + this.token)
              console.log('id : ' + attachId)
              let qobj = {
                'issue': {
                  'uploads': [{
                    'token': this.token,
                    'filename': this.file.name,
                    'description': this.imageDescription,
                    'content_type': this.file.type
                  }]
                }
              }
              await naim.updateIssue(editstate.currentIssueId, qobj)
              await fileUploader.uploadFile(editstate.currentIssueId, attachId, this.file, this.mediaData)
            }
            this.uploading = false
          } catch (err) {
            console.log('error has occured @ attachingFile')
            console.log(err)
            this.errorMessage = err.toString()
          }
        }
      }
    },
    createQueryString: function () {
      let qobj = {
        'issue': {
          'subject': this.subject, // subject
          'priority_id': this.issuePriority, // priority Object
          'status_id': this.issueStatus, // status Object
          // ----------------------
          'tracker_id': this.tracker, // tracker Object
          'project_id': this.projectId, // project Object
          'description': this.description, // description
          // ----------------------
          'start_date': this.start_date, // start_date
          'due_date': this.due_date, // due_date
          'done_ratio': this.done_ratio, // done_ratio
          // ----------------------
          'assigned_to_id': this.assigned, // assigned_to Object
          // ----------------------
          // activity
          // workingTime
          // comment
          'notes': this.notation, // notation
          'custom_fields': [{ id: naim.findCustomFieldId('巡視場所'), 'value': this.site }]
        }
      }
      return qobj
    },
    createIssue: async function () {
      console.log('createIssue')
      if (this.creating) {
        alert('登録処理中です。しばらくお待ちください')
      } else {
        this.creating = true
        let qobj = this.createQueryString()
        console.log(qobj)
        let ret = await naim.createIssue(qobj)
        await naim.retrieveIssues()
        console.log(qobj)
        if (this.mediaData !== null) {
          editstate.currentIssueId = ret.data.issue.id
          await this.uploadFile()
        }
        if (this.$store.getters.connectStat) {
          router.push('/tickets')
        } else {
          router.push('/pendingrequests')
        }
        this.creating = false
      }
    },
    updateIssue: async function () {
      console.log('updateIssue')
      if (this.updating) {
        alert('更新処理中です。しばらくお待ちください')
      } else {
        this.updating = true
        let qobj = this.createQueryString()
        await naim.updateIssue(this.issId, qobj)
        await naim.retrieveIssues()
        console.log(qobj)
        if (this.mediaData !== null) {
          await this.uploadFile()
        }
        if (this.$store.getters.connectStat) {
          router.push('/tickets')
        } else {
          router.push('/pendingrequests')
        }
        this.updating = false
      }
    },
    previewAttachment: function (attachment) {
      if (!this.$store.getters.connectStat) {
        alert('オフラインモード　添付ファイルを取得できません')
      } else {
        console.log('select attachment :')
        console.log('  filename :' + attachment.filename)
        console.log('  content_type : ' + attachment.content_type)
        console.log('  content_url : ' + attachment.content_url)
        console.log('  id : ' + attachment.id)
        // let contentUrl = this.test_url + this.issId + '/' + attachment.id + '_' + attachment.filename
        if (attachment.content_type.indexOf('video') === -1) {
          // 動画以外はそのまま新しいタブで表示
          console.log('image')
        } else {
          console.log('video')
        }
        /*
        window.open(contentUrl)
        */
        editstate.attachment = attachment
        router.push('/attachmentviewer')
      }
    },
    getIssueDetail: async function () {
      if (this.issId !== -1) {
        // await naim.retrieveIssueDetail(Number(this.issId))
        this.issDetail = await naim.getIssueDetail(Number(this.issId))
        console.log(this.issDetail)
        if (this.issDetail !== null) {
          this.projectId = this.issDetail.project.id
          this.subject = this.issDetail.subject
          this.description = this.issDetail.description
          this.tracker = this.issDetail.tracker.id
          this.issueStatus = this.issDetail.status.id
          this.issuePriority = this.issDetail.priority.id
          // this.author = this.issDetail.author.id
          this.assigned = this.issDetail.assigned_to ? this.issDetail.assigned_to.id : '-'
          this.start_date = this.issDetail.start_date ? this.issDetail.start_date : ''
          // console.log('start_date : ' + this.start_date)
          this.due_date = this.issDetail.due_date ? this.issDetail.due_date : ''
          // console.log('due_date : ' + this.due_date)
          this.update_on = this.issDetail.update_on ? this.issDetail.update_on : '未定義'
          this.done_ratio = this.issDetail.done_ratio ? this.issDetail.done_ratio : 0
          // dateSelector.parseDate()
          // 添付ファイルのリスト
          let attachmentItems = []
          this.issDetail.attachments.forEach(el => {
            let item = {
              filename: el.filename,
              filesize: parseInt(el.filesize / 1000) + 'kbyte',
              description: el.description,
              content_type: el.content_type,
              content_url: el.content_url,
              id: el.id
            }
            attachmentItems.push(item)
          })
          this.attachments = attachmentItems
          // 履歴のリスト
          this.journals = []
          this.issDetail.journals.forEach(journal => {
            let details = []
            details.push('by ' + journal.user.name)
            if (journal.notes !== '') details.push(journal.notes)
            journal.details.forEach(detail => {
              let name = detail.name
              let oldValue = detail.old_value ? detail.old_value : '未定義'
              let newValue = detail.new_value
              let str = name + ' : ' + oldValue + ' -> ' + newValue
              details.push(str)
            })
            this.journals.push({id: journal.id, created_on: journal.created_on, details: details})
          })
          // console.log(this.journals)
          this.site = this.issDetail.custom_fields[0].value
        }
      } else {
        // this.tracker = this.trackerOptions[0].value
        // this.issueStatus = this.issueStatuses[0].value
        // this.issuePriority = this.issuePriorities[0].value
        this.tracker = 5 // インシデント
        this.issueStatus = 1 // 新規
        this.issuePriority = 2 // 通常
        this.done_ratio = 0
        // this.author = this.issDetail.author.id
        this.tracker = util.findValue(this.trackerOptions, '安全指摘事項')
        console.log(this.tracker)
        this.start_date = this.due_date = util.getNowYMD()
        console.log(this.start_date)
      }
    }
  },
  async created () {
    console.log('/editissue created')
    this.issId = editstate.currentIssueId
    if (this.issId !== -1) {
      this.new = false
      this.issueId = this.issId
      this.currentPath = '指摘 更新'
    } else {
      this.new = true
      this.issueId = ''
      this.currentPath = '指摘 登録'
    }
    this.projectOptions = naim.getProjects()
    this.usersOptions = naim.getUsers()
    this.trackerOptions = naim.getTrackers()
    this.issueStatuses = naim.getIssueStatuses()
    this.issuePriorities = naim.getIssuePriorities()
    this.activities = naim.getTimeEntryActivities()
    this.documentCategries = naim.getDocumentCategories()
    this.siteOptions = naim.getCustomeFileds('巡視場所')
    await this.getIssueDetail()
  },
  mounted () {
    // console.log('EditIssue mounted')
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