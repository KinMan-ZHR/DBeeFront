<template>
  <div class="deployment-list">
    <lay-card title="部署列表">
      <template #extra>
        <lay-button type="primary" @click="handleAdd">新增部署</lay-button>
      </template>
      
      <lay-form :model="searchForm" inline>
        <lay-form-item label="应用名称">
          <lay-select v-model="searchForm.appId" placeholder="请选择应用">
            <lay-option v-for="app in appOptions" :key="app.id" :label="app.name" :value="app.id" />
          </lay-select>
        </lay-form-item>
        <lay-form-item label="部署状态">
          <lay-select v-model="searchForm.status" placeholder="请选择状态">
            <lay-option label="成功" value="success" />
            <lay-option label="失败" value="failed" />
            <lay-option label="进行中" value="running" />
          </lay-select>
        </lay-form-item>
        <lay-form-item>
          <lay-button type="primary" @click="handleSearch">查询</lay-button>
          <lay-button @click="handleReset">重置</lay-button>
        </lay-form-item>
      </lay-form>

      <lay-table :columns="columns" :data-source="tableData" :loading="loading">
        <template #status="{ row }">
          <lay-tag :type="getStatusType(row.status)">
            {{ getStatusText(row.status) }}
          </lay-tag>
        </template>
        <template #action="{ row }">
          <lay-button type="primary" size="sm" @click="handleView(row)">查看</lay-button>
          <lay-button type="danger" size="sm" @click="handleDelete(row)">删除</lay-button>
        </template>
      </lay-table>

      <div class="pagination-container">
        <lay-pagination
          v-model:current="currentPage"
          v-model:limit="pageSize"
          :total="total"
          :show-total="true"
          @change="handlePageChange"
        />
      </div>
    </lay-card>

    <!-- 新增部署弹窗 -->
    <lay-layer v-model="showDialog" :title="dialogTitle" :area="['500px', '400px']">
      <lay-form :model="form" label-width="100px">
        <lay-form-item label="应用" required>
          <lay-select v-model="form.appId" placeholder="请选择应用">
            <lay-option v-for="app in appOptions" :key="app.id" :label="app.name" :value="app.id" />
          </lay-select>
        </lay-form-item>
        <lay-form-item label="部署环境" required>
          <lay-select v-model="form.env" placeholder="请选择环境">
            <lay-option label="开发环境" value="dev" />
            <lay-option label="测试环境" value="test" />
            <lay-option label="生产环境" value="prod" />
          </lay-select>
        </lay-form-item>
        <lay-form-item label="部署版本" required>
          <lay-input v-model="form.version" placeholder="请输入部署版本" />
        </lay-form-item>
        <lay-form-item label="部署说明">
          <lay-textarea v-model="form.description" placeholder="请输入部署说明" />
        </lay-form-item>
      </lay-form>
      <template #footer>
        <lay-button @click="showDialog = false">取消</lay-button>
        <lay-button type="primary" @click="handleSubmit">确定</lay-button>
      </template>
    </lay-layer>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
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

const searchForm = reactive({
  appId: '',
  status: ''
})

const formData = reactive({
  appId: undefined as number | undefined,
  version: '',
  env: '',
  description: ''
})

const loading = ref(false)
const showDialog = ref(false)
const dialogTitle = ref('新增部署')
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(0)
const tableData = ref<Deployment[]>([])
const appOptions = ref<App[]>([])

const columns = [
  { title: '应用名称', prop: 'appName' },
  { title: '部署环境', prop: 'env' },
  { title: '部署版本', prop: 'version' },
  { title: '部署状态', prop: 'status', slot: 'status' },
  { title: '部署时间', prop: 'deployTime' },
  { title: '操作', slot: 'action', width: 150 }
]

const getStatusType = (status: string) => {
  const types: Record<string, string> = {
    success: 'primary',
    failed: 'danger',
    running: 'warm'
  }
  return types[status] || 'normal'
}

const getStatusText = (status: string) => {
  const texts: Record<string, string> = {
    success: '成功',
    failed: '失败',
    running: '进行中'
  }
  return texts[status] || status
}

const handleAdd = () => {
  dialogTitle.value = '新增部署'
  Object.assign(formData, {
    appId: undefined,
    version: '',
    env: '',
    description: ''
  })
  showDialog.value = true
}

const handleView = async (row: Deployment) => {
  try {
    const logs = await getDeploymentLogs(row.id)
    // TODO: 显示日志详情
    console.log('部署日志:', logs)
  } catch (error) {
    console.error('获取部署日志失败:', error)
  }
}

const handleDelete = (row: Deployment) => {
  layer.confirm('确定要删除该部署记录吗？', {
    title: '提示'
  }, () => {
    // TODO: 调用删除API
    layer.msg('删除成功')
  })
}

const handleSearch = async () => {
  loading.value = true
  try {
    const res = await getDeploymentList({
      ...searchForm,
      page: currentPage.value,
      limit: pageSize.value
    })
    tableData.value = res.list
    total.value = res.total
  } catch (error) {
    console.error('获取部署列表失败:', error)
  } finally {
    loading.value = false
  }
}

const handleReset = () => {
  searchForm.appId = ''
  searchForm.status = ''
  handleSearch()
}

const handlePageChange = (page: number) => {
  currentPage.value = page
  handleSearch()
}

const handleSubmit = async () => {
  try {
    await createDeployment(formData)
    showDialog.value = false
    handleSearch()
  } catch (error) {
    console.error('创建部署失败:', error)
  }
}

const getAppListData = async () => {
  try {
    const res = await getAppList({
      page: 1,
      limit: 100
    })
    appOptions.value = res.list
  } catch (error) {
    console.error('获取应用列表失败:', error)
  }
}

onMounted(() => {
  getAppListData()
  handleSearch()
})
</script>

<style lang="scss" scoped>
.deployment-list {
  .pagination-container {
    margin-top: 15px;
    text-align: right;
  }
}
</style> 