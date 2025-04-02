<template>
  <div class="deployment-list">
    <lay-card title="部署管理">
      <!-- 搜索表单 -->
      <div class="search-form">
        <lay-form :model="searchForm" ref="searchFormRef">
          <lay-row :space="16">
            <lay-col :md="6" :sm="12" :xs="24">
              <lay-form-item label="应用名称">
                <lay-input v-model="searchForm.appName" placeholder="请输入应用名称"></lay-input>
              </lay-form-item>
            </lay-col>
            <lay-col :md="6" :sm="12" :xs="24">
              <lay-form-item label="环境">
                <lay-select v-model="searchForm.env" placeholder="请选择环境">
                  <lay-select-option value="" label="全部"></lay-select-option>
                  <lay-select-option value="dev" label="开发环境"></lay-select-option>
                  <lay-select-option value="test" label="测试环境"></lay-select-option>
                  <lay-select-option value="prod" label="生产环境"></lay-select-option>
                </lay-select>
              </lay-form-item>
            </lay-col>
            <lay-col :md="6" :sm="12" :xs="24">
              <lay-form-item label="状态">
                <lay-select v-model="searchForm.status" placeholder="请选择状态">
                  <lay-select-option value="" label="全部"></lay-select-option>
                  <lay-select-option value="running" label="运行中"></lay-select-option>
                  <lay-select-option value="failed" label="已失败"></lay-select-option>
                  <lay-select-option value="success" label="已完成"></lay-select-option>
                </lay-select>
              </lay-form-item>
            </lay-col>
            <lay-col :md="6" :sm="24" :xs="24">
              <lay-form-item>
                <lay-button type="primary" @click="handleSearch">查询</lay-button>
                <lay-button @click="handleReset">重置</lay-button>
                <lay-button type="primary" @click="handleCreate">新建部署</lay-button>
              </lay-form-item>
            </lay-col>
          </lay-row>
        </lay-form>
      </div>

      <!-- 数据表格 -->
      <lay-table :columns="columns" :data-source="tableData" :loading="loading" :page="page"
        @page-change="handlePageChange">
        <!-- 环境类型 -->
        <template #env="{ row }">
          <lay-tag :type="getEnvType(row.env)">{{ getEnvName(row.env) }}</lay-tag>
        </template>

        <!-- 状态 -->
        <template #status="{ row }">
          <lay-tag :type="getStatusType(row.status)">{{ getStatusName(row.status) }}</lay-tag>
        </template>

        <!-- 操作 -->
        <template #action="{ row }">
          <lay-button size="sm" type="primary" @click="viewDetail(row.id)">详情</lay-button>
          <lay-button size="sm" type="primary" v-if="row.status === 'running'"
            @click="stopDeployment(row.id)">停止</lay-button>
          <lay-button size="sm" type="danger" @click="deleteDeployment(row.id)">删除</lay-button>
          <lay-button size="sm" type="primary" v-if="row.status === 'success'"
            @click="scaleReplicas(row.id)">伸缩</lay-button>
          <lay-button size="sm" type="primary" v-if="row.status === 'success'"
            @click="viewMonitor(row.id)">监控</lay-button>
        </template>

        <!-- 空数据模板 -->
        <template #empty>
          <div class="empty-data">
            <img src="https://img.icons8.com/color/48/000000/box-important--v1.png" alt="暂无数据" />
            <p>暂无部署数据</p>
          </div>
        </template>
      </lay-table>
    </lay-card>

    <!-- 伸缩实例弹窗 -->
    <lay-layer v-model="scaleVisible" :title="'伸缩实例 - ' + currentDeployment.appName" :area="['500px', '300px']">
      <div class="scale-form">
        <lay-form :model="scaleForm" ref="scaleFormRef">
          <lay-form-item label="当前实例数">
            <lay-input v-model="scaleForm.currentReplicas" disabled></lay-input>
          </lay-form-item>
          <lay-form-item label="目标实例数">
            <lay-input-number v-model="scaleForm.targetReplicas" :min="1" :max="10"></lay-input-number>
          </lay-form-item>
          <lay-form-item>
            <lay-button type="primary" @click="confirmScale">确认</lay-button>
            <lay-button @click="scaleVisible = false">取消</lay-button>
          </lay-form-item>
        </lay-form>
      </div>
    </lay-layer>

    <!-- 监控弹窗 -->
    <lay-layer v-model="monitorVisible" :title="'应用监控 - ' + currentDeployment.appName" :area="['800px', '500px']">
      <div class="monitor-tabs">
        <lay-tab v-model="activeMonitorTab">
          <lay-tab-item title="CPU使用率" id="cpu">
            <div class="chart-container">
              <img src="https://img.icons8.com/color/96/000000/line-chart--v1.png" class="chart-placeholder" />
              <p class="chart-text">CPU使用率历史数据</p>
            </div>
          </lay-tab-item>
          <lay-tab-item title="内存使用率" id="memory">
            <div class="chart-container">
              <img src="https://img.icons8.com/color/96/000000/line-chart--v1.png" class="chart-placeholder" />
              <p class="chart-text">内存使用率历史数据</p>
            </div>
          </lay-tab-item>
          <lay-tab-item title="网络流量" id="network">
            <div class="chart-container">
              <img src="https://img.icons8.com/color/96/000000/line-chart--v1.png" class="chart-placeholder" />
              <p class="chart-text">网络流量历史数据</p>
            </div>
          </lay-tab-item>
        </lay-tab>
      </div>
    </lay-layer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from '@layui/layui-vue'
