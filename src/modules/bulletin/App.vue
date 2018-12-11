<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统公告</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="120px">
      <el-form-item label="公告标题" prop="title">
        <el-input v-model.trim="mainForm.title" auto-complete="off" placeholder="请输入公告标题" ref="title" />
      </el-form-item>
      <el-form-item label="公告内容" prop="content">
        <quill-editor v-model="mainForm.content" ref="content" :options="editorOption" />
      </el-form-item>
      <el-form-item label="发布日期" prop="publishDate">
        <el-date-picker v-model="mainForm.publishDate" align="right" type="date" placeholder="选择发布日期" :picker-options="publishDatePickerOptions" ref="publishDate" />
      </el-form-item>
      <el-form-item label="是否显示" prop="isShow">
        <el-switch v-model="mainForm.isShow" ref="isShow" />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEditBulletin">确 认</el-button>
      </el-form-item>
    </el-form>
  </el-main>
</el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      // 主要数据
      isLoading: false,
      editorOption: {
        placeholder: '请输入公共内容'
      },
      publishDatePickerOptions: {
        disabledDate (time) {
          return time.getTime() > Date.now()
        }
      },
      mainForm: {
        title: null,
        content: null,
        publishDate: null,
        isShow: false
      },
      mainFormRules: {
        title: [{
          max: 200,
          message: '最多支持200个字符',
          trigger: 'blur'
        }],
        content: [{
          max: 2000,
          message: '最多支持2000个字符',
          trigger: 'blur'
        }]
      }
    }
  },
  mounted () {
    this.getBulletin()
  },
  methods: {
    getBulletin () {
      this.isLoading = true
      api.getBulletin().then(response => {
        this.isLoading = false
        this.mainForm = response.data.item
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handleEditBulletin () {
      this.editSiteConfig()
    },
    editSiteConfig () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.mainForm
        api.editBulletin(params).then(response => {
          this.isLoading = false
          this.$message({
            message: response.data.message,
            type: 'success'
          })
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        })
      })
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
.ql-container {
  height: 320px;
  min-height: 320px;
}
</style>
