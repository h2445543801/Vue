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

// 编辑用户数据
export const editUser = (pa) => {
  return axios.put(`users/${pa.id}`, pa)
    .then((result) => {
      return result.data
    })
}

// 编辑用户数据
export const deleteUser = (id) => {
  return axios.delete(`users/${id}`)
    .then((result) => {
      return result.data
    })
}

// 获取角色数据数据
export const getRolesList = () => {
  return axios.get(`roles`)
    .then((result) => {
      return result.data
    })
}

// 获取角色数据数据
export const grantUserById = (pa) => {
  return axios.put(`users/${pa.id}/role`, {rid: pa.rid})
    .then((result) => {
      return result.data
    })
}

// 实现单个用户状态的授权
export const changeUserState = (uid, type) => {
  return axios.put(`users/${uid}/state/${type}`)
    .then((result) => {
      return result.data
    })
}

// 获取所有权限
export const getAllRights = (type) => {
  return axios.get(`rights/${type}`)
    .then((result) => {
      return result.data
    })
}

// 实现当前角色的权限发分配
export const grantroleroles = (roleId, rids) => {
  return axios.post(`roles/${roleId}/rights`, {rids: rids})
    .then((result) => {
      return result.data
    })
}

// 实现去除权限标签
export const deleteroleright = (roleId, rightId) => {
  return axios.delete(`roles/${roleId}/rights/${rightId}`)
    .then((result) => {
      return result.data
    })
}

// 添加角色
export const addRole = (pa) => {
  return axios.post('roles', pa)
    .then(res => {
      return res.data
    })
}
