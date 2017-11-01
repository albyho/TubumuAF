<template>
<div>
<el-input
  placeholder="输入关键字进行过滤"
  v-model="filterText">
</el-input>

<el-popover
  ref="popover4"
  placement="left"
  width="400"
  trigger="hover">
  <el-table :data="gridData">
    <el-tooltip class="item" effect="dark" content="Top Center 提示文字" placement="top">
      <el-table-column width="150" property="date" label="日期"></el-table-column>
    </el-tooltip>
    <el-table-column width="100" property="name" label="姓名"></el-table-column>
    <el-table-column width="300" property="address" label="地址"></el-table-column>
  </el-table>
</el-popover>

<el-tree
  class="filter-tree"
  :data="data2"
  :props="defaultProps"
  default-expand-all
  :filter-node-method="filterNode"
  ref="tree2"
  :render-content="renderContent">
</el-tree>

</div>
</template>

<script>
  let id = 1000

  export default {
    watch: {
      filterText (val) {
        this.$refs.tree2.filter(val)
      }
    },

    methods: {
      filterNode (value, data) {
        if (!value) return true
        return data.label.indexOf(value) !== -1
      },
      append (data) {
        const newChild = { id: id++, label: 'testtest', children: [] }
        if (!data.children) {
          this.$set(data, 'children', [])
        }
        data.children.push(newChild)
      },
      remove (node, data) {
        const parent = node.parent
        const children = parent.data.children || parent.data
        const index = children.findIndex(d => d.id === data.id)
        children.splice(index, 1)
      },
      renderContent (h, { node, data, store }) {
        return (
          <span>
            <span>
              <span>{node.label}</span>
            </span>
            <span style="padding-left: 8px;">
              <el-tooltip class="item" effect="dark" content="排序" placement="top">
                <el-button type="text" size="small" icon="el-icon-sort" on-click={ () => this.append(node, data) }></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="添加子节点" placement="top">
                <el-button type="text" size="small" icon="el-icon-circle-plus-outline" on-click={ () => this.append(node, data) }></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑" placement="top">
                <el-button type="text" size="small" icon="el-icon-edit" on-click={ () => this.append(node, data) }></el-button>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="删除" placement="top">
                <el-button type="text" size="small" icon="el-icon-delete" on-click={ () => this.remove(data) }></el-button>
              </el-tooltip>
            </span>
          </span>)
      }
    },

    data () {
      return {
        filterText: '',
        data2: [{
          id: 1,
          label: '一级 1',
          children: [{
            id: 4,
            label: '二级 1-1',
            children: [{
              id: 9,
              label: '三级 1-1-1'
            }, {
              id: 10,
              label: '三级 1-1-2'
            }]
          }]
        }, {
          id: 2,
          label: '一级 2',
          children: [{
            id: 5,
            label: '二级 2-1'
          }, {
            id: 6,
            label: '二级 2-2'
          }]
        }, {
          id: 3,
          label: '一级 3',
          children: [{
            id: 7,
            label: '二级 3-1'
          }, {
            id: 8,
            label: '二级 3-2'
          }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        gridData: [{
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-04',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-01',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }, {
          date: '2016-05-03',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }]

      }
    }
  }
</script>
