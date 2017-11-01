<template>
  <el-container>
    <el-header>
      <el-row>
        <el-col :span="20">系统管理</el-col>
        <el-col :span="4" class="userinfo">
          <el-dropdown trigger="hover">
					  <span class="el-dropdown-link userinfo-inner"><img src="./images/avatar.png" /> {{ profile.displayName }}</span>
					  <el-dropdown-menu slot="dropdown">
						  <el-dropdown-item>我的消息</el-dropdown-item>
						  <el-dropdown-item>设置</el-dropdown-item>
						  <el-dropdown-item divided @click.native="logout">退出登录</el-dropdown-item>
					  </el-dropdown-menu>
		      </el-dropdown></el-col>
      </el-row>
    </el-header>
    <el-container class="el-container-inner">
      <el-aside width="200" v-loading="isGetMenusLoading">
        <el-menu default-active="menuActiveIndex" class="el-menu-vertical-main" @open="handleOpen" @close="handleClose" @select='handleSelect'>
          <xl-menu v-for="(item, itemindex) in menus" :key="itemindex" :model="item" :index="itemindex.toString()"></xl-menu>
        </el-menu>
      </el-aside>
      <el-main><iframe :src='mainFrameURL' class="el-main-content" scrolling="no"></iframe></el-main>
    </el-container>
  </el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      isGetMenusLoading: false,
      mainFrameURL: 'https://www.bing.com',
      profile: {
        displayName: 'Admin'
      },
      menuActiveIndex: '0-0',
      menus: null
    }
  },
  mounted: function () {
    const _this = this
    _this.isGetMenusLoading = true
    api.getMenus().then(response => {
      _this.isGetMenusLoading = false
      _this.menus = response.data.menus
      console.log(response.data)
    }, error => {
      console.log(error)
      _this.isGetMenusLoading = false
      _this.$message({
        message: error.message,
        type: 'error'
      })
    })
  },
  methods: {
    handleOpen (index, indexPath) {
      console.log('open', index, indexPath)
    },
    handleClose (index, indexPath) {
      console.log('close', index, indexPath)
    },
    handleSelect (index, indexPath) {
      const menuIndexes = index.split('-')
      let list = this.menus
      let currentMenu = null
      for (let i = 0; i < menuIndexes.length; i++) {
        currentMenu = list[menuIndexes[i]]
        if (i === menuIndexes.length - 1) {
          this.mainFrameURL = currentMenu.link
        } else {
          list = currentMenu.children
        }
      }
      console.log('handleSelect', index, indexPath, this.mainFrameURL)
    },
    logout () {
      console.log('logout')
    }
  }
}
</script>

<style scoped lang="scss">
@import '../../styles/vars.scss';

body {
  margin: 0;
  padding: 0;
  .el-container {
	  position: absolute;
	  top: 0;
	  left: 0;
    width: 100%;
    height: 100%;
    .el-header {
      padding: 0 20px;
      height: 60px;
      line-height: 60px;
		  background: $color-primary;
      color: #fff;
      font-size: 16px;
      .userinfo {
			  text-align: right;
			  padding-right: 20px;
			  float: right;
			  .userinfo-inner {
				  cursor: pointer;
				  color: #fff;
				  img {
					  width: 40px;
					  height: 40px;
					  border-radius: 20px;
					  margin: 10px 0px 10px 10px;
					  float: right;
				  }
			 }
		}
    }
    .el-container {
      top: 60px;
      height: calc(100% - 60px);
      .el-aside {
        height: 100%;
        .el-menu-vertical-main:not(.el-menu--collapse) {
          width: 199px;
          min-height: 600px;
          height: 100%;
        }
      }
      .el-main {
        height: 100%;
        .el-main-content {
          border: 0;
          width: 100%;
          height: 100%;
          overflow-x: hidden;
          overflow-y: scrolling;
        }
      }
    }
  }
}
</style>

