<template>
<el-container>
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">  
    <el-table :data="permissions" v-loading="isLoading" stripe size="small" style="width: 100%" :empty-text="emptyText">
      <el-table-column prop="displayOrder" label="#" width="40"></el-table-column>
      <el-table-column prop="moduleName" label="模块" width="180"></el-table-column>    
      <el-table-column prop="name" label="名称"></el-table-column>
    </el-table>
  </el-main>
</el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      isLoading: false,
      permissions: null
    }
  },
  mounted () {
    this.getPermissions()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getPermissions () {
      const _this = this
      _this.isLoading = true
      api.getPermissions().then(response => {
        _this.isLoading = false
        _this.permissions = response.data.permissions
      }, error => {
        _this.isLoading = false
        _this.$message({
          message: error.message,
          type: 'error'
        })
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>