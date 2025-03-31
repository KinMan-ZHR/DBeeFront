import type { Component } from 'vue';

declare module '@layui/layui-vue' {
  // Form 实例类型
  export interface FormInstance {
    validate: () => Promise<boolean>;
    validateField: (prop: string | string[]) => Promise<boolean>;
    resetFields: () => void;
    clearValidate: (props?: string | string[]) => void;
  }

  // Layer 组件
  export const layer: {
    msg: (message: string, options?: any) => void;
    alert: (message: string, options?: any) => void;
    confirm: (message: string, options?: any) => void;
    load: (options?: any) => number;
    close: (id: number) => void;
  };
} 