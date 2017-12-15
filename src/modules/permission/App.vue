<template>
  <el-container v-loading.fullscreen.lock="isLoading">
    <el-header class="header">  
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="breadcrumb">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>权限列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="main"> 
      <el-row>
        <el-input
          placeholder="输入关键字进行过滤"
          size="mini"
          clearable
          v-model="filterText"
          class="filterText" />
      </el-row>
      <el-row>
        <el-tree
          :data="treeData" 
          :props="treeDefaultProps" 
          :empty-text="emptyText"
          node-key="id" 
          ref="tree"
          :filter-node-method="filterNode"
          default-expand-all />
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
      treeData: null,
      treeDefaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: null
    }
  },
  mounted () {
    this.getTree()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  watch: {
    filterText (val) {
      this.$refs.tree.filter(val)
    }
  },
  methods: {
    getTree () {
      this.isLoading = true
      api.getPermissionTree().then(response => {
        this.isLoading = false
        this.treeData = response.data.tree
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
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

.filterText {
  width: 200px;
  margin-right: 20px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

</style>