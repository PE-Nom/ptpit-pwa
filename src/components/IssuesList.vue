<template>
  <div class="container-fluid">
    <!-- #### Desktop用 #### -->
    <div class="desktop table-row header">
      <b-row class='query-box'>
        <b-col cols="2">
          <form id="search">
            <input name="query" class="filter" v-model="searchQuery" placeholder="フィルタ文字列">
          </form>
        </b-col>
        <b-col cols="1">
          <img :src="icon_new_issue" class="new_issue" width='30px' height='30px' @click="createIssue"/>
        </b-col>
        <b-col cols="1">
          <img :src="icon_refresh_issue" v-if="connected" class="refresh_issue" width='25px' height='25px' @click="refreshIssue"/>
        </b-col>
        <b-col cols="12">
        </b-col>
      </b-row>
      <div class="wrapper attributes header">
        <div v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey == val }, val]">
          {{ val }}
          <span class="arrow" :class="sortOrders[val] > 0 ? 'asc' : 'dsc'"></span>
        </div>
      </div>
    </div>
    <!-- #### tablet用 #### -->
    <div class="tablet">
      <b-container class="table-row header">
        <b-row>
          <label class="currentpath-user" >指摘一覧 ({{connectStatus}})</label>
        </b-row>
        <b-row>
          <b-col cols="4">
            <!--
            <b-form-input type="text" v-model="searchQuery" placeholder="フィルタ文字列"></b-form-input>
            -->
            <input name="query" class="filter" v-model="searchQuery" placeholder="フィルタ文字列">
          </b-col>
          <b-col cols="4">
            <b-dropdown id="ddown-buttons" split right variant="success" size="sm" class="sorter">
              <template slot="button-content">
                {{sortKey}}
                <span class="arrow" :class="sortOrders[sortKey] > 0 ? 'asc' : 'dsc'"></span>
              </template>
              <b-dropdown-item v-for="(val, idx) in columns" v-bind:key=idx @click="sortBy(val)" :class="[{ active: sortKey == val }, { focus: sortKey == val }]">
                {{ val }}
              </b-dropdown-item>
            </b-dropdown>
          </b-col>
          <b-col cols="2">
            <img :src="icon_new_issue" class="new_issue" width='30px' height='30px' @click="createIssue"/>
          </b-col>
          <b-col cols="2">
            <img :src="icon_refresh_issue" v-if="connected" class="refresh_issue" width='25px' height='25px' @click="refreshIssue"/>
          </b-col>
        </b-row>
      </b-container>
    </div>

    <div class="data-field">
      <div v-for="(entry,idx) in issues" v-bind:key=idx @click="editIssue(entry)">
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
import naim from '../models/naim.js'
import util from '../models/util.js'
import editstate from '../models/editState.js'
import iconNew from '../assets/new.png'
import iconRefresh from '../assets/refresh.png'

