<template>
  <div class="preview-image">
    <a-tooltip placement="right" overlayClassName="tooltip--image"
               :mouseEnterDelay="0.3">
      <template slot="title">
        <img class="preview-image--ori"
             v-if="src"
             :src="src" alt="封面">
      </template>
      <img class="preview-image--item preview-image--mini"
           v-if="src"
           :src="src" alt="封面">
    </a-tooltip>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  export default {
    name: 'preview-image',
    props: {
      src: {
        type: String,
        default: null
      }
    },
    data () {
      return {}
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
    watch: {}
  }
</script>
