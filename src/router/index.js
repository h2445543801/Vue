import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login.vue'
import Home from '@/views/Home.vue'
import Users from '@/views/user/Users.vue'
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
        }
      ]
    }
  ]
})
