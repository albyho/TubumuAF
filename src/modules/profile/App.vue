<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>我的资料</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-tabs v-model="activeTabName" type="card">
      <el-tab-pane label="修改资料" name="pane01">
        <el-form ref="changeProfileForm" :model="changeProfileForm" :rules="changeProfileFormRules" label-position="right" label-width="120px">
          <el-form-item label="昵称" prop="displayName">
            <el-input ref="displayName" v-model.trim="changeProfileForm.displayName" auto-complete="off" placeholder="请输入昵称" />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="handleChangeProfile">修改资料</el-button>
          </el-form-item>
        </el-form>
      </el-tab-pane>
      <el-tab-pane label="修改头像" name="pane02">
        <el-upload
          ref="avatarUploader"
          class="uploader"
          action=""
          :auto-upload="true"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="uploadAvatar">
          <img v-if="uploadImageAvatarPreviewUrl" :src="uploadImageAvatarPreviewUrl" class="uploaderPreview">
          <i v-else class="el-icon-plus uploader-icon"></i>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="修改 Logo" name="pane03">
        <el-upload
          ref="logoUploader"
          class="uploader"
          action=""
          :auto-upload="true"
          :show-file-list="false"
          :before-upload="beforeUpload"
          :http-request="uploadLogo">
          <img v-if="uploadImageLogoPreviewUrl" :src="uploadImageLogoPreviewUrl" class="uploaderPreview">
          <i v-else class="el-icon-plus uploader-icon"></i>
        </el-upload>
      </el-tab-pane>
      <el-tab-pane label="修改密码" name="pane04">
        <el-form ref="changePasswordForm" :model="changePasswordForm" :rules="changePasswordFormRules" label-position="right" label-width="120px">
          <el-form-item label="当前密码" prop="currentPassword">
            <el-input ref="currentPassword" type="password" v-model.trim="changePasswordForm.currentPassword" auto-complete="off" placeholder="请输入当前密码" />
          </el-form-item>
          <el-form-item label="新密码" prop="newPassword">
            <el-input ref="newPassword" type="password" v-model.trim="changePasswordForm.newPassword" auto-complete="off" placeholder="请输入新密码" />
          </el-form-item>
          <el-form-item label="确认新密码" prop="newPasswordConfirm">
            <el-input ref="newPasswordConfirm" type="password" v-model.trim="changePasswordForm.newPasswordConfirm" auto-complete="off" placeholder="请确认新密码" />
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
import md5 from 'js-md5'

export default {
  data () {
    return {
      isLoading: false,
      activeTabName: 'pane01',

      uploadImageAvatarPreviewUrl: null,
      uploadImageLogoPreviewUrl: null,

      changeProfileForm: {
        displayName: null
      },
      changeProfileFormRules: {
        displayName: [{
          max: 20,
          message: '最多支持20个字符',
          trigger: 'blur'
        },
        {
          pattern: /^[a-zA-Z\u4E00-\u9FA5\uF900-\uFA2D][a-zA-Z0-9-_\u4E00-\u9FA5\uF900-\uFA2D]*$/,
          message: '昵称包含非法字符',
          trigger: 'blur'
        }
        ]
      },
      changePasswordForm: {
        currentPassword: null,
        newPassword: null,
        newPasswordConfirm: null
      },
      changePasswordFormRules: {
        currentPassword: [{
          required: true,
          message: '请输入当前密码',
          trigger: 'blur'
        },
        {
          min: 6,
          message: '最少支持6个字符',
          trigger: 'blur'
        },
        {
          max: 32,
          message: '最多支持32个字符',
          trigger: 'blur'
        }
        ],
        newPassword: [{
          required: true,
          message: '请输入新密码',
          trigger: 'blur'
        },
        {
          min: 6,
          message: '最少支持6个字符',
          trigger: 'blur'
        },
        {
          max: 32,
          message: '最多支持32个字符',
          trigger: 'blur'
        }
        ],
        newPasswordConfirm: [{
          required: true,
          message: '请确认新密码',
          trigger: 'blur'
        },
        {
          min: 6,
          message: '最少支持6个字符',
          trigger: 'blur'
        },
        {
          max: 32,
          message: '最多支持32个字符',
          trigger: 'blur'
        }
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
        const profile = response.data.data
        this.changeProfileForm.displayName = profile.displayName
        this.uploadImageAvatarPreviewUrl = profile.avatarUrl
        this.uploadImageLogoPreviewUrl = profile.logoUrl
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    handleChangeProfile () {
      this.$refs.changeProfileForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.changeProfileForm
        api.changeProfile(params).then(response => {
          this.isLoading = false
          this.$message.success(response.data.message)
        }, error => {
          this.isLoading = false
          this.$message.error(error.message)
        })
      })
    },
    handleChangePassword () {
      this.$refs.changePasswordForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = {
          currentPassword: md5(this.changePasswordForm.currentPassword),
          newPassword: md5(this.changePasswordForm.newPassword),
          newPasswordConfirm: md5(this.changePasswordForm.newPasswordConfirm)
        }
        api.changePassword(params).then(response => {
          this.isLoading = false
          this.changePasswordForm.currentPassword = null
          this.changePasswordForm.newPassword = null
          this.changePasswordForm.newPasswordConfirm = null
          this.$message.success(response.data.message)
        }, error => {
          this.isLoading = false
          this.$message.error(error.message)
        })
      })
    },
    handleChangeAvatarUrlBrowser () {
      this.popupFileManager('avatarUrl')
    },
    handleChangeLogoUrlBrowser () {
      this.popupFileManager('logoUrl')
    },
    popupFileManager (name) {
      const _this = this
      try {
        /* eslint-disable no-undef */
        CKFinder.popup({
          chooseFiles: true,
          width: 800,
          height: 600,
          onInit: function (finder) {
            finder.on('files:choose', function (evt) {
              const file = evt.data.files.first()
              _this.changeProfileForm[name] = file.getUrl()
            })
            finder.on('file:choose:resizedImage', function (evt) {
              _this.changeProfileForm[name] = evt.data.resizedUrl
            })
          }
        })
      } catch (e) {
        console.log(e.message)
      }
    },
    // 头像 / Logo
    beforeUpload (file) {
      console.log('beforeUpload')
      const isJPGorPNG = file.type === 'image/jpeg' || file.type === 'image/png'
      const isLt1M = file.size / 1024 / 1024 < 1

      if (!isJPGorPNG) {
        this.$message.error('上传图片只能是 JPG 或 PNG 格式')
      }
      if (!isLt1M) {
        this.$message.error('上传图片大小不能超过 1MB')
      }
      return isJPGorPNG && isLt1M
    },
    uploadAvatar (f) {
      this.isLoading = true
      let params = new FormData()
      params.append('file', f.file)
      api.changeAvatar(params).then(response => {
        this.isLoading = false
        this.uploadImageAvatarPreviewUrl = response.data.url + '?' + (new Date().getTime())
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    uploadLogo (f) {
      this.isLoading = true
      let params = new FormData()
      params.append('file', f.file)
      api.changeLogo(params).then(response => {
        this.isLoading = false
        this.uploadImageLogoPreviewUrl = response.data.url + '?' + (new Date().getTime())
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    }
  }
}
</script>

<style lang="scss">
.el-tab-pane {
  width: 600px;
}
.uploader {
  .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  }
  .el-upload:hover {
    border-color: #409EFF;
  }
  .uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 160px;
  height: 160px;
  line-height: 160px;
  text-align: center;
  }
  .uploaderPreview {
    width: 160px;
    height: 160px;
    display: block;
  }
}
</style>
