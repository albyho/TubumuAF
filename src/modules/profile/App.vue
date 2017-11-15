<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>我的资料</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main"> 
  <el-tabs v-model="activeTabName" type="card">
    <el-tab-pane label="修改资料" name="first">
    <el-form ref="changeProfileForm" :model="changeProfileForm" :rules="changeProfileRules" label-position="right" label-width="120px" size="small">
      <el-form-item label="昵称" prop="displayName">
        <el-input v-model.trim="changeProfileForm.displayName" auto-complete="off" placeholder="请输入昵称" ref="displayName"></el-input>
      </el-form-item>
      <el-form-item label="头像" prop="headURL">
        <el-input v-model.trim="changeProfileForm.headURL" auto-complete="off" placeholder="请输入头像 URL" ref="headURL"></el-input>
      </el-form-item>
      <el-form-item label="Logo" prop="logoURL">
        <el-input v-model.trim="changeProfileForm.logoURL" auto-complete="off" placeholder="请输入Logo URL" ref="logoURL"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleChangeProfile">修改资料</el-button>
      </el-form-item> 
    </el-form>
    </el-tab-pane>
    <el-tab-pane label="修改密码" name="second">
    <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="changePasswordRules" label-position="right" label-width="120px" size="small">
      <el-form-item label="当前密码" prop="currentPassword">
        <el-input type="password" v-model.trim="changePasswordForm.currentPassword" auto-complete="off" placeholder="请输入当前密码" ref="currentPassword"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model.trim="changePasswordForm.newPassword" auto-complete="off" placeholder="请输入新密码" ref="newPassword"></el-input>
      </el-form-item>
      <el-form-item label="确认新密码" prop="newPasswordConfirm">
        <el-input type="password" v-model.trim="changePasswordForm.newPasswordConfirm" auto-complete="off" placeholder="请确认新密码" ref="newPasswordConfirm"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleChangePassword">修改密码</el-button>
      </el-form-item> 
    </el-form>
    </el-tab-pane>
  </el-tabs>
  </el-main>
</el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      isLoading: false,
      activeTabName: 'first',
      changeProfileForm: {
        displayName: null,
        head: null,
        logo: null
      },
      changeProfileRules: {
        displayName: [
          { max: 20, message: '最多支持20个字符', trigger: 'blur,change' },
          { pattern: /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9-_\u4E00-\u9FA5\uF900-\uFA2D]*$/, message: '昵称包含非法字符', trigger: 'blur,change' }
        ],
        head: [
          { max: 200, message: '最多支持200个字符', trigger: 'blur,change' }
        ],
        logo: [
          { max: 200, message: '最多支持200个字符', trigger: 'blur,change' }
        ]
      },
      changePasswordForm: {
        currentPassword: null,
        newPassword: null,
        newPasswordConfirm: null
      },
      changePasswordRules: {
        currentPassword: [
          { required: true, message: '请输入当前密码', trigger: 'blur,change' },
          { min: 20, message: '最少支持6个字符', trigger: 'blur,change' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur,change' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur,change' },
          { min: 20, message: '最少支持6个字符', trigger: 'blur,change' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur,change' }
        ],
        newPasswordConfirm: [
          { required: true, message: '请确认新密码', trigger: 'blur,change' },
          { min: 20, message: '最少支持6个字符', trigger: 'blur,change' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur,change' }
        ]
      }
    }
  },
  mounted: function () {
    this.getProfile()
  },
  methods: {
    getProfile () {
      this.isLoading = true
      api.getProfile().then(response => {
        this.isLoading = false
        const profile = response.data.profile
        this.changeProfileForm.displayName = profile.displayName
        this.changeProfileForm.headURL = profile.headURL
        this.changeProfileForm.logoURL = profile.logoURL
      }, error => {
        this.isLoading = false
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    handleChangeProfile () {
      this.$refs.changeProfileForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          const params = {
            displayName: this.changeProfileForm.displayName,
            headURL: this.changeProfileForm.headURL,
            logoURL: this.changeProfileForm.logoURL
          }
          api.changeProfile(params).then(response => {
            this.isLoading = false
            this.$message({
              message: response.data.message,
              type: 'success'
            })
          }, error => {
            this.isLoading = false
            this.$message({
              message: error.message,
              type: 'error'
            })
          })
        } else {
          // 客户端校验未通过
          return false
        }
      })
    },
    handleChangePassword () {
      this.$refs.changePasswordForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          const params = {
            currentPassword: this.changePasswordForm.currentPassword,
            newPassword: this.changePasswordForm.newPassword,
            newPasswordConfirm: this.changePasswordForm.newPasswordConfirm
          }
          api.changePassword(params).then(response => {
            this.isLoading = false
            this.$message({
              message: response.data.message,
              type: 'success'
            })
          }, error => {
            this.isLoading = false
            this.$message({
              message: error.message,
              type: 'error'
            })
          })
        } else {
          // 客户端校验未通过
          return false
        }
      })
    }
  }
}
</script>