<template>
  <lay-layout class="layui-layout-admin">
    <!-- 头部区域 -->
    <lay-header>
      <lay-logo>
        <div class="logo-container">
          <img src="/static/images/bee-logo.png" alt="DBee" class="logo-img" />
          <span>DBee</span>
        </div>
      </lay-logo>
      
      <!-- 头部右侧菜单 -->
      <div class="layui-header-right">
        <lay-dropdown>
          <lay-avatar :src="userAvatar" />
          <template #content>
            <lay-dropdown-menu>
              <lay-dropdown-menu-item>个人信息</lay-dropdown-menu-item>
              <lay-dropdown-menu-item>修改密码</lay-dropdown-menu-item>
              <lay-dropdown-menu-item divided>退出登录</lay-dropdown-menu-item>
            </lay-dropdown-menu>
          </template>
        </lay-dropdown>
      </div>
    </lay-header>
    
    <lay-layout>
      <!-- 左侧导航区域 -->
      <lay-side>
        <lay-menu 
          theme="dark" 
          :selected-key="selectedKey" 
          @change-selected-key="handleSelect"
          @change-open-keys="handleOpenKeys"
          v-model:open-keys="openKeys"
          :tree="true"
        >
          <!-- 首页 -->
          <lay-menu-item id="1">
            <template #icon><lay-icon type="layui-icon-home"></lay-icon></template>
            首页
          </lay-menu-item>
          
          <!-- 应用管理 -->
          <lay-sub-menu id="2">
            <template #icon><lay-icon type="layui-icon-app"></lay-icon></template>
            <template #title>应用管理</template>
            <lay-menu-item id="2-1">应用列表</lay-menu-item>
            <lay-menu-item id="2-2">新建应用</lay-menu-item>
          </lay-sub-menu>
          
          <!-- 部署管理 -->
          <lay-sub-menu id="3">
            <template #icon><lay-icon type="layui-icon-release"></lay-icon></template>
            <template #title>部署管理</template>
            <lay-menu-item id="3-1">部署列表</lay-menu-item>
            <lay-menu-item id="3-2">新建部署</lay-menu-item>
          </lay-sub-menu>
          
          <!-- 系统设置 -->
          <lay-menu-item id="4">
            <template #icon><lay-icon type="layui-icon-set"></lay-icon></template>
            系统设置
          </lay-menu-item>
        </lay-menu>
      </lay-side>
      
      <!-- 内容主体区域 -->
      <lay-body>
        <router-view></router-view>
      </lay-body>
    </lay-layout>
  </lay-layout>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const selectedKey = ref('1')
const openKeys = ref<string[]>([])
const userAvatar = ref('https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')

// 处理菜单选择
const handleSelect = (key: string) => {
  selectedKey.value = key
  switch (key) {
    case '1':
      router.push('/')
      break
    case '2-1':
      router.push('/app')
      break
    case '2-2':
      router.push('/app/create')
      break
    case '3-1':
      router.push('/deployment')
      break
    case '3-2':
      router.push('/deployment/create')
      break
    case '4':
      router.push('/system')
      break
  }
}

// 处理菜单展开/收起
const handleOpenKeys = (keys: string[]) => {
  openKeys.value = keys
}

// 监听路由变化，更新当前激活的菜单和展开的子菜单
watch(() => route.path, (path) => {
  if (path === '/') {
    selectedKey.value = '1'
    openKeys.value = []
  } else if (path === '/app') {
    selectedKey.value = '2-1'
    openKeys.value = ['2']
  } else if (path === '/app/create') {
    selectedKey.value = '2-2'
    openKeys.value = ['2']
  } else if (path.startsWith('/app/edit')) {
    selectedKey.value = '2-1'
    openKeys.value = ['2']
  } else if (path === '/deployment') {
    selectedKey.value = '3-1'
    openKeys.value = ['3']
  } else if (path === '/deployment/create') {
    selectedKey.value = '3-2'
    openKeys.value = ['3']
  } else if (path.startsWith('/deployment/detail')) {
    selectedKey.value = '3-1'
    openKeys.value = ['3']
  } else if (path === '/system') {
    selectedKey.value = '4'
    openKeys.value = []
  }
}, { immediate: true })
</script>

<style lang="scss" scoped>
.layui-layout-admin {
  height: 100vh;
  
  .layui-header {
    background-color: #23262E;
    display: flex;
    align-items: center;
    padding: 0 15px;
    height: 60px;
    box-shadow: 0 1px 4px rgba(0,21,41,.08);
    
    .layui-logo {
      color: #fff;
      font-size: 18px;
      font-weight: bold;
      margin-right: 20px;
      
      .logo-container {
        display: flex;
        align-items: center;
        
        .logo-img {
          width: 32px;
          height: 32px;
          margin-right: 8px;
        }
      }
    }
    
    .layui-header-right {
      margin-left: auto;
      display: flex;
      align-items: center;
    }
  }
  
  .layui-side {
    background-color: #23262E;
    width: 200px;
    box-shadow: 2px 0 8px 0 rgba(29,35,41,.05);
    
    .layui-menu {
      border: none;
      
      .layui-menu-item {
        height: 50px;
        line-height: 50px;
        
        &.layui-this {
          background-color: #1890ff;
        }
      }
      
      .layui-sub-menu {
        .layui-sub-menu-title {
          height: 50px;
          line-height: 50px;
        }
        
        .layui-menu-item {
          padding-left: 48px;
        }
      }
    }
  }
  
  .layui-body {
    background-color: #f0f2f5;
    padding: 15px;
    overflow: auto;
  }
}
</style>