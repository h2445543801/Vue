import axios from 'axios'

axios.defaults.baseURL = 'http://localhost:8888/api/private/v1/'

// 登录验证接口方法
export const login = (pa) => {
  return axios.post('login', pa)
    .then((result) => {
      return result.data
    })
}
