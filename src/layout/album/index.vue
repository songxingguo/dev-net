<template>
  <div>
    <!-- 上传按钮 -->
    <a-upload
            name="file"
            action="https://up.qiniup.com"
            :beforeUpload="beforeUpload"
            :data="data"
            :fileList="fileList"
            :remove="handleRemove"
            :multiple="true"
            :showUploadList="false"
            @change="handleChange">
      <a-button :disabled="loading || uploading"
                :loading="loading">
        <a-icon type="upload" v-if="!loading"/>
        {{loading?'加载中':'选择'}}
      </a-button>
    </a-upload>
    <a-button
            type="primary"
            @click="handleUpload"
            :disabled="fileList.length === 0"
            :loading="uploading"
            style="margin-top: 16px;margin-left: 10px"
    >
      {{ uploading ? '上传中' : '开始上传' }}
    </a-button>
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
                <a-popover trigger="hover"
                           arrowPointAtCenter
                           placement="top"
                           overlayClassName="img-box"
                           slot="cover">
                  <template slot="content">
                    <img :alt="item.name"
                         :src="item.url"
                         slot="cover"
                         class="preview-img"/>
                  </template>
                  <img :alt="item.name"
                       :src="item.url"/>
                </a-popover>
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
                      <a-popover trigger="hover"
                                 arrowPointAtCenter
                                 placement="top"
                                 overlayClassName="img-box"
                                 slot="cover">
                        <template slot="content">
                          <img :alt="item.name"
                               :src="item.url"
                               slot="cover"
                               class="preview-img"/>
                        </template>
                        <img :alt="item.name"
                             :src="item.url"/>
                      </a-popover>
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
                        <a-icon :type="item.locked?'lock':'unlock'" @click="toggleLock(item)"/>
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
                <a-popover trigger="hover"
                           arrowPointAtCenter
                           placement="top"
                           overlayClassName="img-box"
                           slot="cover">
                  <template slot="content">
                    <img :alt="item.name"
                         :src="item.url"
                         slot="cover"
                         class="preview-img"/>
                  </template>
                  <img :alt="item.name"
                       :src="item.url"/>
                </a-popover>
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
    <!-- 加载更多 -->
    <div style="text-align: center;">
      <a-spin :spinning="curPagination.spinning">
        <a-button type="link" @click="loadData"
                  v-if="!curPagination.isNoMore&&!curPagination.spinning">加载更多
        </a-button>
      </a-spin>
    </div>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import Album from '../../model/album'
  import moment from 'moment'
  import EXIF from 'exif-js'

  function pagination ({marker = '', spinning = false, isNoMore = false, limit = 50} = {}) {
    return {
      marker,
      spinning,
      isNoMore,
      limit
    }
  }

  function TabItem ({name = '', key = '', icon = '', imgList = [], data = [], pagination = {}} = {}) {
    return {
      name,
      key,
      icon,
      imgList,
      data,
      pagination,
    }
  }

  export default {
    data () {
      return {
        fileInfo: {},
        data: {},
        spinning: false,
        prefix: 'index',
        tabList: [
          TabItem({
            name: '精选',
            key: 'index',
            icon: 'apple',
            pagination: pagination()
          }),
          TabItem({
            name: '相册',
            key: 'album',
            icon: 'instagram',
            pagination: pagination({limit: 100})
          }),
          TabItem({
            name: '相机',
            key: 'canon',
            icon: 'chrome',
            pagination: pagination({limit: 500})
          }),
        ],
        uploadToken: '',
        fileList: [],
        uploading: false,
        loading: false
      }
    },
    components: {},
    created () {
    },
    async mounted () {
      this.loadData()
    },
    destroyed () {
    },
    methods: {
      handleTabChange (activeKey) {
        this.prefix = activeKey
        if (this.curTab.imgList.length !== 0) return
        this.loadData()
      },
      refreshData ({key, newItem, prefix}) {
        prefix = prefix ? prefix : this.prefix
        const allData = this.tabList.find(({key}) => key === prefix).data
        if (key) {
          const index = allData.findIndex((item) => item.key === key)
          if (newItem) {
            allData.splice(index, 1, newItem)
          } else {
            allData.splice(index, 1)
          }
        } else {
          allData.unshift(newItem)
        }
        const imgList = this.handleImg(allData, prefix)
        this.tabList.find(({key}) => key === prefix).imgList = imgList
        this.tabList.find(({key}) => key === prefix).data = allData
      },
      async loadData () {
        try {
          const {spinning} = this
          const {marker: nMarker, limit, isNoMore} = this.curPagination
          if (spinning || isNoMore) return
          this.curPagination.spinning = true
          const {prefix} = this
          const {marker, data} = await Album.getImgs({prefix, limit, marker: nMarker})
          let allData = this.curTab.data
          allData.push(...data)
          const imgList = this.handleImg(allData, prefix)
          this.curTab.imgList = imgList
          this.curTab.data = allData
          this.curPagination.marker = marker
          this.curPagination.spinning = false
          if (!marker) this.curPagination.isNoMore = true
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
          url: `${url}/mobile`,
          address: address,
          addressStr: address,
          grade,
          visible: false
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
      async toggleLock (item) {
        const {locked, key, url} = item
        const arr = key.split('/')
        const prefix = arr[0]
        const name = arr[arr.length - 1]
        const desKey = [prefix, `${!locked ? 1 : 0}`, name].join('/')
        try {
          await Album.edit(key, desKey)
          this.$message.success(`${locked ? '解锁成功' : '上锁成功'}`, 1)
          this.refreshData({key, newItem: {...item, url: url.replace('/watermark', ''), locked: !locked}})
        } catch (err) {
          console.error(err)
        }
      },
      async edit (item) {
        const {visible, key, url, addressStr} = item
        if (visible) return
        try {
          await Album.edit(key, await this.genDesKey(item))
          this.$message.success('编辑成功', 1)
          this.refreshData({
            key,
            newItem: {...item, url: url.replace('/watermark', ''), address: addressStr.replace('，', '·')}
          })
        } catch (err) {
          console.error(err)
        }
      },
      genDesKey (item) {
        let {prefix, key} = item
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
        const {addressStr, grade, url, locked} = item
        let {dateTime} = await Album.getImgExif(url)
        dateTime = moment(dateTime, 'YYYY:MM:DD HH:mm:ss').format('YYYYMMDDHHmm')
        return [prefix, `${locked ? 1 : 0}`, `${dateTime}_${addressStr.replace(/，/g, '-')}_${grade}`].join('/')
      },
      async deleteItem (key) {
        try {
          await Album.delete(key)
          this.$message.success('删除成功', 1)
          this.refreshData({key})
        } catch (err) {
          console.error(err)
        }
      },
      ellipsis () {
        this.$message.info('功能正在开发中', 1)
      },
      async onIndex (item) {
        try {
          const {key, url} = item
          const prefix = 'index'
          const desKey = await this.genIndexDesKey({...item, url: url.replace('/mobile', '/watermark')}, prefix)
          await Album.copy(key, desKey)
          this.$message.success('拷贝成功', 1)
          this.refreshData({prefix, newItem: {...item, url: url.replace('/mobile', ''), key: desKey}})
        } catch (err) {
          console.error(err)
        }
      },
      async onAlbum (item) {
        try {
          const {key, url} = item
          const prefix = 'album'
          const desKey = await this.genAlbumDesKey({...item, url: url.replace('/mobile', '/watermark')}, prefix)
          await Album.copy(key, desKey)
          this.$message.success('拷贝成功', 1)
          this.refreshData({prefix, newItem: {...item, url: url.replace('/mobile', ''), key: desKey}})
        } catch (err) {
          console.error(err)
        }
      },
      beforeUpload (file) {
        this.fileList = [...this.fileList, file]
        this.loading = true
        return false
      },
      async handleUpload () {
        try {
          const {fileList} = this
          const allKeys = fileList.map(item => `canon/${item.name}`)
          const {keys} = await Album.batchCheck(allKeys)
          this.loading = false
          this.uploading = true
          const token = await Album.uploadToken()
          const uFileList = fileList.filter(item => keys.findIndex(key => key == `canon/${item.name}`) >= 0)
          await Promise.all(uFileList.map(file => {
            const {name} = file
            const formData = new FormData()
            formData.append('file', file)
            formData.append('token', token)
            formData.append('key', `canon/${name}`)
            return Album.upload(formData)
          }))
          this.fileList = []
          this.uploading = false
          this.$message.success(`${uFileList.length}个图片上传成功`)
        } catch ({message}) {
          this.uploading = false
        }
      },
      handleChange (info) {
        if (info.file.status === 'done') {
          this.$message.success(`${info.file.name} 上传成功`);
        } else if (info.file.status === 'error') {
          this.$message.error(`${info.file.name} 上传失败`);
        }
      },
      handleRemove (file) {
        const index = this.fileList.indexOf(file);
        const newFileList = this.fileList.slice();
        newFileList.splice(index, 1);
        this.fileList = newFileList;
      }
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
      curTab: {
        get: function () {
          return this.tabList.find(({key}) => key === this.prefix)
        },
        set: function (value) {
          const index = this.tabList.findIndex(({key}) => key === this.prefix)
          this.tabList[index] = value
        }
      },
      curPagination: {
        get: function () {
          return this.tabList.find(({key}) => key === this.prefix).pagination
        },
        set: function (value) {
          const index = this.tabList.findIndex(({key}) => key === this.prefix)
          this.tabList[index].pagination = value
        }
      }
    },
    watch: {}
  }
</script>
