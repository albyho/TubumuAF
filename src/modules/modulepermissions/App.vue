<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>模块管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main"> 
    <el-row>
      <el-button-group>
        <el-button type="primary" size="mini" icon="el-icon-refresh" @click="handleExtractModulePermissions">提取模块权限</el-button>  
        <el-button type="primary" size="mini" icon="el-icon-time" @click="handleClearModulePermissions">清理模块权限</el-button>  
      </el-button-group>
    </el-row>
    <el-row>
    <el-table :data="list" size="mini" style="width: 100%" :empty-text="emptyText">
      <el-table-column prop="displayOrder" label="#" width="40"></el-table-column>
      <el-table-column prop="moduleName" label="模块" width="180"></el-table-column>    
      <el-table-column prop="name" label="名称"></el-table-column>
    </el-table>
    </el-row>
  </el-main>
</el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      isLoading: false,
      list: null
    }
  },
  mounted () {
    this.getList()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getList () {
      this.isLoading = true
      api.getPermissions().then(response => {
        this.isLoading = false
        this.list = response.data.list
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handleExtractModulePermissions () {
      this.isLoading = true
      api.extractModulePermissions().then(response => {
        this.isLoading = false
        this.filterText = null
        this.getList()
        this.$message({
          message: response.data.message,
          type: 'success'
        })
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handleClearModulePermissions () {
      this.isLoading = true
      api.clearModulePermissions().then(response => {
        this.isLoading = false
        this.filterText = null
        this.getList()
        this.$message({
          message: response.data.message,
          type: 'success'
        })
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
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

<style lang="scss">

.el-row {
  margin-bottom: 8px;
  &:last-child {
    margin-bottom: 0;
  }
}
.el-table td {
  padding: 8px 0;
}
.el-table .cell{
  line-height: normal;
}

</style>