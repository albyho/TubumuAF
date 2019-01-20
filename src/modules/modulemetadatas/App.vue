<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>模块元数据</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-row>
      <el-button-group>
        <el-button type="primary" icon="el-icon-refresh" @click="handleExtractModuleMetaDatas">提取模块元数据</el-button>
        <el-button type="primary" icon="el-icon-time" @click="handleClearModulePermissions">清理模块权限</el-button>
      </el-button-group>
    </el-row>
    <el-row>
      <el-tabs
        v-model="activeTabName"
        type="card">
        <el-tab-pane
          label="权限"
          name="first">
            <el-table :data="permissionList" style="width: 100%" :empty-text="emptyText">
              <el-table-column prop="displayOrder" label="#" width="40" />
              <el-table-column prop="moduleName" label="模块" width="360" />
              <el-table-column prop="name" label="名称" />
            </el-table>
        </el-tab-pane>
       <el-tab-pane
          label="角色"
          name="second">
          <el-table :data="roleList" style="width: 100%" :empty-text="emptyText">
            <el-table-column prop="name" label="名称" />
          </el-table>
        </el-tab-pane>
       <el-tab-pane
          label="分组"
          name="third">
          <el-tree
            :data="groupTreeData"
            :props="groupTreeDefaultProps"
            :empty-text="emptyText"
            node-key="id"
            ref="tree"
            :default-expand-all="true"/>
        </el-tab-pane>
      </el-tabs>
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
      activeTabName: 'first',
      permissionList: null,
      roleList: null,
      groupTreeData: [],
      groupTreeDefaultProps: {
        children: 'children',
        label: 'name',
        value: 'id'
      }
    }
  },
  mounted () {
    this.getModuleMetaDatas()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getModuleMetaDatas () {
      this.isLoading = true
      api.getModuleMetaDatas().then(response => {
        this.isLoading = false
        this.permissionList = response.data.item.permissions
        this.roleList = response.data.item.roles
        this.groupTreeData = response.data.item.groups
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handleExtractModuleMetaDatas () {
      this.isLoading = true
      api.extractModuleMetaDatas().then(response => {
        this.isLoading = false
        this.getModuleMetaDatas()
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
        this.getModuleMetaDatas()
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

</style>