import type { Deployment, App } from '@/types/api'
import { getAppList } from '@/api/app'
import {
  getDeploymentList,
  createDeployment,
  cancelDeployment,
  rollbackDeployment,
  getDeploymentLogs
} from '@/api/deployment'
import { layer } from '@layui/layui-vue'

// 添加 PageResult 类型导入
import type { PageResult } from '@/types/api'
const router = useRouter()
const loading = ref(false)
const tableData = ref<any[]>([])
const searchFormRef = ref<FormInstance>()
const scaleFormRef = ref<FormInstance>()
const scaleVisible = ref(false)
const monitorVisible = ref(false)
const activeMonitorTab = ref('cpu')
const currentDeployment = ref<any>({})

// 分页配置
const page = reactive({
  current: 1,
  limit: 10,
  total: 0
})

// 搜索表单
const searchForm = reactive({
  appName: '',
  env: '',
  status: ''
})

// 伸缩表单
const scaleForm = reactive({
  currentReplicas: 1,
  targetReplicas: 1
})

// 表格列定义
const columns = [
  { title: 'ID', prop: 'id', width: 80 },
  { title: '应用名称', prop: 'appName', width: 120 },
  { title: '环境', prop: 'env', slot: 'env', width: 100 },
  { title: '状态', prop: 'status', slot: 'status', width: 100 },
  { title: '版本号', prop: 'version', width: 100 },
  { title: '实例数', prop: 'replicas', width: 80 },
  { title: '创建人', prop: 'creator', width: 100 },
  { title: '创建时间', prop: 'createTime', width: 160 },
  { title: '操作', slot: 'action', width: 320 }
]

const appOptions = ref<App[]>([])

const getEnvType = (env: string) => {
  switch (env) {
    case 'dev':
      return 'primary'
    case 'test':
      return 'normal'
    case 'prod':
      return 'danger'
    default:
      return 'primary'
  }
}

const getEnvName = (env: string) => {
  switch (env) {
    case 'dev':
      return '开发环境'
    case 'test':
      return '测试环境'
    case 'prod':
      return '生产环境'
    default:
      return '未知环境'
  }
}

const getStatusType = (status: string) => {
  switch (status) {
    case 'running':
      return 'warm'
    case 'success':
      return 'primary'
    case 'failed':
      return 'danger'
    default:
      return 'normal'
  }
}

const getStatusName = (status: string) => {
  switch (status) {
    case 'running':
      return '运行中'
    case 'success':
      return '已完成'
    case 'failed':
      return '已失败'
    default:
      return '未知状态'
  }
}

