<template>
  <div class="app-edit">
    <lay-card title="编辑应用">
      <lay-form :model="formData" :rules="rules" ref="formRef">
        <lay-form-item label="应用名称" prop="appName">
          <lay-input v-model="formData.appName" placeholder="请输入应用名称"></lay-input>
        </lay-form-item>
        
        <lay-form-item label="部署类型" prop="deployType">
          <lay-select v-model="formData.deployType" placeholder="请选择部署类型">
            <lay-select-option value="jar" label="JAR包"></lay-select-option>
            <lay-select-option value="docker" label="Docker"></lay-select-option>
            <lay-select-option value="k8s" label="Kubernetes"></lay-select-option>
          </lay-select>
        </lay-form-item>
        
        <lay-form-item label="应用描述" prop="description">
          <lay-textarea v-model="formData.description" placeholder="请输入应用描述"></lay-textarea>
        </lay-form-item>
        
        <lay-form-item>
          <lay-button type="primary" @click="handleSubmit">保存</lay-button>
          <lay-button @click="handleCancel">取消</lay-button>
        </lay-form-item>
      </lay-form>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import type { FormInstance } from '@layui/layui-vue'

const router = useRouter()
const route = useRoute()
const formRef = ref<FormInstance>()

interface AppFormData {
  id: number
  appName: string
  deployType: string
  description: string
}

const formData = reactive<AppFormData>({
  id: 0,
  appName: '',
  description: '',
  deployType: 'jar'
})

const rules = {
  appName: [
    { required: true, message: '请输入应用名称', trigger: 'blur' },
    { min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur' }
  ],
  deployType: [
    { required: true, message: '请选择部署类型', trigger: 'change' }
  ],
  description: [
    { max: 200, message: '长度不能超过 200 个字符', trigger: 'blur' }
  ]
}

onMounted(async () => {
  const id = Number(route.params.id)
  if (!id) {
    router.push('/app')
    return
  }
  
  formData.id = id
  // TODO: 调用获取应用详情API
  
  // 模拟数据
  formData.appName = '测试应用'
  formData.deployType = 'jar'
  formData.description = '这是一个测试应用'
})

const handleSubmit = async () => {
  if (!formRef.value) return
  
  try {
    await formRef.value.validate()
    console.log('表单数据：', formData)
    // TODO: 调用更新应用API
    router.push('/app')
  } catch (error) {
    console.error('表单验证失败:', error)
  }
}

const handleCancel = () => {
  router.back()
}
</script>

<style lang="scss" scoped>
.app-edit {
  padding: 20px;
}
</style> 