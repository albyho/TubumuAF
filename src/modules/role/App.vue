<template>
<div>
  <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
    <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    <el-breadcrumb-item>角色列表</el-breadcrumb-item>
  </el-breadcrumb>
  <el-table :data="roles" v-loading="isLoading" stripe style="width: 100%">
    <el-table-column prop="displayOrder" label="#" width="40">
    </el-table-column>
    <el-table-column prop="name" label="名称">
    </el-table-column>
  </el-table>
</div>
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

.breadcrumb 
{
    margin: 20px 20px 20px 10px;
}

</style>