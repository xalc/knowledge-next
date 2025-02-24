# Tailwind css

Tailwind css 通过扫描所有的HTML， js组件以及模板文件获得类名生成相应的样式并写进一个静态css文件中。

## 四种基础组件@tailwind

1. `base` 提供最基本的样式，设置全局字体，排版等 如body，html， h1等常见的HTML上
2. `Components` 组件样式 例如表单，导航栏等通常由多个utility类组合而成，形成独立可复用的样式块
3. `utilities`  提供了一系列原子化的、单一职责的 CSS 类
4. `variants` 用于根据不同的状态或条件修改 utility 类的样式，例如 `hover`、`focus`、`active`、`responsive` (例如 `md:`, `lg:`) 等

## 暗黑模式

`aspect-ratio` 是 CSS 中一个用于设置元素宽高比的属性。