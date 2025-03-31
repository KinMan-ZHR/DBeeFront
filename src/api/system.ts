import request from '@/utils/request'
import type { BasicConfig, EmailConfig, NotificationConfig } from '@/types/api'

// 获取基本设置
export function getBasicConfig() {
  return request.get<BasicConfig>('/system/basic')
}

// 更新基本设置
export function updateBasicConfig(data: BasicConfig) {
  return request.put('/system/basic/update', data)
}

// 获取邮件设置
export function getEmailConfig() {
  return request.get<EmailConfig>('/system/email')
}

// 更新邮件设置
export function updateEmailConfig(data: EmailConfig) {
  return request.put('/system/email/update', data)
}

// 测试邮件配置
export function testEmailConfig() {
  return request.post('/system/email/test')
}

// 获取通知设置
export function getNotificationConfig() {
  return request.get<NotificationConfig>('/system/notification')
}

// 更新通知设置
export function updateNotificationConfig(data: NotificationConfig) {
  return request.put('/system/notification/update', data)
}

// 上传文件
export function uploadFile(file: File) {
  const formData = new FormData()
  formData.append('file', file)
  return request.post<{ url: string }>('/system/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  })
} 