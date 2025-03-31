# DBee

DBee 是一个简单易用的云应用管理平台，基于 Vue 3 + TypeScript + Layui Vue 开发。

## 功能特点

- 应用管理：支持应用的创建、编辑、删除等操作
- 部署管理：支持应用的部署、回滚、查看部署历史等操作
- 系统配置：支持系统基本配置、邮件配置、通知配置等
- 响应式设计：支持移动端访问
- 现代化UI：基于 Layui Vue 的现代化界面设计

## 技术栈

- Vue 3
- TypeScript
- Layui Vue
- Vite
- Vue Router
- Pinia
- SCSS
- Axios

## 开发环境要求

- Node.js >= 16
- npm >= 7

## 安装和运行

1. 安装依赖：

```bash
npm install
```

2. 启动开发服务器：

```bash
npm run dev
```

3. 构建生产版本：

```bash
npm run build
```

4. 预览生产版本：

```bash
npm run preview
```

## 项目结构

```
dbee-vue/
├── src/
│   ├── assets/        # 静态资源
│   ├── components/    # 公共组件
│   ├── views/         # 页面组件
│   ├── router/        # 路由配置
│   ├── store/         # 状态管理
│   ├── utils/         # 工具函数
│   ├── App.vue        # 根组件
│   └── main.ts        # 入口文件
├── public/            # 公共资源
├── index.html         # HTML 模板
├── package.json       # 项目配置
├── tsconfig.json      # TypeScript 配置
├── vite.config.ts     # Vite 配置
└── README.md          # 项目说明
```

## 开发规范

- 使用 TypeScript 进行开发
- 使用 Composition API 和 `<script setup>` 语法
- 使用 SCSS 进行样式开发
- 遵循 Vue 3 官方风格指南

## 贡献指南

1. Fork 本仓库
2. 创建特性分支
3. 提交代码
4. 创建 Pull Request

## 许可证

MIT 