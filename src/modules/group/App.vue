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
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd()">添加</el-button>  
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
        :default-expand-all="true">
      </el-tree>
    </el-row>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
        {{ editActive ? '编辑' : '添加'}}
      </span>
      <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="100px" size="small">
        <el-tabs v-model="activeTabName" type="card">
          <el-tab-pane label="基本信息" name="first">
            <el-form-item label="所属分组">
              <el-cascader :options="editParentTreeData" :props="editParentTreeDefaultProps" clearable change-on-select v-model="mainForm.parentIDPath"></el-cascader>
            </el-form-item>
            <el-form-item label="用户组名称" prop="name">
              <el-input v-model.trim="mainForm.name" auto-complete="off" placeholder="请输入用户组名称" ref="name"></el-input>
            </el-form-item>
            <el-form-item label="是否包含用户">
              <el-switch v-model="mainForm.isIncludeUser"></el-switch>
            </el-form-item>
            <el-form-item label="是否停用">
              <el-switch v-model="mainForm.isDisabled"></el-switch>
            </el-form-item>            
          </el-tab-pane>
          <el-tab-pane label="限制角色" name="second">
            <el-form-item label="限制角色">
              <el-checkbox-group v-model="mainForm.limitRoleIDs">
                <el-checkbox v-for="role in editRoleListData" :label="role.roleID" :key="role.roleID">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="包含角色" name="third">
            <el-form-item label="包含角色">
              <el-checkbox-group v-model="mainForm.roleIDs">
                <el-checkbox v-for="role in editRoleListData" :label="role.roleID" :key="role.roleID">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="包含权限" name="fourth">
            <el-form-item label="包含权限">
              <el-tree :data="editPermissionTreeData" :props="editPermissionTreeDefaultProps"
                node-key="id"
                ref="editPermissionTree"
                empty-text=""
                show-checkbox
                default-expand-all
                check-strictly
                @check-change="handlePermissionTreeCheckChange"
                >
              </el-tree>
            </el-form-item>
          </el-tab-pane>
        </el-tabs>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMainFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleMainFormSure(true)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" :visible.sync="removeConfirmDialogVisible"  width="320px" center>
      <span>删除该用户组后，相关的数据也将被删除。<br/>确定要删除吗？</span>
      <div slot="footer" class="dialog-footer">
       <el-button @click="handleRemoveSure(false)">取 消</el-button>
       <el-button type="primary" @click="handleRemoveSure(true)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="moveFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
        移动节点: {{ moveActive ? moveActive.name : null }}
      </span>
      <el-form ref="moveForm" :model="moveForm" :rules="moveFormRules" label-position="right" label-width="100px" size="small">
        <el-form-item label="目标节点" prop="targetIDPath">
          <el-cascader :options="editParentTreeData" :props="editParentTreeDefaultProps" clearable change-on-select v-model="moveForm.targetIDPath"></el-cascader>
        </el-form-item>
        <el-form-item label="位置">
          <template>
            <el-radio v-model="moveForm.movingLocation" :label="0" border>目标之下</el-radio>
            <el-radio v-model="moveForm.movingLocation" :label="1" border>目标之上</el-radio>
          </template>
        </el-form-item>
        <el-form-item label="作为子节点" v-if="moveForm.movingLocation === 0">
          <el-switch v-model="moveForm.isChild"></el-switch>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMoveFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleMoveFormSure(true)">确 定</el-button>
      </div>
    </el-dialog>

  </el-main>
</el-container>
</template>

<script>
import api from '@/utils/api'
import _ from 'lodash'

