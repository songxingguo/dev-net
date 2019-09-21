<template>
  <div>
    <a-table
            :columns="columns"
            :dataSource="data"
            bordered
            :rowKey='record => record.id'>
      <div class="flex-row flex-space-around" slot="images" slot-scope="images">
        <PreviewImage :src="image.attributes.url" v-for="image in images" :key="image.id"/>
      </div>
      <template slot="state" slot-scope="text">
        <a v-if="text == 0">待审核</a>
        <a v-else-if="text == 1">审核通过</a>
        <a v-else>审核未通过</a>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class='editable-row-operations'>
          <span v-if="record.isPassed == 0">
            <a-popconfirm
                    title='确认通过审核?'
                    okText="确认"
                    cancelText="取消"
                    @confirm="() => passExamine(record.id)">
            <a>通过</a>
            </a-popconfirm>
            <a-divider type="vertical"/>
            <a @click="showModal(record)">不通过</a>
            <a-divider type="vertical"/>
          </span>
          <a-popconfirm
                  title='确认要删除?'
                  okText="确认"
                  cancelText="取消"
                  @confirm="() => deleteGoods(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
    <collection-create-form
            ref="collectionForm"
            :visible="visible"
            :record="record"
            @cancel="handleCancel"
            @create="handleCreate"
    />
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import PreviewImage from '../../components/preview-image/index'

  const columns = [{
    title: '标题',
    dataIndex: 'title',
    width: '10%',
  }, {
    title: '内容',
    dataIndex: 'content',
    width: '15%',
  }, {
    title: '物品图片',
    dataIndex: 'imgList',
    width: '25%',
    scopedSlots: {customRender: 'images'},
  }, {
    title: '类型',
    dataIndex: 'type.attributes.name',
    width: '10%',
  }, {
    title: '价格',
    dataIndex: 'price',
    width: '10%',
    scopedSlots: {customRender: 'price'},
  }, {
    title: '状态',
    dataIndex: 'isPassed',
    width: '10%',
    scopedSlots: {customRender: 'state'},
  }, {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
  }];
  const CollectionCreateForm = {
    props: ['visible', 'record'],
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    template: `
    <a-modal
      :visible="visible"
      title='审核建议'
      okText='提交'
      cancelText="取消"
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create', record) }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='建议'>
          <a-textarea
            placeholder="存在的问题、改进建议"
            v-decorator="[
                'suggest',
                {
                  rules: [{ required: true, message: '请输入审核建议' }],
                }
              ]"
              :rows="8"
              @keyup.enter="() => { $emit('create', record)}"/>
        </a-form-item>
      </a-form>
    </a-modal>
  `,
  }
  const NOT_PASSED = -1 // 审核未通过
  const PASSED = 1 // 审核通过
  const NOT_READ = 0 // 未阅读
  export default {
    data () {
      return {
        columns,
        data: [],
        visible: false,
        record: null
      }
    },
    components: {PreviewImage, CollectionCreateForm},
    created () {
    },
    mounted () {
      this.loadGoodsList((data) => {
        this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
      })
    },
    beforeDestroy () {
    },
    methods: {
      showModal (record) {
        this.visible = true;
        this.record = record;
      },
      handleCancel () {
        this.visible = false;
      },
      handleCreate (record) {
        const form = this.$refs.collectionForm.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          this.notPassExamine(record.id)
          this.createNotice(Object.assign({...values}, {...record}))
          form.resetFields();
          this.visible = false;
        });
      },
      loadGoodsList (callback) {
        const AV = this.AV
        const query = new AV.Query('Goods')
        query.ascending('createdAt')
        query.include('owner')
        query.include('imgList')
        query.include('type')
        query.equalTo('isDelete', false)
        query.find().then(data => {
          callback(data)
        }).catch(error => {
          alert(JSON.stringify(error))
        })
      },
      deleteGoods (id) {
        const goods = this.AV.Object.createWithoutData('Goods', id);
        goods.destroy().then(() => {
          this.$message.success('删除成功', 1)
          this.loadGoodsList((data) => {
            this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
          })
        }, function (error) {
          console.error(error)
        });
      },
      passExamine (id) {
        const goods = this.AV.Object.createWithoutData('Goods', id)
        goods.set('isPassed', PASSED)
        goods.save().then(() => {
          this.$message.success('审核通过', 1)
        })
        this.loadGoodsList((data) => {
          this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
        })
      },
      notPassExamine (id) {
        const goods = this.AV.Object.createWithoutData('Goods', id)
        goods.set('isPassed', NOT_PASSED)
        goods.save().then(() => {
          this.$message.success('审核不通过', 1)
          this.loadGoodsList((data) => {
            this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
          })
        })
      },
      createNotice ({suggest, owner}) {
        const Notice = this.AV.Object.extend('Notices')
        const notice = new Notice()
        notice.set('content', suggest)
        notice.set('sendTime', new Date())
        notice.save().then(notice => {
          const UserNotice = this.AV.Object.extend('UserNotices')
          const userNotice = new UserNotice()
          // userNotice.set('owner', owner)
          userNotice.set('isRead', NOT_READ)
          userNotice.set('notice', notice)
          userNotice.save().then(() => {
            this.$message.success('已通知用户', 1)
          }, error => {
            console.error(error)
          })
        }, error => {
          console.error(error)
        })
      }
    },
    computed: {},
    watch: {}
  }
</script>
