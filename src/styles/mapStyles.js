export const mapStyles = `
/* 自定义样式以实现设计要求 */
body {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
}

/* 隐藏滚动条 */
.no-scrollbar::-webkit-scrollbar {
    display: none;
}
.no-scrollbar {
    -ms-overflow-style: none;  /* IE and Edge */
    scrollbar-width: none;  /* Firefox */
}

/* 自定义地图标记样式 */
.custom-map-marker {
    background-color: rgba(255, 255, 255, 0.3);
    border: 1.5px solid rgba(255, 255, 255, 0.7);
    border-radius: 50%;
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    box-shadow: 0 4px 30px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease;
    display: flex;
    justify-content: center;
    align-items: center;
}
.custom-map-marker .inner-dot {
    width: 8px;
    height: 8px;
    background-color: #fff;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
}

/* 难度等级颜色 - 低饱和度 */
.custom-map-marker.difficulty-beginner {
    background-color: rgba(134, 239, 172, 0.15); /* 淡绿色 */
    border-color: rgba(134, 239, 172, 0.4);
}
.custom-map-marker.difficulty-beginner .inner-dot {
    background-color: rgba(134, 239, 172, 0.9);
}

.custom-map-marker.difficulty-intermediate {
    background-color: rgba(147, 197, 253, 0.15); /* 淡蓝色 */
    border-color: rgba(147, 197, 253, 0.4);
}
.custom-map-marker.difficulty-intermediate .inner-dot {
    background-color: rgba(147, 197, 253, 0.9);
}

.custom-map-marker.difficulty-advanced {
    background-color: rgba(251, 146, 60, 0.15); /* 淡橙色 */
    border-color: rgba(251, 146, 60, 0.4);
}
.custom-map-marker.difficulty-advanced .inner-dot {
    background-color: rgba(251, 146, 60, 0.9);
}

.custom-map-marker.difficulty-expert {
    background-color: rgba(248, 113, 113, 0.15); /* 淡红色 */
    border-color: rgba(248, 113, 113, 0.4);
}
.custom-map-marker.difficulty-expert .inner-dot {
    background-color: rgba(248, 113, 113, 0.9);
}

/* 激活状态的标记 */
.custom-map-marker.active {
    transform: scale(1.5);
    border-color: #fff !important;
    background-color: rgba(255, 255, 255, 0.5) !important;
}
.custom-map-marker.active .inner-dot {
    background-color: #38bdf8 !important; /* sky-500 */
    box-shadow: 0 0 15px #38bdf8;
}

/* 路线目的地标记 */
.custom-map-marker.route-destination {
    background-color: rgba(56, 189, 248, 0.2) !important;
    border-color: rgba(56, 189, 248, 0.8) !important;
    box-shadow: 0 0 20px rgba(56, 189, 248, 0.4);
    animation: pulse-route 2s infinite;
}
.custom-map-marker.route-destination .inner-dot {
    background-color: #38bdf8 !important;
    box-shadow: 0 0 15px #38bdf8;
}

@keyframes pulse-route {
    0%, 100% {
        transform: scale(1);
        opacity: 1;
    }
    50% {
        transform: scale(1.1);
        opacity: 0.8;
    }
}

/* Liquid Glass 详情卡片效果 */
.detail-card-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(
        180deg,
        rgba(255, 255, 255, 0.1) 0%,
        rgba(255, 255, 255, 0.05) 30%,
        transparent 100%
    );
    border-radius: 1.5rem 1.5rem 0 0;
    pointer-events: none;
    z-index: 1;
}

.detail-card-container::after {
    content: '';
    position: absolute;
    top: 50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(
        ellipse at center,
        rgba(56, 189, 248, 0.05) 0%,
        transparent 50%
    );
    pointer-events: none;
    animation: shimmer 8s ease-in-out infinite;
}

@keyframes shimmer {
    0%, 100% {
        transform: translateX(0) translateY(-50%);
        opacity: 0.5;
    }
    50% {
        transform: translateX(50%) translateY(-50%);
        opacity: 1;
    }
}

/* 只设置地图容器的底层背景，不影响瓦片本身 */
.leaflet-container {
    background: #2c2c2c;
}

/* 瓦片层的底层背景 */
.leaflet-tile-pane {
    background: #2c2c2c;
}

/* 增加地图瓦片亮度，特别是水域 */
.leaflet-tile {
    filter: brightness(1.4) contrast(0.95);
}

/* 自定义路线弹窗样式 - 移除默认白色背景 */
.leaflet-popup-content-wrapper {
    background: transparent !important;
    box-shadow: none !important;
}

.leaflet-popup-tip {
    background: transparent !important;
    box-shadow: none !important;
}

/* Marquee animation for long route names */
@keyframes marquee {
    0% {
        transform: translateX(0);
    }
    50% {
        transform: translateX(-130px);
    }
    100% {
        transform: translateX(0);
    }
}

.animate-marquee {
    animation: marquee 10s linear infinite;
    display: inline-block;
}
`;