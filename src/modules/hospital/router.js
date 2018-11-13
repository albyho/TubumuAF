import Vue from 'vue'
import VueRouter from 'vue-router'
import App from './pages/App.vue'
import Department from './pages/Department.vue'
import Sickroom from './pages/Sickroom.vue'
import Bunk from './pages/Bunk.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', name: 'app', component: App },
  { path: '/Department/:hospitalID', name: 'department', component: Department, props: true },
  { path: '/Sickroom/:hospitalID/:hospitalDepartmentID', name: 'sickroom', component: Sickroom, props: true },
  { path: '/Bunk/:hospitalID/:hospitalDepartmentID/:hospitalSickroomID', name: 'bunk', component: Bunk, props: true }
]

const router = new VueRouter({
  routes
})

export default router
