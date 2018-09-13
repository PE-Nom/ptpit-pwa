<template>
  <div class="content-fulied">
    <b-navbar type="dark" variant="success">
      <b-navbar-brand to="/editissue">&lt;&lt; 指摘 更新</b-navbar-brand>
    </b-navbar>
    <p>名前 : {{attachment.filename}}</p>
    <p>説明 : {{attachment.description}}</p>
    <div v-if="isImage">
      <img class="imageView" :src="contentUrlSrc" :srcset="contentUrlSrcset">
      </img>
    </div>
    <div v-else>
      <video class="videoView" controls="" autoplay>
        <source :src="contentUrlSrc">
      </video>
    </div>
  </div>
</template>

<script>
import editstate from '../models/editState.js'

export default {
  data () {
    return {
      test_url: 'http://192.168.10.5/JS/data/', // @ for demo
      attachment: null,
      image_src: null
    }
  },
  computed: {
    isImage () {
      return this.attachment.content_type.indexOf('image') !== -1
    },
    contentUrlSrc () {
      return this.test_url +
              editstate.currentIssueId + '/' +
              this.attachment.id + '_' +
              this.attachment.filename
    },
    contentUrlSrcset () {
      return this.test_url +
              editstate.currentIssueId + '/' +
              this.attachment.id + '_' +
              this.attachment.filename + ' 1x'
    }
  },
  created () {
    console.log('AttachmentViewer.created()')
    console.log(editstate.attachment)
    this.attachment = editstate.attachment
    console.log('  filename :' + this.attachment.filename)
    console.log('  description :' + this.attachment.description)
    console.log('  content_type : ' + this.attachment.content_type)
    console.log('  content_url : ' + this.attachment.content_url)
    console.log('  id : ' + this.attachment.id)
  }
}
</script>

<style>
.imageView {
  width: 100%;
  height: auto;
}
.videoView {
  width: 100%;
  height: auto;
}
</style>