import type { ThemeConfig } from 'antd';

/**
 * Ant Design 主题配置
 * 主色调：#F76153（主色） + #FFE7E3（浅色） + 白色
 */
export const themeConfig: ThemeConfig = {
  token: {
    // 主色调
    colorPrimary: '#F76153', // 主色
    colorSuccess: '#52c41a',
    colorWarning: '#faad14',
    colorError: '#ff4d4f',
    colorInfo: '#F76153', // 信息色同主色
    
    // 背景色
    colorBgBase: '#FFE7E3', // 整体浅粉背景
    colorBgContainer: '#FFFFFF', // 容器白色
    colorBgElevated: '#FFFFFF', // 悬浮白色
    
    // 文字颜色
    colorText: '#2E2E2E',
    colorTextSecondary: '#595959',
    colorTextTertiary: '#8C8C8C',
    
    // 边框颜色
    colorBorder: '#F2D6D1',
    colorBorderSecondary: '#F7E4DF',
    
    // 圆角
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,
    
    // 阴影
    boxShadow: '0 2px 8px rgba(247, 97, 83, 0.12)',
    boxShadowSecondary: '0 4px 12px rgba(247, 97, 83, 0.18)',
    
    // 字体（与全局 body 一致）
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
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
      activeBorderColor: '#F76153', // 主色边框
      hoverBorderColor: '#FCAEA2', // 浅色悬停
    },
    // Card 组件定制
    Card: {
      borderRadius: 12,
      colorBgContainer: '#FFFFFF',
      boxShadow: '0 2px 8px rgba(247, 97, 83, 0.10)',
    },
    // Menu 组件定制
    Menu: {
      itemBg: 'transparent',
      itemHoverBg: '#FFE7E3', // 浅粉悬停
      itemActiveBg: '#FCAEA2', // 浅色激活
      itemSelectedBg: '#FFE7E3', // 选中背景
      itemSelectedColor: '#E84F43', // 深一些的选中字
      borderRadius: 8,
    },
    // Layout 组件定制
    Layout: {
      bodyBg: '#FFE7E3', // 浅粉背景
      headerBg: '#FFFFFF',
      siderBg: '#FFFFFF',
      triggerBg: '#F7F7F7',
    },
    // Table 组件定制
    Table: {
      borderRadius: 8,
      headerBg: '#FFF3EE', // 极浅粉表头
      headerColor: '#2E2E2E',
      rowHoverBg: '#FFE7E3', // 浅粉悬停
    },
    // Form 组件定制
    Form: {
      labelColor: '#2E2E2E',
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

