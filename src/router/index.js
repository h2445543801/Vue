import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Users from '@/views/user/Users.vue'
import Roles from '@/views/roles/Roles.vue'
import Rigths from '@/views/roles/Rigths.vue'
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect: {name: 'Login'}
    },
    {
      path: '/login',
      name: 'Login',
      component: Login
    },
    {
      path: '/home',
      name: 'Home',
      component: Home,
      children: [
        {
          path: '/user',
          name: 'Users',
          component: Users
        },
        {
          path: '/roles',
          name: 'Roles',
          component: Roles
        },
        {
          path: '/rigth',
          name: 'Rigths',
          component: Rigths
        }
      ]
    }
  ]
})
