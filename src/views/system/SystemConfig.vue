<template>
  <div class="system-config">
    <lay-card title="系统设置">
      <lay-tabs v-model="activeName">
        <!-- 基本设置 -->
        <lay-tab-item title="基本设置" id="basic">
          <lay-form :model="basicForm" ref="basicFormRef" :label-width="120">
            <lay-form-item label="系统名称">
              <lay-input v-model="basicForm.systemName" placeholder="请输入系统名称"></lay-input>
            </lay-form-item>
            <lay-form-item label="系统Logo">
              <lay-upload
                accept="image/*"
                :auto-upload="true"
                :limit="1"
                :headers="{ Authorization: 'Bearer token' }"
                action="/api/system/upload"
                @done="handleUploadDone"
              >
                <template #default>
                  <div class="upload-btn">
                    <lay-icon type="layui-icon-upload"></lay-icon>
                    <span>上传图片</span>
                  </div>
                </template>
              </lay-upload>
              <div class="logo-preview" v-if="basicForm.logoUrl">
                <img :src="basicForm.logoUrl" alt="系统Logo" />
                <lay-button size="sm" type="danger" @click="handleRemoveLogo">移除</lay-button>
              </div>
            </lay-form-item>
            <lay-form-item label="超时时间(分钟)">
              <lay-input-number v-model="basicForm.sessionTimeout" :min="5" :max="120"></lay-input-number>
            </lay-form-item>
            <lay-form-item label="系统描述">
              <lay-textarea v-model="basicForm.description" placeholder="请输入系统描述"></lay-textarea>
            </lay-form-item>
            <lay-form-item label="禁用注册">
              <lay-switch v-model="basicForm.disableRegister"></lay-switch>
            </lay-form-item>
            <lay-form-item>
              <lay-button type="primary" @click="saveBasicSettings">保存配置</lay-button>
              <lay-button @click="resetBasicSettings">重置</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-tab-item>
        
        <!-- 邮件设置 -->
        <lay-tab-item title="邮件设置" id="email">
          <lay-form :model="emailForm" ref="emailFormRef" :label-width="120">
            <lay-form-item label="SMTP服务器">
              <lay-input v-model="emailForm.smtpServer" placeholder="请输入SMTP服务器地址"></lay-input>
            </lay-form-item>
            <lay-form-item label="SMTP端口">
              <lay-input-number v-model="emailForm.smtpPort" :min="1" :max="65535"></lay-input-number>
            </lay-form-item>
            <lay-form-item label="发件人邮箱">
              <lay-input v-model="emailForm.senderEmail" placeholder="请输入发件人邮箱"></lay-input>
            </lay-form-item>
            <lay-form-item label="发件人名称">
              <lay-input v-model="emailForm.senderName" placeholder="请输入发件人名称"></lay-input>
            </lay-form-item>
            <lay-form-item label="邮箱密码">
              <lay-input v-model="emailForm.password" type="password" placeholder="请输入邮箱密码"></lay-input>
            </lay-form-item>
            <lay-form-item label="启用SSL">
              <lay-switch v-model="emailForm.enableSsl"></lay-switch>
            </lay-form-item>
            <lay-form-item>
              <lay-button type="primary" @click="saveEmailSettings">保存配置</lay-button>
              <lay-button @click="resetEmailSettings">重置</lay-button>
              <lay-button type="warm" @click="testEmailSettings">测试连接</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-tab-item>
        
        <!-- 告警设置 -->
        <lay-tab-item title="告警设置" id="alert">
          <lay-form :model="alertForm" ref="alertFormRef" :label-width="120">
            <lay-form-item label="启用告警">
              <lay-switch v-model="alertForm.enableAlert"></lay-switch>
            </lay-form-item>
            <lay-form-item label="告警方式">
              <lay-checkbox-group v-model="alertForm.alertMethods">
                <lay-checkbox value="email" label="邮件"></lay-checkbox>
                <lay-checkbox value="sms" label="短信"></lay-checkbox>
                <lay-checkbox value="webhook" label="Webhook"></lay-checkbox>
              </lay-checkbox-group>
            </lay-form-item>
            <lay-form-item label="Webhook地址" v-if="alertForm.alertMethods.includes('webhook')">
              <lay-input v-model="alertForm.webhookUrl" placeholder="请输入Webhook地址"></lay-input>
            </lay-form-item>
            <lay-form-item label="告警接收人">
              <lay-select 
                v-model="alertForm.receivers" 
                multiple 
                placeholder="请选择接收人"
              >
                <lay-select-option value="admin" label="管理员"></lay-select-option>
                <lay-select-option value="op" label="运维人员"></lay-select-option>
                <lay-select-option value="dev" label="开发人员"></lay-select-option>
              </lay-select>
            </lay-form-item>
            <lay-form-item label="告警触发条件">
              <lay-checkbox-group v-model="alertForm.triggerEvents">
                <lay-checkbox value="deploymentFailed" label="部署失败"></lay-checkbox>
                <lay-checkbox value="highCpuUsage" label="CPU使用率过高"></lay-checkbox>
                <lay-checkbox value="highMemoryUsage" label="内存使用率过高"></lay-checkbox>
                <lay-checkbox value="serviceUnavailable" label="服务不可用"></lay-checkbox>
              </lay-checkbox-group>
            </lay-form-item>
            <lay-form-item>
              <lay-button type="primary" @click="saveAlertSettings">保存配置</lay-button>
              <lay-button @click="resetAlertSettings">重置</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-tab-item>
        
        <!-- 集群设置 -->
        <lay-tab-item title="集群设置" id="cluster">
          <lay-empty description="敬请期待..."></lay-empty>
        </lay-tab-item>
      </lay-tabs>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import type { FormInstance } from '@layui/layui-vue'

