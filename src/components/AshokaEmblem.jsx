// Official National Emblem of India (Ashoka Lion Capital) SVG component.

export const AshokaEmblem = ({ className = "h-14 w-auto", size = 56 }) => {
  return <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 130"
    width={size}
    height={size * 130 / 100}
    className={className}
    aria-label="State Emblem of India - Lion Capital of Ashoka"
    role="img"
  >
      {/* Saffron & Navy Official Seal Background Disc */}
      <circle cx="50" cy="50" r="44" fill="#0B3C5D" stroke="#D97706" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="40" fill="none" stroke="#FFFFFF" strokeWidth="1" strokeDasharray="2,2" />
      
      {/* Central Lion Capital Stylized Geometry */}
      {/* Top 3 Lions Heads */}
      {/* Center Lion */}
      <path
    d="M50 18 C46 18, 43 21, 43 25 C43 28, 45 30, 47 31 L47 38 C45 39, 44 42, 44 45 C44 47, 46 49, 50 49 C54 49, 56 47, 56 45 C56 42, 55 39, 53 38 L53 31 C55 30, 57 28, 57 25 C57 21, 54 18, 50 18 Z"
    fill="#FFD700"
  />
      {/* Left Lion */}
      <path
    d="M36 24 C33 24, 30 27, 30 30 C30 33, 32 35, 34 36 L35 43 C33 44, 32 46, 33 48 C34 50, 37 51, 40 50 L41 46 L38 41 L37 35 C39 34, 40 32, 40 30 C40 27, 38 24, 36 24 Z"
    fill="#F39C12"
  />
      {/* Right Lion */}
      <path
    d="M64 24 C67 24, 70 27, 70 30 C70 33, 68 35, 66 36 L65 43 C67 44, 68 46, 67 48 C66 50, 63 51, 60 50 L59 46 L62 41 L63 35 C61 34, 60 32, 60 30 C60 27, 62 24, 64 24 Z"
    fill="#F39C12"
  />
      
      {/* Lion Mane and Pillar Details */}
      <path d="M44 33 Q50 36 56 33" stroke="#B8860B" strokeWidth="1.2" fill="none" />
      <path d="M43 40 Q50 43 57 40" stroke="#B8860B" strokeWidth="1.2" fill="none" />
      
      {/* Abacus / Base Platform */}
      <rect x="26" y="52" width="48" height="6" rx="2" fill="#FFD700" stroke="#B8860B" strokeWidth="0.8" />
      
      {/* Ashoka Chakra in Center of Abacus */}
      <circle cx="50" cy="55" r="4.5" fill="#0B3C5D" stroke="#FFFFFF" strokeWidth="0.8" />
      <circle cx="50" cy="55" r="1.5" fill="#FFFFFF" />
      {/* 8 representative radial spokes */}
      <line x1="50" y1="51" x2="50" y2="59" stroke="#FFFFFF" strokeWidth="0.5" />
      <line x1="46" y1="55" x2="54" y2="55" stroke="#FFFFFF" strokeWidth="0.5" />
      <line x1="47.2" y1="52.2" x2="52.8" y2="57.8" stroke="#FFFFFF" strokeWidth="0.5" />
      <line x1="52.8" y1="52.2" x2="47.2" y2="57.8" stroke="#FFFFFF" strokeWidth="0.5" />

      {/* Flanking Animals Stylized (Bull on right, Horse on left) */}
      <ellipse cx="36" cy="55" rx="3" ry="1.5" fill="#0B3C5D" />
      <ellipse cx="64" cy="55" rx="3" ry="1.5" fill="#0B3C5D" />

      {/* Bell Capital / Lotus Base */}
      <path
    d="M32 58 C32 68, 38 72, 50 72 C62 72, 68 68, 68 58 Z"
    fill="#D4AF37"
    stroke="#8B6914"
    strokeWidth="0.8"
  />
      <path d="M38 58 Q50 69 62 58" stroke="#FFFFFF" strokeWidth="0.6" fill="none" />

      {/* Plinth Base */}
      <rect x="22" y="72" width="56" height="5" rx="1" fill="#B8860B" />

      {/* Satyameva Jayate (सत्यमेव जयते) in Devanagari Script Below Base */}
      <rect x="14" y="81" width="72" height="18" rx="2" fill="#FFFFFF" stroke="#CBD5E1" strokeWidth="0.8" />
      <text
    x="50"
    y="94"
    fontSize="10"
    fontFamily="serif"
    fontWeight="bold"
    fill="#0B3C5D"
    textAnchor="middle"
    letterSpacing="0.8"
  >
        सत्यमेव जयते
      </text>
      <text
    x="50"
    y="110"
    fontSize="6"
    fontFamily="sans-serif"
    fontWeight="bold"
    fill="#475569"
    textAnchor="middle"
    letterSpacing="1"
  >
        GOVT. OF INDIA
      </text>
    </svg>;
};
