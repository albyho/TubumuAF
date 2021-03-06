<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-row>
      <el-col>
        <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd">添加</el-button>
      </el-col>
    </el-row>
    <el-table :data="list" style="width: 100%" :empty-text="mainTableEmptyText">
      <el-table-column prop="name" label="名称" />
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <!-- 禁止拖动：不使用 v-show 和 :class，而是直接使用 v-if 也可行 -->
          <el-button type="text" size="small" icon="el-icon-rank" :class="{ 'ignore-elements': scope.row.isSystem }" v-show="!scope.row.isSystem" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" />
        </template>
      </el-table-column>
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleRemove(scope.row)" v-if="!scope.row.isSystem" />
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加/编辑对话框 -->
    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="400px">
      <span slot="title">
          {{ editActive ? '编辑' : '添加' }}
        </span>
      <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="120px">
        <el-form-item label="角色名称" prop="name">
          <el-input ref="name" v-model.trim="mainForm.name" auto-complete="off" placeholder="请输入角色名称" />
        </el-form-item>
        <el-form-item label="包含权限">
          <el-tree :data="editPermissionTreeData" :props="editPermissionTreeDefaultProps" node-key="id" ref="editPermissionTree" empty-text="" show-checkbox default-expand-all check-strictly @check-change="handlePermissionTreeCheckChange" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMainFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleMainFormSure(true)">确 定</el-button>
      </div>
    </el-dialog>

  </el-main>
</el-container>
</template>

<script>
import Sortable from 'sortablejs'
import api from '@/utils/api'

export default {
  data () {
    return {
      // 主要数据
      isLoading: false,
      list: null, // 主要数据列表

      // 删除
      removeActive: null, // 暂存删除项

      // 添加/编辑
      editActive: null, // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false, // 添加/编辑对话框是否可见
      mainForm: {
        roleId: null,
        name: null,
        permissionIds: null
      },
      mainFormRules: {
        name: [{
          required: true,
          message: '请输入角色名称',
          trigger: 'blur'
        },
        {
          max: 50,
          message: '最多支持50个字符',
          trigger: 'blur'
        }
        ]
      },
      editPermissionTreeData: null, // 用于编辑对话框内显示的权限树
      editPermissionTreeDefaultProps: {
        children: 'children',
        label: 'name'
      }
    }
  },
  mounted () {
    this.getList()
    this.getPermissionTree()
  },
  computed: {
    mainTableEmptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getList () {
      this.isLoading = true
      api.getRoleList().then(response => {
        this.isLoading = false
        this.list = response.data.data
        this.$nextTick(() => {
          this.setupSortable()
        })
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    getPermissionTree () {
      api.getPermissionTree().then(response => {
        this.editPermissionTreeData = response.data.data
      }, error => {
        this.$message.error(error.message)
      })
    },
    handleAdd () {
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.roleId = null
      this.mainForm.name = null
      this.mainForm.permissionIds = null
      this.$nextTick(() => {
        this.$refs.editPermissionTree.setCheckedKeys([], true)
        this.$refs.name.focus()
        this.clearValidate('mainForm')
      })
    },
    handleEdit (row) {
      if (!this.validateBaseData()) {
        this.$message.error('基础数据缺失：权限列表')
      }
      this.editActive = row
      this.mainFormDialogVisible = true
      this.mainForm.roleId = row.roleId
      this.mainForm.name = row.name
      this.mainForm.permissionIds = row.permissions.map(m => m.permissionId)
      this.$nextTick(() => {
        this.$refs.editPermissionTree.setCheckedKeys(this.mainForm.permissionIds, true)
        this.clearValidate('mainForm')
      })
    },
    handleMainFormSure (sure) {
      if (sure) {
        // 提交数据
        if (this.editActive) {
          this.edit()
        } else {
          this.add()
        }
      } else {
        this.mainFormDialogVisible = false
        // this.editActive = null // 注：添加状态 endActive 本就为 null
      }
    },
    handleRemove (row) {
      this.removeActive = row
      this.$confirm('删除该角色后，相关的数据也将被删除。是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove()
      }).catch(() => {
        this.removeActive = null
      })
    },
    add () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = {
          name: this.mainForm.name,
          permissionIds: this.mainForm.permissionIds
        }
        api.addRole(params).then(response => {
          this.list.push(response.data.data)
          this.isLoading = false
          this.mainFormDialogVisible = false
        }, error => {
          this.isLoading = false
          this.$message.error(error.message)
        })
      })
    },
    edit () {
      if (!this.editActive) {
        this.$message.error('异常：无编辑目标')
        return
      }
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = {
          roleId: this.mainForm.roleId,
          name: this.mainForm.name,
          permissionIds: this.mainForm.permissionIds
        }
        api.editRole(params).then(response => {
          this.list.splice(this.list.indexOf(this.editActive), 1, response.data.data)
          // Vue.set(this.list, this.list.indexOf(this.editActive), response.data.data)
          this.isLoading = false
          this.editActive = null
          this.mainFormDialogVisible = false
        }, error => {
          this.isLoading = false
          this.$message.error(error.message)
        })
      })
    },
    remove () {
      if (!this.removeActive) return
      const params = {
        roleId: this.removeActive.roleId
      }
      this.isLoading = true
      api.removeRole(params).then(response => {
        this.isLoading = false
        const index = this.list.indexOf(this.removeActive)
        this.list.splice(index, 1)
        this.removeActive = null
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    move (sourceDisplayOrder, targetDisplayOrder) {
      const params = {
        sourceDisplayOrder: sourceDisplayOrder,
        targetDisplayOrder: targetDisplayOrder
      }
      this.isLoading = true
      api.moveRole(params).then(response => {
        this.isLoading = false
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    validateBaseData () {
      if (!this.editPermissionTreeData) {
        this.$message.error('基础数据缺失：权限列表')
        return false
      }
      return true
    },
    handlePermissionTreeCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.mainForm.permissionIds = this.$refs.editPermissionTree.getCheckedKeys()
      // console.log(this.mainForm.permissionIds)
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    clearValidate (formName) {
      this.$refs[formName].clearValidate()
    },
    setupSortable () {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
        ghostClass: 'sortable-ghost', // Class name for the drop placeholder,
        group: 'name',
        handle: '.el-icon-rank',
        filter: '.ignore-elements',
        onMove: function (evt, originalEvent) {
          return evt.dragged.rowIndex !== 0 && evt.related.rowIndex !== 0
        },
        onEnd: evt => {
          if (evt.oldIndex === evt.newIndex) return
          const sourceDisplayOrder = evt.oldIndex + 1
          const targetDisplayOrder = evt.newIndex + 1

          // 服务器同步
          this.move(sourceDisplayOrder, targetDisplayOrder)
        }
      })
    }
  }
}
</script>

<style lang="scss">
.sortable-ghost {
  opacity: .8;
  color: #fff;
  background: #409eff;
}
</style>
