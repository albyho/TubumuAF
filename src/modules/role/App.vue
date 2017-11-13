<template>
<el-container>
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-row>
      <el-col>
        <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAddRole">添加</el-button>  
      </el-col>
    </el-row>
    <el-table :data="list" v-loading="isLoading" size="small" style="width: 100%" :empty-text="emptyText">
      <el-table-column prop="name" label="名称"></el-table-column>
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <!-- 禁止拖动：不使用 v-show 和 :class，而是直接使用 v-if 也可行 -->
          <el-button type="text" size="small" icon="el-icon-rank" :class="{ 'ignore-elements': scope.row.isSystem }" v-show="!scope.row.isSystem"></el-button>
        </template>
      </el-table-column>      
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleEditRole(scope.row)" v-if="!scope.row.isSystem"></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleRemoveRole(scope.row)" v-if="!scope.row.isSystem"></el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="400px">
      <span slot="title">
        {{ editActive ? '编辑' : '添加'}}
      </span>

      <el-form ref="mainForm" :model="mainForm" :rules="rules" label-position="right" label-width="80px" size="small">
        <el-form-item label="角色名称" prop="name">
          <el-input v-model.trim="mainForm.name" auto-complete="off" placeholder="请输入角色名称" ref="name"></el-input>
        </el-form-item>

        <el-form-item label="包含权限">
          <el-tree :data="permissionTreeData" :props="permissionTreeDefaultProps"
            node-key="id"
            ref="permissionTree"
            empty-text=""
            show-checkbox
            default-expand-all
            check-strictly
            @check-change="handlePermissionTreeCheckChange"
            >
          </el-tree>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMainFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleMainFormSure(true)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="removeConfirmDialogVisible"  width="320px" center>
      <span>删除该角色后，相关的数据也将被删除。<br/>确定要删除吗？</span>
      <div slot="footer" class="dialog-footer">
       <el-button @click="handleRemoveRoleSure(false)">取 消</el-button>
       <el-button type="primary" @click="handleRemoveRoleSure(true)">确 定</el-button>
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
      list: null,                   // 主要数据列表

      // 删除
      removeActive: null,           // 暂存删除项
      removeConfirmDialogVisible: false,  // 删除确认对话框是否可见

      // 添加/编辑
      editActive: null,                   // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false,       // 添加/编辑对话框是否可见
      mainForm: {
        roleID: null,
        name: null,
        permissionIDs: null
      },
      rules: {
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur,change' },
          { max: 50, message: '最多支持50个字符', trigger: 'blur,change' }
        ]
      },
      permissionTreeData: null,     // 用于编辑对话框内显示的权限树
      permissionTreeDefaultProps: {
        children: 'children',
        label: 'name'
      }                             // 用于编辑对话框内显示的权限树
    }
  },
  mounted () {
    this.getList()
    this.getPermissionTree()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  methods: {
    getList () {
      this.isLoading = true
      api.getRoles().then(response => {
        this.isLoading = false
        this.list = response.data.roles
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
    getPermissionTree () {
      api.getPermissionTree().then(response => {
        this.permissionTreeData = response.data.tree
      }, error => {
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    moveRole (sourceDisplayOrder, targetDisplayOrder) {
      const moveRoleParams = {
        SourceDisplayOrder: sourceDisplayOrder,
        TargetDisplayOrder: targetDisplayOrder
      }
      this.isLoading = true
      api.moveRole(moveRoleParams).then(response => {
        this.isLoading = false
      }, error => {
        this.isLoading = false
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    handleRemoveRole (row) {
      this.removeActive = row
      this.removeConfirmDialogVisible = true
    },
    handleRemoveRoleSure (sure) {
      this.removeConfirmDialogVisible = false
      if (sure) {
        this.removeRole()
      }
    },
    removeRole () {
      if (!this.removeActive) return
      const removeRoleParams = {
        RoleID: this.removeActive.roleID
      }
      this.isLoading = true
      api.removeRole(removeRoleParams).then(response => {
        this.isLoading = false
        const index = this.list.indexOf(this.removeActive)
        this.list.splice(index, 1)
        this.removeActive = null
      }, error => {
        this.isLoading = false
        this.removeActive = null
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    showErrorMessage (message) {
      this.$message({
        message: message,
        type: 'error'
      })
    },
    validateBaseData () {
      if (!this.permissionTreeData) {
        this.showErrorMessage('基础数据缺失：权限列表')
        return false
      }
      return true
    },
    handleAddRole () {
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.roleID = null
      this.mainForm.name = null
      this.mainForm.permissionIDs = null
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys([], true)
        this.$refs.name.focus()
      })
    },
    handleEditRole (row) {
      if (!this.validateBaseData()) {
        this.showErrorMessage('基础数据缺失：权限列表')
      }
      this.editActive = row
      this.mainFormDialogVisible = true
      this.mainForm.roleID = row.roleID
      this.mainForm.name = row.name
      this.mainForm.permissionIDs = row.permissions.map(m => m.permissionID)
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(this.mainForm.permissionIDs, true)
      })
    },
    handleMainFormSure (sure) {
      if (sure) {
        // 提交数据
        if (this.editActive) {
          this.endRole()
        } else {
          this.addRole()
        }
      } else {
        this.mainFormDialogVisible = false
        this.editActive = null // 注：添加状态 endActive 本就为 null
      }
    },
    handlePermissionTreeCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.mainForm.permissionIDs = this.$refs.permissionTree.getCheckedKeys()
      // console.log(this.mainForm.permissionIDs)
    },
    addRole () {
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          const params = {
            name: this.mainForm.name,
            permissionIDs: this.mainForm.permissionIDs
          }
          api.addRole(params).then(response => {
            this.list.push(response.data.role)
            this.isLoading = false
            this.mainFormDialogVisible = false
          }, error => {
            this.isLoading = false
            this.$message({
              message: error.message,
              type: 'error'
            })
          })
        } else {
          // 客户端校验未通过
          return false
        }
      })
    },
    endRole () {
      if (!this.editActive) {
        this.showErrorMessage('异常：无编辑目标')
        return
      }
      this.$refs.mainForm.validate(valid => {
        if (valid) {
          this.isLoading = true
          const params = {
            roleID: this.mainForm.roleID,
            name: this.mainForm.name,
            permissionIDs: this.mainForm.permissionIDs
          }
          api.editRole(params).then(response => {
            this.list.splice(this.list.indexOf(this.editActive), 1, response.data.role)
            this.isLoading = false
            this.editActive = null
            this.mainFormDialogVisible = false
          }, error => {
            this.isLoading = false
            this.$message({
              message: error.message,
              type: 'error'
            })
          })
        } else {
          // 客户端校验未通过
          return false
        }
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    setupSortable () {
      const el = document.querySelectorAll('.el-table__body-wrapper > table > tbody')[0]
      this.sortable = Sortable.create(el, {
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
          this.moveRole(sourceDisplayOrder, targetDisplayOrder)
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

</style>