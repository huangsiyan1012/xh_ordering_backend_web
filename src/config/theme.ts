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
    
    // 圆角 - 等比例放大1.5倍
    borderRadius: 12,
    borderRadiusLG: 18,
    borderRadiusSM: 9,
    
    // 阴影 - 等比例放大1.5倍
    boxShadow: '0 3px 12px rgba(247, 97, 83, 0.12)',
    boxShadowSecondary: '0 6px 18px rgba(247, 97, 83, 0.18)',
    
    // 字体（与全局 body 一致）- 等比例放大1.5倍
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "SF Pro Text", "SF Pro Display", "PingFang SC", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    fontSize: 24,
    fontSizeLG: 27,
    fontSizeSM: 21,
    
    // 间距 - 等比例放大1.5倍
    padding: 24,
    paddingLG: 36,
    paddingSM: 18,
    paddingXS: 12,
    
    // 行高
    lineHeight: 1.5715,
  },
  components: {
    // Button 组件定制 - 等比例放大1.5倍
    Button: {
      primaryColor: '#FFFFFF',
      borderRadius: 12,
      controlHeight: 66,
      fontWeight: 500,
      fontSize: 24,
    },
    // Input 组件定制 - 等比例放大1.5倍
    Input: {
      borderRadius: 12,
      controlHeight: 66,
      colorBgContainer: '#FFFFFF',
      activeBorderColor: '#F76153', // 主色边框
      hoverBorderColor: '#FCAEA2', // 浅色悬停
      fontSize: 24,
    },
    // Card 组件定制 - 等比例放大1.5倍
    Card: {
      borderRadius: 18,
      colorBgContainer: '#FFFFFF',
      boxShadow: '0 3px 12px rgba(247, 97, 83, 0.10)',
    },
    // Menu 组件定制 - 等比例放大1.5倍
    Menu: {
      itemBg: 'transparent',
      itemHoverBg: '#FFE7E3', // 浅粉悬停
      itemActiveBg: '#FCAEA2', // 浅色激活
      itemSelectedBg: '#FFE7E3', // 选中背景
      itemSelectedColor: '#E84F43', // 深一些的选中字
      borderRadius: 12,
    },
    // Layout 组件定制
    Layout: {
      bodyBg: '#FFE7E3', // 浅粉背景
      headerBg: '#FFFFFF',
      siderBg: '#FFFFFF',
      triggerBg: '#F7F7F7',
    },
    // Table 组件定制 - 等比例放大1.5倍
    Table: {
      borderRadius: 12,
      headerBg: '#FFF3EE', // 极浅粉表头
      headerColor: '#2E2E2E',
      rowHoverBg: '#FFE7E3', // 浅粉悬停
    },
    // Form 组件定制 - 等比例放大1.5倍
    Form: {
      labelColor: '#2E2E2E',
      itemMarginBottom: 30,
    },
    // Select 组件定制 - 等比例放大1.5倍
    Select: {
      borderRadius: 12,
      controlHeight: 66,
      fontSize: 24,
    },
    // DatePicker 组件定制 - 等比例放大1.5倍
    DatePicker: {
      borderRadius: 12,
      controlHeight: 66,
      fontSize: 24,
    },
  },
};

