<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>医院管理</el-breadcrumb-item>
      <el-breadcrumb-item to="/" replace>医院信息列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.hospitalName }}</el-breadcrumb-item>
      <el-breadcrumb-item :to="{name: 'department', params: { hospitalID: $route.params.hospitalID }, query: { hospitalName: $route.query.hospitalName }}">科室信息列表</el-breadcrumb-item>
      <el-breadcrumb-item>{{ $route.query.departmentName }}</el-breadcrumb-item>
      <el-breadcrumb-item>病房信息列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-form ref="searchCriteriaForm" class="searchCriteriaForm" :model="searchCriteriaForm" inline>
      <el-row>
        <el-form-item>
          <el-input placeholder="关键字(病房名称)" clearable v-model="searchCriteriaForm.keyword" class="filterText" />
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="searchCriteriaForm.isDeleted">
            <el-radio-button>全部</el-radio-button>
            <el-radio-button :label="false">正常</el-radio-button>
            <el-radio-button :label="true">删除</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item>
          <el-button-group>
            <el-button type="primary" icon="el-icon-search" @click="handleSearch ()">搜索</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearchAll ()">全部</el-button>
          </el-button-group>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd()">添加</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="page.list" style="width: 100%" :empty-text="mainTableEmptyText" @sort-change="handleSortChange">
        <el-table-column prop="HospitalSickroomID" label="#" width="60" sortable="custom" />
        <el-table-column prop="Name" label="病房名称" sortable="custom" />
        <el-table-column label="删除" width="60">
          <template slot-scope="scope">
            {{ scope.row.IsDeleted ? '√' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="164">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" />
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)" />
            <el-button
                type="primary"
                size="small"
                icon="el-icon-tickets"
                @click="handlePushBunk(scope.row)">病床</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
          {{ editActive ? '编辑' : '添加' }}
        </span>
      <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="160px">
        <el-form-item label="病房名称" prop="name">
          <el-input ref="name" v-model.trim="mainForm.name" autocomplete="off" placeholder="请输入病房名称"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model.trim="mainForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMainFormSure (false)">取 消</el-button>
        <el-button type="primary" @click="handleMainFormSure (true)">确 定</el-button>
      </div>
    </el-dialog>

  </el-main>
  <el-footer class="footer">
    <el-pagination @size-change="handlePaginationSizeChange" @current-change="handlePaginationCurrentChange" :current-page="pagingInfoForm.pageNumber" :page-sizes="[20, 50, 100, 200, 400]" :page-size="pagingInfoForm.pageSize" layout="total, sizes, prev, pager, next, jumper" :total="page.totalItemCount" v-if="page.totalItemCount" />
  </el-footer>
</el-container>
</template>

<script>
import api from '@/utils/api'
import _ from 'lodash'

export default {
  props: ['hospitalID', 'hospitalDepartmentID'],
  data () {
    return {
      // 主要数据
      isLoading: false,
      page: {
        list: null,
        totalItemCount: null,
        totalPageCount: null
      },
      searchCriteriaForm: {
        hospitalID: this.hospitalID,
        hospitalDepartmentID: this.hospitalDepartmentID,
        keyword: null,
        isDeleted: false
      },
      pagingInfoForm: {
        pageNumber: 1,
        pageSize: 20,
        isExcludeMetaData: false,
        sortInfo: {
          sort: 'HospitalSickroomID',
          sortDir: 'ASC'
        }
      },
      // 删除
      deleteActive: null, // 暂存删除项

      // 添加/编辑
      editActive: null, // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false, // 添加/编辑对话框是否可见
      mainForm: {
        hospitalID: this.hospitalID,
        hospitalDepartmentID: this.hospitalDepartmentID,
        hospitalSickroomID: null, // Int
        name: null, // String
        remark: null // String
      },
      mainFormRules: {
        name: [
          { required: true, message: '请输入病房名称', trigger: 'blur' },
          { max: 100, message: '最多支持100个字符', trigger: 'blur' }
        ],
        remark: [
          { max: 1000, message: '最多支持1000个字符', trigger: 'blur' }
        ]
      }
    }
  },
  mounted () {
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
    getPage () {
      this.isLoading = true
      const params = _.extend({}, this.pagingInfoForm, this.searchCriteriaForm)
      api.getHospitalSickroomBasePage(params).then(response => {
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
    handleSearchAll () {
      this.pagingInfoForm.pageNumber = 1
      this.searchCriteriaForm.keyword = null
      this.searchCriteriaForm.isDeleted = false
      this.getPage()
    },
    handleSearch () {
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handleAdd () {
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.hospitalSickroomID = null
      this.mainForm.name = null
      this.mainForm.remark = null
      this.$nextTick(() => {
        this.clearValidate('mainForm')
      })
    },
    handleEdit (row) {
      console.log('handleEdit', row)
      if (!this.validateBaseData() || !row) {
        return
      }
      this.editActive = row
      this.mainFormDialogVisible = true
      this.mainForm.hospitalSickroomID = row.HospitalSickroomID
      this.mainForm.name = row.Name
      this.mainForm.remark = row.Remark
      this.$nextTick(() => {
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
      }
    },
    handleDelete (row) {
      this.deleteActive = row
      this.$confirm(row.IsDeleted ? '确定要恢复该病房吗？' : '逻辑删除，相关数据依然会得以保留。是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete()
      }).catch(() => {
        this.deleteActive = null
      })
    },
    add () {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.mainForm
        console.log(this.mainForm)
        api.addHospitalSickroom(params).then(response => {
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
        const params = this.mainForm
        api.editHospitalSickroom(params).then(response => {
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
    delete () {
      if (!this.deleteActive) return
      const params = {
        hospitalSickroomID: this.deleteActive.HospitalSickroomID,
        isDeleted: !this.deleteActive.IsDeleted
      }
      this.isLoading = true
      api.setHospitalSickroomIsDeleted(params).then(response => {
        this.isLoading = false
        this.deleteActive = null
        this.getPage()
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    validateBaseData () {
      return true
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
      this.pagingInfoForm.sortInfo.sort = val.prop
      this.pagingInfoForm.sortInfo.sortDir = val.order === 'descending' ? 'DESC' : 'ASC'
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handlePushBunk (row) {
      this.$router.push({
        name: 'bunk',
        params: { hospitalID: this.hospitalID, hospitalDepartmentID: this.hospitalDepartmentID, hospitalSickroomID: row.HospitalSickroomID },
        query: { hospitalName: this.$route.query.hospitalName, departmentName: this.$route.query.departmentName, sickroomName: row.Name }
      })
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
}
</style>
