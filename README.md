# BC 桨板目的地探索器

一个交互式地图应用，展示不列颠哥伦比亚省最佳的桨板运动目的地。

## 功能特点

- 🗺️ **交互式地图** - 使用 Leaflet.js 构建的暗色主题地图，玻璃形态标记
- 📍 **33个精选目的地** - 涵盖大温地区、温哥华岛和BC省内陆，智能距离排序
- 🏷️ **智能分类** - 按标签（海水/淡水、热门、地区等）分类，可视化管理
- 🎯 **难度分级** - 四个难度等级（初级、中级、高级、专家级）带符号显示
- 🖼️ **多图展示** - 每个目的地配有多张高质量图片，点击切换
- 🔄 **自动滚动** - 目的地列表自动滚动展示，鼠标悬停暂停
- 📱 **响应式设计** - 适配桌面和移动设备
- ✨ **流畅动画** - 详情卡片滑入滑出，难度图例淡入淡出
- 👁️ **可见性控制** - 可隐藏/显示特定目的地
- 🔗 **Google地图集成** - 一键跳转到Google地图导航

## 技术栈

- React 19 - 现代React框架
- Vite - 快速构建工具
- Leaflet.js - 交互式地图库
- Tailwind CSS - 实用优先的CSS框架
- 模块化架构 - 可维护的组件结构
- 中文界面

## 架构特点

### 组件化设计
- **数据层分离** - 目的地数据、工具函数和常量独立管理
- **自定义Hooks** - 逻辑复用，状态管理清晰
- **UI组件模块化** - 可重用组件，便于维护和测试
- **关注点分离** - 数据、逻辑、展示层清晰分离

### 性能优化
- **按需渲染** - 组件智能更新，减少不必要的重渲染
- **动画优化** - 基于缩放级别的智能延迟（缩放>11时立即显示）
- **内存管理** - 高效的状态管理和副作用清理

## 难度等级说明

- 🟢 **初级** - 适合新手和家庭，平静水域，设施完善
- 🟡 **中级** - 需要一定经验，可能有风浪或需要轻度徒步
- 🟠 **高级** - 复杂环境，长距离划行，需要高级技能
- 🔴 **专家级** - 极具挑战性，需要徒步携带装备或专业技能

## 本地开发

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 项目结构

```
bc-sup-dest/
├── src/
│   ├── components/           # 可重用UI组件
│   │   ├── Map/             # 地图相关组件
│   │   ├── DestinationList/ # 目的地列表组件
│   │   └── DetailCard/      # 详情卡片组件
│   ├── data/                # 数据层
│   │   └── destinations.js  # 目的地数据
│   ├── hooks/               # 自定义Hooks
│   │   ├── useDestinations.js
│   │   ├── useMap.js
│   │   └── useAutoScroll.js
│   ├── styles/              # 样式文件
│   ├── utils/               # 工具函数
│   ├── App.jsx              # 主应用组件
│   └── main.jsx             # 应用入口
├── index.html               # HTML模板
├── package.json             # 项目配置
├── vite.config.js           # Vite配置
└── REFACTOR.md              # 重构说明文档
```

## 目的地列表

应用包含33个精心挑选的桨板目的地，按距离温哥华市中心排序，包括：

### 大温地区
- Deep Cove、Jericho Beach、English Bay
- Buntzen Lake、Pitt Lake、Sasamat Lake
- Whytecliff Park、Indian Arm

### 海天走廊
- Porteau Cove、Furry Creek、Squamish
- Alice Lake、Howe Sound

### 惠斯勒地区
- Alta Lake、Green Lake、Garibaldi Lake

### 温哥华岛
- Tofino、Sproat Lake、Newcastle Island
- Westwood Lake、Thetis Lake

### 内陆地区
- Harrison Lake、Cultus Lake、Chilliwack Lake
- Kalamalka Lake、Joffre Lakes

## 许可证

MIT License