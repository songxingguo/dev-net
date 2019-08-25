<template>
  <div>
    <a-button type="primary" class="mb20" @click="create">新增</a-button>
    <a-table
            :columns="columns"
            :dataSource="data"
            bordered
            :rowKey='record => record._id'>
      <div class="preview-image flex-row flex-space-around" slot="images" slot-scope="url">
        <a-tooltip placement="right"
                   overlayClassName="tooltip--image"
                   :mouseEnterDelay="0.3">
          <template slot="title">
            <img class="preview-image--ori"
                 v-if="url"
                 :src="url" alt="地点图片"/>
          </template>
          <img class="preview-image--item preview-image--mini"
               v-if="url"
               :src="url" alt="地点图片"/>
        </a-tooltip>
      </div>
      <template slot="operation" slot-scope="text, record">
        <div class='editable-row-operations'>
          <a @click="() => edit(record)">编辑</a>
          <a-divider type="vertical"/>
          <a-popconfirm
                  title='确认要删除?'
                  okText="确认"
                  cancelText="取消"
                  @confirm="() => deleteItem(record)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </div>
</template>
<style lang="scss" scoped>
  @import 'index';
</style>
<script>
  const columns = [{
    title: '名称',
    dataIndex: 'title',
    width: '10%',
  }, {
    title: '类型',
    dataIndex: 'type',
    width: '5%',
  }, {
    title: '描述',
    dataIndex: 'desc',
    width: '25%',
  }, {
    title: '位置',
    dataIndex: 'position',
    width: '10%',
  }, {
    title: '经纬度',
    dataIndex: 'location',
    width: '10%',
  }, {
    title: '音频',
    dataIndex: 'audio',
    width: '10%',
  }, {
    title: '图片',
    dataIndex: 'url',
    width: '10%',
    scopedSlots: {customRender: 'images'},
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: '15%',
    scopedSlots: {customRender: 'operation'},
  }];
  export default {
    data () {
      return {
        data: [],
        columns,
        visible: false,
        record: null,
        access_token: '',
        info: {}
      }
    },
    components: {},
    created () {
    },
    mounted () {
      this.loadSiteList()
    },
    beforeDestroy () {
    },
    methods: {
      handleChange (value, key, column) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target[column] = value
          this.data = newData
        }
      },
      loadSiteList () {
        console.log(this.access_token)
        this.$axios.post(`/tcb/databasequery?access_token=${this.access_token}`, {
          "env": "test-ptpuu",
          "query": "db.collection('sites').limit(10).skip(1).get()"
        }).then(({data: {data}}) => {
          if (!data) return
          this.data = data.map(item => {
            return JSON.parse(item)
          })
        })
      },
      create () {
        this.$router.push(`/sites/create`)
      },
      edit ({_id:id}) {
        this.$router.push(`/sites/${id}/edit`)
      },
      deleteItem ({_id: id}) {
        const {APPID, APPSECRET} = {
          APPID: 'wx851ea7878ea99d18',
          APPSECRET: '8bda07146426aa95b9995940285e3a81'
        }
        this.$axios
          .get(`/cgi-bin/token?grant_type=client_credential&appid=${APPID}&secret=${APPSECRET}`)
          .then(({data: {access_token}}) => {
            this.$axios.post(`/tcb/databasedelete?access_token=${access_token}`, {
              "env": "test-ptpuu",
              "query": `db.collection('sites').doc('${id}').remove()`
            }).then(() => {
              this.$message.success('删除成功！')
              this.loadSiteList()
            })
          })
      }
    },
    computed: {},
    watch: {}
  }
</script>
