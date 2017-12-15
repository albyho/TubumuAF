<template>
  <el-container v-loading.fullscreen.lock="isLoading">
    <el-header class="header">  
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="breadcrumb">
        <el-breadcrumb-item>模块管理</el-breadcrumb-item>
        <el-breadcrumb-item>模块信息</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="main"> 
      <el-row>
        <el-table
          :data="item.modules"
          size="small"
          style="width: 100%"
          :empty-text="emptyText">
          <el-table-column
            prop="Name"
            label="模块名称"
            width="160" />    
          <el-table-column
            prop="Type"
            label="类型" />
          <el-table-column
            prop="DataProvider"
            label="数据代理名称"
            width="140" />
          <el-table-column
            prop="Enabled"
            label="启用"
            width="60">
            <template slot-scope="scope">
              <i 
                class="el-icon-check" 
                v-show="scope.row.Enabled" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-table
          :data="item.backgroundServices"
          size="small"
          style="width: 100%"
          :empty-text="emptyText">
          <el-table-column
            prop="Name"
            label="后台服务器名称"
            width="160" />
          <el-table-column
            prop="Type"
            label="类型" />
          <el-table-column
            prop="ExecutorType"
            label="执行器类型" />
          <el-table-column
            prop="Interval"
            label="执行间隔(毫秒)"
            width="140" />
          <el-table-column
            prop="Enabled"
            label="启用"
            width="60">
            <template slot-scope="scope">
              <i
                class="el-icon-check"
                v-show="scope.row.Enabled" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-table
          :data="item.providers"
          size="small"
          style="width: 100%"
          :empty-text="emptyText">
          <el-table-column
            prop="Name"
            label="数据代理名称"
            width="160" />    
          <el-table-column
            prop="Type"
            label="类型" />
          <el-table-column
            prop="ConnectionString"
            label="数据库链接配置" />
          <el-table-column
            prop="Enabled"
            label="启用"
            width="60">
            <template slot-scope="scope">
              <i
                class="el-icon-check"
                v-show="scope.row.Enabled" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>
      <el-row>
        <el-table
          :data="item.connectionStrings"
          size="small"
          style="width: 100%"
          :empty-text="emptyText">
          <el-table-column
            prop="Name"
            label="数据库链接名称"
            width="160" />    
          <el-table-column
            prop="ConnectionString"
            label="链接字符串" />
          <el-table-column
            prop="ProviderName"
            label="数据代理" />
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
      item: {
        modules: [],
        backgroundServices: [],
        dataProviders: [],
        connectionStrings: []
      }
    }
  },
  mounted () {
    this.getItem()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getItem () {
      this.isLoading = true
      api.getModuleConfig().then(
        response => {
          this.isLoading = false
          this.item = response.data.item
        },
        error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        }
      )
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

.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}

</style>