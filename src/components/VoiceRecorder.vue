<template>
  <transition name="modal">
    <div class="modal-mask">
      <div class="modal-wrapper">
        <div class="modal-container">
          <div class="modal-header">
            <h5>音声メモ</h5>
            <h5 @click='cancel'>×</h5>
          </div>
          <div>
            <canvas id="canvas" ref="canvas"></canvas>
          </div>
          <div class="modal-body">
            <b-row class='form-box'>
              <b-col cols="6">
                <audio id="audio" ref="audio" controls></audio>
              </b-col>
              <b-col cols="2">
                <icon-base v-if="audioBlob && !isPlaying && !isWaitListening && !isRecording && !isConverting" icon-color="#ff0000" width=30 height=30 icon-name="start-play"><icon-start-Play @startPlay="startPlay"/></icon-base>
                <icon-base v-else-if="(!audioBlob || isWaitListening || isRecording || isConverting)" icon-color="#808080" width=30 height=30 icon-name="start-play"><icon-start-play @startPlay="nop"/></icon-base>
                <icon-base v-else icon-color="#ff0000" width=30 height=30 icon-name="stop-play"><icon-stop-play @stopPlay="stopPlay"/></icon-base>
              </b-col>
              <b-col cols="2">
                <icon-base v-if="!isRecording && !isPlaying && !isConverting && !isWaitListening" icon-color="#ff0000" width=30 height=30 icon-name="start-record"><icon-start-record @startRec="startRec"/></icon-base>
                <icon-base v-else-if="!isRecording && (isPlaying || isConverting || isWaitListening)" icon-color="#808080" width=30 height=30 icon-name="start-record"><icon-start-record @startRec="nop"/></icon-base>
                <icon-base v-else icon-color="#ff0000" width=30 height=30 icon-name="stop-record"><icon-stop-record @stopRec="stopRec"/></icon-base>
              </b-col>
              <b-col cols="2">
                <icon-base v-if="audioBlob && !isPlaying && !isWaitListening && !isRecording && !isConverting && connectStatus" icon-color="#ff0000" width=30 height=30 icon-name="convert-text"><icon-convert-text @startConvert="convertBlob"/></icon-base>
                <icon-base v-else icon-color="#808080" width=30 height=30 icon-name="convert-text"><icon-convert-text @startConvert="nop"/></icon-base>
              </b-col>
            </b-row>
            <!--
            <div>
              <p>listenig : {{listening}}</p>
              <p> WsSendCount : {{wssendcnt}} </p>
              <p> AudioProcessCnt : {{audioprocesscnt}} </p>
            </div>
            -->
            <p> AudioProcessCnt : {{audioprocesscnt}} </p>
            <p class="trans">transcript :</p>
            <div class='transcript scroll-area' ref="transcript">
              <div class='scroll_inner'>
                <p>{{transcript}}</p>
              </div>
            </div>
            <p class="trans">result :</p>
            <div class='result scroll-area' ref="result">
              <div class='scroll_inner'>
                <p>{{result}}</p>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type='button' class="btn btn-default" @click='submit'>確定</button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import stt from '../models/sttWithWebsocket.js'
import sp from '../models/audioSignalProcessor.js'
import ReadableBlobStream from 'readable-blob-stream'
import IconBase from './IconBase.vue'
import IconStartRecord from './icons/IconStartRecord.vue'
import IconStopRecord from './icons/IconStopRecord.vue'
import IconStartPlay from './icons/IconStartPlay.vue'
import IconStopPlay from './icons/IconStopPlay.vue'
import IconConvertText from './icons/IconConvertText.vue'

// "It is recommended for authors to not specify this buffer size and allow the implementation to pick a good
// buffer size to balance between latency and audio quality."
// https://developer.mozilla.org/en-US/docs/Web/API/AudioContext/createScriptProcessor
// however, webkitAudioContext (safari) requires it to be set'
// Possible values: null, 256, 512, 1024, 2048, 4096, 8192, 16384
const bufferSize = (typeof window.AudioContext === 'undefined' ? 4096 : null)
const TIME_OUT_VAL = 720 // value of audioprocesscnt for recordinglimit 30sec
const MODE_REALTIME = 'realtime'
const MODE_BATCH = 'batch'

