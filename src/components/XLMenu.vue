<template>
  <el-menu-item v-if="model.type === 0" :index="index">
    <span slot="title">{{ model.title }}</span>
  </el-menu-item>
  <el-submenu v-else-if="model.type === 1" :index="index">
    <template slot="title">
      <i class="el-icon-menu"></i>
      <span slot="title">{{ model.title }}</span>
    </template>
    <xl-menu v-for="(item, itemindex) in model.children" :key="index + '-' + itemindex" :model="item" :index="index + '-' + itemindex"></xl-menu>
  </el-submenu>
  <el-menu-item-group v-else-if="model.type === 2" :title="model.title">
    <xl-menu v-for="(item, itemindex) in model.children" :key="index + '-' + itemindex" :model="item" :index="index + '-' + itemindex"></xl-menu>
  </el-menu-item-group>
</template>

<script>
// model:
// type: 为 1 或 2 时，model.children 不包含元素属于服务器配置不当造成的异常情况
// index:
// 三个作用：1、用于构造自身 el 组件的 index 2、传递给子节点 3、v-for 用于构造 key

export default {
  name: 'XLMenu',
  props: ['model', 'index'],
  data () {
    return {
    }
  }
}
</script>
