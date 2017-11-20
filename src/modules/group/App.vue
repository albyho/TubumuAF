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
        default-expand-all>
      </el-tree>
    </el-row>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
        {{ editActive ? '编辑' : '添加'}}
      </span>
      <el-form ref="mainForm" :model="mainForm" :rules="rules" label-position="right" label-width="100px" size="small">
        <el-tabs v-model="activeTabName" type="card">
          <el-tab-pane label="基本信息" name="first">
            <el-form-item label="所属分组">
              <el-cascader :options="editTreeData" :props="editTreeDefaultProps" clearable change-on-select v-model="mainForm.parentIDs"></el-cascader>
            </el-form-item>
            <el-form-item label="用户组名称" prop="name">
              <el-input v-model.trim="mainForm.name" auto-complete="off" placeholder="请输入用户组名称" ref="name"></el-input>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="限制角色" name="second">
            <el-form-item label="限制角色">
              <el-checkbox-group v-model="mainForm.limitRoleIDs">
                <el-checkbox v-for="role in roleListData" :label="role.roleID" :key="role.roleID">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="包含角色" name="third">
            <el-form-item label="包含角色">
              <el-checkbox-group v-model="mainForm.roleIDs">
                <el-checkbox v-for="role in roleListData" :label="role.roleID" :key="role.roleID">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="包含权限" name="fourth">
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

  </el-main>
</el-container>
</template>

<script>
import api from '@/utils/api'

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
      removeActive: null,           // 暂存删除项
      removeConfirmDialogVisible: false,  // 删除确认对话框是否可见

      // 添加/编辑
      editActive: null,                   // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false,       // 添加/编辑对话框是否可见
      mainForm: {
        groupID: null,                    // String
        name: null,                       // String
        roleIDs: [],                      // Array 不能设置为 null
        permissionIDs: null,              // Array
        limitRoleIDs: [],                 // Array 不能设置为 null
        parentIDs: null                   // Array 如果 parentIDs 无值则作为顶级节点,否则作为子节点
      },
      moveForm: {
        isChild: null,
        movingLocation: null              // 0: Under, 1: Above 。 作为子节点，总是 Under；作为兄弟节点则可使用两值任一。
      },
      rules: {
        name: [
          { required: true, message: '请输入用户组名称', trigger: 'blur,change' },
          { max: 50, message: '最多支持50个字符', trigger: 'blur,change' }
        ]
      },
      permissionTreeData: null,     // 用于编辑对话框内显示的权限树
      permissionTreeDefaultProps: {
        children: 'children',
        label: 'name'
      },                            // 用于编辑对话框内显示的权限树
      roleListData: null,           // 用于编辑对话框内显示的角色列表
      editTreeData: [{
        id: 0,
        name: null
      }],
      editTreeDefaultProps: {
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
    },
    getRoleBases () {
      api.getRoleBases().then(response => {
        this.roleListData = response.data.list
      }, error => {
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
    validateBaseData () {
      if (!this.roleListData) {
        this.showErrorMessage('基础数据缺失：角色列表')
        return false
      }
      if (!this.permissionTreeData) {
        this.showErrorMessage('基础数据缺失：权限列表')
        return false
      }
      return true
    },
    handlePermissionTreeCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.mainForm.permissionIDs = this.$refs.permissionTree.getCheckedKeys()
      // console.log(this.mainForm.permissionIDs)
    },
    handleMainFormSure (sure) {
      console.log(this.mainForm)
    },
    handleAdd (node, data) {
      console.log('handleAdd', node, data)
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = null
      this.filterGroup(null)
      this.mainFormDialogVisible = true
      this.mainForm.groupID = null
      this.mainForm.name = null
      this.mainForm.parentIDs = data ? [data.id] : []
      this.mainForm.roleIDs = []       // 不能设置为 null
      this.mainForm.permissionIDs = null
      this.mainForm.limitRoleIDs = []  // 不能设置为 null
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys([], true)
        this.$refs.name.focus()
      })
    },
    handleEdit (node, data) {
      console.log('handleEdit', node, data)
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = data
      this.generateNewTree(data.id)
      this.mainFormDialogVisible = true
      this.mainForm.groupID = data.id
      this.mainForm.name = data.name
      this.mainForm.parentIDs = [data.id]
      this.mainForm.roleIDs = data.roles.map(m => m.roleID)
      this.mainForm.permissionIDs = data.permissions.map(m => m.permissionID)
      this.mainForm.limitRoleIDs = data.limitRoles.map(m => m.roleID)
      this.$nextTick(() => {
        this.$refs.permissionTree.setCheckedKeys(this.mainForm.permissionIDs, true)
      })
    },
    handleMove (node, data) {

    },
    handleRemove (node, data) {
      console.log('handleRemove', node, data)
      this.getTree()
    },
    generateNewTree (id) {
      if (!this.treeData) {
        // this.treeData 实际上一定有值的
        this.editTreeData = []
        return
      }
      if (!id) {
        // 添加时，过滤系统用户组
        this.editTreeData = this.treeData.filter((element, index, array) => { return !element.isSystem })
      } else {
        // 编辑或移动时，过滤系统用户组和自身树
        this.editTreeData = []
      }
    },
    generateIDPath (id) {
      if (!this.treeData) {
        // this.treeData 实际上一定有值的
        this.editTreeData = []
      }
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
.el-checkbox {
  display: block;
  margin: 0;
}
.el-cascader {
  width: 100%;
}

</style>