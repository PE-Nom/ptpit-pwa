<template>
  <div class="content-fulied">
    <b-navbar type="dark" variant="success">
      <b-navbar-brand to="/editpendingrequest">&lt;&lt; 未登録指摘一覧</b-navbar-brand>
    </b-navbar>
    <p>名前 : {{attachment.value.name}}</p>
    <p>説明 : {{attachment.value.description}}</p>
    <div v-if="isImage">
      <img class="imageView" :src="contentUrlSrc">
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
      attachment: null
    }
  },
  computed: {
    isImage () {
      return this.attachment.value.file_property_bag.type.indexOf('image') !== -1
    },
    contentUrlSrc () {
      return this.attachment.value.mediaData
    }
  },
  created () {
    console.log('PendingRequestAttachmentViewer.created()')
    console.log(editstate.attachment)
    this.attachment = editstate.attachment
    console.log('  filename :' + this.attachment.value.name)
    console.log('  description :' + this.attachment.value.description)
    console.log('  content_type : ' + this.attachment.value.file_property_bag.type)
    console.log('  id : ' + this.attachment.value.id)
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