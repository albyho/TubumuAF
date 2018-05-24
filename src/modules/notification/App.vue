<template>
  <el-container v-loading.fullscreen.lock="isLoading">
    <el-header class="header">
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="breadcrumb">
        <el-breadcrumb-item>通知中心</el-breadcrumb-item>
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
            <el-radio-group v-model="isReadedNumber" @change="handleIsReadChange">
              <el-radio-button :label="1">未读</el-radio-button>
              <el-radio-button :label="2">已读</el-radio-button>
              <el-radio-button >全部</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-input
              placeholder="关键字(标题)"
              clearable
              v-model="searchCriteriaForm.keyword"
              class="filterText" />
          </el-form-item>
          <el-form-item>
            <el-date-picker
              v-model="searchCriteriaForm.creationDate"
              value-format="yyyy-MM-dd"
              type="daterange"
              range-separator="至"
              start-placeholder="创建日期开始"
              end-placeholder="创建日期结束" />
          </el-form-item>
          <el-form-item>
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
          </el-form-item>
        </el-row>
        <el-row>
          <el-form-item>
            <el-button-group>
              <el-button
                plain
                icon="el-icon-view"
                @click="handleReadMultiple()">设置已读</el-button>
              <el-button
                plain
                icon="el-icon-remove-outline"
                @click="handleDeleteMultiple()">删除通知</el-button>
            </el-button-group>
          </el-form-item>
        </el-row>
      </el-form>
      <el-row>
        <el-table
          :data="page.list"
          style="width: 100%"
          ref="mainTable"
          :empty-text="mainTableEmptyText"
          @selection-change="handleSelectionChange"
          @expand-change="handleExpandChange"
          @row-click="handleRowClick"
          @sort-change="handleSortChange">
          <el-table-column
            type="selection"
            width="56">
          </el-table-column>
          <el-table-column type="expand" label="查看">
            <template slot-scope="scope">
              <div v-html="scope.row.message"></div>
            </template>
          </el-table-column>
          <el-table-column
            prop="notificationID"
            label="#"
            width="60"
            sortable="custom" />
          <el-table-column
            prop="title"
            label="标题" />
          <el-table-column
            label="已读"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.readTime ? '√' : '' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="来自"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.fromUser ? scope.row.fromUser.displayName : '系统' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="送至"
            width="100">
            <template slot-scope="scope">
              <span>{{ scope.row.toUser ? scope.row.toUser.displayName : '全部' }}</span>
            </template>
          </el-table-column>
          <el-table-column
            prop="creationDate"
            label="创建时间"
            width="160" />
          <el-table-column
            align="center"
            width="42">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                icon="el-icon-delete"
                @click="handleDeleteOne(scope.row)" />
            </template>
          </el-table-column>
        </el-table>
      </el-row>

      <el-dialog
        title="提示"
        :visible.sync="deleteOneConfirmDialogVisible"
        width="320px"
        center>
        <span>确定要删除该通知吗？</span>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="handleDeleteOneSure(false)">取 消</el-button>
          <el-button
            type="primary"
            @click="handleDeleteOneSure(true)">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="deleteMultipleConfirmDialogVisible"
        width="320px"
        center>
        <span>确定要将选择的通知删除吗？</span>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="handleDeleteMultipleSure(false)">取 消</el-button>
          <el-button
            type="primary"
            @click="handleDeleteMultipleSure(true)">确 定</el-button>
        </div>
      </el-dialog>

      <el-dialog
        title="提示"
        :visible.sync="readMultipleConfirmDialogVisible"
        width="320px"
        center>
        <span>确定要将选择的通知设置为已读吗？</span>
        <div
          slot="footer"
          class="dialog-footer">
          <el-button @click="handleReadMultipleSure(false)">取 消</el-button>
          <el-button
            type="primary"
            @click="handleReadMultipleSure(true)">确 定</el-button>
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
        keyword: null,
        toUserID: null,
        creationDate: null,
        creationDateBegin: null,
        creationDateEnd: null,
        isReaded: false
      },
      isReadedNumber: 1, // 1 未读 2 已读 undefined 全部
      pagingInfoForm: {
        pageNumber: 1,
        pageSize: 20,
        isExcludeMetaData: false,
        sortInfo: {
          sort: 'NotificationID',
          sortDir: 'DESC'
        }
      },
      // 选中项
      selection: null,
      // 删除
      deleteOneActive: null,                      // 暂存删除项
      deleteOneConfirmDialogVisible: false,       // 删除确认对话框是否可见
      deleteMultipleConfirmDialogVisible: false,
      // 已读
      readMultipleConfirmDialogVisible: false,

      // 添加/编辑
      editActive: null,                   // 暂存编辑项，也可用来判断是否添加还是编辑
      mainFormDialogVisible: false,       // 添加/编辑对话框是否可见
      mainForm: {
        notificationID: null,             // Int
        title: null,                      // String
        message: null                     // String
      },
      mainFormRules: {
        title: [
          { required: true, message: '请输入标题', trigger: 'blur' },
          { max: 100, message: '最多支持100个字符', trigger: 'blur' }
        ],
        message: [
          { required: true, message: '请输入消息', trigger: 'blur' },
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
      api.getNotifications(params).then(response => {
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
      this.searchCriteriaForm.creationDateBegin = null
      this.searchCriteriaForm.creationDateEnd = null
      this.getPage()
    },
    handleSearch () {
      this.pagingInfoForm.pageNumber = 1
      if (this.searchCriteriaForm.creationDate && this.searchCriteriaForm.creationDate.length === 2) {
        this.searchCriteriaForm.creationDateBegin = this.searchCriteriaForm.creationDate[0]
        this.searchCriteriaForm.creationDateEnd = this.searchCriteriaForm.creationDate[1]
      }
      this.getPage()
    },
    handleIsReadChange (val) {
      // console.log('handleIsReadChange', val)
      this.searchCriteriaForm.isReaded = !val ? null : val === 2
      this.handleSearch()
    },
    handleDeleteOne (row) {
      this.deleteOneActive = row
      this.deleteOneConfirmDialogVisible = true
    },
    handleDeleteOneSure (sure) {
      this.deleteOneConfirmDialogVisible = false
      if (sure) {
        this.deleteOne()
      } else {
        this.deleteOneActive = null
      }
    },
    handleDeleteMultiple () {
      if (!this.selection || this.selection.length === 0) {
        this.$message({
          message: '请选择要删除的记录',
          type: 'warning'
        })
        return
      }
      this.deleteMultipleConfirmDialogVisible = true
    },
    handleDeleteMultipleSure (sure) {
      this.deleteMultipleConfirmDialogVisible = false
      if (sure) {
        this.deleteMultiple()
      }
    },
    deleteOne () {
      if (!this.deleteOneActive) return
      this.delete([this.deleteOneActive.notificationID])
    },
    deleteMultiple () {
      this.delete(this.selection.map(m => m.notificationID))
    },
    delete (notificationIDs) {
      if (!notificationIDs || notificationIDs.length === 0) return
      const params = {
        notificationIDs: notificationIDs
      }
      this.isLoading = true
      api.deleteNotifications(params).then(response => {
        this.isLoading = false
        this.deleteOneActive = null
        this.getPage()
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    handleReadOne (row) {
      this.read([row.notificationID])
    },
    handleReadMultiple () {
      if (!this.selection || this.selection.length === 0) {
        this.$message({
          message: '请选择要设置为已读的记录',
          type: 'warning'
        })
        return
      }
      this.readMultipleConfirmDialogVisible = true
    },
    handleReadMultipleSure (sure) {
      this.readMultipleConfirmDialogVisible = false
      if (sure) {
        this.readMultiple()
      }
    },
    readMultiple () {
      this.read(this.selection.map(m => m.notificationID))
    },
    read (notificationIDs) {
      if (!notificationIDs || notificationIDs.length === 0) return
      const params = {
        notificationIDs: notificationIDs
      }
      // this.isLoading = true
      api.readNotifications(params).then(response => {
        // this.isLoading = false
        // 不重新获取数据，但设置 readTime 避免重复请求服务器
        // this.getPage()
        for (let item of this.page.list) {
          for (let notificationID of notificationIDs) {
            if (item.notificationID === notificationID) {
              item.readTime = new Date()
              continue
            }
          }
        }
      }, error => {
        // this.isLoading = false
        this.showErrorMessage(error.message)
      })
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
    handleSelectionChange (val) {
      // console.log('handleSelectionChange', val)
      this.selection = val
    },
    handleRowClick (row, event, column) {
      if (column.id === 'el-table_1_column_2') return
      this.$refs.mainTable.toggleRowExpansion(row)
    },
    handleExpandChange (row, expandedRows) {
      console.log('handleExpandChange', row, expandedRows)
      if (row.readTime) return
      this.handleReadOne(row)
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