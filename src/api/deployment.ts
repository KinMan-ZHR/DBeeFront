import request from '@/utils/request'
import type { Deployment, DeploymentQuery, DeploymentCreate, PageResult } from '@/types/api'

// 获取部署列表
export function getDeploymentList(params: DeploymentQuery) {
  return request.get<PageResult<Deployment>>('/deployment/list', { params })
}

// 获取部署详情
export function getDeploymentDetail(id: number) {
  return request.get<Deployment>(`/deployment/${id}`)
}

// 创建部署
export function createDeployment(data: DeploymentCreate) {
  return request.post('/deployment/create', data)
}

// 取消部署
export function cancelDeployment(id: number) {
  return request.post(`/deployment/${id}/cancel`)
}

// 回滚部署
export function rollbackDeployment(id: number) {
  return request.post(`/deployment/${id}/rollback`)
}

// 获取部署日志
export function getDeploymentLogs(id: number) {
  return request.get<{ logs: string[] }>(`/deployment/logs/${id}`)
}

// 获取部署统计
export function getDeploymentStats() {
  return request.get<{
    total: number
    success: number
    failed: number
    running: number
  }>('/deployment/stats')
}

// 删除部署记录
export function deleteDeployment(id: number) {
  return request.delete(`/deployment/delete/${id}`)
}

// 启动部署
export function startDeployment(id: number) {
  return request.post(`/deployment/${id}/start`)
}

// 停止部署
export function stopDeployment(id: number) {
  return request.post(`/deployment/${id}/stop`)
}