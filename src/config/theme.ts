import type { ThemeConfig } from 'antd';

/**
 * Ant Design 主题配置
 * 主色调：淡粉色 + 白色，辅助色：淡蓝色
 */
export const themeConfig: ThemeConfig = {
  token: {
    // 主色调 - 淡粉色
    colorPrimary: '#FFB6C1', // 淡粉色主色
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#6BB6FF', // 淡蓝色作为信息色
    
    // 背景色 - 淡粉色
    colorBgBase: '#FFE4E1', // 淡粉色背景
    colorBgContainer: '#FFFFFF', // 容器背景（白色）
    colorBgElevated: '#FFFFFF', // 悬浮背景
    
    // 文字颜色
    colorText: '#333333',
    colorTextSecondary: '#666666',
    colorTextTertiary: '#999999',
    
    // 边框颜色
    colorBorder: '#E8E8E8',
    colorBorderSecondary: '#F0F0F0',
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 阴影 - 使用淡粉色
    boxShadow: '0 2px 8px rgba(255, 182, 193, 0.15)',
    boxShadowSecondary: '0 4px 12px rgba(255, 182, 193, 0.2)',
    
    // 字体
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 14,
    fontSizeLG: 16,
    fontSizeSM: 12,
    
    // 间距
    padding: 16,
    paddingLG: 24,
    paddingSM: 12,
    paddingXS: 8,
    
    // 行高
    lineHeight: 1.5715,
  },
  components: {
    // Button 组件定制
    Button: {
      primaryColor: '#FFFFFF',
      borderRadius: 8,
      controlHeight: 36,
      fontWeight: 500,
    },
    // Input 组件定制
    Input: {
      borderRadius: 8,
      controlHeight: 36,
      colorBgContainer: '#FFFFFF',
      activeBorderColor: '#FFB6C1', // 淡粉色边框
      hoverBorderColor: '#FFC0CB', // 淡粉色悬停
    },
    // Card 组件定制
    Card: {
      borderRadius: 12,
      colorBgContainer: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(255, 182, 193, 0.12)',
    },
    // Menu 组件定制
    Menu: {
      itemBg: 'transparent',
      itemHoverBg: '#FFE4E1', // 淡粉色悬停背景
      itemActiveBg: '#FFC0CB', // 淡粉色激活背景
      itemSelectedBg: '#FFE4E1', // 淡粉色选中背景
      itemSelectedColor: '#FF69B4', // 粉红色选中文字
      borderRadius: 8,
    },
    // Layout 组件定制
    Layout: {
      bodyBg: '#FFE4E1', // 淡粉色背景
      headerBg: '#FFFFFF', // 白色头部
      siderBg: '#FFFFFF', // 白色侧边栏
      triggerBg: '#F5F5F5',
    },
    // Table 组件定制
    Table: {
      borderRadius: 8,
      headerBg: '#FFF0F5', // 极淡粉色表头
      headerColor: '#333333',
      rowHoverBg: '#FFE4E1', // 淡粉色悬停
    },
    // Form 组件定制
    Form: {
      labelColor: '#333333',
      itemMarginBottom: 20,
    },
    // Select 组件定制
    Select: {
      borderRadius: 8,
      controlHeight: 36,
    },
    // DatePicker 组件定制
    DatePicker: {
      borderRadius: 8,
      controlHeight: 36,
    },
  },
};

