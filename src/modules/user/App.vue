<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">  
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main"> 
    <el-row>
      <el-input placeholder="关键字" size="mini" v-model="searchCriteriaForm.keyword" class="filterText"></el-input>
      <el-cascader :options="editGroupTreeData" size="mini" :props="editGroupTreeDefaultProps" clearable change-on-select filterable placeholder="用户组" v-model="searchCriteriaForm.groupIDPath"></el-cascader>
      <el-button size="mini" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
      <el-button size="mini" icon="el-icon-search" @click="handleSearchAll()">全部</el-button>
      <el-button type="primary" size="mini" icon="el-icon-circle-plus-outline" @click="handleAdd()">添加</el-button>  
    </el-row>
    <el-row>
    <el-table :data="page.list" size="small" style="width: 100%" :empty-text="emptyText" @sort-change="sortChange">
      <el-table-column prop="UserID" label="#" width="60" sortable="custom"></el-table-column>
      <el-table-column prop="Username" label="用户名" width="100" sortable="custom"></el-table-column>
      <el-table-column prop="Group.Name" label="用户组" width="160"></el-table-column>
      <el-table-column prop="RealName" label="真实名称" width="100"></el-table-column>
      <el-table-column prop="DisplayName" label="昵称" width="100"></el-table-column>
      <el-table-column prop="Mobil" label="手机号码" width="120"></el-table-column>
      <el-table-column prop="Email" label="Email"></el-table-column>
      <el-table-column prop="StatusTitle" label="状态" width="60"></el-table-column>
      <el-table-column prop="CreationDate" label="创建日期" width="160"></el-table-column>
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)"></el-button>
        </template>
      </el-table-column>
      <el-table-column align="center" width="42">
        <template slot-scope="scope">
          <el-button type="text" size="small" icon="el-icon-delete" @click="handleRemove(scope.row)"></el-button>
        </template>
      </el-table-column>
    </el-table>
    </el-row>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
        {{ editActive ? '编辑' : '添加'}}
      </span>
      <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="160px" size="small">
        <el-tabs v-model="activeTabName" type="card">
          <el-tab-pane label="基本信息" name="first">
            <el-form-item label="所属分组" prop="groupIDPath">
              <el-cascader :options="editGroupTreeData" :props="editGroupTreeDefaultProps" clearable filterable placeholder="试试搜索" change-on-select v-model="mainForm.groupIDPath"></el-cascader>
            </el-form-item>
            <el-form-item label="用户名" prop="username">
              <el-input v-model.trim="mainForm.username" auto-complete="off" placeholder="请输入用户名" ref="username"></el-input>
            </el-form-item>
            <el-form-item label="状态" :required="true">
			        <el-radio-group v-model="mainForm.status">
				        <el-radio label="NotSet">未设</el-radio>
				        <el-radio label="Normal">默认</el-radio>
                <el-radio label="PendingApproval">待审</el-radio>
				        <el-radio label="Removed">删除</el-radio>
			        </el-radio-group>
            </el-form-item>
          <el-form-item label="登录密码" prop="password" :required="!this.editActive">
            <el-input v-model="mainForm.password" type='password' :placeholder="this.editActive ? '如果不修改密码，请保持为空' : '请输入登录密码'"></el-input>
          </el-form-item>
          <el-form-item label="确认密码" prop="passwordConfirm" :required="!this.editActive">
            <el-input v-model="mainForm.passwordConfirm" type='password' :placeholder="this.editActive ? '如果不修改密码，请保持为空' : '请输入确认密码'"></el-input>
          </el-form-item>
          <el-form-item label="昵称">
            <el-input v-model="mainForm.displayName" type='text'></el-input>
          </el-form-item>
          <el-form-item label="真实名称">
            <el-input v-model="mainForm.realName" type='text'></el-input>
          </el-form-item>
          <el-form-item label="真实名称是否验证">
            <el-switch v-model="mainForm.realNameIsValid"></el-switch>
          </el-form-item>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="mainForm.email" type='text'></el-input>
          </el-form-item>
          <el-form-item label="邮箱是否验证">
            <el-switch v-model="mainForm.emailIsValid"></el-switch>
          </el-form-item>
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="mainForm.mobile" type='text'></el-input>
          </el-form-item>
          <el-form-item label="手机号码是否验证">
            <el-switch v-model="mainForm.mobileIsValid"></el-switch>
          </el-form-item>
          <el-form-item label="描述">
            <el-input type="textarea" :rows="2" v-model.trim="mainForm.description"></el-input>
          </el-form-item>
          <el-form-item label="头像" prop="headURL">
            <el-input v-model.trim="mainForm.headURL" auto-complete="off" placeholder="请输入头像 URL" ref="headURL">
              <el-button slot="append" icon="el-icon-search" @click="handleChangeHeadURLBrowser"></el-button>
            </el-input>
          </el-form-item>
          <el-form-item label="Logo" prop="logoURL">
            <el-input v-model.trim="mainForm.logoURL" auto-complete="off" placeholder="请输入Logo URL" ref="logoURL">
              <el-button slot="append" icon="el-icon-search" @click="handleChangeLogoURLBrowser"></el-button>
            </el-input>
          </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="特定角色" name="second">
            <el-form-item label="特定角色">
              <el-checkbox-group v-model="mainForm.roleIDs">
                <el-checkbox v-for="role in editRoleListData" :label="role.roleID" :key="role.roleID">{{ role.name }}</el-checkbox>
              </el-checkbox-group>
            </el-form-item>
          </el-tab-pane>
          <el-tab-pane label="特定权限" name="third">
            <el-form-item label="特定权限">
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
      <span>删除该用户后，相关的数据也将被删除。<br/>确定要删除吗？</span>
      <div slot="footer" class="dialog-footer">
       <el-button @click="handleRemoveSure(false)">取 消</el-button>
       <el-button type="primary" @click="handleRemoveSure(true)">确 定</el-button>
      </div>
    </el-dialog>

  </el-main>
  <el-footer class="footer">    
    <el-pagination
      @size-change="handlePaginationSizeChange"
      @current-change="handlePaginationCurrentChange"
      :current-page="pagingInfoForm.pageNumber"
      :page-sizes="[20, 50, 100, 200, 400]"
      :page-size="pagingInfoForm.pageSize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="page.totalItemCount"
      v-if="page.totalItemCount"
      >
    </el-pagination>
  </el-footer>
