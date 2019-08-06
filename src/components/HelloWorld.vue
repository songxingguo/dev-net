<template>
  <a-button type="primary" @click="addTodo">{{ msg }}</a-button>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  mounted() {
    // this.addTodo()
  },
  methods: {
    addTodo() {
      const Todo = this.AV.Object.extend('Todos')
      // 新建一个 Todo 对象
      var todo = new Todo()
      todo.set('title', '工程师周会')
      todo.set('content', '每周工程师会议，周一下午2点')
      todo.save().then(function (todo) {
        // 成功保存之后，执行其他逻辑.
        console.log('New object created with objectId: ' + todo.id)
      }, function (error) {
        // 异常处理
        console.error('Failed to create new object, with error message: ' + error.message)
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
