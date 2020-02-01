<template>
  <div>
    <!-- 上传按钮 -->
    <a-upload
            name="file"
            action="https://up.qiniup.com"
            :beforeUpload="beforeUpload"
            :data="data"
            @change="handleChange">
      <a-button>
        <a-icon type="upload"/>
        上传
      </a-button>
    </a-upload>
    <!-- 内容 -->
    <div class="content-area">
      <a-row :gutter="16">
        <a-col :span="6" v-for="item in imgList">
          <a-card hoverable style="margin: 10px 0">
            <img
                    :alt="item.name"
                    :src="item.url"
                    slot="cover"/>
            <template class="ant-card-actions" slot="actions">
              <a-popover trigger="click"
                         v-model="item.visible"
                         @visibleChange="() => edit(item)">
                <div slot="content">
                  <a-form>
                    <a-form-item>
                      <a-input placeholder="地址" v-model="item.addressStr"/>
                    </a-form-item>
                    <a-form-item>
                      <a-input placeholder="评级" v-model="item.grade"/>
                    </a-form-item>
                  </a-form>
                </div>
                <a-icon type="edit"/>
              </a-popover>
              <a-popconfirm
                      title='确认要删除?'
                      okText="确认"
                      cancelText="取消"
                      @confirm="() => deleteItem(item.key)">
                <a-icon type="delete"/>
              </a-popconfirm>
              <a-icon type="ellipsis" @click="ellipsis"/>
            </template>
            <a-card-meta>
              <template slot="title">
                {{item.address}}
              </template>
            </a-card-meta>
          </a-card>
        </a-col>
      </a-row>
    </div>
    <template v-if="!isEmpty">
      <!-- 分页 -->
      <a-pagination
              :pageSizeOptions="pagination.pageSizeOptions"
              :total="pagination.total"
              showSizeChanger
              :pageSize="pagination.pageSize"
              v-model="pagination.current"
              @showSizeChange="onShowSizeChange"
              @change="onChange">
        <template slot="buildOptionText" slot-scope="props">
          <span v-if="props.value!=='50'">{{props.value}}条/页</span>
          <span v-if="props.value==='50'">全部</span>
        </template>
      </a-pagination>
    </template>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import Album from '../../model/album'

  export default {
    data () {
      return {
        imgList: [],
        fileInfo: {},
        data: {},
        pagination: {
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          current: 1,
          pageSize: 10,
          total: 50,
          marker: ''
        }
      }
    },
    components: {},
    async created () {
    },
    mounted () {
      this.loadData()
    },
    destroyed () {
    },
    methods: {
      async loadData () {
        try {
          const {marker: nMarker, pageSize} = this.pagination
          const {marker, data} = await Album.getImgs(nMarker, pageSize)
          this.pagination.marker = marker
          this.imgList = data.map(item => {
            const {address, grade = ''} = item
            return {
              ...item,
              address: address.replace(/-/g, '·'),
              addressStr: address.replace(/-/g, ','),
              grade,
              visible: false
            }
          })
        } catch (err) {
          console.error(err)
        }
      },
      async edit (item) {
        const {visible, addressStr, grade, key, prefix} = item
        if (visible) return
        const deskey = `${prefix}${addressStr.replace(/,/g, '-')}_${grade}`
        try {
          await Album.edit(key, deskey)
          this.$message.success('编辑成功', 1)
          this.loadData()
        } catch (err) {
          console.error(err)
        }
      },
      async deleteItem (key) {
        try {
          await Album.delete(key)
          this.$message.success('删除成功', 1)
          this.loadData()
        } catch (err) {
          console.error(err)
        }
      },
      ellipsis () {
        this.$message.info('功能正在开发中', 1)
      },
      async beforeUpload (file) {
        const {uid, name} = file
        const uploadToken = await Album.uploadToken()
        this.data = {
          token: uploadToken,
          key: `album/${uid}_${name}`,
        }
      },
      handleChange (info) {
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 上传成功`);
          this.loadData()
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`);
        }
      },
      onChange (page, pageSize) {

      },
      onShowSizeChange (current, pageSize) {
        this.pagination.pageSize = pageSize
        this.loadData()
      },
    },
    computed: {
      isEmpty () {
        return this.imgList.length === 0
      }
    },
    watch: {}
  }
</script>
