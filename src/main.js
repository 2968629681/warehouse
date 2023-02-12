import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from "axios";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import 'default-passive-events'
Vue.use(ElementUI);

axios.defaults.baseURL='http://management.niuwx.cn'
Vue.prototype.$axios = axios;

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
