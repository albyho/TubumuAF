<template>
<el-container>
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>权限列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">      
    <el-row>  
      <el-form :inline="true" :model="searchCriteriaForm" size="mini">   
        <el-form-item>  
          <el-input v-model="searchCriteriaForm.name" placeholder="名称"></el-input>  
        </el-form-item>
        <el-form-item>  
            <el-button type="primary" icon="el-icon-search" @click="handleSearch">查询</el-button>  
        </el-form-item>
      </el-form>
    </el-row>
    <el-row>
    <el-table :data="list" v-loading="isLoading" size="small" style="width: 100%" :empty-text="emptyText">
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" round size="small" icon="el-icon-rank"></el-button>
        </template>
      </el-table-column>
      <el-table-column prop="displayOrder" label="#" width="40"></el-table-column>
      <el-table-column prop="moduleName" label="模块" width="180"></el-table-column>    
      <el-table-column prop="name" label="名称"></el-table-column>
    </el-table>
    </el-row>
  </el-main>
</el-container>
</template>

<script>
import Sortable from 'sortablejs'
import api from '@/utils/api'

export default {
  data () {
    return {
      isLoading: false,
      list: null,
      searchCriteriaForm: {
        name: null
      }
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
        this.list = response.data.permissions
        this.$nextTick(() => {
          this.setupSortable()
        })
      }, error => {
        this.isLoading = false
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    setupSortable () {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        handle: '.el-icon-rank',
        onMove: (evt, originalEvent) => {
          // 根据 rowIndex 判断是否可以拖动排序。判断的依据是拖动的元素不能是目标元素的直接或间接祖先。
          console.log('onMove1', evt)
          console.log('onMove2', originalEvent)
          console.log('onMove', evt.dragged.rowIndex, evt.related.rowIndex)
          return this.validDragged(evt.dragged.rowIndex, evt.related.rowIndex)
        },
        onUpdate: evt => {
          console.log('onUpdate', evt)
          // 更新成功后重新设置 list 元素的 DisplayOrder；并且将更新数据同步到服务器。
          // 同步数据库时，显示 loading 不可继续拖动(也可将 sortable 的 disabled 设置为 true，但这样体验不好)。
          // 服务器可提供多种形式的接口。
        },
        onEnd: evt => {
          console.log('onEnd', evt)
        }
      })
    },
    validDragged (srcIndex, dstIndex) {
      console.log('validDragged', srcIndex, dstIndex)
      const src = this.list[srcIndex]
      const dst = this.list[dstIndex]
      if (src.PermissionID === dst.ParentID) {
        console.log('validDragged', false)
        return false
      }
      for (let i = 0; i < this.list.length; i++) {
        if (this.list[i].ParentID === dst.PermissionID) {
          return this.validDragged(srcIndex, i)
        }
      }

      console.log('validDragged', true)
      return true
    },
    handleSearch () {

    }
  }
}
</script>

<style lang="scss" scoped>

</style>