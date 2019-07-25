<template>
  <el-cascader
    :options="list"
    :props="defaultProps"
    clearable
    filterable
    placeholder="请选择区域"
    v-model="currentValue"
    @change="handleChange"/>
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
    const self = this
    return {
      isInitialized: false,
      currentValue: this.value,
      tempValue: [], // 用于根据最后的子节点 id 和树生成路径 id
      list: [],
      defaultProps: {
        children: 'children',
        value: 'id',
        label: 'name',
        lazy: true,
        lazyLoad (node, resolve) {
          self.getRegiontTreeChildNodeList(node.value, resolve)
        }
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
      if (this.isInitialized) {
        this.$emit('input', val)
      } else {
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
      } else if (!this.list || this.list.length === 0) {
        this.getRegiontTreeChildNodeList(null)
      }
    },
    getRegiontParentTree (regionId) {
      console.log('RegionCascader: getRegiontParentTree', regionId)
      const params = {
        regionId: regionId
      }
      api.getRegiontParentTree(params).then(response => {
        const list = response.data.data
        this.fixChildren(list)
        this.list = list
        this.generateIdPath(list, regionId)
        console.log('RegionCascader: getRegiontParentTree', this.tempValue)
        this.currentValue = this.tempValue
      }, error => {
        this.$message.error(error.message)
      })
    },
    getRegiontTreeChildNodeList (parentId, callback) {
      console.log('RegionCascader: getRegiontTreeChildNodeList', parentId)
      const params = {
        parentId: parentId
      }
      api.getRegiontTreeChildNodeList(params).then(response => {
        let list = response.data.data
        this.fixChildren(list)
        if (!parentId) {
          this.list = list
        }
        // 对于非根节点的子节点列表 el-cascader 会自行缓存
        if (callback) {
          callback(list)
        }
      }, error => {
        this.$message.error(error.message)
      })
    },
    fixChildren (list) {
      for (let i = 0; i < list.length; i++) {
        list[i].leaf = !list[i].hasChildren
        if (list[i].hasChildren) {
          if (!list[i].children) {
            Vue.set(list[i], 'children', [])
          } else {
            this.fixChildren(list[i].children)
          }
        }
      }
    },
    generateIdPath (list, id) {
      if (!list) return
      for (let node of list) {
        if (node.id === id) {
          this.tempValue = node.parentIdPath ? node.parentIdPath.concat() : []
          this.tempValue.push(id)
          break
        } else {
          this.generateIdPath(node.children, id)
        }
      }
    },
    handleChange (value) {
      console.log('RegionCascader: handleChange:', value)
      this.$emit('input', value)
    }
  }
}
</script>
