<template>
  <el-cascader
    :options="treeData"
    :props="defaultProps"
    clearable
    filterable
    placeholder="选择分组"
    change-on-select
    @change="handleChange"
    @active-item-change="handleActiveItemChange"
    v-model="currentValue" />
</template>

<script>
import api from '@/utils/api'

export default {
  name: 'XLGroupCascader',
  props: {
    value: {
      type: Array
    }
  },
  data () {
    return {
      currentValue: this.value,
      treeData: [],                       // 用于搜索 cascader / 编辑对话框内显示的分组树
      defaultProps: {
        children: 'children',
        value: 'id',
        label: 'name'
      }
    }
  },
  watch: {
    value (val) {
      this.currentValue = val
    },
    currentValue (val) {
      this.$emit('input', val)
    }
  },
  mounted () {
    this.getGroupTree()
  },
  methods: {
    getGroupTree () {
      api.getGroupTree().then(response => {
        this.treeData = response.data.tree
      }, error => {
        this.$message({
          message: error.message,
          type: 'error'
        })
      })
    },
    handleChange (value) {
      this.$emit('change', value)
    },
    handleActiveItemChange (value) {
      this.$emit('active-item-change', value)
    }
  }
}
</script>
