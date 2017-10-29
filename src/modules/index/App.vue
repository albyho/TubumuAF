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
      <el-aside width="200">
        <el-menu default-active="0-0" class="el-menu-vertical-main" @open="handleOpen" @close="handleClose" @select='handleSelect'>
          <el-submenu v-for="(submenu, submenuindex) in menu.submenus" :index="submenuindex.toString()" :key="'key_' + submenuindex">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span slot="title">{{ submenu.title }}</span>
            </template>
            <el-menu-item v-for="(menuitem, menuitemindex) in submenu.menuitems" :index="submenuindex + '-' + menuitemindex" :key="'key_' + submenuindex + '_' + menuitemindex">
              <span slot="title">{{ menuitem.title }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main><iframe :src='mainFrameURL' class="main-content" scrolling="no"></iframe></el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
  data () {
    return {
      mainFrameURL: 'https://www.bing.com',
      profile: {
        displayName: 'Admin'
      },
      menu: {
        title: '主菜单',
        submenus: [
          {
            title: '导航一',
            menuitems: [
              {
                title: '子菜单1',
                link: 'login.html'
              },
              {
                title: '子菜单2',
                link: 'http://bing.com'
              }
            ]
          },
          {
            title: '导航二',
            menuitems: [
              {
                title: '子菜单1',
                link: 'http://baidu.com'
              },
              {
                title: '子菜单2',
                link: 'http://bing.com'
              }
            ]
          }
        ]
      }
    }
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
      if (menuIndexes.length === 2) {
        const link = this.menu.submenus[menuIndexes[0]].menuitems[menuIndexes[1]].link
        this.mainFrameURL = link
      }
      console.log('select', index, indexPath, this.mainFrameURL)
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
        padding: 0;
        height: 100%;
        .main-content {
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

