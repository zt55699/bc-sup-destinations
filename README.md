# BC 桨板目的地探索器

一个交互式地图应用，展示不列颠哥伦比亚省最佳的桨板运动目的地。

## 功能特点

- 🗺️ **交互式地图** - 使用 Leaflet.js 构建的暗色主题地图，玻璃形态标记
- 📍 **33个精选目的地** - 涵盖大温地区、温哥华岛和BC省内陆，智能距离排序
- 🏷️ **智能分类** - 按标签（海水/淡水、热门、地区等）分类，可视化管理
- 🎯 **难度分级** - 四个难度等级（初级、中级、高级、专家级）带符号显示
- 🖼️ **多图展示** - 每个目的地配有多张高质量图片，点击切换
- 🔄 **智能自动滚动** - 目的地列表自动滚动展示，智能记忆位置，支持暂停和恢复
- 🎯 **精确卡片定位** - 点击地图标记或目的地卡片时，自动居中显示对应卡片
- 🚣 **路线系统** - 动画路线可视化，支持多段路线和中途停靠点
- 📏 **距离计算** - 桨板和徒步距离分别计算，使用哈弗辛公式
- 🔍 **高级过滤** - 多维度过滤系统：水域类型、地区、难度、路线状态
- ✨ **过滤动画** - 卡片和地图标记过滤时有平滑淡入淡出动画，错峰显示效果
- 🌤️ **实时天气** - 集成Open-Meteo API，显示当前天气、逐时预报和5日预报
- 💾 **智能缓存** - 天气数据本地缓存1小时，离线时显示过期数据
- ⚠️ **日间通行证提醒** - 自动显示需要预订通行证的目的地警告
- 📱 **响应式设计** - 适配桌面和移动设备
- ✨ **流畅动画** - 详情卡片滑入滑出，路线动画，标题跑马灯效果
- 📜 **增强滚动** - 强化滚动捕捉，智能滚动指示器，底部渐变效果
- 🎨 **液态玻璃设计** - 现代UI设计语言，背景模糊和透明效果
- 🗺️ **同步筛选** - 地图标记与目的地列表实时同步过滤
- 🔘 **智能过滤按钮** - 过滤按钮在详情卡片打开时自动隐藏，关闭后延迟渐现
- 🔗 **Google地图集成** - 一键跳转到Google地图导航

## 技术栈

- React 19 - 现代React框架
- Vite - 快速构建工具
- Leaflet.js - 交互式地图库
- Tailwind CSS - 实用优先的CSS框架
- Open-Meteo API - 免费天气数据服务
- 模块化架构 - 可维护的组件结构
- 中文界面

## 架构特点

### 组件化设计
- **数据层分离** - 目的地数据、工具函数和常量独立管理
- **自定义Hooks** - 逻辑复用，状态管理清晰
- **UI组件模块化** - 可重用组件，便于维护和测试
- **关注点分离** - 数据、逻辑、展示层清晰分离
- **路线动画系统** - 多段路线支持，停靠点暂停，距离计算

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
│   │   ├── DestinationList/ # 目的地列表和过滤组件
│   │   ├── DetailCard/      # 详情卡片和路线卡片组件
│   │   ├── WeatherDisplay/  # 天气显示组件
│   │   └── WeatherIcon/     # SVG天气图标组件
│   ├── data/                # 数据层
│   │   └── destinations.js  # 目的地数据（含通行证信息）
│   ├── hooks/               # 自定义Hooks
│   │   ├── useDestinations.js
│   │   ├── useMap.js
│   │   ├── useAutoScroll.js
│   │   └── useFilters.js    # 过滤状态管理
│   ├── services/            # 外部服务
│   │   └── weatherService.js # 天气API服务
│   ├── styles/              # 样式文件
│   ├── utils/               # 工具函数
│   ├── App.jsx              # 主应用组件
│   └── main.jsx             # 应用入口
├── index.html               # HTML模板
├── package.json             # 项目配置
├── vite.config.js           # Vite配置
└── CLAUDE.md                # 项目指令文档
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