const activeName = ref('basic')
const basicFormRef = ref<FormInstance>()
const emailFormRef = ref<FormInstance>()
const alertFormRef = ref<FormInstance>()

// 基本设置表单
const basicForm = reactive({
  systemName: 'DBee应用部署平台',
  logoUrl: 'https://img.icons8.com/color/48/000000/bee.png',
  sessionTimeout: 30,
  description: '一个简单易用的应用部署和管理平台',
  disableRegister: false
})

// 邮件设置表单
const emailForm = reactive({
  smtpServer: 'smtp.example.com',
  smtpPort: 465,
  senderEmail: 'notification@example.com',
  senderName: 'DBee系统',
  password: '',
  enableSsl: true
})

// 告警设置表单
const alertForm = reactive({
  enableAlert: false,
  alertMethods: ['email'],
  webhookUrl: '',
  receivers: ['admin'],
  triggerEvents: ['deploymentFailed', 'serviceUnavailable']
})

// 保存基本设置
const saveBasicSettings = () => {
  // 模拟API请求
  setTimeout(() => {
    window.layer.msg('基本设置保存成功', { icon: 1 })
  }, 500)
}

// 重置基本设置
const resetBasicSettings = () => {
  basicFormRef.value?.resetFields()
}

// 处理Logo上传完成
const handleUploadDone = (res: any) => {
  if (res.success) {
    basicForm.logoUrl = res.data.url
    window.layer.msg('上传成功', { icon: 1 })
  } else {
    window.layer.msg('上传失败: ' + res.message, { icon: 2 })
  }
}

// 移除Logo
const handleRemoveLogo = () => {
  basicForm.logoUrl = ''
}

// 保存邮件设置
const saveEmailSettings = () => {
  // 模拟API请求
  setTimeout(() => {
    window.layer.msg('邮件设置保存成功', { icon: 1 })
  }, 500)
}

// 重置邮件设置
const resetEmailSettings = () => {
  emailFormRef.value?.resetFields()
}

// 测试邮件设置
const testEmailSettings = () => {
  // 模拟API请求
  window.layer.load(2)
  setTimeout(() => {
    window.layer.closeAll('loading')
    window.layer.msg('邮件测试成功，请查收测试邮件', { icon: 1 })
  }, 1500)
}

// 保存告警设置
const saveAlertSettings = () => {
  // 模拟API请求
  setTimeout(() => {
    window.layer.msg('告警设置保存成功', { icon: 1 })
  }, 500)
}

// 重置告警设置
const resetAlertSettings = () => {
  alertFormRef.value?.resetFields()
}

// 获取系统配置
const fetchSystemConfig = () => {
  // 模拟API请求，实际项目中应该调用真实的API
  console.log('获取系统配置')
}

onMounted(() => {
  fetchSystemConfig()
})
</script>

<style scoped>
.upload-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 120px;
  height: 120px;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  background-color: #fafafa;
  cursor: pointer;
  
  &:hover {
    border-color: #1890ff;
  }
  
  i {
    font-size: 32px;
    margin-bottom: 8px;
  }
}

.logo-preview {
  margin-top: 16px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  
  img {
    width: 120px;
    height: 120px;
    object-fit: contain;
    border: 1px solid #e5e5e5;
    border-radius: 4px;
    margin-bottom: 8px;
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