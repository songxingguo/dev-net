<template>
  <a-layout id="components-layout-demo-side" style="min-height: 100vh">
    <a-layout-sider
            collapsible
            v-model="collapsed">
      <div class="logo">{{name}}</div>
      <a-menu theme="dark" :defaultSelectedKeys="['1']" mode="inline">
        <a-sub-menu key="sub1">
          <span slot="title"><a-icon type="notification"/><span>知晓理工</span></span>
          <a-menu-item key="5">
            <router-link to="/sites">地点</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <span slot="title"><a-icon type="home"/><span>理工小铺</span></span>
          <a-menu-item key="2">
            <router-link to="/goodsType">类型管理</router-link>
          </a-menu-item>
          <a-menu-item key="3">
            <router-link to="/goodsExamine">物品审核</router-link>
          </a-menu-item>
          <a-menu-item key="4">
            <router-link to="/isStudentExamine">实名审核</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub5">
          <span slot="title"><a-icon type="coffee"/><span>图片</span></span>
          <a-menu-item key="7">
            <router-link to="/album">相册</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub3">
          <span slot="title"><a-icon type="tool"/><span>工具</span></span>
          <a-menu-item key="6">
            <router-link to="/voice">语音合成</router-link>
          </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub4">
          <span slot="title"><a-icon type="rocket"/><span>实验室</span></span>
          <a-menu-item key="1">
            <router-link to="/demo">通讯测试</router-link>
          </a-menu-item>
          <a-menu-item key="8">
            <router-link to="/md2json">md2json</router-link>
          </a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header style="background: #fff;" class="flex-row flex-end  flex-items-center pr50">
        <a-button icon="poweroff" @click="logOut">
          退出登录
        </a-button>
      </a-layout-header>
      <a-layout-content style="margin: 0 16px">
        <div :style="{ padding: '24px', background: '#fff', minHeight: '360px' , margin: '16px 0'}">
          <router-view></router-view>
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        DevNet ©2018 Created by Songxingguo
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<style lang="scss" scoped>
  @import './index.scss';
</style>
<script>
  import {removeAuthToken} from '../../utils/api'

  export default {
    data () {
      return {
        collapsed: false,
      }
    },
    components: {},
    created () {
    },
    mounted () {
    },
    beforeDestroy () {
    },
    methods: {
      logOut () {
        this.AV.User.logOut();
        removeAuthToken()
        this.$router.push({path: '/login'})
      }
    },
    computed: {
      name () {
        return this.collapsed ? '结网' : '临渊羡鱼，不如退而结网'
      }
    },
    watch: {}
  }
</script>
