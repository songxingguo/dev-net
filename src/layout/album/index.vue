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
        <!-- 首页 -->
        <a-tab-pane :key="indexObj.key">
          <span slot="tab">
            <a-icon :type="indexObj.icon"/>
            {{indexObj.name}}
          </span>
          <!-- 内容 -->
          <a-row :gutter="16">
            <a-col :span="6" v-for="item in indexObj.imgList">
              <a-card hoverable style="margin: 10px 0">
                <img :alt="item.name"
                     :src="item.url"
                     slot="cover"/>
                <template class="ant-card-actions" slot="actions">
                  <a-popover trigger="click"
                             v-model="item.visible"
                             @visibleChange="() => edit(item)">
                    <div slot="content">
                      <a-form>
                        <a-form-item>
                          <a-input placeholder="名称" v-model="item.addressStr"/>
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
        </a-tab-pane>
        <!-- 相册 -->
        <a-tab-pane :key="albumObj.key">
          <span slot="tab">
            <a-icon :type="albumObj.icon"/>
            {{albumObj.name}}
          </span>
          <div style="width: 95%">
            <!-- 时间轴 -->
            <a-timeline mode="right" v-for="imgObj in albumObj.imgList">
              <a-timeline-item>
                <div slot="dot" class="flex-row" style="margin-left: 40px">
                  <a-icon type="clock-circle-o" style="font-size: 16px;"/>
                  <span class="ml5">{{imgObj.name}}</span>
                </div>
                <!-- 内容 -->
                <a-row :gutter="16">
                  <a-col :span="6" v-for="item in imgObj.list">
                    <a-card hoverable style="margin: 10px 0">
                      <img :alt="item.name"
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
          </div>
        </a-tab-pane>
        <!-- 相机 -->
        <a-tab-pane :key="canonObj.key">
          <span slot="tab">
            <a-icon :type="canonObj.icon"/>
            {{canonObj.name}}
          </span>
          <!-- 内容 -->
          <a-row :gutter="16">
            <a-col :span="6" v-for="item in canonObj.imgList">
              <a-card hoverable style="margin: 10px 0">
                <img :alt="item.name"
                     :src="item.url"
                     slot="cover"/>
                <template class="ant-card-actions" slot="actions">
                  <a-icon type="apple" @click="onIndex(item)"/>
                  <a-icon type="instagram" @click="onAlbum(item)"/>
                  <a-popconfirm
                          title='确认要删除?'
                          okText="确认"
                          cancelText="取消"
                          @confirm="() => deleteItem(item.key)">
                    <a-icon type="delete"/>
                  </a-popconfirm>
                </template>
                <a-card-meta>
                  <template slot="title">
                    {{item.address}}
                  </template>
                </a-card-meta>
              </a-card>
            </a-col>
          </a-row>
        </a-tab-pane>
      </a-tabs>
    </div>
    <div @click="loadData">加载更多</div>
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
            imgList: [],
            data: []
          },
          {
            name: '相册',
            key: 'album',
            icon: 'instagram',
            imgList: [],
            data: []
          },
          {
            name: '相机',
            key: 'canon',
            icon: 'chrome',
            imgList: [],
            data: []
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
        this.loadData()
      },
      async loadData () {
        try {
          const {marker: nMarker, pageSize} = this.pagination
          const {prefix} = this
          const {marker, data} = await Album.getImgs({prefix, pageSize, marker: nMarker})
          this.pagination.marker = marker
          let allData = this.tabList.find(({key}) => key === prefix).data
          allData.push(...data)
          const imgList = this.handleImg(allData, prefix)
          this.tabList.find(({key}) => key === prefix).imgList = imgList
          this.tabList.find(({key}) => key === prefix).data = allData
        } catch (err) {
          console.error(err)
        }
      },
      handleImg (data, prefix) {
        switch (prefix) {
          case 'index':
            return data.map(item => {
              return this.handleIndex(item)
            })
          case 'album':
            return this.chunkList(data.map(item => {
              return this.handleAlbum(item)
            }))
          case 'canon':
            return data.map(item => {
              return this.handleCanon(item)
            })
        }
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
      chunkList (imgList) {
        if (!Array.isArray(imgList)) return
        const form = 2019
        const to = this.moment().years()
        const cImgList = []
        for (let i = to; i >= form; i--) {
          const imgArr = imgList.filter(({key}) => key.includes(i))
          if (imgArr.length !== 0) {
            cImgList.push({name: i, list: imgArr})
          }
        }
        return cImgList
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
          key: `canon/${name}`,
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
      indexObj () {
        return this.tabList[0]
      },
      albumObj () {
        return this.tabList[1]
      },
      canonObj () {
        return this.tabList[2]
      },
    },
    watch: {}
  }
</script>
