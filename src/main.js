import Vue from 'vue'
import App from './App.vue'

//导入路由
import router from './router'
//导入状态管理
import store from './store'
//导入plugin插件
import './plugin'

//自动执行mock文件下的indexjs，indexjs会自动执行其他的mockjs
// import './mock'

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
