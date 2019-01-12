<template>
  <el-form
    ref="mainForm"
    :model="mainForm"
    :rules="mainFormRules"
    v-loading.fullscreen.lock="isLoading"
    label-position="left"
    label-width="0px"
    class="container">
    <h3 class="title">系统登录</h3>
    <el-form-item prop="account">
      <el-input
        ref="account"
        type="text"
        v-model.trim="mainForm.account"
        autocomplete="on"
        @keyup.enter.native="handleFocus('password')"
        placeholder="账号(用户名、手机号或邮箱)"
        autofocus>
          <font-awesome-icon slot="prefix" icon="user-secret" />
      </el-input>
    </el-form-item>
    <el-form-item prop="password">
      <el-input
        ref="password"
        type="password"
        v-model.trim="mainForm.password"
        autocomplete="off"
        @keyup.enter.native="handleFocus('validationCode')"
        placeholder="密码">
          <font-awesome-icon slot="prefix" icon="key" />
      </el-input>
    </el-form-item>
    <el-form-item prop="validationCode">
      <el-input
        ref="validationCode"
        type="text"
        v-model.trim="mainForm.validationCode"
        autocomplete="off"
        @keyup.enter.native="handleSubmit"
        placeholder="验证码"
        class="validationCode" />
      <img
        :src="refreshValidationCodeUrl"
        @click="handleRefreshValidationCode"
        class="validationCodeImage">
    </el-form-item>
    <!-- <el-checkbox v-model="isRemberPassword" class="remember">记住密码</el-checkbox> -->
    <el-form-item style="width:100%;">
      <el-button
        type="primary"
        class="login"
        @click="handleSubmit">登录</el-button>
    <!-- <el-button @click.native.prevent="handleReset">重置</el-button> -->
    </el-form-item>
  </el-form>
</template>

<script>
import { baseUrl, defaultAccount, defaultPassword } from '@/utils/config'
import _ from 'lodash'
import api from '@/utils/api'
import md5 from 'js-md5'
const fileDownload = require('js-file-download')

export default {
  data () {
    return {
      isLoading: false,
      refreshValidationCodeUrlBase: baseUrl + '/Admin/GetValidationCode',
      refreshValidationCodeUrl: null,
      mainForm: {
        account: defaultAccount,
        password: defaultPassword,
        validationCode: ''
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
          { max: 32, message: '最多支持32个字符', trigger: 'blur' }
        ],
        validationCode: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { max: 32, message: '最多支持32个字符', trigger: 'blur' }
        ]
      },
      isRemberPassword: true
    }
  },
  mounted () {
    this.refreshValidationCodeUrl = this.refreshValidationCodeUrlBase
  },
  methods: {
    handleReset (e) {
      this.$refs.mainForm.resetFields()
    },
    handleSubmit (e) {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = _.cloneDeep(this.mainForm)
        params.password = md5(params.password)
        api.login(params).then(response => {
          // this.isLoading = false
          // httpClient 对 response.data.url 有拦截处理
          // httpClient 对 response.data.token 有拦截处理
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
          this.handleRefreshValidationCode(null)
        })
      })
    },
    handleRefreshValidationCode (e) {
      // console.log('handleRefreshValidationCode')
      this.refreshValidationCodeUrl = this.refreshValidationCodeUrlBase + '?' + (new Date().getTime())
      this.mainForm.validationCode = ''
      if (e) {
        this.$refs.validationCode.focus()
      }
    },
    handleFocus (el) {
      this.$refs[el].focus()
    },
    showErrorMessage (message) {
      this.$message({
        message: message,
        type: 'error'
      })
    },
    testDownload () {
      this.isLoading = true
      const url = 'http://192.168.0.108:9005/manager/api/Project/Report/ImportAttendance'
      const params = {
        Cityname: '35dea0e5-9b9f-4b8b-981e-2e1120b1c317',
        DeliveryFeeBillCsvPath: '/UserFiles/5/files/2017-11-27-2017-12-04配送费账单(1).csv'
      }
      api.download(url, params).then(response => {
        this.isLoading = false
        fileDownload(response.data, 'test.xlsx')
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
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
  .validationCode {
    width: 80px;
    vertical-align: middle;
  }
  .validationCodeImage {
    height: 28px;
    vertical-align: middle;
    cursor: pointer;
  }
  .login {
    width: 100%;
  }
}
</style>