const fetchDeployments = () => {
  loading.value = true
  // 模拟异步请求
  setTimeout(() => {
    const mockData = []
    for (let i = 1; i <= 15; i++) {
      const env = ['dev', 'test', 'prod'][Math.floor(Math.random() * 3)]
      const status = ['running', 'success', 'failed'][Math.floor(Math.random() * 3)]
      mockData.push({
        id: i,
        appName: `应用${i}`,
        env,
        status,
        version: `v1.${i}.0`,
        replicas: Math.floor(Math.random() * 5) + 1,
        creator: '管理员',
        createTime: '2023-03-31 10:00:00'
      })
    }

    // 模拟筛选
    let result = [...mockData]
    if (searchForm.appName) {
      result = result.filter(item => item.appName.includes(searchForm.appName))
    }
    if (searchForm.env) {
      result = result.filter(item => item.env === searchForm.env)
    }
    if (searchForm.status) {
      result = result.filter(item => item.status === searchForm.status)
    }

    // 模拟分页
    page.total = result.length
    const start = (page.current - 1) * page.limit
    const end = start + page.limit
    tableData.value = result.slice(start, end)
    loading.value = false
  }, 500)
}

const handleSearch = () => {
  page.current = 1
  fetchDeployments()
}

const handleReset = () => {
  searchFormRef.value?.resetFields()
  page.current = 1
  fetchDeployments()
}

const handleCreate = () => {
  router.push('/deployment/create')
}

const handlePageChange = (current: number) => {
  page.current = current
  fetchDeployments()
}

const viewDetail = (id: number) => {
  router.push(`/deployment/detail/${id}`)
}

const stopDeployment = (id: number) => {
  // 模拟停止部署
  console.log('停止部署:', id)
  layer.msg('停止部署成功', { icon: 1 })
  fetchDeployments()
}

const deleteDeployment = (id: number) => {
  // 模拟删除部署
  layer.confirm('确定要删除此部署吗？',
    {
      btn: [
        {
          text: '确定', callback: function () {
            console.log('删除部署:', id)
            layer.msg('删除部署成功', { icon: 1 })
            fetchDeployments()
          }
        },
        {
          text: '取消',
          callback: function () {
            layer.msg('已取消删除', { icon: 2 })
          }
        }
      ]
    }
  )
}

const scaleReplicas = (id: number) => {
  // 找到当前部署
  const deployment = tableData.value.find(item => item.id === id)
  if (deployment) {
    currentDeployment.value = deployment
    scaleForm.currentReplicas = deployment.replicas
    scaleForm.targetReplicas = deployment.replicas
    scaleVisible.value = true
  }
}

const confirmScale = () => {
  // 模拟伸缩操作
  console.log('伸缩实例:', currentDeployment.value.id, scaleForm.targetReplicas)
  layer.msg('伸缩实例成功', { icon: 1 })
  scaleVisible.value = false
  fetchDeployments()
}

const viewMonitor = (id: number) => {
  // 找到当前部署
  const deployment = tableData.value.find(item => item.id === id)
  if (deployment) {
    currentDeployment.value = deployment
    monitorVisible.value = true
  }
}

const getAppListData = async () => {
  try {
    const res = await getAppList({
      page: 1,
      limit: 100
    })
    // 添加空值校验（防御性编程）
    if (res?.data?.list) {
      appOptions.value = res.data.list
    } else {
      console.warn('获取到的应用列表数据格式异常')
      layer.msg('数据加载异常，请稍后重试')
    }
  } catch (error) {
    console.error('获取应用列表失败:', error)
    // 增强错误处理（用户体验）
    layer.msg('获取应用列表失败，请检查网络连接', { icon: 2 })
  }
}

onMounted(() => {
  getAppListData()
  fetchDeployments()
})
</script>

<style lang="scss" scoped>
.deployment-list {
  .pagination-container {
    margin-top: 15px;
    text-align: right;
  }
}

.search-form {
  margin-bottom: 20px;
}

.empty-data {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;

  img {
    width: 60px;
    height: 60px;
    margin-bottom: 16px;
  }

  p {
    color: #999;
    font-size: 14px;
  }
}

.scale-form {
  padding: 20px;
}

.chart-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;

  .chart-placeholder {
    width: 96px;
    height: 96px;
    margin-bottom: 16px;
  }

  .chart-text {
    color: #666;
    font-size: 14px;
  }
}
</style>

<script lang="ts">
// 扩展 Window 接口，添加 layer 属性
declare global {
  interface Window {
    layer: any
  }
}
</script>