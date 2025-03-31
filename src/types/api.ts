// 应用相关类型
export interface App {
  id: number
  appName: string
  description: string
  deployType: 'jar' | 'docker' | 'k8s'
  createTime: string
  status: 'running' | 'stopped' | 'error'
}

export interface AppQuery {
  appName?: string
  status?: string
  page: number
  limit: number
}

export interface AppCreate {
  appName: string
  description: string
  deployType: string
}

export interface AppUpdate extends AppCreate {
  id: number
}

// 部署相关类型
export interface Deployment {
  id: number
  appId: number
  appName: string
  version: string
  env: 'dev' | 'test' | 'prod'
  description: string
  deployTime: string
  status: 'success' | 'failed' | 'running'
  deployer: string
}

export interface DeploymentQuery {
  appId?: number
  status?: string
  deployTime?: [string, string]
  page: number
  limit: number
}

export interface DeploymentCreate {
  appId: number
  version: string
  env: string
  description: string
}

// 系统配置相关类型
export interface BasicConfig {
  systemName: string
  logo: string
  description: string
}

export interface EmailConfig {
  smtpServer: string
  smtpPort: number
  senderEmail: string
  emailPassword: string
}

export interface NotificationConfig {
  deployNotify: boolean
  alertNotify: boolean
  notifyMethods: string[]
  webhookUrl: string
}

// API 响应类型
export interface ApiResponse<T = any> {
  code: number
  message: string
  data: T
}

export interface PageResult<T> {
  total: number
  list: T[]
} 