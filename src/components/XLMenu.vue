<template>
  <el-menu-item v-if="model.type === 0" :index="model.index">
    <i class="el-icon-menu"></i>
    <span slot="title">{{ model.title }}</span>
  </el-menu-item>
  <el-submenu v-else-if="model.type === 1" :index="model.index">
    <template slot="title">
      <i class="el-icon-menu"></i>
      <span slot="title">{{ model.title }}</span>
    </template>
    <xl-menu v-for="(item, itemindex) in model.children" :key="model.index + '-' + itemindex" :model="item" :index="model.index + '-' + itemindex"></xl-menu>
  </el-submenu>
  <el-submenu v-else-if="model.type === 2" :index="model.index">
    <template slot="title">
      <i class="el-icon-menu"></i>
      <span slot="title">{{ model.title }}</span>
    </template>
    <xl-menu v-for="(item, itemindex) in model.children" :key="model.index + '-' + itemindex" :model="item" :index="model.index + '-' + itemindex"></xl-menu>
  </el-submenu>
</template>

<script>
// model.type: 为 1 或 2 时，model.children 不包含元素属于异常情况
// index: 目的是传递给子节点用于构造 key 和 el 组件的 index
export default {
  name: 'XLMenu',
  props: ['model', 'index'],
  data () {
    return {
    }
  }
}
</script>
