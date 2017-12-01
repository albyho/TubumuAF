<template>
 <el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>系统配置</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="120px" size="small">
      <el-form-item label="系统名称" prop="name">
        <el-input v-model.trim="mainForm.name" auto-complete="off" placeholder="请输入系统名称" ref="name"></el-input>
      </el-form-item>
      <el-form-item label="系统地址" prop="host">
        <el-input v-model.trim="mainForm.host" auto-complete="off" placeholder="请输入系统地址" ref="host"></el-input>
      </el-form-item>
      <el-form-item label="系统主标题" prop="title">
        <el-input v-model.trim="mainForm.title" auto-complete="off" placeholder="请输入系统主标题" ref="title"></el-input>
      </el-form-item>
      <el-form-item label="系统关键字" prop="keywords">
        <el-input v-model.trim="mainForm.keywords" auto-complete="off" placeholder="请输入系统关键字" ref="keywords"></el-input>
      </el-form-item>
      <el-form-item label="系统描述" prop="description">
        <el-input type="textarea" :rows="4" v-model.trim="mainForm.description" auto-complete="off" placeholder="请输入系统描述" ref="description"></el-input>
      </el-form-item>
      <el-form-item label="版权信息" prop="copyright">
        <el-input type="textarea" :rows="4" v-model.trim="mainForm.copyright" auto-complete="off" placeholder="请输入系统描述" ref="copyright"></el-input>
      </el-form-item>     
      <el-form-item label="系统小图标" prop="faviconURL">
        <el-input v-model.trim="mainForm.faviconURL" auto-complete="off" placeholder="请输入系统小图标地址" ref="faviconURL"></el-input>
      </el-form-item>      
      <el-form-item label="标题分隔符" prop="pageTitleSeparator">
        <el-input v-model="mainForm.pageTitleSeparator" auto-complete="off" placeholder="请输入标题分隔符" ref="pageTitleSeparator"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="handleEditSiteConfig">确 认</el-button>
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
      mainForm: {
        name: null,
        host: null,
        title: null,
        keywords: null,
        description: null,
        copyright: null,
        faviconURL: null,
        pageTitleSeparator: null
      },
      mainFormRules: {
        name: [
          { required: true, message: '请输入系统名称', trigger: 'blur' },
          { max: 50, message: '最多支持50个字符', trigger: 'blur' }
        ],
        host: [
          { required: true, message: '请输入系统地址', trigger: 'blur' },
          { max: 100, message: '最多支持100个字符', trigger: 'blur' },
          { pattern: /^https?:\/\/[\w\-_]+(\.[\w\-_]+)+([\w\-\\.,@?^=%&amp;:/~\\+#]*[\w\-\\@?^=%&amp;/~\\+#])?$/, message: '请输入正确的网址', trigger: 'blur' }
        ],
        title: [
          { max: 100, message: '最多支持100个字符', trigger: 'blur' }
        ],
        keywords: [
          { max: 200, message: '最多支持200个字符', trigger: 'blur' }
        ],
        description: [
          { max: 500, message: '最多支持500个字符', trigger: 'blur' }
        ],
        copyright: [
          { max: 1000, message: '最多支持1000个字符', trigger: 'blur' }
        ],
        faviconURL: [
          { max: 100, message: '最多支持100个字符', trigger: 'blur' }
        ],
        pageTitleSeparator: [
          { max: 50, message: '最多支持50个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
    this.getSiteConfig()
  },
  methods: {
    getSiteConfig () {
      this.isLoading = true
      api.getSiteConfig().then(response => {
        this.isLoading = false
        this.mainForm = response.data.item
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handleEditSiteConfig () {
      this.editSiteConfig()
    },
    editSiteConfig () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        // 独立的参数目的在于保持干净的提交
        const params = this.mainForm
        api.editSiteConfig(params).then(response => {
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

</style>