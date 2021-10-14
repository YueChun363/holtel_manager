import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

//导入nprogress加载进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

//路由信息数组
const routes = [
  //首页
  {
    path: '/',
    meta: { title: "YC酒店管理系统" }, //设置路由原信息
    component: () => import('@v/Index.vue')
  },
  //登录页
  {
    path: '/login',
    meta: { title: "登录页" },
    component: () => import('@v/Login.vue')
  },
  {
    //后台管理布局页
    path: '/layout',
    meta: { title: "yc酒店管理系统" },
    component: () => import('@v/Layout.vue'),
    //配置嵌套路由
    children: [
      {
        //首页 空相当于Layout
        path: '',
        meta: { title: "首页" },
        component: () => import('@v/user/Home.vue')
      },
      {
        //系统性消息
        path: 'message',
        meta: { title: "系统消息" },
        component: () => import('@v/user/Message.vue')
      },
      {
        //电子邮件
        path: 'email',
        meta: { title: "电子邮件" },
        component: () => import('@v/user/Email.vue')
      },
      {
        //个人中心
        path: 'mine',
        meta: { title: "个人中心" },
        component: () => import('@v/user/Mine.vue')
      },
      {
        //修改密码
        path: 'resetPwd',
        meta: { title: "修改密码" },
        component: () => import('@v/user/ResetPwd.vue')
      },
      {
        //角色管理页
        path: 'role',
        meta: { title: "角色管理", permission: [1] },
        component: () => import('@v/role/Role.vue')
      },
      {
        //账号管理页
        path: 'admin',
        meta: { title: "账号管理" },
        component: () => import('@v/admin/Admin.vue')
      },
      {
        //房间类型
        path: 'roomType',
        meta: { title: "房间类型管理", permission: [1,3] },
        component: () => import('@v/roomType/RoomType.vue')
      },
      {
        //房间管理
        path: 'room',
        meta: { title: "房间管理" },
        component: () => import('@v/room/Room.vue')
      },
      {
        //客户管理
        path: 'guest',
        meta: { title: "客户管理" },
        component: () => import('@v/guest/Guest.vue')
      },
      {
        //权限管理
        path: 'permission',
        meta: { title: "权限管理", permission: [1,2] },
        component: () => import('@v/permission/Permission.vue')
      }
    ]
  },
  //剩余的全部情况
  {
    path: "*",
    component: () => import('@v/Error404.vue')
  }
]

//创建路由对象
const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

//路由前置守卫
router.beforeEach((to, from, next) => {
  //显示加载进度条
  NProgress.start()
  if (to.meta && to.meta.title) {
    //设置网页顶部的title值
    document.title = to.meta.title
  }
  //表示需要权限验证
  if (to.meta && to.meta.permission) {
    //判断角色是否符合权限，读取本地roleId
    if (to.meta.permission.includes(parseInt(localStorage.getItem('roleId')))) {
      next()
    } else {
      router.push('/layout')
    }
  } else {
    //调用next方法，表示路由继续往下走
    next()
  }

})
//路由后置首位
router.afterEach((to, from) => {
  //关闭加载进度条
  NProgress.done()
})

//导出路由对象
export default router
