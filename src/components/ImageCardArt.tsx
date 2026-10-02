import React from "react";

interface ImageCardArtProps {
  svgName: string;
  className?: string;
}

/**
 * 艺术级水彩画风格矢量画作系统
 * 融合传统东方水墨水彩、现代独立艺术杂志留白美学与纯棉纸肌理
 */
export const ImageCardArt: React.FC<ImageCardArtProps> = ({ svgName, className = "" }) => {
  return (
    <svg
      viewBox="0 0 300 400"
      className={`w-full h-full ${className}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* 粗纹水彩纯棉纸纹理滤镜 */}
        <filter id="wc-paper-grain" x="-10%" y="-10%" width="120%" height="120%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="4" result="noise" />
          <feColorMatrix
            type="matrix"
            values="
              0.88 0 0 0 0.12
              0 0.86 0 0 0.12
              0 0 0.82 0 0.12
              0 0 0 0.14 0"
            in="noise"
            result="coloredNoise"
          />
          <feBlend mode="multiply" in="SourceGraphic" in2="coloredNoise" />
        </filter>

        {/* 湿画法水晕渗化滤镜 */}
        <filter id="wc-bleed" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="3.2" result="blur" />
          <feTurbulence type="turbulence" baseFrequency="0.04" numOctaves="3" result="turb" />
          <feDisplacementMap in="blur" in2="turb" scale="5" xChannelSelector="R" yChannelSelector="G" />
        </filter>

        {/* 高级东方水彩调色板渐层 */}
        <linearGradient id="gradient-dawn" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#8A9BA8" />
          <stop offset="45%" stopColor="#D8A99B" stopOpacity="0.8" />
          <stop offset="75%" stopColor="#F2D7B6" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#F8F3E8" />
        </linearGradient>

        <linearGradient id="gradient-forest-mist" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#D4DDD6" />
          <stop offset="60%" stopColor="#A2B3A4" stopOpacity="0.75" />
          <stop offset="100%" stopColor="#4A5D4E" />
        </linearGradient>

        <linearGradient id="gradient-twilight-indigo" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1B2232" />
          <stop offset="40%" stopColor="#2E3A52" />
          <stop offset="80%" stopColor="#5D4B66" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#D98A73" stopOpacity="0.75" />
        </linearGradient>

        <linearGradient id="gradient-tea-warmth" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#EFE8DA" />
          <stop offset="50%" stopColor="#DFD0BC" />
          <stop offset="100%" stopColor="#9C7759" />
        </linearGradient>
      </defs>

      {/* 水彩纸底板与毛边撕纸质感衬底 */}
      <rect width="300" height="400" fill="#FAF6EE" />
      <rect x="6" y="6" width="288" height="388" rx="10" fill="#F8F3E9" stroke="#EAE3D2" strokeWidth="1" />

      {/* 画面水彩内容层 */}
      <g filter="url(#wc-paper-grain)">
        {renderArtScene(svgName)}
      </g>

      {/* 优雅纸质微阴影内框 */}
      <rect x="6" y="6" width="288" height="388" rx="10" stroke="#000000" strokeWidth="1" strokeOpacity="0.04" fill="none" />
    </svg>
  );
};

function renderArtScene(name: string): React.ReactNode {
  switch (name) {
    // 旋转楼梯
    case "winding_stairs":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#24262E" />
          <circle cx="150" cy="80" r="45" fill="#FAF3DF" opacity="0.9" filter="url(#wc-bleed)" />
          <circle cx="150" cy="80" r="25" fill="#FFFFFF" />
          {/* 向上旋转的水彩弧线阶梯 */}
          <path d="M150 80 Q210 110 180 150 Q130 190 190 230 Q240 270 170 320 Q110 360 150 390" stroke="#756A5C" strokeWidth="16" fill="none" opacity="0.6" strokeLinecap="round" />
          <path d="M150 80 Q210 110 180 150 Q130 190 190 230 Q240 270 170 320 Q110 360 150 390" stroke="#FAF2DC" strokeWidth="6" fill="none" opacity="0.8" strokeLinecap="round" />
        </g>
      );

    // 裂缝中的幼芽
    case "sprouting_seed":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#98938A" />
          <path d="M12 250 L110 240 L145 285 L180 270 L288 290" stroke="#68625A" strokeWidth="5" fill="none" />
          <polygon points="140,280 152,280 155,388 138,388" fill="#3D3730" />
          {/* 嫩绿双叶幼苗与温润水色 */}
          <circle cx="146" cy="220" r="35" fill="#A8D497" opacity="0.35" filter="url(#wc-bleed)" />
          <path d="M146 295 Q146 240 148 190" stroke="#48783A" strokeWidth="4.5" fill="none" strokeLinecap="round" />
          <path d="M148 215 Q115 195 110 165 Q135 170 148 200" fill="#75A862" />
          <path d="M148 205 Q180 185 190 155 Q168 165 148 190" fill="#88C072" />
        </g>
      );

    // 林间的镜子
    case "mirror_in_forest":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#1C2720" />
          {/* 幽深树影 */}
          <rect x="35" y="12" width="45" height="376" fill="#131B16" />
          <rect x="220" y="12" width="55" height="376" fill="#131B16" />
          {/* 椭圆镜框架与晴空倒影 */}
          <ellipse cx="145" cy="230" rx="58" ry="98" fill="#4B3B2E" />
          <ellipse cx="145" cy="230" rx="52" ry="92" fill="#B4D5E8" />
          <circle cx="170" cy="180" r="22" fill="#FFFFFF" opacity="0.8" filter="url(#wc-bleed)" />
          <ellipse cx="130" cy="250" rx="38" ry="14" fill="#FFFFFF" opacity="0.7" />
        </g>
      );

    // 靠墙的单车
    case "bicycle_wall":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#ECE5D8" />
          <line x1="12" y1="310" x2="288" y2="310" stroke="#C2B7A2" strokeWidth="3" />
          {/* 复古自行车 */}
          <circle cx="95" cy="305" r="36" stroke="#45423E" strokeWidth="4" fill="none" />
          <circle cx="205" cy="305" r="36" stroke="#45423E" strokeWidth="4" fill="none" />
          <line x1="95" y1="305" x2="145" y2="305" stroke="#7656E8" strokeWidth="4" />
          <line x1="145" y1="305" x2="190" y2="245" stroke="#7656E8" strokeWidth="4" />
          <line x1="95" y1="305" x2="135" y2="240" stroke="#7656E8" strokeWidth="4" />
          <line x1="135" y1="240" x2="190" y2="245" stroke="#7656E8" strokeWidth="4" />
          <line x1="205" y1="305" x2="190" y2="230" stroke="#45423E" strokeWidth="4" />
          {/* 车座与车篮野花 */}
          <line x1="125" y1="235" x2="145" y2="235" stroke="#222222" strokeWidth="5" strokeLinecap="round" />
          <rect x="195" y="228" width="24" height="20" fill="#B28C64" rx="3" />
          <circle cx="202" cy="222" r="6" fill="#E87C68" />
          <circle cx="214" cy="220" r="5" fill="#E8BF68" />
        </g>
      );

    // 山间微弱篝火
    case "mountain_fire":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#131924" />
          <polygon points="0,240 100,160 220,260" fill="#1C2432" />
          <polygon points="120,260 230,170 300,250 300,388 0,388" fill="#171F2C" />
          {/* 篝火光晕与跳动火苗 */}
          <circle cx="150" cy="305" r="75" fill="#E87842" opacity="0.3" filter="url(#wc-bleed)" />
          <circle cx="150" cy="305" r="38" fill="#F49E3E" opacity="0.5" />
          <line x1="120" y1="325" x2="180" y2="305" stroke="#382518" strokeWidth="6" strokeLinecap="round" />
          <line x1="125" y1="308" x2="175" y2="323" stroke="#422C1D" strokeWidth="6" strokeLinecap="round" />
          <path d="M150 270 Q160 295 155 315 Q145 315 140 295 Q142 280 150 270 Z" fill="#FFAA38" />
          <path d="M148 285 Q154 298 150 312 Q144 312 144 298 Z" fill="#FFE070" />
        </g>
      );

    // 冒热气的茶杯
    case "teacup_steam":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#F4EFE6" />
          <line x1="12" y1="290" x2="288" y2="290" stroke="#D3C3AB" strokeWidth="3" />
          <ellipse cx="150" cy="285" rx="60" ry="12" fill="#DCD3C2" stroke="#A0947F" strokeWidth="2" />
          <path d="M110 215 L190 215 L178 275 L122 275 Z" fill="#FAF7F2" stroke="#8A7E6C" strokeWidth="3.5" />
          <path d="M182 225 C205 225, 205 260, 178 260" stroke="#8A7E6C" strokeWidth="3.5" fill="none" />
          {/* 升腾的水彩柔白雾汽 */}
          <path d="M140 200 Q125 160 145 130 T135 75" stroke="#A89E90" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.6" filter="url(#wc-bleed)" />
          <path d="M160 200 Q175 155 155 125 T165 65" stroke="#A89E90" strokeWidth="3.5" strokeLinecap="round" fill="none" opacity="0.5" filter="url(#wc-bleed)" />
        </g>
      );

    // 石台上的黄铜钥匙
    case "key_on_stone":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#C5CCD0" />
          <polygon points="30,160 270,160 250,330 50,330" fill="#7E8D94" stroke="#5F6D74" strokeWidth="3.5" />
          {/* 古铜钥匙 */}
          <circle cx="110" cy="245" r="24" stroke="#9E732E" strokeWidth="5.5" fill="#DDBF6F" />
          <circle cx="110" cy="245" r="10" fill="#7E8D94" />
          <line x1="134" y1="245" x2="210" y2="245" stroke="#9E732E" strokeWidth="5.5" strokeLinecap="round" />
          <line x1="190" y1="245" x2="190" y2="262" stroke="#9E732E" strokeWidth="4.5" />
          <line x1="202" y1="245" x2="202" y2="266" stroke="#9E732E" strokeWidth="4.5" />
        </g>
      );

    // 静止的表盘
    case "clock_no_hands":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#EFE9DC" />
          <circle cx="150" cy="200" r="95" fill="#FAF7F0" stroke="#7A7264" strokeWidth="3.5" />
          <circle cx="150" cy="200" r="5" fill="#3D372E" />
          {/* 12个微型刻度 */}
          <circle cx="150" cy="120" r="4" fill="#3D372E" />
          <circle cx="150" cy="280" r="4" fill="#3D372E" />
          <circle cx="70" cy="200" r="4" fill="#3D372E" />
          <circle cx="230" cy="200" r="4" fill="#3D372E" />
          <circle cx="190" cy="130" r="3" fill="#7A7264" />
          <circle cx="220" cy="160" r="3" fill="#7A7264" />
          <circle cx="220" cy="240" r="3" fill="#7A7264" />
          <circle cx="190" cy="270" r="3" fill="#7A7264" />
          <circle cx="110" cy="270" r="3" fill="#7A7264" />
          <circle cx="80" cy="240" r="3" fill="#7A7264" />
          <circle cx="80" cy="160" r="3" fill="#7A7264" />
          <circle cx="110" cy="130" r="3" fill="#7A7264" />
        </g>
      );

    // 避风港的小帆船
    case "sailboat_harbor":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#DEE5DA" />
          <rect x="12" y="220" width="276" height="168" fill="#748E8B" />
          <ellipse cx="180" cy="280" rx="60" ry="12" fill="#586E6B" opacity="0.4" filter="url(#wc-bleed)" />
          {/* 小白船与桅杆 */}
          <path d="M130 250 L230 250 L212 272 L148 272 Z" fill="#F8F6F0" stroke="#3D4D4B" strokeWidth="2.5" />
          <line x1="172" y1="120" x2="172" y2="250" stroke="#332B25" strokeWidth="3" />
          <polygon points="172,135 210,235 172,235" fill="#E8E2D2" />
        </g>
      );

    // 隧道尽头的光
    case "tunnel_light":
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#141312" />
          <path d="M12 388 L12 180 Q150 50 288 180 L288 388 Z" fill="#201E1C" />
          <path d="M45 388 L45 200 Q150 95 255 200 L255 388 Z" fill="#302D2A" />
          <path d="M80 388 L80 230 Q150 145 220 230 L220 388 Z" fill="#423E3A" />
          {/* 明亮椭圆光晕 */}
          <ellipse cx="150" cy="270" rx="55" ry="65" fill="#FFF2CE" opacity="0.3" filter="url(#wc-bleed)" />
          <ellipse cx="150" cy="270" rx="35" ry="45" fill="#FFF7DF" />
          <ellipse cx="150" cy="270" rx="18" ry="26" fill="#FFFFFF" />
        </g>
      );

    // 默认诗意水彩画意境（涵盖 88 体系中其余卡牌的高级画境渲染）
    default:
      return renderMasterProceduralArt(name);
  }
}

/**
 * 针对其余卡牌的高阶意境水彩生成器
 * 精心构建山水、云霭、树梢、光柱与静物意象
 */
function renderMasterProceduralArt(name: string): React.ReactNode {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash << 5) - hash + name.charCodeAt(i);
  }
  const mode = Math.abs(hash) % 5;

  switch (mode) {
    case 0: // 暮山烟云与归鸟
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="url(#gradient-dawn)" />
          <circle cx="90" cy="110" r="38" fill="#FAF5E8" opacity="0.8" />
          <path d="M12 250 Q100 200 200 230 T288 210 L288 388 L12 388 Z" fill="#586776" opacity="0.75" />
          <path d="M12 290 Q120 260 220 280 T288 260 L288 388 L12 388 Z" fill="#3D4752" />
          {/* 归鸟水墨点缀 */}
          <path d="M140 130 Q145 126 150 130 Q155 126 160 130" stroke="#2B2D38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
          <path d="M165 145 Q170 141 175 145 Q180 141 185 145" stroke="#2B2D38" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </g>
      );

    case 1: // 苍翠林荫与林中光柱
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="url(#gradient-forest-mist)" />
          <polygon points="120,12 180,12 240,388 90,388" fill="#FFFADB" opacity="0.25" filter="url(#wc-bleed)" />
          {/* 苍翠老树枝干 */}
          <path d="M60 388 L85 240 Q90 170 140 120" stroke="#2A362D" strokeWidth="8" fill="none" strokeLinecap="round" />
          <path d="M85 240 Q50 190 30 160" stroke="#2A362D" strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* 蓬松水彩叶簇 */}
          <circle cx="140" cy="110" r="45" fill="#3D4F41" opacity="0.75" filter="url(#wc-bleed)" />
          <circle cx="180" cy="130" r="35" fill="#5B7260" opacity="0.7" />
          <circle cx="50" cy="160" r="30" fill="#4B6050" opacity="0.7" />
        </g>
      );

    case 2: // 幽蓝深夜与孤灯清辉
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="url(#gradient-twilight-indigo)" />
          <circle cx="210" cy="100" r="28" fill="#FCEECB" />
          <path d="M12 310 Q150 280 288 310 L288 388 L12 388 Z" fill="#181F2C" />
          {/* 孤松与水彩剪影 */}
          <path d="M90 388 L100 280 Q105 220 140 180" stroke="#10151E" strokeWidth="6" fill="none" strokeLinecap="round" />
          <ellipse cx="140" cy="175" rx="35" ry="18" fill="#10151E" />
          <ellipse cx="120" cy="210" rx="30" ry="14" fill="#10151E" />
        </g>
      );

    case 3: // 暖意室内与静思空间
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="url(#gradient-tea-warmth)" />
          <rect x="40" y="40" width="120" height="180" fill="#FBF8F0" opacity="0.85" />
          <line x1="100" y1="40" x2="100" y2="220" stroke="#8C6E53" strokeWidth="3" />
          <line x1="40" y1="130" x2="160" y2="130" stroke="#8C6E53" strokeWidth="3" />
          <polygon points="40,220 160,220 280,388 120,388" fill="#FFFFFF" opacity="0.18" filter="url(#wc-bleed)" />
          {/* 窗台静物花瓶与小枝 */}
          <rect x="180" y="240" width="22" height="35" rx="4" fill="#6A533E" />
          <path d="M191 240 Q195 190 220 170" stroke="#483727" strokeWidth="2.5" fill="none" />
          <circle cx="220" cy="170" r="5" fill="#D98A73" />
        </g>
      );

    default: // 辽阔湖海与清澈倒影
      return (
        <g>
          <rect x="12" y="12" width="276" height="376" rx="8" fill="#E2EAF0" />
          <circle cx="150" cy="120" r="50" fill="#FCEFD2" opacity="0.75" />
          <rect x="12" y="210" width="276" height="178" fill="#5F7688" />
          {/* 水面倒影与微澜 */}
          <ellipse cx="150" cy="270" rx="55" ry="16" fill="#FCEFD2" opacity="0.35" filter="url(#wc-bleed)" />
          <line x1="70" y1="290" x2="230" y2="290" stroke="#7A93A6" strokeWidth="2.5" strokeDasharray="12 8" />
          <line x1="100" y1="320" x2="200" y2="320" stroke="#7A93A6" strokeWidth="2" strokeDasharray="8 6" />
        </g>
      );
  }
}
