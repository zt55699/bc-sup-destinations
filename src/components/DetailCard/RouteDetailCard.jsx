import React from 'react';

function RouteDetailCard({ routeInfo, startCoords, endCoords, distances, onClose }) {
    if (!routeInfo) {
        return (
            <div id="route-detail-card" className="fixed bottom-0 left-0 right-0 z-20 p-4 transform translate-y-full transition-transform duration-700 ease-in-out">
            </div>
        );
    }

    return (
        <div id="route-detail-card" className="fixed bottom-0 left-0 right-0 z-20 p-4 transform translate-y-full transition-transform duration-700 ease-in-out">
            <div className="detail-card-container max-w-4xl mx-auto backdrop-blur-2xl border border-white/10 rounded-3xl overflow-hidden relative"
                style={{
                    background: `linear-gradient(135deg, 
                        rgba(0, 0, 0, 0.5) 0%, 
                        rgba(0, 0, 0, 0.3) 25%,
                        rgba(0, 0, 0, 0.35) 50%,
                        rgba(0, 0, 0, 0.3) 75%,
                        rgba(0, 0, 0, 0.4) 100%)`,
                    boxShadow: `
                        inset 0 2px 0 0 rgba(255, 255, 255, 0.08),
                        inset 0 -2px 0 0 rgba(0, 0, 0, 0.15),
                        0 30px 90px rgba(0, 0, 0, 0.6),
                        0 15px 50px rgba(0, 0, 0, 0.4),
                        0 5px 20px rgba(0, 0, 0, 0.3)`
                }}>
                <div className="p-5 md:p-6 relative">
                    <button 
                        onClick={onClose} 
                        className="absolute top-5 md:top-6 right-5 md:right-6 w-10 h-10 flex items-center justify-center backdrop-blur-2xl rounded-full text-white/80 hover:text-white transition-all duration-300 z-10"
                        style={{
                            background: `linear-gradient(135deg, 
                                rgba(255, 255, 255, 0.1) 0%, 
                                rgba(255, 255, 255, 0.05) 100%)`,
                            boxShadow: `
                                inset 0 1px 0 0 rgba(255, 255, 255, 0.2),
                                inset 0 -1px 0 0 rgba(0, 0, 0, 0.1),
                                0 4px 16px rgba(0, 0, 0, 0.3)`
                        }}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                    
                    <div className="flex items-center justify-between pr-12">
                        <div className="flex items-center gap-3 min-w-0 flex-1">
                            <h2 className="text-2xl md:text-3xl font-bold text-white whitespace-nowrap overflow-hidden">
                                <span className={`inline-block ${
                                    routeInfo.stops && routeInfo.stops.length > 0 
                                        ? 'animate-marquee' 
                                        : ''
                                }`}>
                                    路线：{routeInfo.stops && routeInfo.stops.length > 0 
                                        ? `经 ${routeInfo.stops.map(s => s.name).join('、')} 到 ${routeInfo.destination}`
                                        : `到 ${routeInfo.destination}`}
                                </span>
                            </h2>
                            {(routeInfo.destination === 'Widgeon Falls' || routeInfo.destination === 'Jug Island' || routeInfo.destination === 'Harrison Lagoon') ? (
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            ) : (routeInfo.destination === 'Silver Falls' || routeInfo.destination === 'Granite Falls') ? (
                                <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                                    <div className="w-2.5 h-2.5 bg-black transform rotate-45"></div>
                                </div>
                            ) : (
                                <div className="w-3 h-3 bg-blue-500"></div>
                            )}
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-2 mt-2">
                        {routeInfo.destination === 'Widgeon Falls' ? (
                            <span className="text-sm text-white/90 px-3 py-1 rounded-full backdrop-blur-xl" 
                                style={{
                                    background: "linear-gradient(90deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.15) 50%, rgba(196, 154, 108, 0.15) 50%, rgba(196, 154, 108, 0.15) 100%)", 
                                    border: "1px solid rgba(126, 171, 178, 0.3)", 
                                    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                }}>
                                桨板/徒步
                            </span>
                        ) : (
                            <span className="text-sm text-sky-200/90 px-3 py-1 rounded-full backdrop-blur-xl" 
                                style={{
                                    background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)", 
                                    border: "1px solid rgba(56, 189, 248, 0.2)", 
                                    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                }}>
                                桨板路线
                            </span>
                        )}
{routeInfo.destination === 'Widgeon Falls' ? (
                            <>
                                <span className="text-sm text-sky-200/90 px-3 py-1 rounded-full backdrop-blur-xl" 
                                    style={{
                                        background: "linear-gradient(135deg, rgba(56, 189, 248, 0.15) 0%, rgba(56, 189, 248, 0.08) 100%)", 
                                        border: "1px solid rgba(56, 189, 248, 0.2)", 
                                        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                    }}>
                                    桨板{distances?.paddling}公里
                                </span>
                                <span className="text-sm text-orange-200/90 px-3 py-1 rounded-full backdrop-blur-xl" 
                                    style={{
                                        background: "linear-gradient(135deg, rgba(196, 154, 108, 0.15) 0%, rgba(196, 154, 108, 0.08) 100%)", 
                                        border: "1px solid rgba(196, 154, 108, 0.2)", 
                                        boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                    }}>
                                    徒步{distances?.hiking}公里
                                </span>
                            </>
                        ) : (
                            <span className="text-sm text-amber-200/90 px-3 py-1 rounded-full backdrop-blur-xl" 
                                style={{
                                    background: "linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%)", 
                                    border: "1px solid rgba(251, 191, 36, 0.2)", 
                                    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                }}>
                                约{distances?.total}公里
                            </span>
                        )}
                        {routeInfo.destination !== 'Widgeon Falls' && (
                            <span className="text-sm text-white/80 px-3 py-1 rounded-full backdrop-blur-xl" 
                                style={{
                                    background: "linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.05) 100%)", 
                                    border: "1px solid rgba(255, 255, 255, 0.15)", 
                                    boxShadow: "inset 0 1px 0 0 rgba(255, 255, 255, 0.1)"
                                }}>
                                {(routeInfo.destination === 'Silver Falls' || routeInfo.destination === 'Granite Falls') ? '◆ 高级' : (routeInfo.destination === 'Jug Island' || routeInfo.destination === 'Harrison Lagoon') ? '● 初级' : '■ 中级'}
                            </span>
                        )}
                    </div>
                    
                    <p className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed">
                        {routeInfo.description} 这条路线全长约{distances?.total}公里，{(routeInfo.destination === 'Silver Falls' || routeInfo.destination === 'Granite Falls') ? '峡湾路线，需要丰富划桨经验' : (routeInfo.destination === 'Widgeon Falls' || routeInfo.destination === 'Jug Island' || routeInfo.destination === 'Harrison Lagoon') ? '适合初学者探索' : '适合有一定经验的桨手探索'}。
                    </p>
                </div>
            </div>
        </div>
    );
}

export default RouteDetailCard;