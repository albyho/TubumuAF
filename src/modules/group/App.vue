<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户组列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main"> 
    <el-row>
      <el-input placeholder="输入关键字进行过滤" size="mini" v-model="filterText" class="filterText"></el-input>
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline">添加</el-button>  
    </el-row>
    <el-row>
      <el-tree
        :data="treeData" 
        :props="treeDefaultProps" 
        :empty-text="emptyText"
        node-key="id" 
        ref="tree"
        :filter-node-method="filterNode"
        :render-content="renderContent"
        default-expand-all>
      </el-tree>
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
      treeData: [{
        id: 0,
        name: null
      }],
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
      api.getGroupTree().then(response => {
        this.isLoading = false
        this.treeData = response.data.tree
      }, error => {
        this.isLoading = false
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 10px;">
          <span>
            <span>{ node.label }</span>
          </span>
          <span>
            <span style="font-size: 12px;"> { data.limitRoles.map(m => m.name).join(' ') } </span>
          </span>
          <span v-show={ !data.isSystem }>
            <span style="font-size: 12px;" v-show={ !data.isDisabled }>[停用] </span>
            <span style="font-size: 12px;" v-show={ data.isIncludeUser }>[用户] </span>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-edit-outline" onClick={ () => this.append(node, data) }>编辑</el-button>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-circle-plus-outline" onClick={ () => this.append(node, data) }>添加</el-button>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-remove-outline" on-click={ () => this.remove(node, data) }>删除</el-button>
          </span>
        </span>)
    },
    append (node, data) {
      console.log(node, data)
    },
    remove (node, data) {

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