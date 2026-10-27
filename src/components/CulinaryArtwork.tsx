import React from 'react';
import { MenuItem } from '../data/restaurantData';

interface CulinaryArtworkProps {
  theme: MenuItem['artworkTheme'] | 'hero-banquet' | 'hero-buffet' | 'hero-live-counter';
  title?: string;
  subtitle?: string;
  className?: string;
}

export const CulinaryArtwork: React.FC<CulinaryArtworkProps> = ({
  theme,
  title,
  subtitle,
  className = '',
}) => {
  if (theme === 'hero-banquet' || theme === 'hero-buffet' || theme === 'hero-live-counter') {
    return (
      <div
        className={`relative overflow-hidden bg-[#191614] text-[#FAF8F5] select-none ${className}`}
        role="img"
        aria-label={title || 'Thaath Maath Grand Dining & Banquet Architecture'}
      >
        <svg
          viewBox="0 0 800 600"
          className="w-full h-full object-cover"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="warmGlow" cx="50%" cy="32%" r="65%">
              <stop offset="0%" stopColor="#D97724" stopOpacity="0.38" />
              <stop offset="50%" stopColor="#9E2A2B" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#141210" stopOpacity="0.95" />
            </radialGradient>
            <linearGradient id="brassGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#F3D088" />
              <stop offset="50%" stopColor="#C8963E" />
              <stop offset="100%" stopColor="#7C5318" />
            </linearGradient>
            <linearGradient id="marbleSurface" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#2B2623" />
              <stop offset="100%" stopColor="#171412" />
            </linearGradient>
            <pattern id="jaaliArch" width="80" height="80" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 80 40 L 40 80 L 0 40 Z"
                fill="none"
                stroke="#C8963E"
                strokeWidth="0.6"
                strokeOpacity="0.22"
              />
              <circle
                cx="40"
                cy="40"
                r="16"
                fill="none"
                stroke="#C8963E"
                strokeWidth="0.5"
                strokeOpacity="0.18"
              />
            </pattern>
          </defs>

          {/* Architectural Backdrop */}
          <rect width="800" height="600" fill="#161311" />
          <rect width="800" height="600" fill="url(#jaaliArch)" />
          <rect width="800" height="600" fill="url(#warmGlow)" />

          {/* Grand Archways */}
          <g stroke="url(#brassGold)" strokeWidth="1.5" fill="none" opacity="0.65">
            <path d="M 90 520 L 90 210 C 90 120 250 120 250 210 L 250 520" />
            <path d="M 290 520 L 290 175 C 290 70 510 70 510 175 L 510 520" strokeWidth="2.2" />
            <path d="M 550 520 L 550 210 C 550 120 710 120 710 210 L 710 520" />
          </g>

          {/* Brass Chandeliers */}
          {theme === 'hero-banquet' && (
            <g>
              <line x1="400" y1="0" x2="400" y2="120" stroke="url(#brassGold)" strokeWidth="2" />
              <ellipse cx="400" cy="130" rx="85" ry="18" fill="none" stroke="url(#brassGold)" strokeWidth="2.5" />
              <ellipse cx="400" cy="148" rx="58" ry="12" fill="none" stroke="url(#brassGold)" strokeWidth="2" />
              {[330, 355, 380, 400, 420, 445, 470].map((cx, i) => (
                <circle key={i} cx={cx} cy={135 + (i % 2) * 10} r="4.5" fill="#FDE68A" opacity="0.9" />
              ))}
              <circle cx="400" cy="140" r="95" fill="#F59E0B" opacity="0.12" />
            </g>
          )}

          {theme === 'hero-buffet' && (
            <g>
              {/* Copper Chafing Dishes & Pendant Lamps */}
              {[170, 400, 630].map((x, idx) => (
                <g key={idx}>
                  <line x1={x} y1="0" x2={x} y2="145" stroke="url(#brassGold)" strokeWidth="1.5" />
                  <path
                    d={`M ${x - 28} 165 Q ${x} 130 ${x + 28} 165 Z`}
                    fill="url(#brassGold)"
                  />
                  <circle cx={x} cy="168" r="14" fill="#FDE68A" opacity="0.55" />
                </g>
              ))}
            </g>
          )}

          {theme === 'hero-live-counter' && (
            <g>
              {/* Live Wood-Fired & Tawa Arch Glow */}
              <path
                d="M 320 340 C 320 250 480 250 480 340 Z"
                fill="#9E2A2B"
                opacity="0.45"
              />
              <path
                d="M 350 340 C 350 280 450 280 450 340 Z"
                fill="#F59E0B"
                opacity="0.65"
              />
            </g>
          )}

          {/* Marble Buffet & Banquet Table Foreground */}
          <rect x="40" y="370" width="720" height="160" rx="8" fill="url(#marbleSurface)" stroke="url(#brassGold)" strokeWidth="1.2" />
          <line x1="40" y1="395" x2="760" y2="395" stroke="#C8963E" strokeOpacity="0.3" strokeWidth="1" />

          {/* Copper Handis / Royal Thali Vessels on the Counter */}
          {[165, 320, 480, 635].map((cx, idx) => (
            <g key={idx} transform={`translate(${cx}, 352)`}>
              {/* Steam wisps */}
              <path
                d="M -8 -24 Q -14 -38 -4 -48"
                fill="none"
                stroke="#FAF8F5"
                strokeOpacity="0.35"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              <path
                d="M 8 -20 Q 14 -34 4 -46"
                fill="none"
                stroke="#FAF8F5"
                strokeOpacity="0.28"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
              {/* Vessel */}
              <path
                d="M -46 0 L 46 0 L 36 26 C 20 34 -20 34 -36 26 Z"
                fill="url(#brassGold)"
              />
              <ellipse cx="0" cy="0" rx="46" ry="11" fill="#3A1F18" stroke="url(#brassGold)" strokeWidth="2" />
              <ellipse
                cx="0"
                cy="0"
                rx="38"
                ry="7"
                fill={idx % 2 === 0 ? '#B43E2B' : '#D9822B'}
              />
              {/* Garnish */}
              <circle cx="-10" cy="-1" r="3" fill="#4ADE80" />
              <circle cx="8" cy="1" r="2.5" fill="#FEF08A" />
              <circle cx="0" cy="-2" r="2" fill="#FAF8F5" />
            </g>
          ))}
        </svg>

        {/* Measured Gradient Scrim for Contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent pointer-events-none" />
      </div>
    );
  }

  // Dish-specific custom culinary SVG plate illustrations
  const paletteMap: Record<
    MenuItem['artworkTheme'],
    { bg: string; plate: string; rim: string; foodPrimary: string; foodSecondary: string; garnish: string }
  > = {
    'buffet-spread': {
      bg: '#1F1B18',
      plate: '#2D2622',
      rim: '#C8963E',
      foodPrimary: '#C2410C',
      foodSecondary: '#F59E0B',
      garnish: '#22C55E',
    },
    'chaat-counter': {
      bg: '#231917',
      plate: '#332421',
      rim: '#D97706',
      foodPrimary: '#B91C1C',
      foodSecondary: '#FBBF24',
      garnish: '#4ADE80',
    },
    'paneer-tikka': {
      bg: '#241816',
      plate: '#1A1412',
      rim: '#C8963E',
      foodPrimary: '#B93829',
      foodSecondary: '#F59E0B',
      garnish: '#4ADE80',
    },
    'dal-bukhara': {
      bg: '#1E1916',
      plate: '#2B211B',
      rim: '#B48232',
      foodPrimary: '#6D2E1C',
      foodSecondary: '#FDE68A',
      garnish: '#22C55E',
    },
    'kofta-royal': {
      bg: '#211C16',
      plate: '#2E261D',
      rim: '#D4A349',
      foodPrimary: '#D97706',
      foodSecondary: '#FEF3C7',
      garnish: '#16A34A',
    },
    'sizzler-asian': {
      bg: '#181A1B',
      plate: '#252729',
      rim: '#94A3B8',
      foodPrimary: '#991B1B',
      foodSecondary: '#EA580C',
      garnish: '#4ADE80',
    },
    'mexican-fiesta': {
      bg: '#211A16',
      plate: '#2E231D',
      rim: '#D97706',
      foodPrimary: '#DC2626',
      foodSecondary: '#FACC15',
      garnish: '#22C55E',
    },
    'woodfired-pizza': {
      bg: '#221C18',
      plate: '#382B22',
      rim: '#CA8A04',
      foodPrimary: '#B91C1C',
      foodSecondary: '#FEF9C3',
      garnish: '#15803D',
    },
    'pasta-truffle': {
      bg: '#1F1D1A',
      plate: '#2C2925',
      rim: '#D6C7B2',
      foodPrimary: '#E7E5E4',
      foodSecondary: '#CA8A04',
      garnish: '#16A34A',
    },
    'gulab-kunafa': {
      bg: '#231B15',
      plate: '#33261C',
      rim: '#EAB308',
      foodPrimary: '#D97706',
      foodSecondary: '#FEF08A',
      garnish: '#4ADE80',
    },
  };

  const colors = paletteMap[theme];

  return (
    <div
      className={`relative overflow-hidden select-none ${className}`}
      style={{ backgroundColor: colors.bg }}
      role="img"
      aria-label={title || 'Thaath Maath Culinary Preparation'}
    >
      <svg
        viewBox="0 0 400 300"
        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-[1.03]"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <radialGradient id={`grad-${theme}`} cx="50%" cy="50%" r="55%">
            <stop offset="0%" stopColor={colors.rim} stopOpacity="0.24" />
            <stop offset="100%" stopColor={colors.bg} stopOpacity="1" />
          </radialGradient>
        </defs>

        <rect width="400" height="300" fill={`url(#grad-${theme})`} />

        {/* Subtle Architectural Placemat Lines */}
        <line x1="30" y1="30" x2="370" y2="30" stroke={colors.rim} strokeOpacity="0.2" strokeWidth="1" />
        <line x1="30" y1="270" x2="370" y2="270" stroke={colors.rim} strokeOpacity="0.2" strokeWidth="1" />

        {/* Artisanal Stoneware / Brass Thali Base */}
        <circle
          cx="200"
          cy="150"
          r="102"
          fill={colors.plate}
          stroke={colors.rim}
          strokeWidth="2.5"
        />
        <circle
          cx="200"
          cy="150"
          r="86"
          fill="none"
          stroke={colors.rim}
          strokeOpacity="0.35"
          strokeWidth="1"
          strokeDasharray="4 4"
        />

        {/* Dish Composition by Theme */}
        {(theme === 'buffet-spread' || theme === 'chaat-counter') && (
          <g>
            {/* Multi-Katori Royal Thali Composition */}
            {[
              { cx: 155, cy: 112, fill: '#B91C1C' },
              { cx: 215, cy: 102, fill: '#D97706' },
              { cx: 252, cy: 145, fill: '#65A30D' },
              { cx: 148, cy: 175, fill: '#92400E' },
            ].map((k, idx) => (
              <g key={idx}>
                <circle cx={k.cx} cy={k.cy} r="24" fill="#1F1916" stroke={colors.rim} strokeWidth="2" />
                <circle cx={k.cx} cy={k.cy} r="19" fill={k.fill} />
                <circle cx={k.cx - 4} cy={k.cy - 3} r="3" fill="#FEF08A" opacity="0.85" />
                <circle cx={k.cx + 5} cy={k.cy + 4} r="2.5" fill="#4ADE80" />
              </g>
            ))}
            {/* Saffron Rice & Artisan Naan */}
            <path
              d="M 175 162 Q 215 150 238 195 Q 195 220 175 162 Z"
              fill="#FDE68A"
              stroke={colors.rim}
              strokeWidth="1.2"
            />
          </g>
        )}

        {(theme === 'paneer-tikka' || theme === 'dal-bukhara' || theme === 'kofta-royal') && (
          <g>
            {/* Rich Gravy Bowl */}
            <circle cx="200" cy="150" r="68" fill={colors.foodPrimary} />
            {/* Cream Swirl */}
            <path
              d="M 165 145 C 180 120, 220 125, 230 152 C 235 170, 200 185, 182 168"
              fill="none"
              stroke={colors.foodSecondary}
              strokeWidth="4"
              strokeLinecap="round"
              opacity="0.85"
            />
            {/* Paneer / Kofta Cubes */}
            {[
              { x: 172, y: 130 },
              { x: 208, y: 128 },
              { x: 186, y: 158 },
              { x: 216, y: 156 },
            ].map((p, idx) => (
              <rect
                key={idx}
                x={p.x}
                y={p.y}
                width="20"
                height="18"
                rx="4"
                fill="#FEF3C7"
                stroke="#92400E"
                strokeWidth="1.2"
                transform={`rotate(${idx * 14 - 10} ${p.x + 10} ${p.y + 9})`}
              />
            ))}
            {/* Coriander & Ginger Garnish */}
            <circle cx="198" cy="146" r="5" fill={colors.garnish} />
            <circle cx="205" cy="152" r="3.5" fill={colors.garnish} />
          </g>
        )}

        {(theme === 'sizzler-asian' || theme === 'mexican-fiesta') && (
          <g>
            <ellipse cx="200" cy="150" rx="76" ry="54" fill={colors.foodPrimary} />
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <polygon
                key={i}
                points="200,105 216,138 184,138"
                fill={colors.foodSecondary}
                stroke={colors.rim}
                strokeWidth="1"
                transform={`rotate(${i * 60} 200 150)`}
              />
            ))}
            <circle cx="200" cy="150" r="22" fill="#FEF9C3" />
            <circle cx="200" cy="150" r="14" fill={colors.garnish} />
          </g>
        )}

        {(theme === 'woodfired-pizza' || theme === 'pasta-truffle') && (
          <g>
            <circle cx="200" cy="150" r="74" fill="#D97706" />
            <circle cx="200" cy="150" r="63" fill={colors.foodPrimary} />
            {[
              { cx: 175, cy: 128 },
              { cx: 222, cy: 132 },
              { cx: 202, cy: 168 },
              { cx: 172, cy: 164 },
              { cx: 224, cy: 165 },
            ].map((b, idx) => (
              <g key={idx}>
                <circle cx={b.cx} cy={b.cy} r="12" fill={colors.foodSecondary} />
                <ellipse cx={b.cx + 6} cy={b.cy - 4} rx="6" ry="3.5" fill={colors.garnish} />
              </g>
            ))}
          </g>
        )}

        {theme === 'gulab-kunafa' && (
          <g>
            <circle cx="200" cy="150" r="64" fill="#FEF3C7" />
            <circle cx="184" cy="144" r="22" fill="#9A3412" />
            <circle cx="218" cy="156" r="22" fill="#B45309" />
            {/* Pistachio & Rose Petal Shavings */}
            <circle cx="184" cy="142" r="4" fill="#4ADE80" />
            <circle cx="218" cy="154" r="4" fill="#4ADE80" />
            <circle cx="202" cy="132" r="3.5" fill="#F43F5E" />
            <circle cx="198" cy="168" r="3.5" fill="#F43F5E" />
          </g>
        )}
      </svg>

      {/* Pure Veg Culinary Mark in Corner (Unboxed quiet text with symbol) */}
      <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-[11px] tracking-wide text-[#FAF8F5]/90 pointer-events-none">
        <span className="font-medium truncate">{subtitle || '100% Pure Vegetarian'}</span>
      </div>
    </div>
  );
};
