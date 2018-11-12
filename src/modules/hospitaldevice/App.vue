<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>床柜管理</el-breadcrumb-item>
      <el-breadcrumb-item>床柜信息列表</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-form ref="searchCriteriaForm" class="searchCriteriaForm" :model="searchCriteriaForm" inline>
      <el-row>
        <el-form-item>
          <el-input placeholder="关键字(序列号)" clearable v-model="searchCriteriaForm.keyword" class="filterText" />
        </el-form-item>
        <el-form-item>
          <el-radio-group v-model="searchCriteriaForm.isEnabled">
            <el-radio-button>全部</el-radio-button>
            <el-radio-button :label="true">启用</el-radio-button>
            <el-radio-button :label="false">禁用</el-radio-button>
          </el-radio-group>
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
            <el-button type="primary" icon="el-icon-search" @click="handleSearch()">搜索</el-button>
            <el-button type="primary" icon="el-icon-search" @click="handleSearchAll()">全部</el-button>
          </el-button-group>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleAdd()">添加</el-button>
          <el-button type="primary" icon="el-icon-circle-plus-outline" @click="handleImport()">导入</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-row>
      <el-table :data="page.list" style="width: 100%" :empty-text="mainTableEmptyText" @sort-change="handleSortChange">
        <el-table-column prop="HospitalDeviceID" label="#" width="60" sortable="custom" />
        <el-table-column prop="Serial" label="序列号" sortable="custom" />
        <el-table-column label="启用" width="60">
          <template slot-scope="scope">
            {{ scope.row.IsEnabled ? '' : '×' }}
          </template>
        </el-table-column>
        <el-table-column label="删除" width="60">
          <template slot-scope="scope">
            {{ scope.row.IsDeleted ? '√' : '' }}
          </template>
        </el-table-column>
        <el-table-column align="center" fixed="right" width="84">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click="handleEdit(scope.row)" />
            <el-button type="text" size="small" icon="el-icon-delete" @click="handleDelete(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
          {{ editActive ? '编辑' : '添加' }}
        </span>
      <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="160px">
        <el-form-item label="序列号" prop="serial">
          <el-input ref="serial" v-model.trim="mainForm.serial" auto-complete="off" placeholder="请输入序列号" :disabled="!!editActive" />
        </el-form-item>
        <el-form-item label="启用" :required="true">
          <el-radio-group v-model="mainForm.isEnabled">
            <el-radio :label="true">启用</el-radio>
            <el-radio :label="false">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" :rows="4" v-model.trim="mainForm.remark" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMainFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleMainFormSure(true)">确 定</el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="importFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="600px">
      <span slot="title">
          导入
        </span>
      <el-form ref="importForm" :model="importForm" :rules="importFormRules" label-position="right" label-width="160px">
        <el-form-item label="序列号段" prop="serials">
          <el-input ref="serials" v-model.trim="importForm.serials" auto-complete="off" placeholder="请输入序列号段" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleImportFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleImportFormSure(true)">确 定</el-button>
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
  data() {
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
        isEnabled: true,
        isDeleted: false
      },
      pagingInfoForm: {
        pageNumber: 1,
        pageSize: 20,
        isExcludeMetaData: false,
        sortInfo: {
          sort: 'HospitalDeviceID',
          sortDir: 'ASC'
        }
      },
      // 删除
      deleteActive: null, // 暂存删除项

      // 添加/编辑
      editActive: null, // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false, // 添加/编辑对话框是否可见
      mainForm: {
        hospitalDeviceID: null, // Int
        serial: null, // String
        isEnabled: false, // bool
        remark: null // String
      },
      mainFormRules: {
        email: [{
          pattern: /^\d{8}$/,
          message: '请输入正确的序列号',
          trigger: 'blur'
        }],
        remark: [{
          max: 1000,
          message: '最多支持1000个字符',
          trigger: 'blur'
        }]
      },
      // 导入
      importFormDialogVisible: false, // 添加/编辑对话框是否可见
      importForm: {
        serials: null // String
      },
      importFormRules: {
        serials: [{
            required: true,
            message: '请输入序列号段',
            trigger: 'blur'
          },
          {
            pattern: /^(\d{8}((,\d{8})*|(-\d{8})*|(,\d{8}-\d{8})*)*)$/,
            message: '请输入正确的格式("数字"、"数字-数字"的以逗号分隔的任意组合',
            trigger: 'blur'
          }
        ]
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
      api.getHospitalDeviceBasePage(params).then(response => {
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
      this.searchCriteriaForm.isEnabled = true
      this.searchCriteriaForm.isDeleted = false
      this.getPage()
    },
    handleSearch() {
      this.pagingInfoForm.pageNumber = 1
      this.getPage()
    },
    handleAdd() {
      if (!this.validateBaseData()) {
        return
      }
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.hospitalDeviceID = null
      this.mainForm.serial = null
      this.mainForm.isEnabled = true // 默认 正常
      this.mainForm.remark = null
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
      this.mainForm.hospitalDeviceID = row.HospitalDeviceID
      this.mainForm.serial = row.Serial
      this.mainForm.isEnabled = row.IsEnabled
      this.mainForm.remark = row.Remark
      this.$nextTick(() => {
        this.clearValidate('mainForm')
      })
    },
    handleImport() {
      if (!this.validateBaseData()) {
        return
      }
      this.importFormDialogVisible = true
      this.importForm.serials = null
      this.$nextTick(() => {
        this.clearValidate('importForm')
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
    handleImportFormSure(sure) {
      console.log('handleImportFormSure', sure)
      if (sure) {
        this.import()
      } else {
        this.importFormDialogVisible = false
      }
    },
    handleDelete(row) {
      this.deleteActive = row
      this.$confirm(row.IsDeleted ? '确定要恢复该货柜吗？' : '逻辑删除，相关数据依然会得以保留。是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.delete()
      }).catch(() => {
        this.deleteActive = null
      })
    },
    add() {
      this.$refs.mainForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.mainForm
        api.addHospitalDevice(params).then(response => {
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
        api.editHospitalDevice(params).then(response => {
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
    delete() {
      if (!this.deleteActive) return
      const params = {
        hospitalDeviceID: this.deleteActive.HospitalDeviceID,
        isDeleted: !this.deleteActive.IsDeleted
      }
      this.isLoading = true
      api.setIsDeleted(params).then(response => {
        this.isLoading = false
        this.deleteActive = null
        this.getPage()
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    import() {
      this.$refs.importForm.validate(valid => {
        if (!valid) return false // 客户端校验未通过
        this.isLoading = true
        const params = this.importForm
        api.importHospitalDevice(params).then(response => {
          this.isLoading = false
          this.editActive = null
          this.importFormDialogVisible = false
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
