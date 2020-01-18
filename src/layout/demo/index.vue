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
    async mounted () {
      const {access_token} = await new Promise((resolve) => {
        this.$axios
          .get(`https://net.songxingguo.workers.dev/wx/token`)
          .then(response => {
            resolve(response)
          })
      })
      const {sites} = await new Promise((resolve) => {
        this.$axios
          .get(`https://net.songxingguo.workers.dev/coll?access_token=${access_token}`)
          .then(response => {
            resolve(response)
          })
      })
      console.log(sites)
      this.info = sites
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
      async getAccessToken () {
        const {access_token} = await new Promise((resolve) => {
          this.$axios
            .get(`https://net.songxingguo.workers.dev/wx/token`)
            .then(response => {
              resolve(response)
            })
        })
        this.access_token = access_token
      }
    },
    computed: {},
    watch: {}
  }
</script>
