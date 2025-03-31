import request from '@/utils/request'
import type { App, AppQuery, AppCreate, AppUpdate, PageResult } from '@/types/api'

// 获取应用列表
export function getAppList(params: AppQuery) {
  return request.get<PageResult<App>>('/app/list', { params })
}

// 获取应用详情
export function getAppDetail(id: number) {
  return request.get<App>(`/app/${id}`)
}

// 创建应用
export function createApp(data: AppCreate) {
  return request.post('/app/create', data)
}

// 更新应用
export function updateApp(data: AppUpdate) {
  return request.put('/app/update', data)
}

// 删除应用
export function deleteApp(id: number) {
  return request.delete(`/app/delete/${id}`)
}

// 启动应用
export function startApp(id: number) {
  return request.post(`/app/${id}/start`)
}

// 停止应用
export function stopApp(id: number) {
  return request.post(`/app/${id}/stop`)
}

// 重启应用
export function restartApp(id: number) {
  return request.post(`/app/${id}/restart`)
} 