</el-container>
</template>

<script>
import api from '@/utils/api'
import _ from 'lodash'

export default {
  data () {
    const validatePassord = (rule, value, callback) => {
      // 编辑时未输入密码，无需验证
      if (this.editActive && (!value || value.length === 0)) {
        callback()
      }
      if (!value) {
        callback(new Error('请输入登录密码'))
      } else if (value.length < 6) {
        callback(new Error('请输入至少6位密码'))
      } else if (value.length > 20) {
        callback(new Error('密码请保持在20位以内'))
      } else {
        callback()
      }
    }
    const validatePassordConfirm = (rule, value, callback) => {
      // 编辑时未输入密码，无需验证
      if (this.editActive && (!this.mainForm.password || this.mainForm.password.length === 0)) {
        callback()
      }
      if (!value) {
        callback(new Error('请输入确认密码'))
      } else if (value !== this.mainForm.password) {
        callback(new Error('两次输入密码不一致!'))
      } else {
        callback()
      }
    }
    return {
      // 主要数据
      isLoading: false,
      activeTabName: 'first',
      page: {
        list: null,
        totalItemCount: null,
        totalPageCount: null
      },
      searchCriteriaForm: {
        keyword: null,
        groupID: null,
        groupIDPath: []
      },
      pagingInfoForm: {
        pageNumber: 1,
        pageSize: 20,
        isExcludeMetaData: false,
        sortInfo: {
          sort: 'UserID',
          sortDir: 'ASC'
        }
      },
      // 删除
      removeActive: null,                 // 暂存删除项
      removeConfirmDialogVisible: false,  // 删除确认对话框是否可见

      // 添加/编辑
      editActive: null,                   // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false,       // 添加/编辑对话框是否可见
      mainForm: {
        userID: null,                     // Int
        status: null,                     // Int
        username: null,                   // String
        displayName: null,                // String
        realName: null,                   // String
        realNameIsValid: false,           // bool
        email: null,                      // String
        emailIsValid: false,              // bool
        mobile: null,                     // String
        mobileIsValid: false,             // bool
        groupIDPath: [],                  // Array 不能设置为 null。给 cascader 组件使用。
        groupID: null,                    // String
        roleIDs: [],                      // Array 不能设置为 null
        permissionIDs: null,              // Array
        password: null,
        passwordConfirm: null,
        description: null,
        headURL: null,
        logoURL: null
      },
      mainFormRules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' },
          { max: 20, message: '最多支持20个字符', trigger: 'blur' }
        ],
        displayName: [
          { max: 20, message: '最多支持20个字符', trigger: 'blur' }
        ],
        realName: [
          { max: 100, message: '最多支持100个字符', trigger: 'blur' }
        ],
        mobile: [
          { pattern: /^1\d{10}$/, message: '请输入正确的手机号码', trigger: 'blur' }
        ],
        email: [
          { pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/, message: '请输入正确的邮箱', trigger: 'blur' }
        ],
        groupIDPath: [
          { required: true, type: 'array', message: '请选择所属分组', trigger: 'change' }
        ],
        password: [
          { validator: validatePassord, trigger: 'blur' }
        ],
        passwordConfirm: [
          { validator: validatePassordConfirm, trigger: 'blur' }
        ]
      },
      editPermissionTreeData: null,         // 用于编辑对话框内显示的权限树
      editPermissionTreeDefaultProps: {
        children: 'children',
        label: 'name'
      },
      editRoleListData: null,               // 用于编辑对话框内显示的角色列表
      editGroupTreeData: [],                // 用于搜索 cascader /编辑对话框内显示的用户组树
      editGroupTreeDefaultProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      }
    }
  },
  mounted () {
    this.getPage()
    this.getGroupTree()
    this.getRoleBases()
    this.getPermissionTree()
  },
  computed: {
    emptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  watch: {

  },
  methods: {
    getPage () {
      this.isLoading = true
      const params = _.extend({}, this.pagingInfoForm, this.searchCriteriaForm)
      api.getUsers(params).then(response => {
        this.isLoading = false
        this.page = response.data.page
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handlePaginationSizeChange (val) {
      this.pagingInfoForm.pageSize = val
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handlePaginationCurrentChange (val) {
      this.pagingInfoForm.pageNumber = val
      this.getPage()
    },
    getGroupTree () {
      api.getGroupTree().then(response => {
        this.editGroupTreeData = response.data.tree
      }, error => {
        this.showErrorMessage(error.message)
      })
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
    handleSearchAll () {
      this.pagingInfoForm.pageNumber = 1
      this.searchCriteriaForm.keyword = null
      this.searchCriteriaForm.groupID = null
      this.searchCriteriaForm.groupIDPath = []
      this.getPage()
    },
    handleSearch () {
      this.pagingInfoForm.pageNumber = 1
      this.searchCriteriaForm.groupID = this.searchCriteriaForm.groupIDPath && this.searchCriteriaForm.groupIDPath.length
          ? this.searchCriteriaForm.groupIDPath[this.searchCriteriaForm.groupIDPath.length - 1]
          : null
      this.getPage()
    },
    handleAdd () {
      if (!this.validateBaseData()) {
        return
      }
      this.activeTabName = 'first'
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.userID = null
      this.mainForm.status = 'Normal'            // 默认 正常
      this.mainForm.username = null
      this.mainForm.displayName = null
      this.mainForm.realName = null
      this.mainForm.realNameIsValid = null
      this.mainForm.email = null
      this.mainForm.emailIsValid = null
      this.mainForm.mobile = null
      this.mainForm.mobileIsValid = null
      this.mainForm.groupIDPath = []
      this.mainForm.groupID = null
      this.mainForm.roleIDs = []                // 不能设置为 null
      this.mainForm.permissionIDs = null
      this.mainForm.password = null
      this.mainForm.passwordConfirm = null
      this.mainForm.description = null
      this.mainForm.headURL = null
      this.mainForm.logoURL = null
      this.$nextTick(() => {
        this.$refs.editPermissionTree.setCheckedKeys([], true)
        this.clearValidate('mainForm')
      })
    },
    handleEdit (row) {
      console.log('handleEdit', row)
      if (!this.validateBaseData() || !row) {
        return
      }
      this.activeTabName = 'first'
      this.editActive = row
      this.mainFormDialogVisible = true
      this.mainForm.userID = row.UserID
      this.mainForm.status = row.Status            // 默认 正常
      this.mainForm.username = row.Username
      this.mainForm.displayName = row.DisplayName
      this.mainForm.realName = row.RealName
      this.mainForm.realNameIsValid = row.RealNameIsValid
      this.mainForm.email = row.Email
      this.mainForm.emailIsValid = row.EmailIsValid
      this.mainForm.mobile = row.Mobile
      this.mainForm.mobileIsValid = row.MobileIsValid
      // this.mainForm.groupIDPath = []
      this.getGroupIDPath(this.editGroupTreeData, row.Group.GroupID)
      this.mainForm.groupID = row.Group.GroupID
      this.mainForm.roleIDs = row.Roles.map(m => m.roleID)
      this.mainForm.permissionIDs = row.Permissions.map(m => m.permissionID)
      this.mainForm.password = null
      this.mainForm.passwordConfirm = null
      this.mainForm.description = row.Description
      this.mainForm.headURL = row.headURL
      this.mainForm.logoURL = row.logoURL
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
    handleRemove (row) {
      this.removeActive = row
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
    add () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        this.mainForm.groupID = this.mainForm.groupIDPath[this.mainForm.groupIDPath.length - 1]
        const params = this.mainForm
        api.addUser(params).then(response => {
          this.isLoading = false
          this.mainFormDialogVisible = false
          this.getPage()
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
        this.isLoading = true
        this.mainForm.groupID = this.mainForm.groupIDPath[this.mainForm.groupIDPath.length - 1]
        const params = this.mainForm
        api.editUser(params).then(response => {
          this.isLoading = false
          this.editActive = null
          this.mainFormDialogVisible = false
          this.getPage()
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        })
      })
    },
    remove () {
      if (!this.removeActive) return
      const params = {
        userID: this.removeActive.UserID
      }
      this.isLoading = true
      api.removeUser(params).then(response => {
        this.isLoading = false
        this.removeActive = null
        this.getPage()
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    validateBaseData () {
      if (!this.editGroupTreeData || this.editGroupTreeData.length === 0) {
        this.showErrorMessage('基础数据缺失：用户组列表')
        return false
      }
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
    getGroupIDPath (tree, id) {
      if (!tree) return
      for (let node of tree) {
        if (node.id === id) {
          this.mainForm.groupIDPath = node.parentIDPath ? node.parentIDPath.concat() : []
          this.mainForm.groupIDPath.push(id)
          break
        } else {
          this.getGroupIDPath(node.children, id)
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
    sortChange (v) {
      this.pagingInfoForm.sortInfo.sort = v.prop
      this.pagingInfoForm.sortInfo.sortDir = v.order === 'descending' ? 'DESC' : 'ASC'
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handleChangeHeadURLBrowser () {
      this.popupCKFinder('headURL')
    },
    handleChangeLogoURLBrowser () {
      this.popupCKFinder('logoURL')
    },
    popupCKFinder (name) {
      const _this = this
      /* eslint-disable no-undef */
      CKFinder.popup({
        chooseFiles: true,
        width: 800,
        height: 600,
        onInit: function (finder) {
          finder.on('files:choose', function (evt) {
            const file = evt.data.files.first()
            _this.changeProfileForm[name] = file.getUrl()
          })
          finder.on('file:choose:resizedImage', function (evt) {
            _this.changeProfileForm[name] = evt.data.resizedUrl
          })
        }
      })
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
  width: 200px;
  margin-right: 12px;
}

</style>