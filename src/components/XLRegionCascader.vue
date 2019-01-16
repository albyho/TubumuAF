<template>
  <el-cascader
    :options="treeData"
    :props="defaultProps"
    clearable
    filterable
    placeholder="请选择区域"
    v-model="currentValue"
    @active-item-change="handleActiveItemChange"/>
</template>

<script>
import api from '@/utils/api'
import Vue from 'vue'

export default {
  name: 'XLRegionCascader',
  props: {
    value: {
      type: Array
    }
  },
  data () {
    return {
      isInitialized: false,
      currentValue: this.value,
      tempValue: [], // 用于根据最后的子节点 id 和树生成路径 id
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
      console.log('RegionCascader: value', val)
      this.currentValue = val
    },
    currentValue (val) {
      console.log('RegionCascader: currentValue', val, this.isInitialized)
      this.$emit('input', val)
      if (!this.isInitialized) {
        this.isInitialized = true
        this.getInitializationTree()
      }
    }
  },
  mounted () {
    console.log('RegionCascader: mounted', this.currentValue, this.value)
    this.isInitialized = true
  },
  methods: {
    reset () {
      console.log('RegionCascader: reset')
      this.isInitialized = false
    },
    getInitializationTree () {
      console.log('RegionCascader: getInitializationTree')
      if (this.currentValue && this.currentValue.length > 0) {
        this.getRegiontParentTree(this.currentValue[this.currentValue.length - 1])
      } else if (!this.treeData || this.treeData.length === 0) {
        this.getRegiontTreeNodeList(null)
      }
    },
    getRegiontParentTree (regionId) {
      console.log('RegionCascader: getRegiontParentTree', regionId)
      const params = {
        regionId: regionId
      }
      api.getRegiontParentTree(params).then(response => {
        const tree = response.data.tree
        this.fixChildren(tree)
        this.treeData = tree
        this.getRegionIdPath(tree, regionId)
        console.log('RegionCascader: getRegiontParentTree', this.tempValue)
        this.currentValue = this.tempValue
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    getRegiontTreeNodeList (parentId) {
      console.log('RegionCascader: getRegiontTreeNodeList', parentId)
      let currentNode
      if (parentId && this.treeData && this.treeData.length > 0) {
        currentNode = this.findNode(this.treeData, parentId)
        if (!currentNode) {
          console.log('RegionCascader: findNode Error: cannot find', parentId)
          return
        }
        if (!currentNode.hasChildren) {
          console.log('RegionCascader: findNode Error: has no children')
          return
        }
        if (currentNode.children && currentNode.children.length > 0) {
          console.log('RegionCascader: findNode: reused')
          return
        }
      }
      const params = {
        parentId: parentId
      }
      api.getRegiontTreeNodeList(params).then(response => {
        let list = response.data.list
        this.fixChildren(list)
        if (!parentId) {
          this.treeData = list
        } else {
          currentNode.children = list
        }
      }, error => {
        this.showErrorMessage(error.message)
      })
    },
    fixChildren (tree) {
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].hasChildren) {
          if (!tree[i].children) {
            Vue.set(tree[i], 'children', [])
          } else {
            this.fixChildren(tree[i].children)
          }
        }
      }
    },
    findNode (tree, id) {
      let node = null
      for (let i = 0; i < tree.length; i++) {
        if (tree[i].id === id) {
          node = tree[i]
          break
        } else if (tree[i].hasChildren && tree[i].children != null && tree[i].children.length > 0) {
          let child = this.findNode(tree[i].children, id)
          if (child) {
            node = child
            break
          }
        }
      }
      return node
    },
    getRegionIdPath (tree, id) {
      if (!tree) return
      for (let node of tree) {
        if (node.id === id) {
          this.tempValue = node.parentIdPath ? node.parentIdPath.concat() : []
          this.tempValue.push(id)
          break
        } else {
          this.getRegionIdPath(node.children, id)
        }
      }
    },
    handleActiveItemChange (value) {
      console.log('RegionCascader: handleActiveItemChange:', value)
      this.getRegiontTreeNodeList(value[value.length - 1])
      this.$emit('active-item-change', value)
      this.$emit('input', value)
    },
    showErrorMessage (message) {
      this.$message({
        message: message,
        type: 'error'
      })
    }
  }
}
</script>
