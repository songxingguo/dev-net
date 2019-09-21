<template>
  <div>
    <a-form>
      <a-form-item label="请输入需要合成的文案（随机示例）">
        <a-textarea :placeholder="placeholderText" :rows="6" v-model="text"/>
      </a-form-item>
      <a-form-item label="发音人">
        <a-radio-group v-model="voiceName">
          <a-radio value="x_ningning">讯飞宁宁</a-radio>
          <a-radio value="xiaoyan">小燕</a-radio>
        </a-radio-group>
      </a-form-item>
      <a-button type="primary" @click="play">
        <a-icon :type="iconType"/>
        播放
      </a-button>
      <a-button class="ml-s" @click="download">
        <a-icon type="download"/>
        下载
      </a-button>
    </a-form>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import {Base64} from 'js-base64'
  import MD5 from 'js-md5'
  import {download} from '../../utils/util'

  const placeholderText = '科大讯飞成立于1999年，是中国先进的智能化语音技术提供商，其语音核心技术代表世界先进水平。我们提供的语音合成效果，达到了真正可商用的标准，您可以在这里输入任意文本进行语音合成体验。'

  export default {
    data () {
      return {
        text: '',
        url: '',
        voiceName: 'x_ningning',
        audio: null,
        placeholderText: placeholderText,
        blobUrl: '',
        paused: true
      }
    },
    components: {},
    async created () {
      this.audio = new Audio()
    },
    mounted () {
    },
    destroyed () {
      this.audio.pause()
      this.audio = null
    },
    methods: {
      async getVoice () {
        const appid = '5c308e57'
        const apiKey = '13c1a7ef9bde624e183ef8051074d5a2'
        const curTime = Math.round(new Date() / 1000)
        const param = Base64.encode(`{
          "auf": "audio/L16;rate=16000",
          "aue": "lame",
          "voice_name": ${JSON.stringify(this.voiceName)},
          "speed": "50",
          "volume": "50",
          "pitch": "50",
          "engine_type": "intp65",
          "text_type": "text"
        }`)
        const checkSum = MD5(`${apiKey}${curTime}${param}`)
        try {
          const {data} = await this.axios({
            method: 'post',
            headers: {
              "X-Appid": appid,
              "X-CurTime": curTime,
              "X-Param": param,
              "X-CheckSum": checkSum,
              "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
            },
            url: '/xfyun/v1/service/v1/tts',
            params: {
              text: this.text ? this.text : placeholderText
            },
            responseType: 'blob' // TODO 不采用 responseType 对数据进行处理
          })
          if (data.type === "text/plain") return console.error(data) // 异常处理
          // const blob = new Blob([data], {type: 'audio/mp3'})
          this.blobUrl = URL.createObjectURL(data)
          this.audio.src = this.blobUrl
        } catch (err) {
          console.error(err)
        }
      },
      async play () {
        const {paused, audio} = this
        if (paused) {
          await this.getVoice() // 加载音频数据
          audio.play()
          audio.addEventListener('ended', () => {
            audio.pause() // 音频结束后暂停
            this.paused = audio.paused // 设置音频播放状态
          }, false)
        } else {
          audio.pause()
        }
        this.paused = audio.paused // 设置音频播放状态
      },
      async download () {
        await this.getVoice() // 加载音频数据
        download(this.blobUrl, '音频')
      }
    },
    computed: {
      iconType () {
        return this.paused ? 'caret-right' : 'pause'
      }
    },
    watch: {}
  }
</script>
