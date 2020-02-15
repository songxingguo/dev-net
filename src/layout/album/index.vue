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
                        <div v-if="tab.key==='canon'">
                          <a-popover trigger="click"
                                     v-model="item.eVisible">
                            <div slot="content">
                              <p>
                                <a-button block @click="onIndex(item)">首页</a-button>
                              </p>
                              <p>
                                <a-button block @click="onAlbum(item)">相册</a-button>
                              </p>
                            </div>
                            <a-icon type="ellipsis"/>
                          </a-popover>
                        </div>
                        <div v-else>
                          <a-icon type="ellipsis" @click="ellipsis"/>
                        </div>
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
              return this.handleCanon(item)
          }
        })
      },
      handleIndex (item) {
        const {address, grade = '', url} = item
        return {
          ...item,
          name: '',
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
          name: '',
          url: `${url}/watermark`,
          address: address.replace(/-/g, '·'),
          addressStr: address.replace(/-/g, '，'),
          grade,
          visible: false
        }
      },
      handleCanon (item) {
        const {address, grade = '', url} = item
        return {
          ...item,
          name: '',
          url: `${url}/watermark`,
          address: address.replace(/-/g, '·'),
          addressStr: address.replace(/-/g, '，'),
          grade,
          visible: false,
          eVisible: false
        }
      },
      async edit (item) {
        const {visible, key} = item
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
            return this.genIndexDesKey(item, prefix)
          case 'album':
            return this.genAlbumDesKey(item, prefix)
          case 'canon':
            return key
        }
      },
      async genIndexDesKey (item, prefix) {
        const {addressStr, grade, url} = item
        let {dateTime} = await Album.getImgExif(url)
        dateTime = moment(dateTime, 'YYYY:MM:DD HH:mm:ss').format('YYYYMMDDHHmm')
        return `${prefix}/${dateTime}_${addressStr.replace(/，/g, '-')}_${grade}`
      },
      async genAlbumDesKey (item, prefix) {
        const {addressStr, grade, url} = item
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
      async onIndex (item) {
        const {key} = item
        try {
          await Album.copy(key, await this.genIndexDesKey(item, 'index'))
          this.$message.success('拷贝成功', 1)
          this.loadData()
        } catch (err) {
          console.error(err)
        }
      },
      async onAlbum (item) {
        const {key} = item
        try {
          await Album.copy(key, await this.genAlbumDesKey(item, 'album'))
          this.$message.success('拷贝成功', 1)
          this.loadData()
        } catch (err) {
          console.error(err)
        }
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
    computed: {},
    watch: {}
  }
</script>
