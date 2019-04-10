<template>
<el-container v-loading.fullscreen.lock="isLoading">
  <el-header>
    <el-row>
      <el-col :span="16">系统管理</el-col>
      <el-col :span="8" class="userinfo">
        <el-badge value="new" :hidden="!hasNewMessage">
          <i class="el-icon-message newMessage" @click="handleNewMessage" />
        </el-badge>
        <el-dropdown
          trigger="hover"
          :show-timeout="150">
          <span class="el-dropdown-link userinfo-inner">
            <img
              :src="profileDisplay.headUrl"
              v-show="profileDisplay.headUrl" /> [ {{ profileDisplay.groups.map(m => m.name).join(' - ') }} ] {{ profileDisplay.displayName || profileDisplay.username }}
          </span>
          <el-dropdown-menu slot="dropdown">
            <!-- <el-dropdown-item>我的消息</el-dropdown-item> -->
            <el-dropdown-item @click.native="profile">我的资料</el-dropdown-item>
            <!-- <el-dropdown-item @click.native="resources">我的文件</el-dropdown-item> -->
            <el-dropdown-item
              divided
              @click.native="logout">退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </el-col>
    </el-row>
  </el-header>
  <el-container class="el-container-inner">
    <el-aside
      width="200"
      v-loading="isGetMenusLoading">
      <el-menu
        unique-opened
        default-active="menuActiveIndex"
        class="el-menu-vertical-main"
        @open="handleOpen"
        @close="handleClose"
        @select="handleSelect">
        <xl-menu
          v-for="(item, itemindex) in menus"
          :key="itemindex"
          :model="item"
          :index="itemindex.toString()" />
      </el-menu>
    </el-aside>
    <el-main><iframe
      :src="mainFrameUrl"
      class="el-main-content"
      scrolling="auto" frameBorder="0" :width="iframeWidth" :height="iframeHeight" /></el-main>
    </el-container>
  </el-container>
</template>

<script>
import api from '@/utils/api'

export default {
  data () {
    return {
      isLoading: false,
      isGetMenusLoading: false,
      hasNewMessage: null,
      mainFrameUrl: '',
      profileDisplay: {
        username: '',
        displayName: '',
        headUrl: null,
        groups: []
      },
      menus: null,
      menuActiveIndex: '0-0',
      iframeWidth: document.documentElement.clientWidth - 200,
      iframeHeight: document.documentElement.clientHeight - 60
    }
  },
  created: function () {

  },
  mounted: function () {
    const self = this
    window.onresize = function () {
      self.iframeWidth = document.documentElement.clientWidth - 200
      self.iframeHeight = document.documentElement.clientHeight - 60
    }

    window.onresize()

    this.isGetMenusLoading = true
    api.getMenus().then(response => {
      this.isGetMenusLoading = false
      this.menus = response.data.list
      // console.log(response.data)
    }, error => {
      // console.log(error)
      this.isGetMenusLoading = false
      this.showErrorMessage(error.message)
    })
    api.getProfile().then(response => {
      // console.log(response.data)
      this.profileDisplay = response.data.item
      this.connectNotifictionServer()
    }, error => {
      // console.log(error)
      this.showErrorMessage(error.message)
    })
  },
  methods: {
    handleOpen (index, indexPath) {
      // console.log('open', index, indexPath)
    },
    handleClose (index, indexPath) {
      // console.log('close', index, indexPath)
    },
    handleSelect (index, indexPath) {
      const menuIndexes = index.split('-')
      let list = this.menus
      let currentMenu = null
      for (let i = 0; i < menuIndexes.length; i++) {
        currentMenu = list[menuIndexes[i]]
        if (i === menuIndexes.length - 1) {
          if (currentMenu.directly) {
            this.callDirectly(currentMenu.link)
          } else if (currentMenu.linkTarget) {
            window.open(currentMenu.link, currentMenu.linkTarget)
          } else {
            this.mainFrameUrl = currentMenu.link
          }
        } else {
          list = currentMenu.children
        }
      }
      // console.log('handleSelect', index, indexPath, this.mainFrameUrl)
    },
    profile () {
      this.mainFrameUrl = '/Admin/View?IsCore=true&Title=%E6%88%91%E7%9A%84%E8%B5%84%E6%96%99&Name=profile&Components=ckfinder'
    },
    resources () {
      this.mainFrameUrl = '/Admin/View?IsCore=true&Title=%E6%88%91%E7%9A%84%E8%B5%84%E6%96%99&Name=resources&Components=ckfinder'
    },
    logout () {
      this.isLoading = true
      api.logout().then(response => {
        // this.isLoading = false
        // httpClient 对 response.data.url 有拦截处理
        localStorage.removeItem('token')
        localStorage.removeItem('refreshToken')
      }, error => {
        // console.log(error)
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    callDirectly (url) {
      this.isLoading = true
      api.callDirectly(url).then(response => {
        this.isLoading = false
        this.$message({
          message: response.data.message,
          type: 'success'
        })
      }, error => {
        this.isLoading = false
        this.showErrorMessage(error.message)
      })
    },
    connectNotifictionServer () {
      const _this = this
      try {
        /* eslint-disable no-undef */
        const connection = new signalR.HubConnectionBuilder()
        .withUrl('/hubs/notificationHub', { accessTokenFactory: () => localStorage.token })
        .build()
        connection.on('ReceiveMessage', function (data) {
          console.log(data)
          // 错误码：
          // 200 连接通知成功 (暂未使用)
          // 201 新消息(可带url参数)
          // 202 清除新消息标记
          // 400 连接通知失败等错误
          if (data.code === 201) {
            _this.hasNewMessage = true
            _this.$notify.info({
              dangerouslyUseHTMLString: true,
              offset: 64,
              duration: 5000,
              title: data.title || '新的消息',
              message: data.message
            })
          } else if (data.code === 202) {
            // 暂未使用 202
            _this.hasNewMessage = false
          } else if (data.code === 400) {
            _this.showErrorMessage(data.message)
          }
        })

        connection.start().catch(function (err) {
          return console.error(err.toString())
        })
      } catch (e) {
        console.log(e.message)
      }
    },
    handleNewMessage () {
      this.hasNewMessage = false
      this.mainFrameUrl = '/Admin/View?IsCore=true&Title=%E9%80%9A%E7%9F%A5%E4%B8%AD%E5%BF%83&Name=notification&t=' + (new Date().getTime())
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

<style lang="scss">
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

      .el-badge {
        margin-right: 20px;
        height: 32px;
        line-height: 32px;
        font-size: 20px;

        .el-badge__content {
          font-size: 6px;
          padding: 2px;
          height: 8px;
          line-height: 8px;
          border-radius: 4px;
          top: 4px;
          right: 6px;
        }

        .newMessage {
          cursor: pointer;
        }
      }

      .el-dropdown {
        line-height: 32px;
      }

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

          .el-submenu .el-menu-item {
            height: 36px;
            line-height: 36px;
          }

          .el-menu-item,
          .el-submenu__title {
            height: 40px;
            line-height: 40px;
          }
        }
      }

      .el-main {
        height: 100%;
        padding: 0;
        overflow: hidden;

        .el-main-content {
          border: 0;
          /*width: 100%;
          height: 100%;*/
        }
      }
    }
  }
}
</style>
