<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>医院管理</el-breadcrumb-item>
      <el-breadcrumb-item>医院信息列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-form ref="searchCriteriaForm" class="searchCriteriaForm" :model="searchCriteriaForm" inline>
      <el-row>
        <el-form-item>
          <el-input placeholder="关键字(医院名称/用户名/真实名称/昵称/邮箱/手机号)" clearable v-model="searchCriteriaForm.keyword" class="filterText" />
        </el-form-item>
        <el-form-item>
          <xl-userStatusSelect v-model="searchCriteriaForm.status" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchCriteriaForm.creationDate" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="创建日期开始" end-placeholder="创建日期结束" />
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearchAll()">全部</el-button>
          </el-button-group>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="page.list" style="width: 100%" :empty-text="mainTableEmptyText" @sort-change="handleSortChange">
        <el-table-column prop="UserID" label="#" width="60" sortable="custom" />
        <el-table-column prop="Hospital.HospitalName" label="医院" />
        <el-table-column prop="Hospital.Address" label="地址" />
        <el-table-column prop="Username" label="用户名" width="100" />
        <el-table-column label="手机号码" width="120">
          <template slot-scope="scope">
            <i
                class="el-icon-question"
                v-show="scope.row.Mobile && !scope.row.MobileIsValid" />
              <span>{{ scope.row.Mobile }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="StatusText"
            label="状态"
            width="60" />
          <el-table-column
            prop="CreationDate"
            label="创建时间"
            width="160" />
          <el-table-column
            align="center"
            fixed="right"
            width="42">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-edit"
                @click="handleEdit(scope.row)" />
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
          <el-form-item 
            label="医院名称"
            prop="hospitalName">
            <el-input
              v-model.trim="mainForm.hospitalName"
              auto-complete="off"
              placeholder="请输入医院名称" />
          </el-form-item>
          <el-form-item 
            label="医院地址"
            prop="address">
            <el-input
              v-model.trim="mainForm.address"
              auto-complete="off"
              placeholder="请输入医院地址" />
          </el-form-item>
          <el-form-item
            label="用户名"
            prop="username">
            <el-input
              ref="username"
              v-model.trim="mainForm.username"
              auto-complete="off"
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
              :placeholder="editActive ? '如果不修改密码，请保持为空' : '请输入登录密码'" />
          </el-form-item>
          <el-form-item
            label="确认密码"
            prop="passwordConfirm"
            :required="!editActive">
            <el-input
              v-model="mainForm.passwordConfirm"
              type="password"
              :placeholder="editActive ? '如果不修改密码，请保持为空' : '请输入确认密码'" />
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
            prop="headURL">
            <el-input
              ref="headURL"
              v-model.trim="mainForm.headURL"
              auto-complete="off"
              placeholder="请输入头像 URL">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleChangeHeadURLBrowser" />
            </el-input>
          </el-form-item>
          <el-form-item
            label="Logo"
            prop="logoURL">
            <el-input
              ref="logoURL"
              v-model.trim="mainForm.logoURL"
              auto-complete="off"
              placeholder="请输入Logo URL">
              <el-button
                slot="append"
                icon="el-icon-search"
                @click="handleChangeLogoURLBrowser" />
            </el-input>
          </el-form-item>
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
        :current-page="pagingInfoForm.pageNumber"
        :page-sizes="[20, 50, 100, 200, 400]"
        :page-size="pagingInfoForm.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="page.totalItemCount"
        v-if="page.totalItemCount" />
    </el-footer>
  </el-container>
</template>

<script>
import api from '@/utils/api'
import _ from 'lodash'

export default {
  data() {
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
      page: {
        list: null,
        totalItemCount: null,
        totalPageCount: null
      },
      searchCriteriaForm: {
        keyword: null,
        creationDate: null,
        creationDateBegin: null,
        creationDateEnd: null,
        status: null
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

      // 添加/编辑
      editActive: null, // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false, // 添加/编辑对话框是否可见
      mainForm: {
        userID: null, // Int
        status: null, // Int
        username: null, // String
        displayName: null, // String
        realName: null, // String
        realNameIsValid: false, // bool
        email: null, // String
        emailIsValid: false, // bool
        mobile: null, // String
        mobileIsValid: false, // bool
        groupID: '11111111-1111-1111-1111-111111111111', // String 注意：硬编码
        password: null, // String
        passwordConfirm: null, // String
        description: null, // String
        headURL: null, // String
        logoURL: null, // String
        hospitalName: null, // String
        address: null // String
      },
      mainFormRules: {
        hospitalName: [{
            required: true,
            message: '请输入医院名称',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '最多支持100个字符',
            trigger: 'blur'
          }
        ],
        address: [{
            required: true,
            message: '请输入医院地址',
            trigger: 'blur'
          },
          {
            max: 100,
            message: '最多支持100个字符',
            trigger: 'blur'
          }
        ],
        username: [{
            required: true,
            message: '请输入用户名',
            trigger: 'blur'
          },
          {
            max: 20,
            message: '最多支持20个字符',
            trigger: 'blur'
          }
        ],
        displayName: [{
          max: 20,
          message: '最多支持20个字符',
          trigger: 'blur'
        }],
        realName: [{
          max: 100,
          message: '最多支持100个字符',
          trigger: 'blur'
        }],
        mobile: [{
          pattern: /^1\d{10}$/,
          message: '请输入正确的手机号码',
          trigger: 'blur'
        }],
        email: [{
          pattern: /^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/,
          message: '请输入正确的邮箱',
          trigger: 'blur'
        }],
        password: [{
          validator: validatePassord,
          trigger: 'blur'
        }],
        passwordConfirm: [{
          validator: validatePassordConfirm,
          trigger: 'blur'
        }]
      }
    }
  },
  mounted() {
    this.getPage()
  },
  computed: {
    mainTableEmptyText: function () {
      return this.isLoading ? '加载中...' : '暂无数据'
    }
  },
  watch: {

  },
  methods: {
    getPage() {
      this.isLoading = true
      const params = _.extend({}, this.pagingInfoForm, this.searchCriteriaForm)
      api.getHospitalUserInfoBasePage(params).then(response => {
        this.isLoading = false
        this.page = response.data.page
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handlePaginationSizeChange(val) {
      this.pagingInfoForm.pageSize = val
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handlePaginationCurrentChange(val) {
      this.pagingInfoForm.pageNumber = val
      this.getPage()
    },
    handleSearchAll() {
      this.pagingInfoForm.pageNumber = 1
      this.searchCriteriaForm.keyword = null
      this.searchCriteriaForm.creationDate = null
      this.searchCriteriaForm.creationDateBegin = null
      this.searchCriteriaForm.creationDateEnd = null
      this.searchCriteriaForm.status = null
      this.getPage()
    },
    handleSearch() {
      this.pagingInfoForm.pageNumber = 1
      if (this.searchCriteriaForm.creationDate && this.searchCriteriaForm.creationDate.length === 2) {
        this.searchCriteriaForm.creationDateBegin = this.searchCriteriaForm.creationDate[0]
        this.searchCriteriaForm.creationDateEnd = this.searchCriteriaForm.creationDate[1]
      }
      this.getPage()
    },
    handleAdd() {
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.userID = null
      this.mainForm.status = 'Normal' // 默认 正常
      this.mainForm.username = null
      this.mainForm.displayName = null
      this.mainForm.realName = null
      this.mainForm.realNameIsValid = false
      this.mainForm.email = null
      this.mainForm.emailIsValid = false
      this.mainForm.mobile = null
      this.mainForm.mobileIsValid = false
      this.mainForm.password = null
      this.mainForm.passwordConfirm = null
      this.mainForm.description = null
      this.mainForm.headURL = null
      this.mainForm.logoURL = null
      this.mainForm.hospitalName = null
      this.mainForm.address = null
      this.$nextTick(() => {
        this.clearValidate('mainForm')
      })
    },
    handleEdit(row) {
      console.log('handleEdit', row)
      if (!this.validateBaseData() || !row) {
        return
      }
      this.editActive = row
      this.mainFormDialogVisible = true
      this.mainForm.userID = row.UserID
      this.mainForm.status = row.Status // 默认 正常
      this.mainForm.username = row.Username
      this.mainForm.displayName = row.DisplayName
      this.mainForm.realName = row.RealName
      this.mainForm.realNameIsValid = row.RealNameIsValid
      this.mainForm.email = row.Email
      this.mainForm.emailIsValid = row.EmailIsValid
      this.mainForm.mobile = row.Mobile
      this.mainForm.mobileIsValid = row.MobileIsValid
      this.mainForm.password = null
      this.mainForm.passwordConfirm = null
      this.mainForm.description = row.Description
      this.mainForm.headURL = row.HeadURL
      this.mainForm.logoURL = row.LogoURL
      this.mainForm.hospitalName = row.Hospital.HospitalName
      this.mainForm.address = row.Hospital.Address
      this.$nextTick(() => {
        this.clearValidate('mainForm')
      })
    },
    handleMainFormSure(sure) {
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
      }
    },
    add() {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.mainForm
        api.addHospital(params).then(response => {
          this.isLoading = false
          this.mainFormDialogVisible = false
          this.getPage()
        }, error => {
          this.isLoading = false
          this.showErrorMessage(error.message)
        })
      })
    },
    edit() {
      if (!this.editActive) {
        this.showErrorMessage('异常：无编辑目标')
        return
      }
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.mainForm
        api.editHospital(params).then(response => {
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
    validateBaseData() {
      return true
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    clearValidate(formName) {
      this.$refs[formName].clearValidate()
    },
    showErrorMessage(message) {
      this.$message({
        message: message,
        type: 'error'
      })
    },
    handleSortChange(val) {
      this.pagingInfoForm.sortInfo.sort = val.prop
      this.pagingInfoForm.sortInfo.sortDir = val.order === 'descending' ? 'DESC' : 'ASC'
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handleChangeHeadURLBrowser() {
      this.popupCKFinder('headURL')
    },
    handleChangeLogoURLBrowser() {
      this.popupCKFinder('logoURL')
    },
    popupCKFinder(name) {
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

  // 用户状态
  .el-select {
    width: 120px;
    margin-right: 12px;
  }
}
</style>
