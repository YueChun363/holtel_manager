import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

//导入颜色主题模块
import theme from './module/theme'

//导入当前登录账户模块
import admin from './module/admin'

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
    theme,
    admin
  }
})
