<template>
  <div class="home">
    <lay-card title="系统概览">
      <template #extra>
        <lay-button type="primary" size="sm">刷新</lay-button>
      </template>
      <div class="overview">
        <div class="overview-item">
          <div class="item-title">应用总数</div>
          <div class="item-value">0</div>
        </div>
        <div class="overview-item">
          <div class="item-title">运行中</div>
          <div class="item-value">0</div>
        </div>
        <div class="overview-item">
          <div class="item-title">部署次数</div>
          <div class="item-value">0</div>
        </div>
        <div class="overview-item">
          <div class="item-title">成功部署</div>
          <div class="item-value">0</div>
        </div>
      </div>
    </lay-card>

    <lay-card title="最近活动" class="mt-4">
      <lay-table :columns="columns" :data-source="activityData" :loading="loading">
        <template #status="{ row }">
          <lay-tag :type="row.status === 'success' ? 'primary' : 'danger'">
            {{ row.status === 'success' ? '成功' : '失败' }}
          </lay-tag>
        </template>
      </lay-table>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const loading = ref(true)
const columns = ref([
  { title: '时间', prop: 'time', width: 180 },
  { title: '类型', prop: 'type', width: 120 },
  { title: '内容', prop: 'content' },
  { title: '状态', prop: 'status', width: 100, slot: 'status' }
])

const activityData = ref<{time: string; type: string; content: string; status: string}[]>([])

onMounted(() => {
  // 模拟加载数据
  setTimeout(() => {
    /* 
    // 取消注释以显示测试数据
    activityData.value = [
      { time: '2023-03-31 10:00:00', type: '部署', content: '应用1部署成功', status: 'success' },
      { time: '2023-03-31 09:30:00', type: '创建', content: '创建应用1', status: 'success' },
      { time: '2023-03-30 11:20:00', type: '部署', content: '应用2部署失败', status: 'failed' }
    ]
    */
    loading.value = false
  }, 1000)
})
</script>

<style lang="scss" scoped>
.home {
  padding: 20px;

  .overview {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;

    .overview-item {
      text-align: center;
      padding: 20px;
      background-color: #f8f8f8;
      border-radius: 4px;
      width: 200px;

      .item-title {
        font-size: 14px;
        color: #666;
        margin-bottom: 10px;
      }

      .item-value {
        font-size: 24px;
        font-weight: bold;
        color: #333;
      }
    }
  }
}
</style> 