# 主题配置说明

## 主题色调

本项目采用 **#F76153（主色） + #FFE7E3（浅色） + 白色** 的主色调：

- **主色调（Primary）**: `#F76153`
- **背景色（Background）**: `#FFE7E3`（整体浅粉）
- **容器背景**: `#FFFFFF`
- **选中色**: `#E84F43`（更深的强调/选中）

## 颜色变量

在 `src/assets/style/global.scss` 中定义了以下颜色变量：

```scss
$primary-color: #F76153;      // 主色
$primary-light: #FCAEA2;     // 浅色
$primary-lighter: #FFE7E3;   // 极浅色
$primary-dark: #E84F43;      // 深色（选中/强调）
$bg-pink: #FFE7E3;          // 整体浅粉背景
$bg-white: #FFFFFF;         // 白色
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

- **按钮**: 珊瑚淡粉渐变，悬停加深并带阴影
- **输入框**: 焦点珊瑚边框，悬停浅珊瑚边框
- **卡片**: 珊瑚淡粉边框，悬停阴影加深
- **菜单**: 选中淡粉背景 + 深珊瑚文字，悬停淡粉背景
- **表格**: 行悬停淡粉背景，表头极淡粉
- **链接**: 珊瑚色，悬停加深

## 注意事项

1. 所有颜色值都使用十六进制格式，便于统一管理
2. 主题配置支持响应式，在不同设备上会自动适配
3. 建议保持整体色调的一致性，避免使用过于鲜艳的颜色

