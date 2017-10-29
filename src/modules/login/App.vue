<template>
  <el-form :model="mainForm" :rules="rules" v-loading.fullscreen.lock="isLoading" ref="mainForm" label-position="left" label-width="0px" class="container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model="mainForm.account" auto-complete="on" placeholder="账号(用户名、手机号或邮箱)"></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model="mainForm.password" auto-complete="off" placeholder="密码"></el-input>
    </el-form-item>    
    <el-form-item prop="verificationCode">
      <el-input type="txt" v-model="mainForm.verificationCode" auto-complete="off" placeholder="验证码" class="verificationCode"></el-input>
      <img src="../detail/images/logo.png" @click="refreshVerificationCode" class="verificationCodeImage">
    </el-form-item>
    <!-- <el-checkbox v-model="isRemberPassword" class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" class="login" @click="handleSubmit">登录</el-button>
      <!-- <el-button @click.native.prevent="handleReset">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { requestLogin } from '@/api/api'

export default {
  data () {
    return {
      isLoading: false,
      mainForm: {
        account: '',
        password: '',
        verificationCode: ''
      },
      rules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, message: '最少支持2个字符', trigger: 'blur' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur' },
          { pattern: /^(1(3|4|5|7|8)\d{9})|([a-zA-Z][a-zA-Z0-9-_]*)|([\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?)$/, message: '请输入合法的用户名、手机号或邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少支持6个字符', trigger: 'blur' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur' }
        ],
        verificationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { max: 10, message: '最多支持20个字符', trigger: 'blur' }
        ]
      },
      isRemberPassword: true
    }
  },
  methods: {
    handleReset (e) {
      this.$refs.mainForm.resetFields()
    },
    handleSubmit (e) {
      var _this = this
      _this.$refs.mainForm.validate(valid => {
        if (valid) {
          _this.isLoading = true
          var loginParams = {
            account: _this.mainForm.account,
            password: _this.mainForm.password
          }
          console.log('loginParams', loginParams)
          requestLogin(loginParams).then(data => {
            this.isLoading = false
            let { code, msg } = data
            if (code !== 200) {
              _this.$message.error(msg)
              return false
            } else {
              location.href = 'index.html'
            }
          })
        } else {
          this.isLoading = false
          return false
        }
      })
    },
    refreshVerificationCode (e) {
      console.log('refreshVerificationCode')
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../../styles/mixin.scss';

.container {
  @include border-radius(5px);
  @include box-shadow(0, 0, 25px, #cac6c6);
  background-clip: padding-box;
  margin: 180px auto;
  width: 350px;
  padding: 35px 35px 15px 35px;
  background: #fff;
  border: 1px solid #eaeaea;
  .title {
    margin: 0px auto 40px auto;
    text-align: center;
    color: #505458;
  }
  .remember {
    margin: 0px 0px 35px 0px;
  }
  .verificationCode {
    width: 80px;
    vertical-align: middle;
  }
  .verificationCodeImage {
    height: 38px;
    vertical-align: middle;
  }
  .login {
    width: 100%;
  }
}
</style>