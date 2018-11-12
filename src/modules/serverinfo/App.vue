<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>服务器信息</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main" v-html="content" />
</el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data() {
    return {
      // 主要数据
      isLoading: false,
      content: null
    }
  },
  mounted() {
    this.getServerInfo()
  },
  methods: {
    getServerInfo() {
      this.isLoading = true
      api.getServerInfo().then(response => {
        this.isLoading = false
        this.content = response.data.html
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    showErrorMessage(message) {
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
