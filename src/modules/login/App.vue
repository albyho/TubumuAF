<template>
  <el-form :model="mainForm" :rules="mainFormRules" v-loading.fullscreen.lock="isLoading" ref="mainForm" label-position="left" label-width="0px" class="container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input type="text" v-model.trim="mainForm.account" auto-complete="on" placeholder="账号(用户名、手机号或邮箱)" ref="account" autofocus></el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input type="password" v-model.trim="mainForm.password" auto-complete="off" placeholder="密码" ref="password"></el-input>
    </el-form-item>    
    <el-form-item prop="validateCode">
      <el-input type="text" v-model.trim="mainForm.validateCode" auto-complete="off" placeholder="验证码" ref="validateCode" class="validateCode"></el-input>
      <img :src="refreshValidateCodeURL" @click="handleRefreshValidateCode" class="validateCodeImage">
    </el-form-item>
    <!-- <el-checkbox v-model="isRemberPassword" class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button type="primary" class="login" @click="handleSubmit">登录</el-button>
      <!-- <el-button @click.native.prevent="handleReset">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { baseURL, defaultAccount, defaultPassword } from '@/utils/config'
import api from '@/utils/api'

export default {
  data () {
    return {
      isLoading: false,
      refreshValidateCodeURLBase: baseURL + '/Admin/GetValidateCode',
      refreshValidateCodeURL: null,
      mainForm: {
        account: defaultAccount,
        password: defaultPassword,
        validateCode: ''
      },
      mainFormRules: {
        account: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 2, message: '最少支持2个字符', trigger: 'blur' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur' },
          { pattern: /^([a-zA-Z][a-zA-Z0-9-_]*)|(1(3|4|5|7|8)\d{9})|([\w!#$%&'*+/=?^_`{|}~-]+(?:\.[\w!#$%&'*+/=?^_`{|}~-]+)*@(?:[\w](?:[\w-]*[\w])?\.)+[\w](?:[\w-]*[\w])?)$/, message: '请输入合法的用户名、手机号或邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '最少支持6个字符', trigger: 'blur' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur' }
        ],
        validateCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur' }
        ]
      },
      isRemberPassword: true
    }
  },
  mounted () {
    this.refreshValidateCodeURL = this.refreshValidateCodeURLBase
  },
  methods: {
    handleReset (e) {
      this.$refs.mainForm.resetFields()
    },
    handleSubmit (e) {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.mainForm
        api.login(params).then(response => {
          // this.isLoading = false
          // httpClient 对 response.data.url 有拦截处理
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
          this.handleRefreshValidateCode(null)
        })
      })
    },
    handleRefreshValidateCode (e) {
      // console.log('handleRefreshValidateCode')
      this.refreshValidateCodeURL = this.refreshValidateCodeURLBase + '?' + (new Date().getTime())
      this.mainForm.validateCode = ''
      if (e) {
        this.$refs.validateCode.focus()
      }
    },
    showErrorMessage (message) {
      this.$message({
        message: message,
        type: 'error'
      })
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
  .validateCode {
    width: 80px;
    vertical-align: middle;
  }
  .validateCodeImage {
    height: 28px;
    vertical-align: middle;
    cursor: pointer;
  }
  .login {
    width: 100%;
  }
}
</style>