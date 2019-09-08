<template>
  <div>
    <a-button type="primary" class="mb20" @click="create">新增</a-button>
    <a-table
            :columns="columns"
            :dataSource="data"
            :pagination="pagination"
            @change="handleChange"
            bordered
            :rowKey='record => record.id'>
      <template slot="desc" slot-scope="text">
        <tooltip :value="text"></tooltip>
      </template>
      <template slot="images" slot-scope="record">
        <preview-image v-for="(item, index) in record" :key="index" :src="item.url"/>
      </template>
      <audio slot="audioUrl" slot-scope="text" :src="text" controls="controls" class="audio">
        您的浏览器不支持 audio 标签。
      </audio>
      <preview-image slot="poster" slot-scope="text" :src="text"/>
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
  import Sites from '../../../model/sites'
  import PreviewImage from '../../../components/preview-image/index'
  import Tooltip from '../../../components/tooltip/index'

  const columns = [{
    title: '名称',
    dataIndex: 'title'
  }, {
    title: '类型',
    dataIndex: 'type',
    width: '8%',
  }, {
    title: '描述',
    dataIndex: 'desc',
    scopedSlots: {customRender: 'desc'},
    width: '10%',
  }, {
    title: '位置',
    dataIndex: 'position',
  }, {
    title: '经纬度',
    dataIndex: 'location'
  }, {
    title: '图片',
    dataIndex: 'images',
    scopedSlots: {customRender: 'images'},
    width: '20%',
  }, {
    title: '名称',
    dataIndex: 'audio.name',
  }, {
    title: '海报',
    dataIndex: 'audio.poster.url',
    scopedSlots: {customRender: 'poster'}
  }, {
    title: '音频',
    dataIndex: 'audio.src.url',
    scopedSlots: {customRender: 'audioUrl'}
  }, {
    title: '操作',
    dataIndex: 'operation',
    width: '10%',
    scopedSlots: {customRender: 'operation'},
  }];
  export default {
    data () {
      return {
        data: [],
        pagination: {},
        columns,
        visible: false,
        record: null,
        info: {}
      }
    },
    components: {PreviewImage, Tooltip},
    created () {
    },
    mounted () {
      this.loadData()
    },
    beforeDestroy () {
    },
    methods: {
      async handleChange (pagination) {
        this.pagination = pagination
        await this.loadData()
      },
      async loadData () {
        try {
          const {data, pagination} = await Sites.list(this.pagination)
          if (!data) return
          this.data = await data
          console.log(this.data)
          this.pagination = pagination
        } catch (err) {
          console.error(err)
        }
      },
      create () {
        this.$router.push(`/sites/create`)
      },
      edit ({id}) {
        this.$router.push(`/sites/${id}/edit`)
      },
      async deleteItem ({id}) {
        try {
          await Sites.delete(id)
          this.$message.success('删除成功！')
          this.loadSiteList()
        } catch (err) {
          console.error(err)
        }
      }
    },
    computed: {},
    watch: {}
  }
</script>
