# DBee API 接口文档

## 基础信息

- 基础路径: `/api`
- 请求方式: REST
- 数据格式: JSON
- 认证方式: Bearer Token

## 通用响应格式

```json
{
  "code": 200,          // 状态码
  "message": "success", // 响应消息
  "data": {}           // 响应数据
}
```

## 应用管理

### 获取应用列表

- 请求路径: `/app/list`
- 请求方式: GET
- 请求参数:
  ```typescript
  {
    page: number;      // 页码
    limit: number;     // 每页数量
    name?: string;     // 应用名称
    type?: string;     // 应用类型
  }
  ```
- 响应数据:
  ```typescript
  {
    list: Array<{
      id: number;           // 应用ID
      name: string;         // 应用名称
      type: string;         // 应用类型
      description: string;  // 应用描述
      gitUrl: string;       // Git仓库地址
      branch: string;       // 分支名称
      status: string;       // 状态
      createTime: string;   // 创建时间
    }>;
    total: number;          // 总数
  }
  ```

### 创建应用

- 请求路径: `/app/create`
- 请求方式: POST
- 请求参数:
  ```typescript
  {
    name: string;         // 应用名称
    type: string;         // 应用类型
    description: string;  // 应用描述
    gitUrl: string;       // Git仓库地址
    branch: string;       // 分支名称
  }
  ```

### 更新应用

- 请求路径: `/app/update`
- 请求方式: PUT
- 请求参数:
  ```typescript
  {
    id: number;           // 应用ID
    name: string;         // 应用名称
    type: string;         // 应用类型
    description: string;  // 应用描述
    gitUrl: string;       // Git仓库地址
    branch: string;       // 分支名称
  }
  ```

### 删除应用

- 请求路径: `/app/delete/{id}`
- 请求方式: DELETE

## 部署管理

### 获取部署列表

- 请求路径: `/deployment/list`
- 请求方式: GET
- 请求参数:
  ```typescript
  {
    page: number;      // 页码
    limit: number;     // 每页数量
    appId?: number;    // 应用ID
    status?: string;   // 部署状态
  }
  ```
- 响应数据:
  ```typescript
  {
    list: Array<{
      id: number;           // 部署ID
      appId: number;        // 应用ID
      appName: string;      // 应用名称
      version: string;      // 部署版本
      env: string;          // 部署环境
      status: string;       // 部署状态
      description: string;  // 部署说明
      deployTime: string;   // 部署时间
    }>;
    total: number;          // 总数
  }
  ```

### 创建部署

- 请求路径: `/deployment/create`
- 请求方式: POST
- 请求参数:
  ```typescript
  {
    appId: number;        // 应用ID
    version: string;      // 部署版本
    env: string;          // 部署环境
    description: string;  // 部署说明
  }
  ```

### 获取部署日志

- 请求路径: `/deployment/logs/{id}`
- 请求方式: GET
- 响应数据:
  ```typescript
  {
    logs: string[];  // 日志内容
  }
  ```

### 删除部署记录

- 请求路径: `/deployment/delete/{id}`
- 请求方式: DELETE

## 系统设置

### 获取基本设置

- 请求路径: `/system/basic`
- 请求方式: GET
- 响应数据:
  ```typescript
  {
    systemName: string;   // 系统名称
    logo: string;         // 系统Logo
    description: string;  // 系统描述
  }
  ```

### 更新基本设置

- 请求路径: `/system/basic/update`
- 请求方式: PUT
- 请求参数:
  ```typescript
  {
    systemName: string;   // 系统名称
    logo: string;         // 系统Logo
    description: string;  // 系统描述
  }
  ```

### 获取邮件设置

- 请求路径: `/system/email`
- 请求方式: GET
- 响应数据:
  ```typescript
  {
    smtpServer: string;    // SMTP服务器
    smtpPort: number;      // SMTP端口
    senderEmail: string;   // 发件人邮箱
    useSsl: boolean;       // 是否使用SSL
  }
  ```

### 更新邮件设置

- 请求路径: `/system/email/update`
- 请求方式: PUT
- 请求参数:
  ```typescript
  {
    smtpServer: string;    // SMTP服务器
    smtpPort: number;      // SMTP端口
    senderEmail: string;   // 发件人邮箱
    senderPassword: string;// 发件人密码
    useSsl: boolean;       // 是否使用SSL
  }
  ```

### 获取通知设置

- 请求路径: `/system/notification`
- 请求方式: GET
- 响应数据:
  ```typescript
  {
    deployNotify: boolean;    // 部署通知
    systemNotify: boolean;    // 系统通知
    notifyTypes: string[];    // 通知方式
    webhookUrl: string;       // Webhook地址
    dingtalkToken: string;    // 钉钉Token
  }
  ```

### 更新通知设置

- 请求路径: `/system/notification/update`
- 请求方式: PUT
- 请求参数:
  ```typescript
  {
    deployNotify: boolean;    // 部署通知
    systemNotify: boolean;    // 系统通知
    notifyTypes: string[];    // 通知方式
    webhookUrl: string;       // Webhook地址
    dingtalkToken: string;    // 钉钉Token
  }
  ```

## 文件上传

### 上传文件

- 请求路径: `/upload`
- 请求方式: POST
- 请求头:
  ```
  Content-Type: multipart/form-data
  ```
- 请求参数:
  ```
  file: File  // 文件对象
  ```
- 响应数据:
  ```typescript
  {
    url: string;  // 文件访问地址
  }
  ``` 