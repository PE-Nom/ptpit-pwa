<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h5>音声メモ</h5>
            <h5 @click='cancel'>×</h5>
          </div>
          <div class="modal-body">
            <p>Some text in the Modal Body</p>
            <p>Some other text...</p>
          </div>
          <div class="modal-footer">
            <button type='button' class="btn btn-primary" @click='submit'>確定</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
export default {
  name: 'VoiceRecorder',
  date () {
    return {
    }
  },
  methods: {
    submit () {
      console.log('VoiceRecorder submitted')
      this.$emit('submitClose')
    },
    cancel () {
      console.log('VoiceRecorder canceled')
      this.$emit('cancelClose')
    }
  },
  mounted () {
    console.log('VoiceRecorder mounted')
  }
}
</script>

<style>
@import '../style/modal.css'
</style>