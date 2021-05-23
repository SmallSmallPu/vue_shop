import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
import Home from '../components/Home'
import Welcome from '../components/Welcome'
import User from '../components/user/User'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: Login
  },
  {
    path:'/home',
    component: Home,
    // 重定向操作，只要进去home页面之后立马重定向到welcome页面
    redirect:'/welcome',
    children:[
      {
      path:'/welcome',
      component:Welcome,
    },
      {
        path:'/users',
        component:User,
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

//路由导航守卫，用于限制未登录用户进去须登录之后页面操作
//next()表示直接放行，next('/login')表示跳转到login页面
router.beforeEach((to,from,next)=>{
  if (to.path == '/login') return next()
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')
  next();
})

export default router