export default {
//  name: 'TicketList',
  data () {
    let sortOrders = {}
    util.columns.forEach(function (key) {
      sortOrders[key] = 1
    })

    return {
      userName: '',
      icon_new_issue: iconNew,
      icon_refresh_issue: iconRefresh,
      columns: util.columns,
      searchQuery: '',
      sortKey: 'キー',
      sortOrders: sortOrders,
      isslist: [],
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
    },
    issues: function () {
      let ret = this.isslist
      let filterKey = this.searchQuery && this.searchQuery.toLowerCase()
      if (filterKey) {
        // console.log('filterData by filterKey changed');
        ret = ret.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      let sortKey = this.sortKey
      let order = this.sortOrders[sortKey] || 1
      if (sortKey) {
        // console.log('filterData by sortKey changed');
        ret = ret.slice().sort(function (a, b) {
          a = a[sortKey]
          b = b[sortKey]
          return (a === b ? 0 : a > b ? 1 : -1) * order
        })
      }
      return ret
    }
  },
  methods: {
    sortBy: function (key) {
      console.log('Issue sortKey : ' + key)
      this.sortKey = key
      this.sortOrders[key] = this.sortOrders[key] * -1
    },
    editIssue: function (issue) {
      console.log('editIssue')
      let issId = issue.id.slice(1)
      let storageKey = 'issue-' + issId
      if (!this.connected && !(storageKey in localStorage)) {
        alert('オフラインモード　詳細情報を取得できません')
      } else {
        console.log('editIssue')
        editstate.currentIssueId = issId
        this.$router.push('/editissue')
      }
    },
    refreshIssue: async function () {
      console.log('refreshIssues')
      await naim.retrieveIssues()
      this.isslist = naim.getIssues()
    },
    createIssue: function () {
      console.log('createIssue')
      editstate.currentIssueId = -1
      this.$router.push('/editissue')
    }
  },
  beforeCreate () {
    console.log('beforeCreate @ IssuesList')
  },
  async created () {
    console.log('created @ IssuesList')
    this.userName = 'mhims1'
    this.isslist = naim.getIssues()
  },
  mounted () {
    console.log('mounted @ IssuesList')
  },
  destroy () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .container-fluid{
    padding: 5px;
    width: 100%;
  }
  .wrapper {
    display: flex;
    display: -webkit-flex;
    flex-direction: row;
    -webkit-flex-direction: row;
  }
  /* growable wrappers */
  .attributes {
    flex-grow: 0;
    -webkit-flex-grow: 0;
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
  .wrapper.attributes.header {
    height: 50px;
  }
  .filter {
    width: 100%;
  }
  .new_issue {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    -webkit-transform: translateY(-50%) translateX(-50%);
    /* float: right; */
  }
  .refresh_issue {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
    -webkit-transform: translateY(-50%) translateX(-50%);
    /* float: right; */
  }
  .query-box {
    margin-bottom: 1em
  }

  .data-field {
    height: 100vh;
    overflow-y: auto;
  }
  .wrapper.attributes.data {
    height: 100px;
  }
  
  .id {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .トラッカー {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .プロジェクト {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .題名 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .優先度 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .ステータス {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .進捗率 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .作成者 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .担当者 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .開始日 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .期日 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
  }
  .期日 {
    width: 100px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    text-align: left;
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
    .wrapper.attributes.header {
      height: auto;
    }
    .wrapper.attributes.data {
      height: auto;
    }
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
    .currentpath-user {
      font-size: small;
      color:  rgb(26, 92, 0);
      margin-left: 1em;
    }
    .sorter {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
    .new_issue .refresh_issue {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateY(-50%) translateX(-50%);
      -webkit-transform: translateY(-50%) translateX(-50%);
      /* float: right; */
    }
    .dropdown .dropdown-menu .dropdown-item:focus {
      outline: none;
      /*
      background-color: #eaeaea;
      color: #1d1e1f;
      */
    }
    .data-field {
      height: 600px;
      overflow-y: auto;
    }
    .filter {
      width: 100%;
      font-size: 16px;
      /* transform: scale(0.8); */
    }
    .ReviewComment {
      overflow: visible;
      white-space: normal;
      text-overflow: clip;
      word-wrap: break-word;
    }
    .attributes {
      flex-direction: column;
      -webkit-flex-direction: column;
    }
    .attributes div {
      flex-grow: 0;
      -webkit-flex-grow: 0;
    }
    .attributes > div {
      width: 100%;
    }
  }
  /*
   * General good-look styles
   */
  div.active {
    color: rgb(55, 11, 177);
  }
  .arrow {
    display: inline-block;
    vertical-align: middle;
    width: 0;
    height: 0;
    margin-left: 5px;
    opacity: 0.0;
  }
  .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid #000;
  }
  .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid #000;
  }
  .sorter .arrow {
    opacity: 1;
  }
  div.active .arrow {
    opacity: 1;
  }
  div.active .arrow.asc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-bottom: 4px solid rgb(55, 11, 177);
  }
  div.active .arrow.dsc {
    border-left: 4px solid transparent;
    border-right: 4px solid transparent;
    border-top: 4px solid rgb(55, 11, 177);
  }
  </style>
