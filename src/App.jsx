import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';

function App() {
    const mapRef = useRef(null);
    const mapInstanceRef = useRef(null);
    const markersRef = useRef({});
    const [activeDestinationId, setActiveDestinationId] = useState(null);
    const [hiddenDestinations, setHiddenDestinations] = useState(new Set());
    const [isAutoScrolling, setIsAutoScrolling] = useState(true);
    const animationIdRef = useRef(null);

    // 数据模型 (未排序的原始数据)
    const destinations = [
        { id: 1, name: 'Deep Cove', coords: [49.3283, -122.9524], tags: ['海水', '热门', '大温'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Deep Cove 是北温哥华一个风景如画的海湾，以其平静的水域和壮丽的风景而闻名，是初学者和家庭的理想选择。', difficultyInfo: '● 初级 - 平静海湾，有设施支持，适合新手', imageUrls: ['https://deepcovekayak.com/wp-content/uploads/2022/10/Home-Page-Carousel-2-scaled.jpg', 'https://farm1.staticflickr.com/542/20094274766_63418d0090_z.jpg', 'https://cdn.shopify.com/s/files/1/0623/7510/0601/files/deep-cove-paddle-boarding-irockerca-2_f4975adb-d62f-42c0-87a2-f961acc1be93.jpg?v=1714008899'] },
        { id: 2, name: 'Jericho Beach', coords: [49.2725, -123.1901], tags: ['海水', '沙滩', '大温'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Jericho Beach 位于温哥华，享有城市和山脉的壮丽景色。这里的水域通常很平静，非常适合悠闲地划桨。', difficultyInfo: '● 初级 - 城市海滩，平静水域，设施完善', imageUrls: ['https://cdn.sanity.io/images/flus6j8v/production/a14074847748e1a5dd2fed08275328b62ec460e1-3874x2578.jpg?rect=0,200,3874,2179&w=3840&h=2160&q=75&fit=max&auto=format', 'https://cdn.shopify.com/s/files/1/2978/5848/files/Jericho-Beach-BC.jpg?v=1628026884', 'https://cdn.shopify.com/s/files/1/0623/7510/0601/files/paddle-boarding-jericho-beach_1024x1024.webp?v=1690279941'] },
        { id: 3, name: 'Alouette Lake', coords: [49.3369, -122.4867], tags: ['淡水', '湖泊', '枫树岭'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Alouette Lake 坐落在 Golden Ears 省立公园内，是一个大型淡水湖，周围环绕着茂密的森林和山脉，提供了一个宁静的划桨环境。', difficultyInfo: '■ 中级 - 大型湖泊，省立公园环境', imageUrls: ['https://c2.staticflickr.com/8/7222/7278081576_c764c90223_b.jpg', 'https://live.staticflickr.com/3558/3800450144_dccbcab054_b.jpg', 'https://preview.redd.it/qhg1f601ofg91.jpg?width=640&crop=smart&auto=webp&s=2be8a96f1f9f50d2eb4878eab04c20d2e255820b'] },
        { id: 4, name: 'Cultus Lake', coords: [49.0631, -122.0019], tags: ['淡水', '热门', '奇利瓦克'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Cultus Lake 是一个温暖的淡水湖，是夏季的热门目的地。湖泊很大，为各种水上活动提供了充足的空间。', difficultyInfo: '● 初级 - 暖水湖，设施完善，适合家庭', imageUrls: ['https://gocampingbc.com/wp-content/uploads/2016/02/Cultus-July-2021-3_-aaron-Butcher-1024x768.jpg', 'https://thousandtrails.com/images/accommodations/Cultus%20Lake/CultusLake-Activity-BeachFun.jpg#joomlaImage:/local-images/accommodations/Cultus%20Lake/CultusLake-Activity-BeachFun.jpg?width=1000&height=700', 'https://live.staticflickr.com/1834/42084143245_733b22468d_b.jpg'] },
        { id: 5, name: 'Whytecliff Park', coords: [49.3736, -123.2882], tags: ['海水', '潜水', '西温'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Whytecliff Park 位于西温哥华，拥有清澈的海水和丰富的海洋生物，是探索海岸线和岩石小岛的绝佳地点。', difficultyInfo: '■ 中级 - 海水环境，岩石区域，需注意潮汐', imageUrls: ['https://live.staticflickr.com/8318/8005050167_4825ec4255_b.jpg', 'https://i.pinimg.com/originals/5a/bf/a2/5abfa288899cdc24b8799b052ffce7ee.jpg', 'https://i.ytimg.com/vi/jESBu-MWPL8/maxresdefault.jpg'] },
        { id: 6, name: 'Alta Lake', coords: [50.1065, -122.9650], tags: ['淡水', '湖泊', '惠斯勒'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Alta Lake 是惠斯勒村中心的美丽湖泊，享有壮丽山景。通过著名的 River of Golden Dreams 连接到其他水域，为桨手提供丰富的探索体验。', difficultyInfo: '■ 中级 - 大型湖泊，可能有风浪，山地环境', imageUrls: ['https://cdn.whistler.com/blog/wp-content/uploads/2015/05/23132742/whistler-summer-fashion.jpg', 'https://dynamic-media-cdn.tripadvisor.com/media/photo-o/24/87/5c/ce/another-beautiful-day.jpg?w=1200&h=1200&s=1', 'https://uncoveringbc.com/wp-content/uploads/2021/08/Whistler-River-of-Golden-Dreams-1-1024x768.jpg'] },
        { id: 7, name: 'Buntzen Lake', coords: [49.3510, -122.8600], tags: ['淡水', '徒步', '高贵林'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Buntzen Lake 是一个美丽的 BC Hydro 水库，周围有远足小径。这里的水域平静，非常适合划桨。', difficultyInfo: '■ 中级 - 水库环境，需轻度徒步进入', imageUrls: ['https://live.staticflickr.com/65535/52797624504_0603227149_b.jpg', 'https://www.outdoorproject.com/sites/default/files/styles/cboxshow/public/1472494173/buntzen-7.jpg?itok=XmnRokHu', 'https://images.dailyhive.com/20210829221444/buntzen_lake.jpg'] },
        { id: 8, name: 'Pitt Lake', coords: [49.4933, -122.6000], tags: ['淡水', '潮汐湖', '匹特草原'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Pitt Lake 是北美最大的淡水潮汐湖之一，提供了独特的划桨体验，拥有广阔的开放水域和偏远的感觉。', difficultyInfo: '■ 中级 - 大型潮汐湖，有码头设施，需注意潮汐', imageUrls: ['https://i.vimeocdn.com/video/584884954-fc5777464c379c93b83aa753d490ab220c100303b6ea43ba375473d13f1b584f-d', 'https://content.r9cdn.net/rimg/dimg/b7/40/e542ad80-city-47233-16c3dff84ac.jpg?width=2160&height=1215&xhint=1158&yhint=1178&crop=true', 'https://modernmixvancouver.com/wp-content/uploads/2019/07/pitt-lake-canoe-rentals.jpg'] },
        { id: 9, name: 'Harrison Lake', coords: [49.4800, -121.8500], tags: ['淡水', '温泉', '哈里森'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Harrison Lake 是一个巨大的冰川湖，以其温泉而闻名。划桨者可以探索其广阔的海岸线和偏远的海湾。', difficultyInfo: '■ 中级 - 巨大冰川湖，可能有风浪，需经验', imageUrls: ['https://destinationlesstravel.com/wp-content/uploads/2022/10/Two-people-on-a-jet-skis-on-Harrison-Lake-in-Harrison-Hot-Springs-Canada.jpg'] },
        { id: 10, name: 'Tofino', coords: [49.1528, -125.9066], tags: ['海水', '冲浪', '温哥华岛'], difficulty: 'advanced', difficultyColor: '#f97316', description: '虽然以冲浪闻名，但托菲诺的平静入口和海湾为桨板运动提供了绝佳的机会，可以观赏野生动物。', difficultyInfo: '◆ 高级 - 海洋环境，复杂潮汐，野生动物', imageUrls: ['https://acitygirloutside.com/wp-content/uploads/2022/07/Cox-Bay-Beach-Lookout-A-City-Girl-Outside-1094x730.jpg', 'https://www.gotofino.com/tofinophotos/wp-content/uploads/2015/04/tofinoaerial20091003-IMG_5775.jpg', 'https://nomsmagazine.com/wp-content/uploads/2022/07/best-tofino-beaches-mackenzie-beach.jpg'] },
        { id: 11, name: 'Kalamalka Lake', coords: [50.1917, -119.2556], tags: ['淡水', '多色湖', '欧垦娜根'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Kalamalka Lake 以其青色和靛蓝色的水域而闻名，这些水域在夏季会变色，提供了令人惊叹的划桨背景。', difficultyInfo: '■ 中级 - 大型湖泊，欧垦娜根地区，可能有风浪', imageUrls: ['https://okanagan.com/wp-content/uploads/kalpark2.jpeg', 'https://okanaganrailtrail.ca/wp-content/uploads/2020/01/IMG_6435-2-scaled.jpg', 'https://preview.redd.it/vsxwjjecafp91.jpg?width=4000&format=pjpg&auto=webp&s=ff463d8e5e3a5392dbd853f67257544117fd9ffd'] },
        { id: 12, name: 'Garibaldi Lake', coords: [49.9325, -123.0275], tags: ['淡水', '高山湖', '徒步'], difficulty: 'expert', difficultyColor: '#dc2626', description: 'Garibaldi Lake 是一个令人惊叹的绿松石色冰川湖，需要长途跋涉才能到达。对于那些愿意努力的人来说，回报是无与伦比的。', difficultyInfo: '◆◆ 专家级 - 高山湖泊，需长途徒步携带装备', imageUrls: ['https://images.squarespace-cdn.com/content/v1/5a87961cbe42d637c54cab93/1615137926817-X8DSQMV605UOMW69TQQS/garibaldi-lake-hike.jpg', 'https://images.theoutbound.com/contents/104708/assets/1440219393276?w=1200&h=630&fit=crop&auto=format'] },
        { id: 13, name: 'Joffre Lakes', coords: [50.3686, -122.4981], tags: ['淡水', '高山湖', '彭伯顿'], difficulty: 'expert', difficultyColor: '#dc2626', description: 'Joffre Lakes 由三个绿松石色的冰川湖组成。虽然需要徒步，但在这些令人惊叹的高山湖泊上划桨是一次难忘的经历。', difficultyInfo: '◆◆ 专家级 - 三个高山冰川湖，需徒步携带装备', imageUrls: ['https://happiestoutdoors.ca/wp-content/uploads/2023/07/MiddleJoffreLakeViewpointHikers.jpg.webp', 'https://happiestoutdoors.ca/wp-content/uploads/2023/07/UpperJoffreLakeViewpoint.jpg.webp', 'https://604now.com/wp-content/uploads/2018/02/joffre_lakes_woman-e1553795227184-1024x464.jpg'] },
        { id: 14, name: 'Indian Arm', coords: [49.4000, -122.8667], tags: ['海水', '峡湾', '北温'], difficulty: 'advanced', difficultyColor: '#f97316', description: 'Indian Arm 是一个长而狭窄的冰川峡湾，从 Burrard Inlet 延伸。它提供了偏远而崎岖的划桨体验，有瀑布和野生动物。', difficultyInfo: '◆ 高级 - 峡湾环境，长距离，偏远地区', imageUrls: ['https://www.vancouverattractions.com/files/File/myAssets/92/large/Indian-Arm.jpg', 'https://portnut.weebly.com/uploads/5/1/7/0/5170415/7165220_orig.jpg', 'https://c8.alamy.com/comp/BFFPKE/granite-falls-provincial-park-indian-arm-british-columbia-canada-BFFPKE.jpg'] },
        { id: 15, name: 'Sasamat Lake', coords: [49.3144, -122.8917], tags: ['淡水', '家庭', '满地宝'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Sasamat Lake 是 Belcarra 地区公园中一个温暖的淡水湖。它有一个沙滩，是家庭和初学者的热门地点。', difficultyInfo: '● 初级 - 温暖淡水湖，沙滩，适合家庭', imageUrls: ['https://theoutdoorfamilyblog.wordpress.com/wp-content/uploads/2021/01/img_6437.jpg?w=1024', 'https://www.outdoorproject.com/sites/default/files/styles/cboxshow/public/1472602388/whitepine-9.jpg?itok=dXSHOyq8', 'https://theoutdoorfamilyblog.wordpress.com/wp-content/uploads/2021/01/img_3239.jpg?w=1024'] },
        { id: 16, name: 'Thetis Lake', coords: [48.4683, -123.4681], tags: ['淡水', '湖泊', '温哥华岛'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Thetis Lake 地区公园靠近维多利亚，有两个淡水湖，周围环绕着森林。这里是游泳和划桨的热门地点。', difficultyInfo: '● 初级 - 城市公园湖泊，近维多利亚', imageUrls: ['https://www.outdoorproject.com/sites/default/files/styles/cboxshow/public/1478075881/thetis-2.jpg?itok=Dy0txukm', 'https://hikeinclayoquot.com/images/trails/ThetisLake/Thetis_Lake_Hike_Victoria_5.jpg', 'https://hikeinvictoria.com/images/trails/ThetisLake/Thetis_Lake_Hike_Victoria_7.jpg'] },
        { id: 17, name: 'Alice Lake', coords: [49.7758, -123.1208], tags: ['淡水', '露营', '斯阔米什'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Alice Lake 省立公园有四个淡水湖，周围环绕着高耸的山脉。Alice Lake 本身是划桨和露营的热门地点。', difficultyInfo: '● 初级 - 省立公园湖泊，设施齐全', imageUrls: ['https://seatoskyparks.com/wpress/wp-content/gallery/alice-lake/alice_0090-00hqpe0002.jpg', 'https://happiestoutdoors.ca/wp-content/uploads/2022/02/AliceLakeSouthBeachReflection-1024x768.jpg.webp', 'https://hikeinwhistler.com/images/best/Hwy99/Sea_to_Sky_Attractions_Alice_Lake.jpg'] },
        { id: 18, name: 'Howe Sound', coords: [49.5667, -123.2500], tags: ['海水', '峡湾', '海天公路'], difficulty: 'advanced', difficultyColor: '#f97316', description: 'Howe Sound 是一个由岛屿组成的三角洲网络，提供了无尽的探索机会。从 Porteau Cove 或 Squamish 出发，欣赏壮丽的景色。', difficultyInfo: '◆ 高级 - 海峡，复杂水域条件', imageUrls: ['https://images.dailyhive.com/20210918153232/shutterstock_1252945951-e1632004453752.jpg', 'https://www.outdoorproject.com/sites/default/files/styles/hero_image_desktop/public/features/hsct2016-8-1.jpg?itok=krrWXjHS'] },
        { id: 19, name: 'Green Lake', coords: [50.1436, -122.9358], tags: ['淡水', '冰川湖', '惠斯勒'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Green Lake 是惠斯勒最大的湖泊，以其独特的绿色而闻名，这是由冰川融水造成的。它提供了令人惊叹的划桨体验。', difficultyInfo: '■ 中级 - 惠斯勒大湖，山地环境', imageUrls: ['https://hikeinwhistler.com/images/AtoZ/G/GreenLake/Green_Lake_Highway_Viewpoint_35.jpg', 'https://media.gettyimages.com/id/660743552/photo/green-lake-in-whistler-british-columbia-canada.jpg?s=1024x1024&w=gi&k=20&c=zT9BIKjx3I6IXCRESv3VQQIDU52E1SwyxMzAvqDFidc=', 'https://www.blackcombpeaks.com/sites/default/files/images/paddle_boarding_green_lake.JPG'] },
        { id: 20, name: 'English Bay', coords: [49.2850, -123.1500], tags: ['海水', '城市', '温哥华'], difficulty: 'beginner', difficultyColor: '#22c55e', description: '在温哥华市中心的天际线下划桨。English Bay 提供了独特的城市划桨体验，尤其是在日落时分。', difficultyInfo: '● 初级 - 城市海滩，救生员值守', imageUrls: ['https://c8.alamy.com/comp/J25910/paddlers-wait-for-thye-start-of-the-big-chop-summer-paddle-race-english-J25910.jpg', 'https://cottagelife.com/wp-content/uploads/2022/10/photo-1-1200x799.jpeg', 'https://images.dailyhive.com/20220711142747/beach-logs.jpg'] },
        { id: 21, name: 'Chilliwack Lake', coords: [49.1000, -121.4200], tags: ['淡水', '湖泊', '奇利瓦克', '风景'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Chilliwack Lake 是一个巨大而壮丽的冰川湖，坐落在同名省立公园内。湖水清澈寒冷，周围环绕着古老的森林和崎岖的山峰，为经验丰富的桨手提供了令人惊叹的划桨环境。', difficultyInfo: '■ 中级 - 大型冰川湖，偏远地区，需要经验', imageUrls: ['https://3.bp.blogspot.com/-7YacQXxsHFA/U-4RR0moSAI/AAAAAAAAELc/SwsbJSHpLes/s1600/DSCF7130.JPG', 'https://peakvisor.com/img/news/Chilliwack-Lake-Provincial-Park.jpg', 'https://thumbs.dreamstime.com/z/beach-chilliwack-lake-provincial-park-campground-forests-mountains-boat-launch-sxotsaquel-bc-towering-over-slopes-forested-188197894.jpg'] },
        { id: 22, name: 'Lindeman Lake', coords: [49.1380, -121.5750], tags: ['淡水', '高山湖', '徒步', '挑战'], difficulty: 'expert', difficultyColor: '#dc2626', description: 'Lindeman Lake 是一个令人惊叹的绿松石色小湖，需要通过一条短途但陡峭的步道才能到达。对于愿意携带桨板的探险者来说，在它清澈见底的水面上划桨是一次无与伦比的奖励。', difficultyInfo: '◆◆ 专家级 - 高山湖泊，需徒步携带装备', imageUrls: ['https://takemetotheriver.ca/wp-content/uploads/2024/04/IMG_20200705_132057_HQ.webp', 'https://worldadventurists.com/wp-content/uploads/2020/07/lindeman-lake-2021-05-900x600.jpg', 'https://i.pinimg.com/originals/f6/b7/37/f6b73729e990554a05600f92a65a3221.jpg'] },
        { id: 23, name: 'Taylor River', coords: [49.3050, -125.0450], tags: ['淡水', '河流', '温哥华岛'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Taylor River 以其水晶般清澈的河水而闻名，提供了一段宁静而美丽的漂流体验。河流平缓，非常适合在流经 Sproat Lake 的途中欣赏两岸的森林风光。', difficultyInfo: '● 初级 - 平缓河流，宁静漂流体验', imageUrls: ['https://www.splendidlytraveled.com/wp-content/uploads/2022/12/8416-Bljh564og.jpg', 'https://images.dailyhive.com/20230829130740/taylor-river-rest-area-bc-1024x529.jpg', 'https://i.pinimg.com/736x/93/df/93/93df9379c951462a21f96ef9e9e6ff3c.jpg'] },
        { id: 24, name: 'Sproat Lake', coords: [49.2370, -125.0000], tags: ['淡水', '湖泊', '温哥华岛', '热门'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Sproat Lake 是温哥华岛上一个大型的暖水湖，非常受家庭欢迎。这里不仅有广阔的水域可供探索，还有著名的史前岩画（Petroglyphs）可供观赏。', difficultyInfo: '● 初级 - 暖水湖，家庭友好，设施完善', imageUrls: ['https://content.app-sources.com/s/08901972839218532/uploads/Good_Eats/Beautiful_Sproat_Lake_0-3777782.jpg', 'https://live.staticflickr.com/65535/52260898113_b79dba9afb_b.jpg', 'https://www.womo-abenteuer.de/sites/default/files/u31593/img_9405.jpg'] },
        { id: 25, name: 'Belcarra Park', coords: [49.3080, -122.9150], tags: ['海水', '公园', '满地宝', '家庭'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Belcarra Regional Park 提供了一个美丽的野餐区和一个码头，使其成为探索 Indian Arm 平静水域的便捷下水点。这里是各级别桨手的理想之地，拥有迷人的景色和附近的步道。', difficultyInfo: '● 初级 - 公园环境，码头设施，适合各级别', imageUrls: ['https://theoutdoorfamilyblog.wordpress.com/wp-content/uploads/2020/09/img_1616.jpg?w=1024', 'https://campbellriverwhalewatching.com/wp-content/uploads/2020/06/Copy-of-desolation-sound-068-kayak-trips-copy-1024x639.jpg', 'https://worldadventurists.com/wp-content/uploads/2020/08/jugisland2020_029-780x520.jpg'] },
        { id: 26, name: 'Newcastle Island', coords: [49.1800, -123.9200], tags: ['海水', '海岛', '公园', '温哥华岛'], difficulty: 'intermediate', difficultyColor: '#eab308', description: '又名 Saysutshun，这是一个美丽的省立海洋公园，从纳奈莫港口划船片刻即可到达。环岛划行，探索砂岩悬崖、隐蔽海滩和丰富的历史。', difficultyInfo: '■ 中级 - 海岛环境，需要划船到达', imageUrl: 'https://placehold.co/800x400/F97316/FFFFFF?text=Newcastle+Island' },
        { id: 27, name: 'Westwood Lake', coords: [49.1600, -123.9950], tags: ['淡水', '湖泊', '热门', '温哥华岛'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Westwood Lake 是纳奈莫最受欢迎的休闲区之一。湖水温暖平静，非常适合初学者和家庭。湖边有沙滩和环湖步道，设施齐全。', difficultyInfo: '● 初级 - 温暖平静湖泊，适合初学者和家庭', imageUrl: 'https://placehold.co/800x400/EC4899/FFFFFF?text=Westwood+Lake' },
        { id: 28, name: 'Long Lake', coords: [49.2150, -124.0200], tags: ['淡水', '湖泊', '温哥华岛', '家庭'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Long Lake 是纳奈莫北部一个狭长的淡水湖，提供了充足的划桨空间。这里是进行长距离划行和游泳的热门地点，湖边设有公园和沙滩。', difficultyInfo: '■ 中级 - 狭长湖泊，适合长距离划行', imageUrl: 'https://placehold.co/800x400/38BDF8/FFFFFF?text=Long+Lake' },
        { id: 29, name: 'Porteau Cove', coords: [49.5694, -123.2300], tags: ['海水', '海天公路', '露营', '潜水'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Porteau Cove 省立公园是海天公路上的一颗明珠，拥有海滨露营地和一个独特的沉船潜水区。平静的海湾使其成为欣赏 Howe Sound 壮丽景色的理想划桨地点。', difficultyInfo: '● 初级 - 平静海湾，省立公园设施', imageUrls: ['https://theoutdoorfamilyblog.wordpress.com/wp-content/uploads/2020/08/img_8056.jpg?w=1024', 'https://theoutdoorfamilyblog.wordpress.com/wp-content/uploads/2020/08/img_8056.jpg?w=1024', 'https://lechameaubleu.fr/wp-content/uploads/2018/12/Canada-Colombie-Britannique-Porteau-Cove-CB-1170px-cp-1024x683.jpg'] },
        { id: 30, name: 'Furry Creek', coords: [49.5890, -123.2200], tags: ['海水', '海天公路', '风景', '安静'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Furry Creek 是一个风景如画的海滨社区，以其高尔夫球场而闻名。这里的水域通常很安静，提供了一个宁静的划桨环境，可以近距离欣赏 Howe Sound 的悬崖和入海的溪流。', difficultyInfo: '● 初级 - 安静海域，风景优美', imageUrls: ['https://media.istockphoto.com/id/1674494595/photo/olivers-landing-beach-in-furry-creek.jpg?s=1024x1024&w=is&k=20&c=hG58317GkDgUGVaO-OfsEWFMb1UejxzzhogMM6dd9n8=', 'https://i.ytimg.com/vi/DlSr_eEvclI/maxresdefault.jpg', 'https://i0.wp.com/sylviesadventures.com/wp-content/uploads/2023/09/IMG_1503.jpg?fit=1200%2C800&ssl=1'] },
        { id: 31, name: 'Sp\'akw\'us Feather Park', coords: [49.6885, -123.1610], tags: ['海水', '河口', '斯阔米什', '风景'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Sp\'akw\'us Feather Park 是进入斯阔米什河口和豪湾的热门下水点。这里可以欣赏到斯塔瓦姆斯酋长岩的壮丽景色，但水域易受风力影响，有时会带来挑战。', difficultyInfo: '■ 中级 - 河口环境，易受风力影响', imageUrls: ['https://live.staticflickr.com/65535/53908005887_a6418662e3_k.jpg', 'https://landezine.com/wp-content/uploads/2025/06/3-1.jpg', 'https://www.vmcdn.ca/f/files/squamishchief/images/emergency/kitingthumbnail_img_0396.jpg;w=1200;h=800;mode=crop'] },
        { id: 32, name: 'Sandy Beach', coords: [49.3780, -123.3350], tags: ['海水', '沙滩', '宝云岛', '家庭'], difficulty: 'beginner', difficultyColor: '#22c55e', description: 'Sandy Beach 位于宝云岛的东侧，靠近 Snug Cove 码头，是一个方便到达的沙滩。这里的水域相对平静，非常适合家庭和初学者进行休闲划桨。', difficultyInfo: '● 初级 - 平静沙滩，家庭友好，方便到达', imageUrl: 'https://www.vmcdn.ca/f/files/bowenislandundercurrent/images/environment/nature-club/sandy-beach-panorama.jpg;w=1200;h=800;mode=crop' },
        { id: 33, name: 'Tunstall Bay', coords: [49.3800, -123.3850], tags: ['海水', '日落', '宝云岛', '风景'], difficulty: 'intermediate', difficultyColor: '#eab308', description: 'Tunstall Bay 位于宝云岛的西海岸，是观赏壮丽日落的绝佳地点。这里的海滩更具野性，水域可能更具挑战性，适合有一定经验的桨手。', difficultyInfo: '■ 中级 - 野性海滩，更具挑战性', imageUrl: 'https://thedognetwork.ca/wp-content/uploads/2023/03/Tunstall-Bay-Beach-Off-Leash-Dog-Park-Bowen-Island-BC-21-1080x606.jpg' },
    ];

    const [sortedDestinations, setSortedDestinations] = useState([]);

    // 使用 Haversine 公式计算距离
    function calculateDistance(lat1, lon1, lat2, lon2) {
        const R = 6371; // 地球半径（公里）
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    }

    // 初始化排序逻辑
    useEffect(() => {
        const vancouverCoords = { lat: 49.2827, lon: -123.1207 }; // 温哥华市中心坐标

        // 1. 分离大陆/近岛和温哥华岛的目的地
        const mainlandDests = destinations.filter(d => !d.tags.includes('温哥华岛'));
        const islandDests = destinations.filter(d => d.tags.includes('温哥华岛'));

        // 2. 为大陆/近岛目的地计算距离
        mainlandDests.forEach(dest => {
            dest.distance = calculateDistance(
                vancouverCoords.lat, vancouverCoords.lon,
                dest.coords[0], dest.coords[1]
            );
        });

        // 3. 按距离对大陆/近岛目的地进行排序
        mainlandDests.sort((a, b) => a.distance - b.distance);

        // 4. 合并列表，并重新分配 ID 和生成 Google Maps 链接
        const sortedDestinations = [...mainlandDests, ...islandDests];
        sortedDestinations.forEach((dest, index) => {
            dest.id = index + 1;
            const query = `${encodeURIComponent(dest.name)},${dest.coords[0]},${dest.coords[1]}`;
            dest.googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${query}`;
        });
        
        setSortedDestinations(sortedDestinations);
    }, []);

    // 根据隐藏状态重新排序目的地
    const getFilteredAndSortedDestinations = () => {
        const visible = sortedDestinations.filter(dest => !hiddenDestinations.has(dest.id));
        const hidden = sortedDestinations.filter(dest => hiddenDestinations.has(dest.id));
        return [...visible, ...hidden];
    };

    // 切换目的地隐藏状态
    const toggleDestinationVisibility = (id, event) => {
        event.stopPropagation(); // 防止触发卡片点击
        const newHiddenDestinations = new Set(hiddenDestinations);
        if (newHiddenDestinations.has(id)) {
            newHiddenDestinations.delete(id);
        } else {
            newHiddenDestinations.add(id);
            // 如果隐藏的是当前激活的目的地，关闭详情卡片
            if (activeDestinationId === id) {
                hideDetailCard();
            }
        }
        setHiddenDestinations(newHiddenDestinations);
    };

    // 地图初始化
    useEffect(() => {
        if (mapRef.current && !mapInstanceRef.current) {
            mapInstanceRef.current = L.map(mapRef.current, {
                center: [49.8, -122.9], // BC 省中心区域
                zoom: 8,
                zoomControl: false,
                attributionControl: false,
            });

            // 使用 CartoDB 暗色主题图层
            L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
                maxZoom: 19,
            }).addTo(mapInstanceRef.current);

            // 页面加载时动画显示难度图例
            setTimeout(() => {
                const legend = document.getElementById('difficulty-legend');
                if (legend) {
                    legend.style.opacity = '1';
                    legend.style.transform = 'translateY(0)';
                }
            }, 600); // 600ms 延迟，让地图先加载

            return () => {
                if (mapInstanceRef.current) {
                    mapInstanceRef.current.remove();
                    mapInstanceRef.current = null;
                }
            };
        }
    }, []);

    // 添加地图标记
    useEffect(() => {
        if (mapInstanceRef.current && sortedDestinations.length > 0) {
            // 清除现有标记
            Object.values(markersRef.current).forEach(marker => {
                mapInstanceRef.current.removeLayer(marker);
            });
            markersRef.current = {};

            // 只添加可见目的地的地图标记
            sortedDestinations.forEach(dest => {
                if (!hiddenDestinations.has(dest.id)) {
                    // 根据难度等级添加类名
                    const difficultyClass = dest.difficulty ? `difficulty-${dest.difficulty}` : '';
                    
                    const icon = L.divIcon({
                        className: 'custom-map-marker-container',
                        html: `<div id="marker-${dest.id}" class="custom-map-marker w-6 h-6 ${difficultyClass}"><div class="inner-dot"></div></div>`,
                        iconSize: [24, 24],
                        iconAnchor: [12, 12]
                    });

                    const marker = L.marker(dest.coords, { icon: icon }).addTo(mapInstanceRef.current);
                    marker.on('click', () => selectDestination(dest.id));
                    markersRef.current[dest.id] = marker;
                }
            });
        }
    }, [sortedDestinations, hiddenDestinations]);

    // 自动滚动功能
    useEffect(() => {
        if (!isAutoScrolling) return;
        
        const timer = setTimeout(() => {
            const container = document.getElementById('top-destinations-list');
            if (!container || !isAutoScrolling) return;
            
            let scrollPosition = 0;
            const scrollSpeed = 1.12; // 每帧滚动像素数 (减慢30%)
            
            const smoothScroll = () => {
                if (!isAutoScrolling) return;
                
                const maxScroll = container.scrollWidth - container.clientWidth;
                
                if (maxScroll <= 0) {
                    // 如果没有足够内容滚动，跳过
                    animationIdRef.current = requestAnimationFrame(smoothScroll);
                    return;
                }
                
                // 如果到达末尾，重置到开始
                if (scrollPosition >= maxScroll) {
                    scrollPosition = 0;
                } else {
                    scrollPosition += scrollSpeed;
                }
                
                container.scrollLeft = scrollPosition;
                animationIdRef.current = requestAnimationFrame(smoothScroll);
            };
            
            if (isAutoScrolling) {
                animationIdRef.current = requestAnimationFrame(smoothScroll);
            }
        }, 200); // 延迟0.2秒启动
        
        return () => {
            clearTimeout(timer);
            if (animationIdRef.current) {
                cancelAnimationFrame(animationIdRef.current);
                animationIdRef.current = null;
            }
        };
    }, [isAutoScrolling]);

    // 停止自动滚动
    const stopAutoScroll = () => {
        setIsAutoScrolling(false);
        if (animationIdRef.current) {
            cancelAnimationFrame(animationIdRef.current);
        }
    };

    // 核心交互函数
    function selectDestination(id) {
        stopAutoScroll(); // 用户选中目的地时停止自动滚动
        if (activeDestinationId === id) {
            hideDetailCard();
            return;
        }
        
        // 更新激活状态
        updateActiveState(id);
        
        const destination = sortedDestinations.find(d => d.id === id);
        
        // 移动地图 - 简单固定偏移，向北移动地图中心使目标点在上半部分
        if (mapInstanceRef.current && destination) {
            // 向北偏移约0.015度（大约1.7公里），让目标点出现在地图上半部分
            const offsetCoords = [
                destination.coords[0] - 0.015, // 地图中心向南，目标点出现在北边（上方）
                destination.coords[1]
            ];
            
            mapInstanceRef.current.flyTo(offsetCoords, 13, {
                animate: true,
                duration: 1.5
            });
        }

        // 显示详情卡片
        showDetailCard(destination);

        // 滚动顶部列表到视图中
        const cardElement = document.getElementById(`card-${id}`);
        if (cardElement) {
            cardElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }

    function updateActiveState(newId) {
        // 清除所有激活状态（防止有遗留的激活状态）
        const allMarkers = document.querySelectorAll('.custom-map-marker');
        allMarkers.forEach(marker => marker.classList.remove('active'));
        
        const allCards = document.querySelectorAll('.top-card');
        allCards.forEach(card => card.classList.remove('!border-sky-400', '!bg-white/20'));

        // 设置新的激活状态
        setActiveDestinationId(newId);
        if (newId) {
            const newMarkerEl = document.getElementById(`marker-${newId}`);
            if (newMarkerEl) newMarkerEl.classList.add('active');
            
            const newCardEl = document.getElementById(`card-${newId}`);
            if (newCardEl) newCardEl.classList.add('!border-sky-400', '!bg-white/20');
        }
    }

    // 详情卡片控制
    function showDetailCard(destination) {
        const detailCard = document.getElementById('detail-card');
        const detailImage = document.getElementById('detail-image');
        const detailName = document.getElementById('detail-name');
        const detailDescription = document.getElementById('detail-description');
        const detailGmapsLink = document.getElementById('detail-gmaps-link');
        const tagsContainer = document.getElementById('detail-tags');

        if (detailImage) detailImage.src = destination.imageUrls ? destination.imageUrls[0] : destination.imageUrl;
        if (detailImage) detailImage.alt = `${destination.name} 的图片`;
        
        // 显示多张图片
        const imageGallery = document.getElementById('image-gallery');
        if (imageGallery) {
            if (destination.imageUrls) {
                imageGallery.innerHTML = destination.imageUrls.map((url, index) => 
                    `<img src="${url}" alt="${destination.name} 图片 ${index + 1}" class="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" onclick="document.getElementById('detail-image').src='${url}'" />`
                ).join('');
            } else {
                imageGallery.innerHTML = `<img src="${destination.imageUrl}" alt="${destination.name} 图片" class="w-full h-16 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity" onclick="document.getElementById('detail-image').src='${destination.imageUrl}'" />`;
            }
        }
        if (detailName) detailName.innerText = destination.name;
        if (detailDescription) detailDescription.innerText = destination.description;
        if (detailGmapsLink) detailGmapsLink.href = destination.googleMapsUrl;

        if (tagsContainer) {
            tagsContainer.innerHTML = destination.tags.map(tag => 
                `<span class="text-sm text-amber-200/90 px-3 py-1 rounded-full backdrop-blur-xl" style="background: linear-gradient(135deg, rgba(251, 191, 36, 0.15) 0%, rgba(251, 191, 36, 0.08) 100%); border: 1px solid rgba(251, 191, 36, 0.2); box-shadow: inset 0 1px 0 0 rgba(255, 255, 255, 0.1)">${tag}</span>`
            ).join('');
        }

        // 添加难度符号
        const difficultyContainer = document.getElementById('detail-difficulty');
        const difficultyInfoContainer = document.getElementById('detail-difficulty-info');
        
        if (difficultyContainer && destination.difficulty) {
            let difficultyHtml = '';
            if (destination.difficulty === 'beginner') {
                difficultyHtml = '<div class="w-3 h-3 rounded-full bg-green-500"></div>';
            } else if (destination.difficulty === 'intermediate') {
                difficultyHtml = '<div class="w-3 h-3 bg-blue-500"></div>';
            } else if (destination.difficulty === 'advanced') {
                difficultyHtml = '<div class="w-4 h-4 bg-white rounded-sm flex items-center justify-center"><div class="w-2.5 h-2.5 bg-black transform rotate-45"></div></div>';
            } else if (destination.difficulty === 'expert') {
                difficultyHtml = '<div class="bg-white rounded-sm px-1 py-0.5 flex gap-0.5 h-4 items-center"><div class="w-1.5 h-1.5 bg-black transform rotate-45"></div><div class="w-1.5 h-1.5 bg-black transform rotate-45"></div></div>';
            }
            difficultyContainer.innerHTML = difficultyHtml;
        }
        
        // 直接显示难度说明
        if (difficultyInfoContainer && destination.difficultyInfo) {
            difficultyInfoContainer.innerText = destination.difficultyInfo;
            difficultyInfoContainer.classList.remove('hidden');
        } else if (difficultyInfoContainer) {
            difficultyInfoContainer.classList.add('hidden');
        }

        if (detailCard) {
            detailCard.classList.remove('translate-y-full');
        }
        
        // 隐藏难度图例，带向下滑动动画
        const legend = document.getElementById('difficulty-legend');
        if (legend) {
            legend.style.opacity = '0';
            legend.style.transform = 'translateY(100%)';
        }
    }

    function hideDetailCard() {
        const detailCard = document.getElementById('detail-card');
        
        if (detailCard) {
            detailCard.classList.add('translate-y-full');
        }
        
        updateActiveState(null);
        if (mapInstanceRef.current) {
            mapInstanceRef.current.flyTo([49.8, -122.9], 8, { animate: true, duration: 1 });
        }
        
        // 延迟显示难度图例，带动画
        const legend = document.getElementById('difficulty-legend');
        if (legend) {
            setTimeout(() => {
                legend.style.opacity = '1';
                legend.style.transform = 'translateY(0)';
            }, 600); // 600ms 延迟
        }
    }

    return (
        <div className="bg-gray-900 overflow-hidden h-screen">
            <style>{`
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
            `}</style>

            {/* 地图容器 */}
            <div id="map" ref={mapRef} className="absolute inset-0 z-0"></div>

            {/* 顶部目的地列表 */}
            <div id="top-destinations-container" className="fixed top-0 left-0 right-0 z-10 pt-8 md:pt-6">
                <div 
                    id="top-destinations-list" 
                    className="no-scrollbar flex gap-3 overflow-x-auto px-4"
                    onMouseEnter={stopAutoScroll}
                    onTouchStart={stopAutoScroll}
                >
                    {getFilteredAndSortedDestinations().map(dest => (
                        <div
                            key={dest.id}
                            id={`card-${dest.id}`}
                            className={`top-card flex-shrink-0 w-48 p-3 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl shadow-lg cursor-pointer transition-all duration-300 hover:border-white/40 hover:bg-white/20 relative ${
                                activeDestinationId === dest.id ? '!border-sky-400 !bg-white/20' : ''
                            } ${hiddenDestinations.has(dest.id) ? 'opacity-50' : ''}`}
                            onClick={() => selectDestination(dest.id)}
                        >
                            {/* 眼睛按钮 */}
                            <button
                                className="absolute top-2 right-2 w-6 h-6 flex items-center justify-center bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-black/60 transition-colors z-10"
                                onClick={(e) => toggleDestinationVisibility(dest.id, e)}
                                title={hiddenDestinations.has(dest.id) ? "显示目的地" : "隐藏目的地"}
                            >
                                {hiddenDestinations.has(dest.id) ? (
                                    // 闭眼图标
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                                    </svg>
                                ) : (
                                    // 睁眼图标
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                            
                            <div className="flex items-center gap-2 pr-8">
                                <h3 className="text-white font-semibold truncate">{dest.name}</h3>
                                {dest.difficulty && (
                                    <div className="flex-shrink-0" title={dest.difficultyInfo || ''}>
                                        {dest.difficulty === 'beginner' && (
                                            <div className="w-3 h-3 rounded-full bg-green-500"></div>
                                        )}
                                        {dest.difficulty === 'intermediate' && (
                                            <div className="w-3 h-3 bg-blue-500"></div>
                                        )}
                                        {dest.difficulty === 'advanced' && (
                                            <div className="w-4 h-4 bg-white rounded-sm flex items-center justify-center">
                                                <div className="w-2.5 h-2.5 bg-black transform rotate-45"></div>
                                            </div>
                                        )}
                                        {dest.difficulty === 'expert' && (
                                            <div className="bg-white rounded-sm px-1 py-0.5 flex gap-0.5 h-4 items-center">
                                                <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                                                <div className="w-1.5 h-1.5 bg-black transform rotate-45"></div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                                {dest.tags.map(tag => (
                                    <span key={tag} className="text-xs text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full">
                                        {tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* 底部详情卡片 - Liquid Glass 设计 */}
            <div id="detail-card" className="fixed bottom-0 left-0 right-0 z-20 p-4 transform translate-y-full transition-transform duration-700 ease-in-out">
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
                    <div className="relative">
                        <img id="detail-image" src="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='400'%3E%3Crect width='800' height='400' fill='%23374151'/%3E%3C/svg%3E" alt="目的地图片" className="w-full h-48 md:h-64 object-cover" />
                        
                        {/* 图片底部渐变蒙版 - 使图片部分透明 */}
                        <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
                            style={{
                                background: `linear-gradient(0deg, rgba(0, 0, 0, 0.6) 0%, transparent 100%)`
                            }}>
                        </div>
                        
                        {/* 难度信息条 - 覆盖在透明化的图片区域 */}
                        <div id="detail-difficulty-info" className="absolute bottom-0 left-0 right-0 px-4 py-2 text-sm text-white">
                            {/* 难度说明将通过 JS 动态插入 */}
                        </div>
                        
                        <button id="close-detail-card" onClick={hideDetailCard} className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center backdrop-blur-2xl rounded-full text-white/80 hover:text-white transition-all duration-300 z-10"
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
                        
                    </div>
                    <div className="p-5 md:p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <h2 id="detail-name" className="text-2xl md:text-3xl font-bold text-white"></h2>
                                <div id="detail-difficulty">
                                    {/* 难度符号将通过 JS 动态插入 */}
                                </div>
                            </div>
                            {/* Google Maps 小图标按钮 */}
                            <a id="detail-gmaps-link" href="#" target="_blank" rel="noopener noreferrer" className="w-8 h-8 flex items-center justify-center backdrop-blur-xl rounded-full text-white/60 hover:text-white transition-all duration-300"
                                style={{
                                    background: `linear-gradient(135deg, 
                                        rgba(255, 255, 255, 0.08) 0%, 
                                        rgba(255, 255, 255, 0.05) 100%)`,
                                    boxShadow: `
                                        inset 0 1px 0 0 rgba(255, 255, 255, 0.15),
                                        inset 0 -1px 0 0 rgba(0, 0, 0, 0.05),
                                        0 2px 8px rgba(0, 0, 0, 0.2)`
                                }}>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
                                </svg>
                            </a>
                        </div>
                        <div id="detail-tags" className="flex flex-wrap gap-2 mt-2">
                            {/* 标签将通过 JS 动态插入 */}
                        </div>
                        <p id="detail-description" className="text-gray-300 mt-4 text-sm md:text-base leading-relaxed"></p>
                        <div className="mt-4">
                            <div id="image-gallery" className="flex gap-2 overflow-x-auto">
                                {/* 图片缩略图将通过 JS 动态插入 */}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 难度图例 - 全宽底部横条 */}
            <div id="difficulty-legend" className="fixed bottom-0 left-0 right-0 z-10 backdrop-blur-2xl h-12 transition-all duration-300"
                style={{
                    opacity: 0,
                    transform: 'translateY(100%)',
                    background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.1) 0%, 
                        rgba(255, 255, 255, 0.05) 25%,
                        rgba(255, 255, 255, 0.08) 50%,
                        rgba(255, 255, 255, 0.03) 75%,
                        rgba(255, 255, 255, 0.06) 100%)`,
                    borderTop: `1px solid rgba(255, 255, 255, 0.15)`,
                    boxShadow: `
                        inset 0 1px 0 0 rgba(255, 255, 255, 0.1),
                        0 -4px 16px rgba(0, 0, 0, 0.2)`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '32px',
                    transform: 'translateY(-4px)'
                }}>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                    <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(34, 197, 94, 0.7)'}}>
                        <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                    </div>
                    <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>初级</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                    <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(234, 179, 8, 0.7)'}}>
                        <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                    </div>
                    <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>中级</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                    <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(249, 115, 22, 0.7)'}}>
                        <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                    </div>
                    <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>高级</span>
                </div>
                <div style={{display: 'flex', alignItems: 'center', gap: '8px', transform: 'translateY(-3px)'}}>
                    <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '1px solid rgba(255, 255, 255, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)', opacity: '0.8', backgroundColor: 'rgba(220, 38, 38, 0.7)'}}>
                        <div style={{width: '6px', height: '6px', backgroundColor: 'rgba(255, 255, 255, 0.8)', borderRadius: '50%'}}></div>
                    </div>
                    <span style={{color: 'rgba(255, 255, 255, 0.85)', fontSize: '12px', fontWeight: '500'}}>专家级</span>
                </div>
            </div>
        </div>
    );
}

export default App;