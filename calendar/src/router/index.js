import Vue from 'vue'
import VueRouter from 'vue-router'  

Vue.use(VueRouter)

const routes = [
  {
    path:'/',
    name:'calendar',
    component: ()=> import('../components/Calendar.vue'),
    alias:'/calendar'
  }

]

const router = new VueRouter({
  routes
})

export default router
