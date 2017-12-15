<template>
  <el-container v-loading.fullscreen.lock="isLoading">
    <el-header class="header">  
      <el-breadcrumb
        separator-class="el-icon-arrow-right"
        class="breadcrumb">
        <el-breadcrumb-item>我的文件</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-main
      class="main"
      id="main" />
  </el-container>
</template>

<script>

export default {
  data () {
    return {
      // 主要数据
      isLoading: false
    }
  },
  mounted () {
    this.showCKFinder()
  },
  methods: {
    showCKFinder () {
      try {
        /* eslint-disable no-undef */
        CKFinder.widget('main', {
          width: '100%',
          height: 700
        })
      } catch (e) {
        console.log(e.message)
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>