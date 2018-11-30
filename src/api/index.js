import axios from 'axios'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'

// 为axios添加拦截器
// 1.获取token值 有token值就通过请求头的方式获取
// 2.如果没有token 就实现拦截器的默认行为
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做什么
  var token = localStorage.getItem('itcast_token')
  if (token) {
    config.headers['Authorization'] = token
  }
  return config
}, function (error) {
  return Promise.reject(error)
})

// 登录验证接口方法
export const login = (pa) => {
  return axios.post('login', pa)
    .then((result) => {
      return result.data
    })
}

// 获取所有用户数据
export const GetUserList = (pa) => {
  return axios.get('users', {params: pa})
    .then((result) => {
      return result.data
    })
}

// 实现用户数据新增
export const addUser = (pa) => {
  return axios.post('users', pa)
    .then((result) => {
      return result.data
    })
}
