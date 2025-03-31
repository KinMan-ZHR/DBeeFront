<template>
  <div class="deployment-create">
    <lay-card title="新建部署">
      <lay-form :model="formData" :rules="rules" ref="formRef">
        <lay-form-item label="应用" prop="appId">
          <lay-select v-model="formData.appId" placeholder="请选择应用">
            <lay-select-option
              v-for="app in appOptions"
              :key="app.id"
              :value="app.id"
              :label="app.appName"
            ></lay-select-option>
          </lay-select>
        </lay-form-item>
        
        <lay-form-item label="版本号" prop="version">
          <lay-input v-model="formData.version" placeholder="请输入版本号"></lay-input>
        </lay-form-item>
        
        <lay-form-item label="环境" prop="env">
          <lay-select v-model="formData.env" placeholder="请选择环境">
            <lay-select-option value="dev" label="开发环境"></lay-select-option>
            <lay-select-option value="test" label="测试环境"></lay-select-option>
            <lay-select-option value="prod" label="生产环境"></lay-select-option>
          </lay-select>
        </lay-form-item>
        
        <lay-form-item label="描述" prop="description">
          <lay-textarea v-model="formData.description" placeholder="请输入部署描述"></lay-textarea>
        </lay-form-item>
        
        <lay-form-item>
          <lay-button type="primary" @click="handleSubmit">提交</lay-button>
          <lay-button @click="handleCancel">取消</lay-button>
        </lay-form-item>
      </lay-form>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance } from '@layui/layui-vue'

const router = useRouter()
const formRef = ref<FormInstance>()

interface App {
  id: number
  appName: string
}

interface DeploymentFormData {
  appId: number
  version: string
  env: string
  description: string
}

const appOptions = ref<App[]>([])

const formData = reactive<DeploymentFormData>({
  appId: 0,
  version: '',
  env: 'dev',
  description: ''
})

const rules = {
  appId: [
    { required: true, message: '请选择应用', trigger: 'change' }
  ],
  version: [
    { required: true, message: '请输入版本号', trigger: 'blur' },
    { pattern: /^\d+\.\d+\.\d+$/, message: '版本号格式为 x.y.z', trigger: 'blur' }
  ],
  env: [
    { required: true, message: '请选择环境', trigger: 'change' }
  ],
  description: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ]
}

onMounted(() => {
  // TODO: 调用获取应用列表API
  
  // 模拟数据
  appOptions.value = [
    { id: 1, appName: '应用1' },
    { id: 2, appName: '应用2' },
    { id: 3, appName: '应用3' }
  ]
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    console.log('表单数据：', formData)
    // TODO: 调用创建部署API
    router.push('/deployment')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.deployment-create {
  padding: 20px;
}
</style> 