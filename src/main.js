import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'default-passive-events'
Vue.use(Vuex).use(ElementUI);

axios.defaults.baseURL ='http://39.98.179.159:8080/'
//http://8.130.99.204:8080/
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

const store = new Vuex.Store({
  state: {
    user: true,
    permission: {},
  },
  mutations: {
    isAdmin(state) {
        state.user = true; 
    },
  }
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
