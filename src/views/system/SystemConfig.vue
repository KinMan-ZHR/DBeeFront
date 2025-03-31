<template>
  <div class="system-config">
    <lay-card title="系统设置">
      <lay-tabs v-model="activeTab">
        <!-- 基本设置 -->
        <lay-tab-pane title="基本设置" name="basic">
          <lay-form :model="basicConfig" label-width="120px">
            <lay-form-item label="系统名称">
              <lay-input v-model="basicConfig.systemName" placeholder="请输入系统名称" />
            </lay-form-item>
            <lay-form-item label="系统Logo">
              <lay-upload
                v-model="basicConfig.logo"
                :action="uploadUrl"
                :headers="uploadHeaders"
                accept="image/*"
              >
                <template #trigger>
                  <lay-button type="primary">上传Logo</lay-button>
                </template>
              </lay-upload>
            </lay-form-item>
            <lay-form-item label="系统描述">
              <lay-textarea v-model="basicConfig.description" placeholder="请输入系统描述" />
            </lay-form-item>
            <lay-form-item>
              <lay-button type="primary" @click="handleSaveBasic">保存设置</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-tab-pane>

        <!-- 邮件设置 -->
        <lay-tab-pane title="邮件设置" name="email">
          <lay-form :model="emailConfig" label-width="120px">
            <lay-form-item label="SMTP服务器">
              <lay-input v-model="emailConfig.smtpServer" placeholder="请输入SMTP服务器地址" />
            </lay-form-item>
            <lay-form-item label="SMTP端口">
              <lay-input-number v-model="emailConfig.smtpPort" :min="1" :max="65535" />
            </lay-form-item>
            <lay-form-item label="发件人邮箱">
              <lay-input v-model="emailConfig.senderEmail" placeholder="请输入发件人邮箱" />
            </lay-form-item>
            <lay-form-item label="邮箱密码">
              <lay-input v-model="emailConfig.emailPassword" type="password" placeholder="请输入邮箱密码" />
            </lay-form-item>
            <lay-form-item label="SSL加密">
              <lay-switch v-model="emailConfig.useSsl" />
            </lay-form-item>
            <lay-form-item>
              <lay-button type="primary" @click="handleSaveEmail">保存设置</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-tab-pane>

        <!-- 通知设置 -->
        <lay-tab-pane title="通知设置" name="notification">
          <lay-form :model="notificationConfig" label-width="120px">
            <lay-form-item label="部署通知">
              <lay-switch v-model="notificationConfig.deployNotify" />
            </lay-form-item>
            <lay-form-item label="告警通知">
              <lay-switch v-model="notificationConfig.alertNotify" />
            </lay-form-item>
            <lay-form-item label="通知方式">
              <lay-checkbox-group v-model="notificationConfig.notifyMethods">
                <lay-checkbox value="email">邮件通知</lay-checkbox>
                <lay-checkbox value="webhook">Webhook通知</lay-checkbox>
              </lay-checkbox-group>
            </lay-form-item>
            <lay-form-item label="Webhook地址" v-if="notificationConfig.notifyMethods.includes('webhook')">
              <lay-input v-model="notificationConfig.webhookUrl" placeholder="请输入Webhook地址" />
            </lay-form-item>
            <lay-form-item>
              <lay-button type="primary" @click="handleSaveNotification">保存设置</lay-button>
            </lay-form-item>
          </lay-form>
        </lay-tab-pane>
      </lay-tabs>
    </lay-card>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { layer } from '@layui/layui-vue'

// 当前激活的标签页
const activeTab = ref('basic')

// 基本设置
const basicConfig = reactive({
  systemName: 'DBee',
  logo: '',
  description: '云应用管理平台'
})

// 邮件设置
const emailConfig = reactive({
  smtpServer: '',
  smtpPort: 465,
  senderEmail: '',
  emailPassword: '',
  useSsl: true
})

// 通知设置
const notificationConfig = reactive({
  deployNotify: true,
  alertNotify: true,
  notifyMethods: ['email'],
  webhookUrl: ''
})

// 上传相关配置
const uploadUrl = '/api/upload'
const uploadHeaders = {
  // TODO: 添加认证信息
}

// 保存基本设置
const handleSaveBasic = () => {
  // TODO: 调用保存API
  layer.msg('保存成功')
}

// 保存邮件设置
const handleSaveEmail = () => {
  // TODO: 调用保存API
  layer.msg('保存成功')
}

// 保存通知设置
const handleSaveNotification = () => {
  // TODO: 调用保存API
  layer.msg('保存成功')
}
</script>

<style lang="scss" scoped>
.system-config {
  padding: 20px;
  
  :deep(.layui-form) {
    max-width: 600px;
    margin: 20px auto;
  }
}
</style> 