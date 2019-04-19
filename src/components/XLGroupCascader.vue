<template>
  <el-cascader
    :options="treeData"
    :props="defaultProps"
    clearable
    filterable
    placeholder="请选择分组"
    change-on-select
    @change="handleChange"
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
      tempValue: [],                      // 用于根据最后的子节点 id 和树生成路径 id
      treeData: [],
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
        const tree = response.data.data
        this.treeData = tree
        if (this.currentValue && this.currentValue.length === 1) {
          this.getIdPath(tree, this.currentValue[0])
          this.currentValue = this.tempValue
        }
      }, error => {
        this.$message.error(error.message)
      })
    },
    getIdPath (tree, id) {
      if (!tree) return
      for (let node of tree) {
        if (node.id === id) {
          this.tempValue = node.parentIdPath ? node.parentIdPath.concat() : []
          this.tempValue.push(id)
          break
        } else {
          this.getIdPath(node.children, id)
        }
      }
    },
    handleChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
