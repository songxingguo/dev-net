<template>
  <div>
    <a-button type="primary" class="mb20" @click="showModal">新增</a-button>
    <collection-create-form
            ref="collectionForm"
            :visible="visible"
            @cancel="handleCancel"
            @create="handleCreate"
    />
    <a-table :columns="columns" :dataSource="data" bordered :rowKey='record => record.id'>
      <template v-for="col in ['name']" :slot="col" slot-scope="text, record">
        <div :key="col">
          <a-input
                  v-if="record.editable"
                  style="margin: -5px 0"
                  :value="text"
                  @change="e => handleChange(e.target.value, record.key, col)"
          />
          <template v-else>{{text}}</template>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <div class='editable-row-operations'>
        <span v-if="record.editable">
          <a @click="() => save(record.key)">保存</a>
          <a-popconfirm
                  title='确认要取消?'
                  okText="确认"
                  cancelText="取消"
                  @confirm="() => cancel(record.key)">
            <a>取消</a>
          </a-popconfirm>
        </span>
          <span v-else>
             <a @click="() => edit(record.key)">编辑</a>
          </span>
          <a-divider type="vertical"/>
          <a-popconfirm
                  title='确认要删除?'
                  okText="确认"
                  cancelText="取消"
                  @confirm="() => deleteType(record.id)">
            <a>删除</a>
          </a-popconfirm>
        </div>
      </template>
    </a-table>
  </div>
</template>
<style lang="scss" scoped>
  @import './index.scss';
  
  .editable-row-operations a {
    margin-right: 8px;
  }
</style>
<script>
  const columns = [{
    title: '名称',
    dataIndex: 'name',
    width: '70%',
  }, {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: {customRender: 'operation'},
  }];
  const CollectionCreateForm = {
    props: ['visible'],
    beforeCreate () {
      this.form = this.$form.createForm(this);
    },
    template: `
    <a-modal
      :visible="visible"
      title='新增类型'
      okText='新增'
      cancelText="取消"
      @cancel="() => { $emit('cancel') }"
      @ok="() => { $emit('create') }"
    >
      <a-form layout='vertical' :form="form">
        <a-form-item label='名称'>
          <a-input
            v-decorator="[
              'name',
              {
                rules: [{ required: true, message: '请输入名称' }],
              }
            ]"
            @keyup.enter="() => { $emit('create') }"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  `,
  }
  export default {
    data () {
      return {
        columns,
        data: [],
        visible: false,
      }
    },
    components: {CollectionCreateForm},
    created () {
    },
    mounted () {
      this.loadTypes((data) => {
        this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
      })
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
      edit (key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          target.editable = true
          this.data = newData
        }
      },
      save (key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          delete target.editable
          this.data = newData
          this.cacheData = newData.map(item => ({...item}))
          this.editType(target)
        }
      },
      cancel (key) {
        const newData = [...this.data]
        const target = newData.filter(item => key === item.key)[0]
        if (target) {
          Object.assign(target, this.cacheData.filter(item => key === item.key)[0])
          delete target.editable
          this.data = newData
        }
      },
      showModal () {
        this.visible = true;
      },
      handleCancel () {
        this.visible = false;
      },
      handleCreate () {
        const form = this.$refs.collectionForm.form;
        form.validateFields((err, values) => {
          if (err) {
            return;
          }
          this.createType(values)
          form.resetFields();
          this.visible = false;
        });
      },
      loadTypes (callback) {
        const AV = this.AV
        const query = new AV.Query('GoodsTypes')
        query.ascending('createdAt')
        query.find().then(data => {
          callback(data)
        }).catch(error => {
          alert(JSON.stringify(error))
        })
      },
      createType ({name}) {
        const GoodsType = this.AV.Object.extend('GoodsTypes')
        const goodsType = new GoodsType()
        goodsType.set('name', name)
        goodsType.save().then(() => {
          this.$message.success('新增成功', 1)
          this.loadTypes((data) => {
            this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
          })
        }, error => {
          console.error(error)
        });
      },
      editType (item) {
        const goodsType = this.AV.Object.createWithoutData('GoodsTypes', item.id)
        goodsType.set('name', item.name)
        goodsType.save().then(() => {
          this.$message.success('修改成功', 1)
        });
      },
      deleteType (id) {
        const goodsType = this.AV.Object.createWithoutData('GoodsTypes', id);
        goodsType.destroy().then(() => {
          this.$message.success('删除成功', 1)
          this.loadTypes((data) => {
            this.data = data.map((item, i) => Object.assign({}, {...item.attributes}, {id: item.id}, {key: i.toString()}))
          })
        }, function (error) {
          console.error(error)
        });
      }
    },
    computed: {},
    watch: {}
  }
</script>
