import Vue from 'vue'
import Router from 'vue-router'
import MainLayout from '../layout/main'
import DemoLayout from '../layout/demo'
import GoodsTypeLayout from '../layout/goodsType'
import GoodsExamineLayout from '../layout/goodsExamine'
import IsStudentExamine from '../layout/isStudentExamine'
import Login from '../layout/login'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: Login
    },
    {
    path: '',
    meta: {
      requireAuth: true,
    },
    component: MainLayout,
    children: [
      {
        path: '/demo',
        meta: {
          requireAuth: true,
        },
        component: DemoLayout
      },
      {
        path: '/goodsType',
        meta: {
          requireAuth: true,
        },
        component: GoodsTypeLayout
      }, {
        path: '/goodsExamine',
        meta: {
          requireAuth: true,
        },
        component: GoodsExamineLayout
      }, {
        path: '/isStudentExamine',
        meta: {
          requireAuth: true,
        },
        component: IsStudentExamine
      }, {
        path: '*',
        meta: {
          requireAuth: true,
        },
        component: GoodsTypeLayout
      }
    ]
  }]
})
