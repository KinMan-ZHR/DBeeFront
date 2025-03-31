import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 路由配置
const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home.vue')
  },
  {
    path: '/app',
    name: 'appList',
    component: () => import('@/views/app/AppList.vue')
  },
  {
    path: '/app/create',
    name: 'appCreate',
    component: () => import('@/views/app/AppCreate.vue')
  },
  {
    path: '/app/edit/:id',
    name: 'appEdit',
    component: () => import('@/views/app/AppEdit.vue')
  },
  {
    path: '/deployment',
    name: 'deploymentList',
    component: () => import('@/views/deployment/DeploymentList.vue')
  },
  {
    path: '/deployment/create',
    name: 'deploymentCreate',
    component: () => import('@/views/deployment/DeploymentCreate.vue')
  },
  {
    path: '/deployment/detail/:id',
    name: 'deploymentDetail',
    component: () => import('@/views/deployment/DeploymentDetail.vue')
  },
  {
    path: '/system',
    name: 'systemConfig',
    component: () => import('@/views/system/SystemConfig.vue')
  }
]

// 创建路由
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

export default router 