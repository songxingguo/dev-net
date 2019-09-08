<template>
  <div>
    <a-form>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="标题">
            <a-input v-model="model.title"></a-input>
          </a-form-item>
          <a-form-item label="类型">
            <a-select v-model="model.type" placeholder="选择类型">
              <a-select-option v-for="item in categories" :key="item.code" :value="item.code">{{item.name}}
              </a-select-option>
            </a-select>
          </a-form-item>
          <a-form-item label="描述">
            <a-textarea v-model="model.desc" :autosize="{minRows:2,maxRows:8}"></a-textarea>
          </a-form-item>
          <a-form-item label="位置">
            <a-input v-model="model.position"></a-input>
          </a-form-item>
          <a-form-item label="经纬度">
            <a-input v-model="model.location"></a-input>
            <a href="https://lbs.amap.com/console/show/picker" target="_blank">坐标拾取器</a>
          </a-form-item>
          <a-form-item label="图片">
            <upload v-model="model.images" :size="5"></upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">音频</a-divider>
      <a-row :gutter="20">
        <a-col :span="12">
          <a-form-item label="名称">
            <a-input v-model="model.audio.name"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
      <a-form-item label="音频">
        <upload v-model="model.audio.src" listType="text" accept="audio/*"></upload>
      </a-form-item>
      <a-form-item label="海报">
        <upload v-model="model.audio.poster"></upload>
      </a-form-item>
      <a-button type='primary' :loading="loading" @click="submit">
        提交
      </a-button>
    </a-form>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import upload from '../../../components/upload'
  import Sites from '../../../model/sites'

  export default {
    data () {
      return {
        model: {
          title: '',
          type: undefined,
          desc: '',
          position: '',
          location: '',
          audio: {
            name: '',
            poster: '',
            src: ''
          },
          images: []
        },
        categories: [{
          name: '景点',
          code: 'scenic'
        }, {
          name: '院系',
          code: 'dept'
        }, {
          name: '教学楼',
          code: 'building'
        }, {
          name: '宿舍',
          code: 'dormitory'
        }, {
          name: '餐饮',
          code: 'diningroom'
        }, {
          name: '图书馆',
          code: 'library'
        }, {
          name: '场馆',
          code: 'site'
        }, {
          name: '出入门',
          code: 'gate'
        }, {
          name: 'ATM',
          code: 'atm'
        }, {
          name: '卫生间',
          code: 'toilet'
        }, {
          name: '服务',
          code: 'service'
        }
        ],
        loading: false,
        siteId: undefined
      }
    },
    components: {upload},
    created () {
      this.siteId = this.$route.params.id
      if (!this.siteId) return
      this.loadEditData(this.siteId)
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      async loadEditData (id) {
        this.model = await Sites.show(id)
        console.log(this.model)
      },
      async submit () {
        try {
          this.isUpdate ? await Sites.edit(this.siteId, this.model) : await Sites.create(this.model)
          this.$message.success('新增成功！')
          this.back()
        } catch (err) {
          console.error(err)
        }
      },
      back () {
        setTimeout(() => {
          this.$router.replace('/sites')
        }, 800)
      }
    },
    computed: {
      isUpdate () {
        return this.siteId !== undefined
      }
    },
    watch: {}
  }
</script>
