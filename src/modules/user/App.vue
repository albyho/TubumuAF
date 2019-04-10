<template>
  <el-container v-loading.fullscreen.lock="isLoading">
    <el-header class="header">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="breadcrumb">
        <el-breadcrumb-item>用户管理</el-breadcrumb-item>
        <el-breadcrumb-item>用户列表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main class="main">
      <el-form
        ref="searchCriteriaForm"
        class="searchCriteriaForm"
        :model="searchCriteriaForm"
        inline>
        <el-row>
          <el-form-item>
            <el-input
              placeholder="关键字(用户名/真实名称/昵称/邮箱/手机号)"
              clearable
              v-model="searchCriteriaForm.keyword"
              class="filterText" />
          </el-form-item>
          <el-form-item>
            <el-cascader
              :options="editGroupTreeData"
              :props="editGroupTreeDefaultProps"
              clearable
              change-on-select
              filterable
              placeholder="分组"
              v-model="searchCriteriaForm.groupIdPath" />
          </el-form-item>
          <el-form-item>
            <xl-userStatusSelect v-model="searchCriteriaForm.status" />
          </el-form-item>
          <el-form-item>
            <el-button
              plain
              @click="isSearchCriteriaFormExpand =! isSearchCriteriaFormExpand"
              :icon="isSearchCriteriaFormExpand ? 'el-icon-caret-top' : 'el-icon-caret-bottom'" />
            <el-button-group>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearch()">搜索</el-button>
              <el-button
                type="primary"
                icon="el-icon-search"
                @click="handleSearchAll()">全部</el-button>
            </el-button-group>
            <el-button
              type="primary"
              icon="el-icon-circle-plus-outline"
              @click="handleAdd()">添加</el-button>
          </el-form-item>
        </el-row>
        <el-row v-show="isSearchCriteriaFormExpand">
          <el-form-item>
            <xl-datePicker v-model="searchCriteriaForm.creationTime" />
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-table
          :data="page.list"
          style="width: 100%"
          :empty-text="mainTableEmptyText"
          @sort-change="handleSortChange">
          <el-table-column
            prop="userId"
            label="#"
            width="60"
            sortable="custom" />
          <el-table-column
            prop="username"
            label="用户名"
            width="160"
            sortable="custom" />
          <el-table-column
            prop="group.name"
            label="分组"
            width="160" />
          <el-table-column
            label="角色"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.role ? scope.row.role.name : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="displayName"
            label="昵称"
            width="100" />
          <el-table-column
            label="真实名称"
            width="100">
            <template slot-scope="scope">
              <i
                class="el-icon-question"
                v-show="scope.row.realName && !scope.row.realNameIsValid" />
              <span>{{ scope.row.realName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="手机号码"
            width="120">
            <template slot-scope="scope">
              <i
                class="el-icon-question"
                v-show="scope.row.mobile && !scope.row.mobileIsValid" />
              <span>{{ scope.row.mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column 
            label="Email"
            width="140">
            <template slot-scope="scope">
              <i
                class="el-icon-question"
                v-show="scope.row.email && !scope.row.emailIsValid" />
              <span>{{ scope.row.email }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="statusText"
            label="状态"
            width="60" />
          <el-table-column
            prop="creationTime"
            label="创建时间"
            width="160" />
          <el-table-column label="开发" width="60">
            <template slot-scope="scope">
              {{ scope.row.isDeveloper ? '√' : '×' }}
            </template>
          </el-table-column>
          <el-table-column label="测试" width="60">
            <template slot-scope="scope">
              {{ scope.row.isTester ? '√' : '×' }}
            </template>
          </el-table-column>
          <el-table-column
            align="center"
            fixed="right"
            width="84">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)" />
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="handleRemove(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-dialog
        :visible.sync="mainFormDialogVisible"
        @submit.native.prevent
        :close-on-click-modal="false"
        width="600px">
        <span slot="title">
          {{ editActive ? '编辑' : '添加' }}
        </span>
        <el-form
          ref="mainForm"
          :model="mainForm"
          :rules="mainFormRules"
          label-position="right"
          label-width="160px">
          <el-tabs
            v-model="activeTabName"
            type="card">
            <el-tab-pane
              label="基本信息"
              name="first">
              <el-form-item
                label="主要分组"
                prop="groupIdPath">
                <el-cascader
                  :options="editGroupTreeData"
                  :props="editGroupTreeDefaultProps"
                  clearable
                  change-on-select
                  filterable
                  placeholder="请选择主要分组"
                  @change="handleGroupCascaderChange"
                  v-model="mainForm.groupIdPath" />
              </el-form-item>
              <el-form-item
                label="主要角色"
                prop="roleId">
                <el-select
                  v-model="mainForm.roleId"
                  clearable
                  placeholder="请选择主要角色">
                  <el-option
                    v-for="role in editGroupRoleListData"
                    :key="role.roleId"
                    :label="role.name"
                    :value="role.roleId" />
                </el-select>
              </el-form-item>
              <el-form-item
                label="用户名"
                prop="username">
                <el-input
                  ref="username"
                  v-model.trim="mainForm.username"
                  autocomplete="off"
                  placeholder="请输入用户名" />
              </el-form-item>
              <el-form-item
                label="状态"
                :required="true">
                <xl-userStatusRadioGroup v-model="mainForm.status" />
              </el-form-item>
              <el-form-item
                label="登录密码"
                prop="password"
                :required="!editActive">
                <el-input
                  v-model="mainForm.password"
                  type="password"
                  :placeholder="editActive ? '如果不修改密码，请保持为空' : '请输入登录密码'" show-password/>
              </el-form-item>
              <el-form-item
                label="确认密码"
                prop="passwordConfirm"
                :required="!editActive">
                <el-input
                  v-model="mainForm.passwordConfirm"
                  type="password"
                  :placeholder="editActive ? '如果不修改密码，请保持为空' : '请输入确认密码'" show-password/>
              </el-form-item>
              <el-form-item label="昵称">
                <el-input
                  v-model="mainForm.displayName"
                  type="text" />
              </el-form-item>
              <el-form-item label="真实名称">
                <el-input
                  v-model="mainForm.realName"
                  type="text" />
              </el-form-item>
              <el-form-item label="真实名称是否验证">
                <el-switch v-model="mainForm.realNameIsValid" />
              </el-form-item>
              <el-form-item
                label="邮箱"
                prop="email">
                <el-input
                  v-model="mainForm.email"
                  type="text" />
              </el-form-item>
              <el-form-item label="邮箱是否验证">
                <el-switch v-model="mainForm.emailIsValid" />
              </el-form-item>
              <el-form-item
                label="手机号码"
                prop="mobile">
                <el-input
                  v-model="mainForm.mobile"
                  type="text" />
              </el-form-item>
              <el-form-item label="手机号码是否验证">
                <el-switch v-model="mainForm.mobileIsValid" />
              </el-form-item>
              <el-form-item label="描述">
                <el-input
                  type="textarea"
                  :rows="2"
                  v-model.trim="mainForm.description" />
              </el-form-item>
              <el-form-item
                label="头像"
                prop="headUrl">
                <el-input
                  ref="headUrl"
                  v-model.trim="mainForm.headUrl"
                  autocomplete="off"
                  placeholder="请输入头像 Url">
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleChangeHeadUrlBrowser" />
                </el-input>
              </el-form-item>
              <el-form-item
                label="Logo"
                prop="logoUrl">
                <el-input
                  ref="logoUrl"
                  v-model.trim="mainForm.logoUrl"
                  autocomplete="off"
                  placeholder="请输入Logo Url">
                  <el-button
                    slot="append"
                    icon="el-icon-search"
                    @click="handleChangeLogoUrlBrowser" />
                </el-input>
              </el-form-item>
              <el-form-item label="是否是开发人员">
                <el-switch v-model="mainForm.isDeveloper" />
              </el-form-item>
              <el-form-item label="是否是测试人员">
                <el-switch v-model="mainForm.isTester" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane
              label="附加分组"
              name="second">
              <el-form-item label="附加分组">
                <el-tree
                  :data="editGroupTreeData"
                  :props="editGroupTreeDefaultProps"
                  node-key="id"
                  ref="editGroupTree"
                  empty-text=""
                  show-checkbox
                  default-expand-all
                  check-strictly
                  @check-change="handleGroupTreeCheckChange" />
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane
              label="附加角色"
              name="third">
              <el-form-item label="附加角色">
                <el-checkbox-group v-model="mainForm.roleIds">
                  <el-checkbox
                    v-for="role in editRoleListData"
                    :label="role.roleId"
                    :key="role.roleId">{{ role.name }}</el-checkbox>
                </el-checkbox-group>
              </el-form-item>
            </el-tab-pane>
            <el-tab-pane
              label="附加权限"
              name="fourth">
              <el-form-item label="附加权限">
                <el-tree
                  :data="editPermissionTreeData"
                  :props="editPermissionTreeDefaultProps"
                  node-key="id"
                  ref="editPermissionTree"
                  empty-text=""
                  show-checkbox
                  default-expand-all
                  check-strictly
                  @check-change="handlePermissionTreeCheckChange" />
              </el-form-item>
            </el-tab-pane>
          </el-tabs>
        </el-form>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="handleMainFormSure(false)">取 消</el-button>
          <el-button
            type="primary"
            @click="handleMainFormSure(true)">确 定</el-button>
        </div>
      </el-dialog>
    </el-main>
    <el-footer class="footer">
      <el-pagination
        @size-change="handlePaginationSizeChange"
        @current-change="handlePaginationCurrentChange"
        :current-page="searchCriteriaForm.pagingInfo.pageNumber"
        :page-sizes="[20, 50, 100, 200, 400]"
        :page-size="searchCriteriaForm.pagingInfo.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalItemCount"
        v-if="page.totalItemCount" />
    </el-footer>
  </el-container>
</template>

<script>
import api from '@/utils/api'
import _ from 'lodash'
import md5 from 'js-md5'

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
      } else if (value.length > 32) {
        callback(new Error('密码请保持在32位以内'))
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
      isSearchCriteriaFormExpand: false,
      searchCriteriaForm: {
        keyword: null,
        groupIds: null,         // 服务器期待一个数组
        creationTime: null,
        creationTimeBegin: null,
        creationTimeEnd: null,
        status: null,
        groupIdPath: [],
        pagingInfo: {
          pageNumber: 1,
          pageSize: 20,
          isExcludeMetaData: false,
          sortInfo: {
            sort: 'userId',
            sortDir: 'ASC'
          }
        }
      },
      // 删除
      removeActive: null,                 // 暂存删除项

      // 添加/编辑
      editActive: null,                   // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false,       // 添加/编辑对话框是否可见
      mainForm: {
        userId: null,                     // Int
        status: null,                     // Int
        username: null,                   // String
        displayName: null,                // String
        realName: null,                   // String
        realNameIsValid: false,           // bool
        email: null,                      // String
        emailIsValid: false,              // bool
        mobile: null,                     // String
        mobileIsValid: false,             // bool
        groupIdPath: [],                  // Array 不能设置为 null。给 cascader 组件使用。
        groupId: null,                    // String
        groupIds: [],                     // Array 不能设置为 null
        roleId: null,                     // String
        roleIds: [],                      // Array 不能设置为 null
        permissionIds: null,              // Array
        password: null,                   // String
        passwordConfirm: null,            // String
        description: null,                // String
        headUrl: null,                    // String
        logoUrl: null,                    // String
        isDeveloper: false,               // bool
        isTester: false                   // bool
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
        groupIdPath: [
          { required: true, type: 'array', message: '请选择主要分组', trigger: 'change' }
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
      editGroupRoleListData: null,          // 用于编辑对话框内显示的角色列表
      editRoleListData: null,               // 用于编辑对话框内显示的角色列表
      editGroupTreeData: [],                // 用于搜索 cascader / 编辑对话框内显示的分组树
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
    this.getRoleBaseList()
    this.getPermissionTree()
  },
  computed: {
    mainTableEmptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  watch: {

  },
  methods: {
    getPage () {
      this.isLoading = true
      const params = this.searchCriteriaForm
      api.getUserPage(params).then(response => {
        this.isLoading = false
        this.page = response.data.data
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handlePaginationSizeChange (val) {
      this.searchCriteriaForm.pagingInfo.pageSize = val
      this.searchCriteriaForm.pagingInfo.pageNumber = 1
      this.getPage()
    },
    handlePaginationCurrentChange (val) {
      this.searchCriteriaForm.pagingInfo.pageNumber = val
      this.getPage()
    },
    getGroupTree () {
      api.getGroupTree().then(response => {
        this.editGroupTreeData = response.data.data
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    getRoleBaseList () {
      api.getRoleBaseList().then(response => {
        this.editRoleListData = response.data.data
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    getPermissionTree () {
      api.getPermissionTree().then(response => {
        this.editPermissionTreeData = response.data.data
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    handleSearchAll () {
      this.searchCriteriaForm.pagingInfo.pageNumber = 1
      this.searchCriteriaForm.keyword = null
      this.searchCriteriaForm.groupIds = null
      this.searchCriteriaForm.creationTime = null
      this.searchCriteriaForm.creationTimeBegin = null
      this.searchCriteriaForm.creationTimeEnd = null
      this.searchCriteriaForm.status = null
      this.searchCriteriaForm.groupIdPath = []
      this.getPage()
    },
    handleSearch () {
      this.searchCriteriaForm.pagingInfo.pageNumber = 1
      if (this.searchCriteriaForm.creationTime && this.searchCriteriaForm.creationTime.length === 2) {
        this.searchCriteriaForm.creationTimeBegin = this.searchCriteriaForm.creationTime[0]
        this.searchCriteriaForm.creationTimeEnd = this.searchCriteriaForm.creationTime[1]
      }
      this.searchCriteriaForm.groupIds = this.searchCriteriaForm.groupIdPath && this.searchCriteriaForm.groupIdPath.length
          ? [this.searchCriteriaForm.groupIdPath[this.searchCriteriaForm.groupIdPath.length - 1]]
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
      this.mainForm.userId = null
      this.mainForm.status = 'Normal'            // 默认 正常
      this.mainForm.username = null
      this.mainForm.displayName = null
      this.mainForm.realName = null
      this.mainForm.realNameIsValid = false
      this.mainForm.email = null
      this.mainForm.emailIsValid = false
      this.mainForm.mobile = null
      this.mainForm.mobileIsValid = false
      this.mainForm.groupIdPath = []
      this.mainForm.groupId = null
      this.mainForm.groupIds = []               // 不能设置为 null
      this.mainForm.roleId = null
      this.editGroupRoleListData = []
      this.mainForm.roleIds = []                // 不能设置为 null
      this.mainForm.permissionIds = null
      this.mainForm.password = null
      this.mainForm.passwordConfirm = null
      this.mainForm.description = null
      this.mainForm.headUrl = null
      this.mainForm.logoUrl = null
      this.mainForm.isDeveloper = false
      this.mainForm.isTester = false

      this.$nextTick(() => {
        this.$refs.editGroupTree.setCheckedKeys([], true)
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
      this.mainForm.userId = row.userId
      this.mainForm.status = row.status            // 默认 正常
      this.mainForm.username = row.username
      this.mainForm.displayName = row.displayName
      this.mainForm.realName = row.realName
      this.mainForm.realNameIsValid = row.realNameIsValid
      this.mainForm.email = row.email
      this.mainForm.emailIsValid = row.emailIsValid
      this.mainForm.mobile = row.mobile
      this.mainForm.mobileIsValid = row.mobileIsValid
      this.getGroupIdPath(this.editGroupTreeData, row.group.groupId)
      this.mainForm.groupId = row.group.groupId
      this.mainForm.groupIds = row.groups.map(m => m.groupId)
      this.mainForm.roleId = row.role ? row.role.roleId : null
      this.getGroupAvailableRoles(this.editGroupTreeData, row.group.groupId)
      this.mainForm.roleIds = row.roles.map(m => m.roleId)
      this.mainForm.permissionIds = row.permissions.map(m => m.permissionId)
      this.mainForm.password = null
      this.mainForm.passwordConfirm = null
      this.mainForm.description = row.description
      this.mainForm.headUrl = row.headUrl
      this.mainForm.logoUrl = row.logoUrl
      this.mainForm.isDeveloper = row.isDeveloper
      this.mainForm.isTester = row.isTester

      this.$nextTick(() => {
        this.$refs.editGroupTree.setCheckedKeys(this.mainForm.groupIds, true)
        this.$refs.editPermissionTree.setCheckedKeys(this.mainForm.permissionIds, true)
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
      this.$confirm('删除该用户后，相关的数据也将被删除。是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.remove()
      }).catch(() => {
        this.removeActive = null
      })
    },
    handleGroupCascaderChange (value) {
      console.log(value)
      this.mainForm.roleId = null
      this.editGroupRoleListData = []
      if (value.length === 0) return
      this.getGroupAvailableRoles(this.editGroupTreeData, value[value.length - 1])
    },
    add () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        this.mainForm.groupId = this.mainForm.groupIdPath[this.mainForm.groupIdPath.length - 1]
        const params = _.cloneDeep(this.mainForm)
        if (this.params.password) {
          params.password = md5(params.password)
        }
        if (params.passwordConfirm) {
          params.passwordConfirm = md5(params.passwordConfirm)
        }
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
        this.mainForm.groupId = this.mainForm.groupIdPath[this.mainForm.groupIdPath.length - 1]
        const params = _.cloneDeep(this.mainForm)
        if (params.password) {
          params.password = md5(params.password)
        }
        if (params.passwordConfirm) {
          params.passwordConfirm = md5(params.passwordConfirm)
        }
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
        userId: this.removeActive.userId
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
        this.showErrorMessage('基础数据缺失：分组列表')
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
    handleGroupTreeCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.mainForm.groupIds = this.$refs.editGroupTree.getCheckedKeys()
      // console.log(this.mainForm.groupIds)
    },
    handlePermissionTreeCheckChange (data, checked, indeterminate) {
      // console.log(data, checked, indeterminate)
      this.mainForm.permissionIds = this.$refs.editPermissionTree.getCheckedKeys()
      // console.log(this.mainForm.permissionIds)
    },
    getGroupIdPath (tree, id) {
      if (!tree) return
      for (let node of tree) {
        if (node.id === id) {
          this.mainForm.groupIdPath = node.parentIdPath ? node.parentIdPath.concat() : []
          this.mainForm.groupIdPath.push(id)
          break
        } else {
          this.getGroupIdPath(node.children, id)
        }
      }
    },
    getGroupAvailableRoles (tree, id) {
      this.editGroupRoleListData = []
      if (!tree) return
      for (let node of tree) {
        if (node.id === id) {
          this.editGroupRoleListData = node.availableRoles
          break
        } else {
          this.getGroupAvailableRoles(node.children, id)
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
    handleSortChange (val) {
      this.searchCriteriaForm.pagingInfo.sortInfo.sort = val.prop
      this.searchCriteriaForm.pagingInfo.sortInfo.sortDir = val.order === 'descending' ? 'DESC' : 'ASC'
      this.searchCriteriaForm.pagingInfo.pageNumber = 1
      this.getPage()
    },
    handleChangeHeadUrlBrowser () {
      this.popupFileManager('headUrl')
    },
    handleChangeLogoUrlBrowser () {
      this.popupFileManager('logoUrl')
    },
    popupFileManager (name) {
      const _this = this
      try {
        /* eslint-disable no-undef */
        CKFinder.popup({
          chooseFiles: true,
          width: 800,
          height: 600,
          onInit: function (finder) {
            finder.on('files:choose', function (evt) {
              const file = evt.data.files.first()
              _this.mainForm[name] = file.getUrl()
            })
            finder.on('file:choose:resizedImage', function (evt) {
              _this.mainForm[name] = evt.data.resizedUrl
            })
          }
        })
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>

<style lang="scss">

.searchCriteriaForm {
  .el-row {
    margin-bottom: 8px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-form-item {
    margin-bottom: 4px;
    margin-right: 4px;
  }
  .filterText {
    width: 240px;
    margin-right: 12px;
  }
  // 分组
  .el-cascader {
    width: 200px;
    margin-right: 12px;
  }
  // 用户状态
  .el-select {
    width: 120px;
    margin-right: 12px;
  }
}

// 编辑对话框：附加角色
.el-checkbox {
  display: block;
  margin: 0;
}

</style>