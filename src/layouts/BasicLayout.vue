<template>
  <lay-layout class="layui-layout-admin">
    <lay-header>
      <lay-logo>DBee</lay-logo>
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
      <lay-side>
        <lay-menu theme="dark" :selected-key="selectedKey" @select="handleSelect">
          <lay-menu-item id="1">
            <template #icon><lay-icon type="layui-icon-home"></lay-icon></template>
            首页
          </lay-menu-item>
          <lay-menu-item id="2">
            <template #icon><lay-icon type="layui-icon-app"></lay-icon></template>
            应用管理
          </lay-menu-item>
          <lay-menu-item id="3">
            <template #icon><lay-icon type="layui-icon-release"></lay-icon></template>
            部署管理
          </lay-menu-item>
          <lay-menu-item id="4">
            <template #icon><lay-icon type="layui-icon-set"></lay-icon></template>
            系统设置
          </lay-menu-item>
        </lay-menu>
      </lay-side>
      
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
const userAvatar = ref('https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png')

// 根据路由更新选中的菜单项
const updateSelectedKey = () => {
  const path = route.path
  if (path === '/') {
    selectedKey.value = '1'
  } else if (path === '/app') {
    selectedKey.value = '2'
  } else if (path === '/deployment') {
    selectedKey.value = '3'
  } else if (path === '/system') {
    selectedKey.value = '4'
  }
}

// 处理菜单选择
const handleSelect = (key: string) => {
  selectedKey.value = key
  switch (key) {
    case '1':
      router.push('/')
      break
    case '2':
      router.push('/app')
      break
    case '3':
      router.push('/deployment')
      break
    case '4':
      router.push('/system')
      break
  }
}

// 监听路由变化
watch(() => route.path, updateSelectedKey, { immediate: true })
</script>

<style lang="scss" scoped>
.layui-layout-admin {
  height: 100vh;
  
  .layui-header {
    background-color: #23262E;
    display: flex;
    align-items: center;
    padding: 0 15px;
    
    .layui-header-right {
      margin-left: auto;
    }
  }
  
  .layui-side {
    background-color: #23262E;
  }
  
  .layui-body {
    background-color: #f2f2f2;
    padding: 15px;
  }
}
</style> 