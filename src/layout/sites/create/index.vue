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
            <a-input v-model="model.desc"></a-input>
          </a-form-item>
          <a-form-item label="位置">
            <a-input v-model="model.position"></a-input>
          </a-form-item>
          <a-form-item label="经纬度">
            <a-input v-model="model.location"></a-input>
          </a-form-item>
          <a-form-item label="图片">
            <upload></upload>
          </a-form-item>
        </a-col>
      </a-row>
      <a-divider orientation="left">音频</a-divider>
      <a-row :gutter="20">
        <a-col :span="8">
          <a-form-item>
            <a-input placeholder="名称" v-model="model.audio.name"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <a-input placeholder="海报" v-model="model.audio.poster"></a-input>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item>
            <a-input placeholder="音频" v-model="model.audio.url"></a-input>
          </a-form-item>
        </a-col>
      </a-row>
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
            url: ''
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
        loading: false
      }
    },
    components: {upload},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      submit () {
        this.model.desc = this.model.desc.trim().split(/\s+/)
        const {APPID, APPSECRET} = {
          APPID: 'wx851ea7878ea99d18',
          APPSECRET: '8bda07146426aa95b9995940285e3a81'
        }
        this.$axios
          .get(`/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`)
          .then(({data: {access_token}}) => {
              this.$axios.post(`/tcb/databaseadd?access_token=${access_token}`, {
                "env": "test-ptpuu",
                "query": `db.collection('sites').add({data: ${JSON.stringify(this.model)}})`
              }).then(() => {
                this.$message.success('提交成功！')
                this.back()
              })
            }
          )
      },
      back () {
        setTimeout(() => {
          this.$router.replace('/sites')
        }, 800)
      },
    },
    computed: {}
    ,
    watch: {}
  }
</script>