export default {
  name: 'VoiceRecorder',
  components: {
    IconBase,
    IconStartRecord,
    IconStopRecord,
    IconStartPlay,
    IconStopPlay,
    IconConvertText
  },
  data () {
    return {
      mode: MODE_REALTIME,
      msg: 'ボイスレコーダ',
      audiosource: null,
      mediaStream: null,
      isRecording: false,
      isPlaying: false,
      isConverting: false,
      isWaitListening: false,
      chunks: [],
      audio: null,
      audioContext: null,
      audioInput: null,
      audioElementInput: null,
      audioAnalyser: null,
      audioProcessor: null,
      audioprocesscnt: 0,
      audioBlob: null,
      recordlimit: false,
      result: ''
    }
  },
  computed: {
    connectStatus: function () {
      return this.$store.getters.connectStat
    },
    transcript: function () {
      return this.$store.getters.transcript
    },
    transcribed: function () {
      return this.$store.getters.transcribed
    },
    listening: function () {
      return this.$store.getters.listening
    },
    listeningCount: function () {
      return this.$store.getters.listeningCount
    },
    wssendcnt: function () {
      return this.$store.getters.wssendcount
    }
  },
  watch: {
    listening: function (newVal, oldVal) {
      if (!newVal && oldVal && this.isRecording) {
        console.log('listening() computed value is changed true -> false')
        this.stopRecorder()
      } else if (newVal && !oldVal && !this.isRecording) {
        console.log(' listening change false -> true')
        console.log('this.mode : ' + this.mode)
        if (this.mode === MODE_REALTIME) {
          console.log('listening() computed value is changed false -> true in RealTime')
          this.startRecorder()
        } else if (this.mode === MODE_BATCH) {
          console.log('listening() computed value is changed false -> true in Batch')
          this.startConvert()
        } else {
          console.log('!!!!!!')
        }
      } else {
        console.log('watch listening')
      }
    },
    listeningCount: function (newVal, oldVal) {
      console.log(newVal)
      if (this.mode === MODE_BATCH && newVal === 2) {
        this.stopConvert()
      }
    },
    recordlimit: function (newVal, oldVal) {
      if (newVal && !oldVal) { // false -> true
        this.stopRec()
      }
    },
    transcript: function (newVal, oldVal) {
      this.$refs.transcript.scrollTop = this.$refs.transcript.scrollHeight
    },
    transcribed: function (newVal, oldVal) {
      console.log('store.transcribed changed newVal : ' + newVal)
      if (this.result.length === 0) {
        this.result = newVal
      } else {
        this.result = this.result + ',' + newVal
      }
      this.$refs.result.scrollTop = this.$refs.result.scrollHeight
      console.log('result : ' + this.result)
    }
  },
  methods: {
    submit () {
      this.finlize()
      console.log('VoiceRecorder submitted')
      this.$emit('submitClose')
    },
    cancel () {
      this.finlize()
      console.log('VoiceRecorder canceled')
      this.$emit('cancelClose')
    },
    // ダミーリスナー
    nop () {
      console.log('nop')
    },
    // 確定、エスケープ時の終了処理
    async finlize () {
      if (this.isWaitListening) {
        console.log('fianlize @ wait listening')
        await stt.wsclose()
        this.isWaitListening = false
      } else if (this.isRecording) {
        console.log('fianlize @ recording')
        await this.stopRec()
      } else if (this.isConverting) {
        console.log('fianlize @ converting')
        await this.stopConvert()
      }
    },
    // ----------------
    // 再変換開始制御
    async convertBlob () {
      console.log('convertBlob')
      if (!this.isRecording) {
        this.mode = MODE_BATCH
        let openingMsg = {
          'action': 'start',
          'content-type': 'audio/wav',
          'interim_results': true,
          'continuous': true,
          'inactivity_timeout': -1
        }
        await stt.wsopen(openingMsg)
        this.isWaitListening = true
      }
    },
    async startConvert () {
      console.log('startConvert')
      this.isConverting = true
      this.isWaitListening = false
      this.result = ''
      this.$store.commit('setTranscript', {transcript: ''})
      this.$store.commit('setTranscribed', {transcribed: ''})
      // listening になったら (watch listening から呼び出す)
      // audioBlob から readStream で読み出して、stt.wssend する
      let stream = new ReadableBlobStream(this.audioBlob)
      stream.on('error', error => {
        console.log('error with reading audioBlob')
        console.log(error)
      })
      stream.on('data', data => {
        console.log('read data from audioBlob ')
        stt.wssend(data)
      })
      stream.on('end', () => {
        console.log('read end from audioBlob')
        stt.wssend(Buffer.alloc(0), {binary: true, mask: true})
      })
    },
    async stopConvert () {
      await stt.wsclose()
      this.isConverting = false
      this.mode = MODE_REALTIME
    },
    // ----------------
    // 再生制御
    startPlay () {
      console.log('startPlay')
      this.createPlayer()
      this.audio.play()
      this.isPlaying = true
    },
    async stopPlay () {
      console.log('stopPlay')
      await this.audioElementInput.disconnect()
      await this.audioProcessor.disconnect()
      this.audioProcessor = null
      this.audioAnalyser = null
      this.isPlaying = false
    },
    // ----------------
    // レコーディング開始制御
    async startRec () {
      if (!this.isRecording) {
        if (this.connectStatus) {
          let openingMsg = {
            'action': 'start',
            'content-type': 'audio/l16;rate=16000',
            'word_confidence': false,
            'timestamps': true,
            'interim_results': true,
            'word_alternatives_threshold': 0.01,
            'inactivity_timeout': 2
          }
          await stt.wsopen(openingMsg)
          this.isWaitListening = true
        } else {
          this.startRecorder()
        }
      }
    },
    async startRecorder () {
      if (!this.isRecording) {
        console.log('startRecorder')
        this.result = ''
        this.$store.commit('setTranscript', {transcript: ''})
        this.$store.commit('setTranscribed', {transcribed: ''})
        this.chunks = []
        this.recordlimit = false
        this.$store.commit('setTranscript', {transcript: ''})
        this.$store.commit('setWsSendCount', {sendcnt: 0})
        this.createRecorder()
        console.log('isRecording set true')
        this.isRecording = true
        this.isWaitListening = false
      }
    },
    // レコーディング停止制御
    async stopRec () {
      if (this.isRecording) {
        if (this.connectStatus) {
          await stt.wsclose()
        }
        await this.stopRecorder()
      }
    },
    async stopRecorder () {
      if (this.isRecording) {
        await this.audioInput.disconnect()
        this.audioInput = null
        await this.audioProcessor.disconnect()
        this.audioProcessor = null
        this.audioAnalyser = null
        // await this.audioContext.close()
        let track = this.mediaStream.getAudioTracks()
        track[0].stop()
        this.mediaStream = null
        this.isRecording = false
        // wav file 作成
        this.createWavFile(this.concatChunks(), this.audioContext.sampleRate)
      }
    },
    // ----------------
    // wav file 作成
    concatChunks () {
      console.log('concatChunks')
      let sampleLength = 0
      this.chunks.forEach(chunk => {
        sampleLength += chunk.length
      })
      console.log('sampleLength : ' + sampleLength)
      // ここから結合
      let sampleCnt = 0
      let samples = new Float32Array(sampleLength)
      this.chunks.forEach(chunk => {
        chunk.forEach(sample => {
          samples[sampleCnt] = sample
          sampleCnt++
        })
      })
      return samples
    },
    writeString (view, offset, string) {
      for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i))
      }
    },
    createWavFile (samples, sampleRate) {
      let buffer = new ArrayBuffer(44 + samples.length * 2)
      let view = new DataView(buffer)
      this.writeString(view, 0, 'RIFF') // RIFFヘッダ
      view.setUint32(4, 32 + samples.length * 2, true) // これ以降のファイルサイズ
      this.writeString(view, 8, 'WAVE') // WAVEヘッダ
      this.writeString(view, 12, 'fmt ') // fmtチャンク
      view.setUint32(16, 16, true) // fmtチャンクのバイト数
      view.setUint16(20, 1, true) // フォーマットID
      view.setUint16(22, 1, true) // チャンネル数
      view.setUint32(24, sampleRate, true) // サンプリングレート
      view.setUint32(28, sampleRate * 2, true) // データ速度
      view.setUint16(32, 2, true) // ブロックサイズ
      view.setUint16(34, 16, true) // サンプルあたりのビット数
      this.writeString(view, 36, 'data') // dataチャンク
      view.setUint32(40, samples.length * 2, true) // 波形データのバイト数
      sp.floatTo16BitPCM(view, 44, samples) // 波形データ

      this.audioBlob = new Blob([view], { type: 'audio/wav' })
      this.audio.src = URL.createObjectURL(this.audioBlob)
    },
    // プレーヤー
    createPlayer () {
      console.log('createPlayer')
      if (!this.audioElementInput) {
        this.audioElementInput = this.audioContext.createMediaElementSource(this.audio)
      }
      this.createAudioProcessor(this.audioElementInput)
      this.createAudioAnalyser(this.audioElementInput)
      this.audioElementInput.connect(this.audioContext.destination)
    },
    // レコーディング
    createRecorder () {
      console.log('createRecorder')
      // stop で audioContext.close() する場合、start で再度 construct する必要がある。
      // this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
      navigator.mediaDevices.getUserMedia({ audio: true, video: false })
        .then(stream => {
          this.mediaStream = stream
          this.audioInput = this.audioContext.createMediaStreamSource(stream)
          this.createAudioProcessor(this.audioInput)
          this.createAudioAnalyser(this.audioInput)
        })
        .catch(error => {
          console.log(error)
          alert(error)
        })
    },
    // Audio Processor は Record と play で共通化
    // 音声信号処理
    audioprocess (e) {
      this.audioprocesscnt++
      let source = e.inputBuffer.getChannelData(0)
      let buffer = sp.downSample(source, this.audioContext.sampleRate)
      let data = sp.floatTo16BitPCM(null, 0, buffer)
      stt.wssend(data)
      //  レコーディング
      let chunk = source.slice()
      this.chunks.push(chunk)
      if (this.audioprocesscnt > TIME_OUT_VAL) {
        this.recordlimit = true
      }
    },
    createAudioProcessor (audioInput) {
      console.log('createAudioProcessor')
      this.audioprocesscnt = 0
      sp.resetProcessor()
      this.audioProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1)
      this.audioProcessor.onaudioprocess = this.audioprocess
      audioInput.connect(this.audioProcessor)
      this.audioProcessor.connect(this.audioContext.destination)
    },
    // Audio Analyser は Record と play で共通化
    createAudioAnalyser (audioInput) {
      console.log('createAudioAnalyser')
      // --- Audio Visualize
      this.audioAnalyser = this.audioContext.createAnalyser()
      audioInput.connect(this.audioAnalyser)
      let canvas = this.$refs.canvas
      let cw = canvas.width
      let ch = canvas.height
      let drawContext = canvas.getContext('2d')
      let self = this
      // --
      /*
      this.audioAnalyser.fftSize = 2048
      const array = new Uint8Array(self.audioAnalyser.fftSize)
      const barWidth = cw / self.audioAnalyser.fftSize
      function draw () {
        self.audioAnalyser.getByteTimeDomainData(array)
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)'
        drawContext.fillRect(0, 0, cw, ch)

        for (let i = 0; i < self.audioAnalyser.fftSize; ++i) {
          const value = array[i]
          const percent = value / 255
          const height = ch * percent
          const offset = ch - height

          drawContext.fillStyle = 'lime'
          drawContext.fillRect(i * barWidth, offset, barWidth, 2)
        }
        requestAnimationFrame(draw)
      }
      draw()
      */
      // --
      this.audioAnalyser.fftSize = 512
      const bufferLength = this.audioAnalyser.frequencyBinCount
      const array = new Uint8Array(bufferLength)
      const barWidth = (cw / bufferLength) * 2.5

      function renderFrame () {
        self.audioAnalyser.getByteFrequencyData(array)
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)'
        drawContext.fillRect(0, 0, cw, ch)
        let x = 0

        for (var i = 0; i < bufferLength; i++) {
          let barHeight = array[i]
          var r = barHeight + (25 * (i / bufferLength))
          var g = 250 * (i / bufferLength)
          var b = 50
          drawContext.fillStyle = 'rgb(' + r + ',' + g + ',' + b + ')'
          // drawContext.fillRect(x, ch - barHeight, barWidth, barHeight)
          drawContext.fillRect(x, ch - array[i] * ch / 255, barWidth, barHeight)
          /*
          if (ch < barHeight) {
            console.log('Over Ch : ' + ch + ', ' + barHeight)
          }
          */
          x += barWidth + 1
        }
        requestAnimationFrame(renderFrame)
      }
      renderFrame()
      // --
      /*
      this.audioAnalyser.fftSize = 2048
      const array = new Uint8Array(self.audioAnalyser.fftSize)
      function draw () {
        // ask the browser to schedule a redraw before the next repaint
        requestAnimationFrame(draw)

        // clear the canvas
        drawContext.fillStyle = 'rgba(0, 0, 0, 1)'
        drawContext.fillRect(0, 0, cw, ch)

        drawContext.lineWidth = 2
        drawContext.strokeStyle = '#f00'
        drawContext.beginPath()

        let sliceWidth = cw * 1.0 / self.audioAnalyser.fftSize
        let x = 0

        self.audioAnalyser.getByteTimeDomainData(array)

        for (let i = 0; i < self.audioAnalyser.fftSize; i++) {
          let v = array[i] / 128.0
          let y = v * ch / 2
          i === 0 ? drawContext.moveTo(x, y) : drawContext.lineTo(x, y)
          x += sliceWidth
        }
        drawContext.lineTo(cw, ch / 2)
        drawContext.stroke()
      }
      draw()
      */
    }
  },
  mounted () {
    console.log('VoiceRecorder mounted')
    this.audio = this.$refs.audio
    this.audio.onended = this.stopPlay
    // stop で audioContext.close() しなければ、mounted で construct しておけばよい。
    this.audioContext = new (window.AudioContext || window.webkitAudioContext)()
    this.$store.commit('setTranscript', {transcript: ''})
    this.$store.commit('setTranscribed', {transcribed: ''})
    this.$store.commit('setListening', {listening: false})
    this.$store.commit('setListeningCount', {listeningCount: 0})
    this.$store.commit('setWsSendCount', {sendcnt: 0})
  }
}
</script>

<style>
canvas {
  width: 100%;
  height: 128px
}
button {
  padding: 0.5em 1em;
  border-width: 0;
  border-radius: 0.25em;
  font-size: 1em;
  background-color: #dfdfdf;
  color: #333;
}
button[disabled] {
  color: #aaa;
}
audio {
  width: 100%;
}
.transcript.scroll-area {
  width: 100%;
  height: 2.5em;
  overflow: auto;
  border:#8db8ff solid 1px;
}
.result.scroll-area {
  width: 100%;
  height: 4.5em;
  overflow: auto;
  border:#8db8ff solid 1px;
}
.scroll-inner {
  height: auto;
}
.trans {
  margin-top: 0.5rem;
  margin-bottom: 0rem;
}
@import '../style/modal.css'
</style>