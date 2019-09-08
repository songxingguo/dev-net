<template>
  <div class="d-upload">
    <a-upload
            :action="fullAction"
            :accept="accept"
            :listType="listType"
            :fileList="fileList"
            @preview="handlePreview"
            @change="handleChange"
            :data="data"
            :beforeUpload="beforeUpload"
    >
      <template v-if="isPictureCard">
        <div v-if="fileList.length < size">
          <a-icon type="plus"/>
          <div class="ant-upload-text">上传</div>
        </div>
      </template>
      <template v-else>
        <a-button>
          <a-icon type="upload"/>
          上传
        </a-button>
      </template>
    </a-upload>
    <a-modal :visible="previewVisible" :footer="null" @cancel="handleCancel">
      <img alt="example" style="width: 100%" :src="previewImage"/>
    </a-modal>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import NetConfig from '../../../src/config/net'
  import {getAuthToken} from '../../../src/utils/api'
  import Upload from '../../model/upload'

  export default {
    name: 'upload',
    props: {
      value: {
        type: [Array, String],
        default () {
          return []
        }
      },
      size: {
        type: Number,
        default: 1
      },
      listType: {
        type: String,
        default: 'picture-card'
      },
      accept: {
        type: String,
        default: 'jpg,.png,.jpeg'
      }
    },
    data () {
      return {
        fullAction: '',
        previewVisible: false,
        previewImage: '',
        access_token: '',
        fileList: [],
        isFirst: true,
        data: {}
      }
    },
    components: {},
    async created () {
      this.access_token = getAuthToken()
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      handleCancel () {
        this.previewVisible = false
      },
      handlePreview (file) {
        this.previewImage = file.url || file.thumbUrl
        this.previewVisible = true
      },
      handleChange ({fileList}) {
        let inputData = fileList.map(item => item.file_id)
        this.emitInput(inputData)
      },
      emitInput (value) {
        this.$emit('input', this.size > 1 ? value : value[0] || '')
      },
      async beforeUpload (file) {
        const data = await Upload.getUploadUrl({"path": `${file.name}`})
        file.file_id = data.file_id
        this.fullAction = `${NetConfig.apiUrlOfCloud}${data.url.split('.com')[1]}`
        this.data = {
          'key': file.name,
          'Signature': data.authorization,
          'x-cos-security-token': data.token,
          'x-cos-meta-fileid': data.cos_file_id
        }
      }
    },
    computed: {
      isPictureCard () {
        return this.listType === 'picture-card'
      }
    },
    watch: {
      value: {
        async handler () {
          const value = this.value
          if (value.length === 0) return this.fileList = []
          const fileIds = (typeof value === 'string') ? [value] : value
          const fileList = await Upload.getDownloadUrl(fileIds)
          // if (!fileList) return
          this.fileList = fileList
        }
      }
    }
  }
</script>
