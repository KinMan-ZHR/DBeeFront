<template>
  <div class="app-list">
    <lay-card title="应用列表">
      <template #extra>
        <lay-button type="primary" @click="handleAdd">新增应用</lay-button>
      </template>
      
      <lay-form :model="searchForm" inline>
        <lay-form-item label="应用名称">
          <lay-input v-model="searchForm.name" placeholder="请输入应用名称" />
        </lay-form-item>
        <lay-form-item label="应用类型">
          <lay-select v-model="searchForm.type" placeholder="请选择应用类型">
            <lay-option label="Java" value="java" />
            <lay-option label="Python" value="python" />
            <lay-option label="Node.js" value="nodejs" />
            <lay-option label="Go" value="go" />
          </lay-select>
        </lay-form-item>
        <lay-form-item>
          <lay-button type="primary" @click="handleSearch">查询</lay-button>
          <lay-button @click="handleReset">重置</lay-button>
        </lay-form-item>
      </lay-form>

      <lay-table :columns="columns" :data-source="tableData" :loading="loading">
        <template #status="{ row }">
          <lay-tag :type="row.status === 'running' ? 'success' : 'warning'">
            {{ row.status === 'running' ? '运行中' : '已停止' }}
          </lay-tag>
        </template>
        <template #action="{ row }">
          <lay-button type="primary" size="sm" @click="handleEdit(row)">编辑</lay-button>
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

    <!-- 新增/编辑应用弹窗 -->
    <lay-layer v-model="showDialog" :title="dialogTitle" :area="['500px', '400px']">
      <lay-form :model="form" label-width="100px">
        <lay-form-item label="应用名称" required>
          <lay-input v-model="form.name" placeholder="请输入应用名称" />
        </lay-form-item>
        <lay-form-item label="应用类型" required>
          <lay-select v-model="form.type" placeholder="请选择应用类型">
            <lay-option label="Java" value="java" />
            <lay-option label="Python" value="python" />
            <lay-option label="Node.js" value="nodejs" />
            <lay-option label="Go" value="go" />
          </lay-select>
        </lay-form-item>
        <lay-form-item label="应用描述">
          <lay-textarea v-model="form.description" placeholder="请输入应用描述" />
        </lay-form-item>
        <lay-form-item label="Git仓库" required>
          <lay-input v-model="form.gitUrl" placeholder="请输入Git仓库地址" />
        </lay-form-item>
        <lay-form-item label="分支" required>
          <lay-input v-model="form.branch" placeholder="请输入分支名称" />
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
import { ref, reactive } from 'vue'
import { layer } from '@layui/layui-vue'

// 搜索表单
const searchForm = reactive({
  name: '',
  type: ''
})

// 表格列配置
const columns = [
  { title: '应用名称', prop: 'name' },
  { title: '应用类型', prop: 'type' },
  { title: '状态', prop: 'status', slot: 'status' },
  { title: '创建时间', prop: 'createTime' },
  { title: '操作', slot: 'action', width: 150 }
]

// 表格数据
const tableData = ref([
  {
    id: 1,
    name: '示例应用',
    type: 'Java',
    status: 'running',
    createTime: '2024-03-20 10:00:00'
  }
])

// 分页相关
const currentPage = ref(1)
const pageSize = ref(10)
const total = ref(100)
const loading = ref(false)

// 弹窗相关
const showDialog = ref(false)
const dialogTitle = ref('新增应用')
const form = reactive({
  name: '',
  type: '',
  description: '',
  gitUrl: '',
  branch: ''
})

// 查询
const handleSearch = () => {
  loading.value = true
  // TODO: 调用API获取数据
  setTimeout(() => {
    loading.value = false
  }, 1000)
}

// 重置
const handleReset = () => {
  searchForm.name = ''
  searchForm.type = ''
  handleSearch()
}

// 新增应用
const handleAdd = () => {
  dialogTitle.value = '新增应用'
  Object.assign(form, {
    name: '',
    type: '',
    description: '',
    gitUrl: '',
    branch: ''
  })
  showDialog.value = true
}

// 编辑应用
const handleEdit = (row: any) => {
  dialogTitle.value = '编辑应用'
  Object.assign(form, row)
  showDialog.value = true
}

// 删除应用
const handleDelete = (row: any) => {
  layer.confirm('确定要删除该应用吗？', {
    title: '提示'
  }, () => {
    // TODO: 调用删除API
    layer.msg('删除成功')
  })
}

// 提交表单
const handleSubmit = () => {
  // TODO: 调用保存API
  showDialog.value = false
  layer.msg('保存成功')
}

// 分页变化
const handlePageChange = (page: number) => {
  currentPage.value = page
  handleSearch()
}
</script>

<style lang="scss" scoped>
.app-list {
  .pagination-container {
    margin-top: 15px;
    text-align: right;
  }
}
</style> 