<template>
  <div class="login">
    <div class="container">
      <el-form :model="loginForm" :rules="rules" ref="loginForm" class="demo-ruleForm"  >
          <img src="../assets/avatar.jpg" alt="" class="avatar">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" prefix-icon="myicon myicon-user" placeholder="用户"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="loginForm.password" prefix-icon="myicon myicon-key" placeholder="密码" type="password"></el-input>
        </el-form-item>
        <el-button type="primary" class="login-btn" @click='login("loginForm")'>登录</el-button>
      </el-form>
    </div>

  </div>
</template>
<script>

import {login} from '@/api/index.js'

export default {
  data () {
    return {
      loginForm: {
        username: '',
        password: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    login (formname) {
      // 实现用户输入的验证：如果用户输入不合法，则取消当前请求
      this.$refs[formname].validate((valid) => {
        if (valid) {
          // console.log(123)
          // 调用接口，发送请求
          login(this.loginForm)
            .then((result) => {
              // console.log(result)
              if (result.meta.status === 200) {
                // 将token 实现本地存储
                localStorage.setItem('itcast_token', result.data.token)
                // 实现跳转主页
                this.$router.push({name: 'Home'})
              } else {
                console.log(123)
                this.$message.error(result.meta.msg)
              }
            })
        } else {
          this.$message.error('登陆失败，输入数据不完整')
          return false
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.login {
  position: fixed;
  width: 100%;
  height: 100%;
  background-color: #2f4050;

  .container {
    position: absolute;
    left: 0;
    right: 0;
    width: 400px;
    padding: 0px 40px 15px 40px;
    margin: 200px auto;
    background: white;
    .avatar {
      position: relative;
      left: 50%;
      width: 120px;
      height: 120px;
      margin-left: -60px;
      margin-top: -60px;
      box-sizing: border-box;
      border-radius: 50%;
      border: 10px solid #fff;
      box-shadow: 0 1px 5px #ccc;
      overflow: hidden;
    }
    .login-btn {
      width: 100%;
    }
  }
}
</style>
