<template>
  <a-upload
          name="file"
          :multiple="true"
          action="https://net.songxingguo.workers.dev/test/md"
          @change="handleChange">
    <a-button>
      <a-icon type="upload"/>
      Click to Upload
    </a-button>
  </a-upload>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  export default {
    data () {
      return {}
    },
    components: {},
    created () {
    },
    async mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      handleChange (info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} file upload failed.`);
        }
      },
    },
    computed: {},
    watch: {}
  }
</script>
