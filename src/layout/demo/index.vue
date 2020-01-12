<template>
  <div>
    <div>
      <a-button type="primary" @click="TomSend">Tom发送</a-button>
      <a-button type="primary" @click="TomReceive">Tom接收</a-button>
    </div>
    <div>
      <a-button type="primary" @click="JerryReceive">Jerry发送</a-button>
      <a-button type="primary" @click="JerrySend">Jerry接收</a-button>
    </div>
    <div>{{ access_token }}</div>
    <div>{{info}}</div>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  export default {
    data () {
      return {
        tom: null,
        jerry: null,
        info: null,
        access_token: ''
      }
    },
    components: {},
    created () {
    },
    mounted () {
      const APPID = 'wx851ea7878ea99d18';
      const APPSECRET = '4c353cf5a856771ecfbc93bd1463e00f'
      this.$axios
        .get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`)
        .then(response => (this.access_token = response.access_token))
      const ACCESS_TOKEN = '24_AxXmIR9ub2QqWVEV7iLHQ7HzBxEIHV9b9nMPsBkMT3r3ZAUAyATbLmZKeHVjoKkFL01V_HF2G1J-iFLa23OAgwivgiQGGny18g9c36GYsjg59AThQY9e0sSisDoM1qOILJTsgKbfoiqM2dAkVKYiACAZOC';
      this.axios({
        method: 'post',
        url: `https://api.weixin.qq.com/tcb/databasecollectionget?access_token=${ACCESS_TOKEN}`,
        data: this.$qs.stringify({
          env: "visitingcqut-700544",
          limit: 10,
          offset: 0
        })
      }).then(response => (this.info = response))
    },
    beforeDestroy () {
    },
    methods: {
      TomSend () {
        const {TextMessage} = require('leancloud-realtime');
        this.realtime.createIMClient('Tom').then(function (tom) {
          this.tom = tom
          // 创建与Jerry之间的对话
          return tom.createConversation({
            members: ['Jerry'],
            name: 'Tom & Jerry',
            unique: true
          });
        }).then(function (conversation) {
          // 发送消息
          return conversation.send(new TextMessage('耗子，起床！！'));
        }).then(function (message) {
          console.log('Tom & Jerry', '发送成功！');
        }).catch(console.error);
      },
      TomReceive () {
        const {Event} = require('leancloud-realtime');
        this.tom.on(Event.MESSAGE, function (message, conversation) {
          console.log('Tom Message received: ' + message.text);
        });
      },
      JerrySend () {
        const {TextMessage} = require('leancloud-realtime');
        // this.realtime.createIMClient('Tom').then(function (tom) {
        //   // 创建与Jerry之间的对话
        //   return tom.createConversation({
        //     members: ['Jerry'],
        //     name: 'Tom & Jerry',
        //     unique: true
        //   });
        // }).then(function (conversation) {
        //   // 发送消息
        //   return conversation.send(new TextMessage('耗子，起床！！'));
        // }).then(function (message) {
        //   console.log('Tom & Jerry', '发送成功！');
        // }).catch(console.error);
        this.tom.send(new TextMessage('耗！！'))
      },
      JerryReceive () {
        const {Event} = require('leancloud-realtime');
        this.realtime.createIMClient('Jerry').then(function (jerry) {
          jerry.on(Event.MESSAGE, function (message, conversation) {
            console.log('Message received: ' + message.text);
          });
        }).catch(console.error);
      },
      getAccessToken () {
        const APPID = 'wx851ea7878ea99d18';
        const APPSECRET = '8bda07146426aa95b9995940285e3a81'
        axios
          .get(`https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`)
          .then(response => (this.access_token = response.access_token))
      }
    },
    computed: {},
    watch: {}
  }
</script>
