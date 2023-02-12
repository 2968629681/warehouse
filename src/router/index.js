import Vue from 'vue'
import VueRouter from 'vue-router'
import LoginPage from '../views/LoginPage.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginPage
  },
  {
    path: '/home',
    name: 'home',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/HomePage.vue'),
    },
    {
      path:'/homepage',
      name:'homepage',
      component:()=> import('../views/RouterJump.vue'),
      children:[{
          path: "put",
          component: () => { return import("../views/home/PutWarehouse.vue") },
      },
      {
          path: "out",
          component: () => { return import("../views/home/OutWarehouse.vue") },
      },
      {
          path: "mate",
          component: () => { return import("../views/home/MaterialInformation.vue") },
      },
      {
          path: "one",
          component: () => { return import("../views/home/QueryOne.vue") },
      },
      {
          path: "time",
          component: () => { return import("../views/home/QueryTime.vue") },
      },
      {
          path: "sys",
          component: () => { return import("../views/home/SystemSettings.vue") },
      }]
    }
]

const router = new VueRouter({
  routes
})

export default router
