<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="loadingArea">
        <fade-loader :loading="loading" :color="color" :height="height" :width="width"></fade-loader>
      </div>
      <div class="messageArea"><p :style="{color: color, fontSize: '24px'}">{{message}}</p></div>
    </div>
  </transition>    
</template>

<script>
// import {RotateSquare2} from 'vue-loading-spinner'
import FadeLoader from 'vue-spinner/src/FadeLoader.vue'

export default {
  name: 'Indicator',
  props: {
    message: {
      type: String,
      default: '更新中です'
    },
    color: {
      type: String,
      default: '#ffffff'
    },
    height: {
      type: String,
      default: '15px'
    },
    width: {
      type: String,
      default: '5px'
    },
    margin: {
      type: String,
      default: '2px'
    },
    radius: {
      type: String,
      default: '20px'
    }
  },
  components: {
    // RotateSquare2
    FadeLoader
  }
}
</script>

<style>
.loadingArea {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  -webkit-transform: translateY(-50%) translateX(-50%);
}
.messageArea {
  position: absolute;
  top: 60%;
  transform: translateY(-50%);
  -webkit-transform: translateY(-50%);
  width: 100%;
  text-align:center;
}
</style>
