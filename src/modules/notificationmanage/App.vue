<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header class="header">
    <el-breadcrumb separator-class="el-icon-arrow-right" class="breadcrumb">
      <el-breadcrumb-item>系统管理</el-breadcrumb-item>
      <el-breadcrumb-item>通知管理</el-breadcrumb-item>
    </el-breadcrumb>
  </el-header>
  <el-main class="main">
    <el-form ref="searchCriteriaForm" class="searchCriteriaForm" :model="searchCriteriaForm" inline>
      <el-row>
        <el-form-item>
          <el-input placeholder="关键字(标题)" clearable v-model="searchCriteriaForm.keyword" class="filterText" />
        </el-form-item>
        <el-form-item>
          <el-date-picker v-model="searchCriteriaForm.creationTime" value-format="yyyy-MM-dd" type="daterange" range-separator="至" start-placeholder="创建日期开始" end-placeholder="创建日期结束" />
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
      <el-table :data="page.list" style="width: 100%" ref="mainTable" :empty-text="mainTableEmptyText" @row-click="handleRowClick" @sort-change="handleSortChange">
        <el-table-column type="expand" label="查看">
          <template slot-scope="scope">
            <div v-html="scope.row.message"></div>
          </template>
        </el-table-column>
        <el-table-column prop="notificationId" label="#" width="60" sortable="custom" />
        <el-table-column prop="title" label="标题" />
        <el-table-column label="已读" width="100" v-if="searchCriteriaForm.toUserId">
          <template slot-scope="scope">
            <span>{{ scope.row.readTime ? '√' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="来自" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.fromUser ? scope.row.fromUser.displayName : '系统' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="送至" width="100">
          <template slot-scope="scope">
            <span>{{ scope.row.toUser ? scope.row.toUser.displayName : '全部' }}</span>
          </template>
        </el-table-column>
        <el-table-column label="已删" width="100" v-if="searchCriteriaForm.toUserId">
          <template slot-scope="scope">
            <span>{{ scope.row.deleteTime ? '√' : '' }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="creationTime" label="创建时间" width="160" />
        <el-table-column align="center" fixed="right" width="84">
          <template slot-scope="scope">
            <el-button type="text" size="small" icon="el-icon-edit" @click.stop="handleEdit(scope.row)" />
            <el-button type="text" size="small" icon="el-icon-delete" @click.stop="handleRemove(scope.row)" />
          </template>
        </el-table-column>
      </el-table>
    </el-row>

    <el-dialog :visible.sync="mainFormDialogVisible" @submit.native.prevent :close-on-click-modal="false" width="780px">
      <span slot="title">
          {{ editActive ? '编辑' : '添加' }}
        </span>
      <el-form ref="mainForm" :model="mainForm" :rules="mainFormRules" label-position="right" label-width="120px">
        <el-form-item label="标题" prop="title" placeholder="请输入标题">
          <el-input v-model="mainForm.title" type="text" />
        </el-form-item>
        <el-form-item label="消息" prop="message" placeholder="请输入简称">
          <quill-editor v-model="mainForm.message" ref="messageEditor" :options="editorOption" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="handleMainFormSure(false)">取 消</el-button>
        <el-button type="primary" @click="handleMainFormSure(true)">确 定</el-button>
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

export default {
  data () {
    return {
      // 主要数据
      isLoading: false,
      editorOption: {
        placeholder: '请输入消息'
      },
      page: {
        list: null,
        totalItemCount: null,
        totalPageCount: null
      },
      searchCriteriaForm: {
        keyword: null,
        toUserId: null,
        creationTime: null,
        creationTimeBegin: null,
        creationTimeEnd: null,
        pagingInfo: {
          pageNumber: 1,
          pageSize: 20,
          isExcludeMetaData: false,
          sortInfo: {
            sort: 'NotificationId',
            sortDir: 'DESC'
          }
        }
      },
      // 删除
      removeActive: null, // 暂存删除项

      // 添加/编辑
      editActive: null, // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false, // 添加/编辑对话框是否可见
      mainForm: {
        notificationId: null, // Int
        title: null, // String
        message: null // String
      },
      mainFormRules: {
        title: [{
          required: true,
          message: '请输入标题',
          trigger: 'blur'
        },
        {
          max: 100,
          message: '最多支持100个字符',
          trigger: 'blur'
        }
        ],
        message: [{
          required: true,
          message: '请输入消息',
          trigger: 'blur'
        },
        {
          max: 1000,
          message: '最多支持1000个字符',
          trigger: 'blur'
        }
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
      const params = this.searchCriteriaForm
      api.getNotificationsForManager(params).then(response => {
        this.isLoading = false
        this.page = response.data.data
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    handlePaginationSizeChange (val) {
      this.searchCriteriaForm.pageInfo.pageSize = val
      this.searchCriteriaForm.pageInfo.pageNumber = 1
      this.getPage()
    },
    handlePaginationCurrentChange (val) {
      this.searchCriteriaForm.pageInfo.pageNumber = val
      this.getPage()
    },
    handleSearchAll () {
      this.searchCriteriaForm.pageInfo.pageNumber = 1
      this.searchCriteriaForm.keyword = null
      this.getPage()
    },
    handleSearch () {
      this.searchCriteriaForm.pageInfo.pageNumber = 1
      if (this.searchCriteriaForm.creationTime && this.searchCriteriaForm.creationTime.length === 2) {
        this.searchCriteriaForm.creationTimeBegin = this.searchCriteriaForm.creationTime[0]
        this.searchCriteriaForm.creationTimeEnd = this.searchCriteriaForm.creationTime[1]
      }
      this.getPage()
    },
    handleAdd () {
      this.editActive = null
      this.mainFormDialogVisible = true
      this.mainForm.notificationId = null
      this.mainForm.title = null
      this.mainForm.message = null
      this.$nextTick(() => {
        this.clearValidate('mainForm')
      })
    },
    handleEdit (row) {
      console.log('handleEdit', row)
      this.editActive = row
      this.mainFormDialogVisible = true
      this.mainForm.notificationId = row.notificationId
      this.mainForm.title = row.title
      this.mainForm.message = row.message
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
    handleRemove (row) {
      this.removeActive = row
      this.$confirm('删除该通知后，相关的数据也将被删除。是否继续?', '提示', {
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
        const params = this.mainForm
        api.addNotification(params).then(response => {
          this.isLoading = false
          this.mainFormDialogVisible = false
          this.getPage()
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
        const params = this.mainForm
        api.editNotification(params).then(response => {
          this.isLoading = false
          this.editActive = null
          this.mainFormDialogVisible = false
          this.getPage()
        }, error => {
          this.isLoading = false
          this.$message.error(error.message)
        })
      })
    },
    remove () {
      if (!this.removeActive) return
      const params = {
        notificationId: this.removeActive.notificationId
      }
      this.isLoading = true
      api.removeNotification(params).then(response => {
        this.isLoading = false
        this.removeActive = null
        this.getPage()
      }, error => {
        this.isLoading = false
        this.$message.error(error.message)
      })
    },
    resetForm (formName) {
      this.$refs[formName].resetFields()
    },
    clearValidate (formName) {
      this.$refs[formName].clearValidate()
    },
    handleRowClick (row, event, column) {
      if (column.id === 'el-table_1_column_1') return
      this.$refs.mainTable.toggleRowExpansion(row)
    },
    handleSortChange (val) {
      this.searchCriteriaForm.pageInfo.sortInfo.sort = val.prop
      this.searchCriteriaForm.pageInfo.sortInfo.sortDir = val.order === 'descending' ? 'DESC' : 'ASC'
      this.searchCriteriaForm.pageInfo.pageNumber = 1
      this.getPage()
    }
  }
}
</script>

<style lang="scss">
// 编辑对话框：附加角色
.el-checkbox {
  display: block;
  margin: 0;
}
</style>
