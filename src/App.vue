<template>
  <div id="app">

    <b-navbar v-if="showNavbar" toggleable="md" type="dark" variant="success">
      <b-navbar-brand to="/">Pit-SAN (version:{{version}})</b-navbar-brand>
      <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
      <b-collapse is-nav id="nav_collapse">
        <b-navbar-nav>
          <b-nav-item to="/tickets">指摘一覧</b-nav-item>
          <b-nav-item to="/pendingrequests">未登録の指摘一覧</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <router-view />

  </div>
</template>

<script>
import _ from 'lodash'
import router from './router'
import naim from './models/naim.js'

export default {
  name: 'app',
  data () {
    return {
      activeUser: false,
      version: '1.00',
      tablet: false
    }
  },
  computed: {
    currentPath: function () {
      let path = 'ホーム'
      if (this.$route.path === '/tickets') {
        path = 'チケット'
      }
      return path
    },
    showNavbar: function () {
      let show = true
      if (this.$route.path !== '/' &&
          this.$route.path !== '/tickets' &&
          this.$route.path !== '/pendingrequests') {
        show = false
      }
      return show
    }
  },
  async beforeCreate () {
    console.log('beforeCreate @ App.vue')
    // 起動時にredmineのデータを取り込む取得
    try {
      await naim.initialize()
    } catch (err) {
      console.log('------- initialize　失敗 -------')
      alert(err)
    }
  },
  async created () {
    console.log('created @ App.vue')
    this.tablet = window.innerWidth < 769
    // インスタンスを作成した後、イベントリスナに登録
    window.addEventListener('resize', this.setTabletMode, false)
    window.addEventListener('online', this.onlineEventHandler, false)
    window.addEventListener('offline', this.offlineEventHandler, false)
  },
  mounted () {
    router.push('/')
  },
  beforeDestroy () {
    // インスタンスを破棄する前に、イベントリスナから削除
    window.removeEventListener('resize', this.setTabletMode, false)
  },
  methods: {
    // 無くても良いが lodash の debounce で発火頻度を調整してあげるとエコ
    setTabletMode: _.debounce(function () {
      // data にリサイズ後のウィンドウ幅を代入
      this.tablet = window.innerWidth < 769
      console.log('setTabletMode : ' + this.tablet)
    }, 300),
    onlineEventHandler (event) {
      this.$store.commit('setConnectStat', {connectStat: true})
    },
    offlineEventHandler (event) {
      this.$store.commit('setConnectStat', {connectStat: false})
    }
  }
}
</script>

<style>

body {
  overflow: hidden;
  margin: 0;
}

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

main {
  text-align: center;
  margin-top: 40px;
}

header {
  margin: 0;
  height: 56px;
  padding: 0 16px 0 24px;
  background-color: #35495E;
  color: #ffffff;
}

header span {
  display: block;
  position: relative;
  font-size: 20px;
  line-height: 1;
  letter-spacing: .02em;
  font-weight: 400;
  box-sizing: border-box;
  padding-top: 16px;
}
</style>
