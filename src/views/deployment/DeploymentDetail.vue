<template>
  <div class="deployment-detail">
    <lay-card title="部署详情">
      <lay-descriptions :column="2" bordered>
        <lay-descriptions-item label="应用名称">{{ detail.appName }}</lay-descriptions-item>
        <lay-descriptions-item label="版本号">{{ detail.version }}</lay-descriptions-item>
        <lay-descriptions-item label="环境">
          <lay-tag :type="getEnvType(detail.env)">{{ getEnvText(detail.env) }}</lay-tag>
        </lay-descriptions-item>
        <lay-descriptions-item label="状态">
          <lay-tag :type="getStatusType(detail.status)">{{ getStatusText(detail.status) }}</lay-tag>
        </lay-descriptions-item>
        <lay-descriptions-item label="部署时间">{{ detail.deployTime }}</lay-descriptions-item>
        <lay-descriptions-item label="部署人">{{ detail.deployer }}</lay-descriptions-item>
        <lay-descriptions-item label="描述" :span="2">{{ detail.description }}</lay-descriptions-item>
      </lay-descriptions>
      
      <div class="log-section">
        <lay-title :title="'部署日志'" level="3"></lay-title>
        <lay-textarea
          v-model="logs"
          readonly
          :rows="10"
          placeholder="暂无日志"
        ></lay-textarea>
      </div>
      
      <div class="action-section">
        <lay-button v-if="detail.status === 'stopped'" @click="handleStartDeployment">启动部署</lay-button>
        <lay-button v-if="detail.status === 'running'" type="danger" @click="handleStopDeployment">停止部署</lay-button>
        <lay-button @click="handleBack">返回</lay-button>
      </div>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { startDeployment, stopDeployment } from '@/api/deployment'

const router = useRouter()
const route = useRoute()
const logs = ref('')

interface DeploymentDetail {
  id: number
  appId: number
  appName: string
  version: string
  env: string
  status: string
  deployTime: string
  deployer: string
  description: string
}

const detail = reactive<DeploymentDetail>({
  id: 0,
  appId: 0,
  appName: '',
  version: '',
  env: 'dev',
  description: '',
  deployTime: '',
  status: 'running',
  deployer: ''
})

// 获取环境类型
const getEnvType = (env: string) => {
  switch (env) {
    case 'dev':
      return 'normal'
    case 'test':
      return 'warm'
    case 'prod':
      return 'danger'
    default:
      return 'normal'
  }
}

// 获取环境文本
const getEnvText = (env: string) => {
  switch (env) {
    case 'dev':
      return '开发环境'
    case 'test':
      return '测试环境'
    case 'prod':
      return '生产环境'
    default:
      return env
  }
}

// 获取状态类型
const getStatusType = (status: string) => {
  switch (status) {
    case 'success':
      return 'primary'
    case 'failed':
      return 'danger'
    case 'running':
      return 'warm'
    default:
      return 'normal'
  }
}

// 获取状态文本
const getStatusText = (status: string) => {
  switch (status) {
    case 'success':
      return '成功'
    case 'failed':
      return '失败'
    case 'running':
      return '部署中'
    default:
      return '未知'
  }
}

onMounted(() => {
  const deploymentId = route.params.id
  
  // TODO: 调用API获取部署详情
  // 模拟数据
  Object.assign(detail, {
    id: deploymentId,
    appId: 1,
    appName: '测试应用',
    version: '1.0.0',
    env: 'dev',
    status: 'success',
    deployTime: '2023-03-31 10:00:00',
    deployer: '管理员',
    description: '这是一个测试部署'
  })
  
  // 模拟日志数据
  logs.value = '2023-03-31 10:00:00 [INFO] 开始部署\n2023-03-31 10:01:00 [INFO] 部署完成'
})

const handleBack = () => {
  router.back()
}

const handleStartDeployment = async () => {
  try {
    await startDeployment(detail.id)
    layer.msg('启动部署成功', { icon: 1 })
    detail.status = 'running'
  } catch (error) {
    console.error('启动部署失败:', error)
    layer.msg('启动部署失败，请稍后重试', { icon: 2 })
  }
}

const handleStopDeployment = async () => {
  try {
    await stopDeployment(detail.id)
    layer.msg('停止部署成功', { icon: 1 })
    detail.status = 'stopped'
  } catch (error) {
    console.error('停止部署失败:', error)
    layer.msg('停止部署失败，请稍后重试', { icon: 2 })
  }
}
</script>

<style lang="scss" scoped>
.deployment-detail {
  padding: 20px;
  
  .log-section {
    margin-top: 20px;
  }
  
  .action-section {
    margin-top: 20px;
    text-align: center;
  }
}
</style>