<template>
  <router-view></router-view>
</template>

<style>
/* 保留全局样式调整 */
.layui-card {
  border-radius: 4px;
  box-shadow: 0 1px 2px 0 rgba(0,0,0,.03);
  
  .layui-card-header {
    height: 50px;
    line-height: 50px;
    padding: 0 20px;
    border-bottom: 1px solid #f0f0f0;
    font-size: 16px;
    font-weight: 500;
  }
}

.layui-form {
  .layui-form-item {
    margin-bottom: 20px;
    
    .layui-form-label {
      width: 100px;
      text-align: right;
      padding-right: 12px;
    }
    
    .layui-input-block {
      margin-left: 120px;
    }
  }
}

.layui-table {
  .layui-table-header {
    background-color: #fafafa;
  }
  
  .layui-table-cell {
    height: 38px;
    line-height: 38px;
  }
}

.layui-btn {
  height: 32px;
  line-height: 32px;
  padding: 0 15px;
  
  &.layui-btn-sm {
    height: 24px;
    line-height: 24px;
    padding: 0 8px;
  }
}
</style>