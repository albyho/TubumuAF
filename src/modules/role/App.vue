<template>
<el-container>
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">  
    <el-table :data="roles" v-loading="isLoading" stripe size="small" style="width: 100%" :empty-text="emptyText">
      <el-table-column prop="displayOrder" label="#" width="40"></el-table-column>
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
      roles: null
    }
  },
  mounted () {
    this.getRoles()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getRoles () {
      const _this = this
      _this.isLoading = true
      api.getRoles().then(response => {
        _this.isLoading = false
        _this.roles = response.data.roles
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