export default {
  data () {
    return {
      // 主要数据
      isLoading: false,
      activeTabName: 'first',
      treeData: null,
      treeDefaultProps: {
        children: 'children',
        label: 'name'
      },
      filterText: null,

      // 删除
      removeActive: null,                 // 暂存删除项
      removeConfirmDialogVisible: false,  // 删除确认对话框是否可见
      // 移动
      moveActive: null,                   // 暂存移动项
      moveFormDialogVisible: false,       // 移动对话框是否可见

      // 添加/编辑
      editActive: null,                   // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false,       // 添加/编辑对话框是否可见
      mainForm: {
        groupID: null,                    // String
        name: null,                       // String
        roleIDs: [],                      // Array 不能设置为 null
        permissionIDs: null,              // Array
        limitRoleIDs: [],                 // Array 不能设置为 null
        parentIDPath: [],                 // Array 不能设置为 null 如果 parentIDPath 无值则作为顶级节点,否则作为子节点。给 cascader 组件使用。
        parentID: null,                   // String
        isIncludeUser: null,              // Bool 是否包含用户
        isDisabled: null                  // Bool 是否停用
      },
      moveForm: {
        sourceID: null,
        targetIDPath: null,               // Array 必须选择。给 cascader 组件使用。
        targetID: null,
        isChild: false,
        movingLocation: 0                 // 0: Under, 1: Above 。 作为子节点，总是 Under；作为兄弟节点则可使用两值任一。
      },
      mainFormRules: {
        name: [
          { required: true, message: '请输入用户组名称', trigger: 'blur' },
          { max: 50, message: '最多支持50个字符', trigger: 'blur' }
        ]
      },
      moveFormRules: {
        targetIDPath: [
          { required: true, type: 'array', message: '请选择目标节点', trigger: 'change' }
        ]
      },
      editPermissionTreeData: null,       // 用于编辑对话框内显示的权限树
      editPermissionTreeDefaultProps: {
        children: 'children',
        label: 'name'
      },
      editRoleListData: null,             // 用于编辑对话框内显示的角色列表
      editParentTreeData: null,           // 用于编辑对话框内显示的父节点
      editParentTreeDefaultProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      }
    }
  },
  mounted () {
    this.getTree()
    this.getRoleBases()
    this.getPermissionTree()
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
        this.showErrorMessage(error.message)
      })
    },
    filterNode (value, data) {
      if (!value) {
        return true
      }
      return data.name.indexOf(value) !== -1
    },
    getRoleBases () {
      api.getRoleBases().then(response => {
        this.editRoleListData = response.data.list
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    getPermissionTree () {
      api.getPermissionTree().then(response => {
        this.editPermissionTreeData = response.data.tree
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    handleAdd (node, data) {
      console.log('handleAdd', node, data)
      if (!this.validateBaseData()) {
        return
      }
      let parentIDPath = []
      if (data) {
        parentIDPath = data.parentIDPath ? data.parentIDPath : []
        parentIDPath.push(data.id)
      }
      this.activeTabName = 'first'
      this.editActive = null
      this.generateParentTree(null)
      this.mainFormDialogVisible = true
      this.mainForm.groupID = null
      this.mainForm.name = null
      this.mainForm.parentIDPath = parentIDPath
      this.mainForm.parentID = data ? data.id : null
      this.mainForm.roleIDs = []            // 不能设置为 null
      this.mainForm.permissionIDs = null
      this.mainForm.limitRoleIDs = []       // 不能设置为 null
      this.mainForm.isIncludeUser = true    // 默认 true
      this.mainForm.isDisabled = false      // 默认 false
      this.$nextTick(() => {
        this.$refs.editPermissionTree.setCheckedKeys([], true)
        this.clearValidate('mainForm')
      })
    },
    handleEdit (node, data) {
      console.log('handleEdit', node, data)
      if (!this.validateBaseData() || !data) {
        return
      }
      this.activeTabName = 'first'
      this.editActive = data
      this.generateParentTree(data)
      this.mainFormDialogVisible = true
      this.mainForm.groupID = data.id
      this.mainForm.name = data.name
      this.mainForm.parentIDPath = data.parentIDPath
      this.mainForm.parentID = data.id
      this.mainForm.roleIDs = data.roles.map(m => m.roleID)
      this.mainForm.permissionIDs = data.permissions.map(m => m.permissionID)
      this.mainForm.limitRoleIDs = data.limitRoles.map(m => m.roleID)
      this.mainForm.isIncludeUser = data.isIncludeUser
      this.mainForm.isDisabled = data.isDisabled
      this.$nextTick(() => {
        this.$refs.editPermissionTree.setCheckedKeys(this.mainForm.permissionIDs, true)
        this.clearValidate('mainForm')
      })
    },
    handleMainFormSure (sure) {
      console.log('handleMainFormSure', sure)
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
    handleRemove (node, data) {
      this.removeActive = data
      this.removeConfirmDialogVisible = true
    },
    handleRemoveSure (sure) {
      this.removeConfirmDialogVisible = false
      if (sure) {
        this.remove()
      } else {
        this.removeActive = null
      }
    },
    handleMove (node, data) {
      console.log('handleMove', node, data)
      if (!this.validateBaseData() || !data) {
        return
      }
      this.moveActive = data
      this.generateParentTree(data)
      this.moveFormDialogVisible = true
      this.moveForm.sourceID = data.id
      this.moveForm.targetIDPath = []
      this.moveForm.movingLocation = 0
      this.moveForm.isChild = false
      this.$nextTick(() => {
        this.clearValidate('moveForm')
      })
    },
    handleMoveFormSure (sure) {
      console.log('handleMoveFormSure', sure)
      if (sure) {
        this.move()
      } else {
        this.moveFormDialogVisible = false
        this.moveActive = null
      }
    },
    add () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = {
          groupID: null,                                  // String
          name: this.mainForm.name,                       // String
          roleIDs: this.mainForm.roleIDs,                 // Array
          permissionIDs: this.mainForm.permissionIDs,     // Array
          limitRoleIDs: this.mainForm.limitRoleIDs,       // Array
          parentID: this.mainForm.parentIDPath && this.mainForm.parentIDPath.length
          ? this.mainForm.parentIDPath[this.mainForm.parentIDPath.length - 1]
          : null,
          isIncludeUser: this.mainForm.isIncludeUser,
          isDisabled: this.mainForm.isDisabled
        }
        api.addGroup(params).then(response => {
          this.isLoading = false
          this.mainFormDialogVisible = false
          this.getTree()
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        })
      })
    },
    edit () {
      if (!this.editActive) {
        this.showErrorMessage('异常：无编辑目标')
        return
      }
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = {
          groupID: this.mainForm.groupID,                 // String
          name: this.mainForm.name,                       // String
          roleIDs: this.mainForm.roleIDs,                 // Array
          permissionIDs: this.mainForm.permissionIDs,     // Array
          limitRoleIDs: this.mainForm.limitRoleIDs,       // Array
          parentID: this.mainForm.parentIDPath && this.mainForm.parentIDPath.length
          ? this.mainForm.parentIDPath[this.mainForm.parentIDPath.length - 1]
          : null,
          isIncludeUser: this.mainForm.isIncludeUser,
          isDisabled: this.mainForm.isDisabled
        }
        api.editGroup(params).then(response => {
          this.isLoading = false
          this.editActive = null
          this.mainFormDialogVisible = false
          this.getTree()
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        })
      })
    },
    remove () {
      if (!this.removeActive) return
      const params = {
        groupID: this.removeActive.id
      }
      this.isLoading = true
      api.removeGroup(params).then(response => {
        this.isLoading = false
        this.removeActive = null
        this.getTree()
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    move () {
      if (!this.moveActive) return
      this.$refs.moveForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        const params = {
          sourceID: this.moveActive.id,
          targetID: this.moveForm.targetIDPath[this.moveForm.targetIDPath.length - 1],
          isChild: this.moveForm.movingLocation === 0 ? this.moveForm.isChild : null,
          movingLocation: this.moveForm.movingLocation
        }
        console.log(this.moveForm)
        this.isLoading = true
        api.moveGroup(params).then(response => {
          this.isLoading = false
          this.moveFormDialogVisible = false
          this.moveActive = null
          this.getTree()
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        })
      })
    },
    validateBaseData () {
      if (!this.editRoleListData) {
        this.showErrorMessage('基础数据缺失：角色列表')
        return false
      }
      if (!this.editPermissionTreeData) {
        this.showErrorMessage('基础数据缺失：权限列表')
        return false
      }
      return true
    },
    handlePermissionTreeCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.mainForm.permissionIDs = this.$refs.editPermissionTree.getCheckedKeys()
      // console.log(this.mainForm.permissionIDs)
    },
    generateParentTree (data) {
      // 在添加或编辑用户组时，需要将系统用户组
      if (!this.treeData) {
        // this.treeData 实际上一定有值的
        this.editParentTreeData = []
        return
      }
      if (!data) {
        // 添加时，过滤系统用户组
        this.editParentTreeData = this.treeData.filter((element, index, array) => { return !element.isSystem })
      } else {
        // 编辑或移动时，过滤系统用户组和自身树(需递归)
        this.editParentTreeData = _.cloneDeep(this.treeData)
        // 系统用户组只在第一级
        this.editParentTreeData = this.editParentTreeData.filter((element, index, array) => { return !element.isSystem })
        this.filterTree(this.editParentTreeData, data)
      }
    },
    filterTree (tree, data) {
      for (let i = 0; i < tree.length; i++) {
        const item = tree[i]
        // tree 通过 clone 而来，不能直接比较对象
        if (item.id === data.id) {
          // 在第一级就找到
          tree.splice(i, 1)
          break
        } else if (item.children) {
          this.filterTree(item.children, data)
        }
      }
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    clearValidate (formName) {
      this.$refs[formName].clearValidate()
    },
    showErrorMessage (message) {
      this.$message({
        message: message,
        type: 'error'
      })
    },
    renderContent (h, { node, data, store }) {
      return (
        <span style="flex: 1; display: flex; align-items: center; justify-content: space-between; font-size: 14px; padding-right: 10px;">
          <span>
            <span>{ node.label }</span>
          </span>
          <span>
            <span style="font-size: 12px;"> { data.limitRoles ? data.limitRoles.map(m => m.name).join(' ') : '' } </span>
          </span>
          <span v-show={ !data.isSystem }>
            <span style="font-size: 12px;" v-show={ data.isDisabled }>[停用] </span>
            <span style="font-size: 12px;" v-show={ data.isIncludeUser }>[用户] </span>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-edit-outline" onClick={ (e) => {
              e.stopPropagation()
              e.preventDefault()
              this.handleEdit(node, data)
            }}>编辑</el-button>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-circle-plus-outline" onClick={ (e) => {
              e.stopPropagation()
              e.preventDefault()
              this.handleAdd(node, data)
            }}>添加</el-button>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-rank" onClick={ (e) => {
              e.stopPropagation()
              e.preventDefault()
              this.handleMove(node, data)
            }}>移动</el-button>
            <el-button style="font-size: 12px;" type="text" icon="el-icon-remove-outline" onClick={ (e) => {
              e.stopPropagation()
              e.preventDefault()
              this.handleRemove(node, data)
            }}>删除</el-button>
          </span>
        </span>)
    }
  }
}
</script>

<style lang="scss" scoped>

.filterText {
  width: 200px;
  margin-right: 12px;
}
.el-row {
  margin-bottom: 20px;
  &:last-child {
    margin-bottom: 0;
  }
}
// 角色
.el-checkbox {
  display: block;
  margin: 0;
}
// 用户组
.el-cascader {
  width: 100%;
}

</style>