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
    <div class="content-area">
      <!-- 标签页 -->
      <a-tabs defaultActiveKey="index"
              @change="handleTabChange">
        <a-tab-pane v-for="tab in tabList" :key="tab.key">
          <span slot="tab">
            <a-icon :type="tab.icon"/>
            {{tab.name}}
          </span>
          <div style="width: 95%">
            <!-- 时间轴 -->
            <a-timeline mode="right">
              <a-timeline-item>
                <div slot="dot" class="flex-row" style="margin-left: 40px">
                  <a-icon type="clock-circle-o" style="font-size: 16px;"/>
                  <span class="ml5">2019</span>
                </div>
                <!-- 内容 -->
                <a-row :gutter="16">
                  <a-col :span="6" v-for="item in tab.imgList">
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
              </a-timeline-item>
            </a-timeline>
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
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import Album from '../../model/album'
  import moment from 'moment'

  export default {
    data () {
      return {
        fileInfo: {},
        data: {},
        pagination: {
          pageSizeOptions: ['10', '20', '30', '40', '50'],
          current: 1,
          pageSize: 10,
          total: 50,
          marker: ''
        },
        prefix: 'index',
        tabList: [
          {
            name: '精选',
            key: 'index',
            icon: 'apple',
            imgList: []
          },
          {
            name: '相册',
            key: 'album',
            icon: 'instagram',
            imgList: []
          },
          {
            name: '相机',
            key: 'canon',
            icon: 'chrome',
            imgList: []
          },
        ]
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
      handleTabChange (activeKey) {
        this.prefix = activeKey
        this.loadData(activeKey)
      },
      async loadData (prefix = 'index') {
        try {
          const {marker: nMarker, pageSize} = this.pagination
          const {marker, data} = await Album.getImgs({prefix, pageSize})
          this.pagination.marker = marker
          const imgList = this.handleImg(data, prefix)
          this.tabList.find(({key}) => key === prefix).imgList = imgList
        } catch (err) {
          console.error(err)
        }
      },
      handleImg (data, prefix) {
        return data.map(item => {
          switch (prefix) {
            case 'index':
              return this.handleIndex(item)
            case 'album':
              return this.handleAlbum(item)
            case 'canon':
              return this.handleAlbum(item)
          }
        })
      },
      handleIndex (item) {
        const {address, grade = '', url} = item
        return {
          ...item,
          url: `${url}/watermark`,
          address: address.replace(/-/g, '·'),
          addressStr: address.replace(/-/g, '，'),
          grade,
          visible: false
        }
      },
      handleAlbum (item) {
        const {address, grade = '', url} = item
        return {
          ...item,
          url: `${url}/watermark`,
          address: address.replace(/-/g, '·'),
          addressStr: address.replace(/-/g, '，'),
          grade,
          visible: false
        }
      },
      async edit (item) {
        const {visible, key,} = item
        if (visible) return
        try {
          await Album.edit(key, await this.genDesKey(item))
          this.$message.success('编辑成功', 1)
          this.loadData()
        } catch (err) {
          console.error(err)
        }
      },
      genDesKey (item) {
        const {prefix, key} = item
        switch (prefix) {
          case 'index':
            return this.genIndexDesKey(item)
          case 'album':
            return this.genAlbumDesKey(item)
          case 'canon':
            return key
        }
      },
      async genIndexDesKey (item) {
        const {addressStr, grade, prefix, url} = item
        let {dateTime} = await Album.getImgExif(url)
        dateTime = moment(dateTime, 'YYYY:MM:DD HH:mm:ss').format('YYYYMMDDHHmm')
        return `${prefix}/${dateTime}_${addressStr.replace(/，/g, '-')}_${grade}`
      },
      async genAlbumDesKey (item) {
        const {addressStr, grade, prefix, url} = item
        let {dateTime} = await Album.getImgExif(url)
        dateTime = moment(dateTime, 'YYYY:MM:DD HH:mm:ss').format('YYYYMMDDHHmm')
        return `${prefix}/${dateTime}_${addressStr.replace(/，/g, '-')}_${grade}`
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
        return true
      }
    },
    watch: {}
  }
</script>
