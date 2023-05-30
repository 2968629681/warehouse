import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'default-passive-events'
import Router from 'vue-router'
Vue.use(Vuex).use(ElementUI);
import dayjs from 'dayjs'
Vue.prototype.dayjs = dayjs;

axios.defaults.baseURL ='http://8.130.99.204:8080/'
//http://8.130.99.204:8080/
Vue.prototype.$axios = axios;
axios.interceptors.request.use(
  config => {
    if (localStorage.getItem('auth')) {
      config.headers.Authorization  = 'Bearer ' + localStorage.getItem('auth');
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  });

Vue.config.productionTip = false

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}

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
