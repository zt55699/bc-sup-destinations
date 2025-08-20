# BC 桨板目的地探索器

一个交互式地图应用，展示不列颠哥伦比亚省最佳的桨板运动目的地。

## 功能特点

- 🗺️ **交互式地图** - 使用 Leaflet.js 构建的暗色主题地图
- 📍 **33个精选目的地** - 涵盖大温地区、温哥华岛和BC省内陆
- 🏷️ **智能分类** - 按标签（海水/淡水、热门、地区等）分类
- 🎯 **难度分级** - 四个难度等级（初级、中级、高级、专家级）
- 🖼️ **多图展示** - 每个目的地配有多张高质量图片
- 🔄 **自动滚动** - 目的地列表自动滚动展示
- 📱 **响应式设计** - 适配桌面和移动设备

## 技术栈

- React 19
- Vite
- Leaflet.js
- Tailwind CSS
- 中文界面

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
│   ├── App.jsx        # 主应用组件
│   └── main.jsx       # 应用入口
├── index.html         # HTML模板
├── package.json       # 项目配置
└── vite.config.js     # Vite配置
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