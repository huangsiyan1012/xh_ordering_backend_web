# 主题配置说明

## 主题色调

本项目采用**淡粉色 + 白色**的主色调，搭配**淡蓝色**作为辅助色：

- **主色调（Primary）**: `#FFB6C1` - 淡粉色
- **背景色（Background）**: `#FFE4E1` - 淡粉色背景
- **容器背景**: `#FFFFFF` - 纯白色
- **辅助色（Accent）**: `#6BB6FF` - 淡蓝色（用于链接、特殊交互等）
- **选中色**: `#FF69B4` - 粉红色（用于选中状态）

## 颜色变量

在 `src/assets/style/global.scss` 中定义了以下颜色变量：

```scss
$primary-color: #FFB6C1;      // 淡粉色主色
$primary-light: #FFC0CB;     // 淡粉色浅色
$primary-lighter: #FFE4E1;   // 淡粉色极浅
$primary-dark: #FF69B4;      // 粉红色（选中状态）
$bg-pink: #FFE4E1;          // 淡粉色背景
$bg-white: #FFFFFF;         // 白色
$accent-blue: #6BB6FF;      // 淡蓝色辅助色
$accent-blue-light: #E6F7FF; // 淡蓝色极浅
```

## 主题配置位置

主题配置文件位于：`src/config/theme.ts`

该文件使用 Ant Design 的 `ThemeConfig` 类型，配置了所有组件的主题样式。

## 使用方式

主题已在 `App.tsx` 中通过 `ConfigProvider` 全局应用：

```tsx
import { ConfigProvider } from "antd";
import { themeConfig } from "@/config/theme";

function App() {
  return (
    <ConfigProvider theme={themeConfig}>
      {/* 你的应用内容 */}
    </ConfigProvider>
  );
}
```

## 自定义组件样式

如果需要为特定组件添加自定义样式，可以在 `global.scss` 中使用以下类名：

- `.ant-card` - 卡片组件
- `.ant-btn-primary` - 主按钮
- `.ant-input` - 输入框
- `.ant-menu-item-selected` - 菜单选中项

## 颜色调整

如果需要调整主题颜色，请修改：

1. **Ant Design 组件颜色**: 修改 `src/config/theme.ts` 中的 `token.colorPrimary`
2. **全局样式颜色**: 修改 `src/assets/style/global.scss` 中的 SCSS 变量

## 效果预览

- **按钮**: 淡粉色渐变背景，悬停时加深并显示阴影
- **输入框**: 焦点时显示淡粉色边框和阴影，悬停时显示淡蓝色边框
- **卡片**: 淡粉色边框，悬停时显示阴影并加深边框
- **菜单**: 选中项使用淡粉色背景，悬停时使用淡蓝色背景
- **表格**: 行悬停时显示淡粉色背景，表头使用极淡粉色
- **链接**: 使用淡蓝色，悬停时变为淡粉色

## 注意事项

1. 所有颜色值都使用十六进制格式，便于统一管理
2. 主题配置支持响应式，在不同设备上会自动适配
3. 建议保持整体色调的一致性，避免使用过于鲜艳的颜色

