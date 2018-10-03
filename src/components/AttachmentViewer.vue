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
      <video class="videoView" controls autoplay playsinline>
        <source :src="contentUrlSrc">
      </video>
    </div>
  </div>
</template>

<script>
import URLjoin from 'url-join'
import config from '../config.js'
import editstate from '../models/editState.js'

export default {
  data () {
    return {
      attachment: null,
      image_src: null
    }
  },
  computed: {
    isImage () {
      return this.attachment.content_type.indexOf('image') !== -1
    },
    contentUrlSrc () {
      let url = URLjoin(config.BaseURL, '/data/', editstate.currentIssueId + '/', this.attachment.id + '_' + this.attachment.filename)
      return url
    },
    contentUrlSrcset () {
      let url = URLjoin(config.BaseURL, '/data/', editstate.currentIssueId + '/', this.attachment.id + '_' + this.attachment.filename + ' 1x')
      return url
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