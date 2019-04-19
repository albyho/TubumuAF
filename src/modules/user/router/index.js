import Vue from 'vue'
import VueRouter from 'vue-router'
import App from '../pages/App.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'app', component: App }
]

const router = new VueRouter({
  routes
})

export default router
