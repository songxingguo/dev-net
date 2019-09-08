<template>
  <div>
    <a-tooltip placement="rightTop">
      <template slot='title'>
        {{value}}
      </template>
      {{value | more(maxLen)}}
    </a-tooltip>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  export default {
    data () {
      return {}
    },
    props: {
      value: {
        type: String,
        default: ''
      },
      maxLen: Number,
      placement: {
        type: String,
        default: 'rightTop'
      }
    },
    components: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {},
    computed: {},
    watch: {},
    filters: {
      more: function (value, maxLen = 10) {
        if (value && value.length > maxLen) {  //字符最大长度
          value = value.substring(0, maxLen) + "...";  //超过省略
        }
        return value;
      }
    }
  }
</script>
