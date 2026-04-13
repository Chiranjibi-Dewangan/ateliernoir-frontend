import { getSegmentCentroid, polarToCartesian } from "../lib/geometry";

const segmentPalettes = {
  ignorance: { base: "#6a5b31", accent: "#b89853", glow: "#d3b47d", ink: "#2f2213", mist: "#e0cc9c" },
  craving: { base: "#85422f", accent: "#d17c44", glow: "#f1c57f", ink: "#2e1710", mist: "#f4ddbc" },
  aversion: { base: "#355764", accent: "#7eb5a9", glow: "#b8dfd5", ink: "#15242a", mist: "#d9e6df" },
  "rising-path": { base: "#c9ae78", accent: "#f2d9a1", glow: "#fff1cf", ink: "#3c2e14", mist: "#f8eac8" },
  "falling-path": { base: "#5f4d5d", accent: "#9e8298", glow: "#c8a9c0", ink: "#241920", mist: "#dfd0de" },
  gods: { base: "#8299b7", accent: "#f1daa0", glow: "#fcf3d2", ink: "#233242", mist: "#e7eef7" },
  "demi-gods": { base: "#6b7a58", accent: "#d08b5a", glow: "#e6c89e", ink: "#242916", mist: "#dbe2cf" },
  humans: { base: "#987754", accent: "#d9bf88", glow: "#f3e0b0", ink: "#2e2114", mist: "#f2e4c3" },
  animals: { base: "#7d6c46", accent: "#b6a170", glow: "#ddd1a0", ink: "#2d2618", mist: "#ebe3c1" },
  "hungry-ghosts": { base: "#77606d", accent: "#c2a291", glow: "#ddc3b4", ink: "#251d1f", mist: "#eee2dc" },
  hell: { base: "#72382f", accent: "#d66743", glow: "#f1a078", ink: "#2d1410", mist: "#f4d6cb" },
  "ignorance-link": { base: "#cfb984", accent: "#f0dfb1", glow: "#fff4d0", ink: "#352718", mist: "#f6edd0" },
  formations: { base: "#b89763", accent: "#e5c58c", glow: "#f2dfb4", ink: "#2f2114", mist: "#f0e2c2" },
  consciousness: { base: "#9b8aa5", accent: "#d1c4d8", glow: "#efe6f2", ink: "#241d29", mist: "#ebe3f0" },
  "name-and-form": { base: "#8a7b64", accent: "#d0bb95", glow: "#efe2c3", ink: "#2d251b", mist: "#e6dbc4" },
  "six-senses": { base: "#6f8d8d", accent: "#b5d0cf", glow: "#deefef", ink: "#1f2c2d", mist: "#dbe8e8" },
  contact: { base: "#886860", accent: "#caa58d", glow: "#ebd2c0", ink: "#2e1f1b", mist: "#f0e2d7" },
  feeling: { base: "#b06f63", accent: "#edb68d", glow: "#f8dec1", ink: "#341d18", mist: "#f7e6d6" },
  "craving-link": { base: "#875246", accent: "#daa16f", glow: "#f0d2ac", ink: "#2e1712", mist: "#f1dece" },
  clinging: { base: "#6e5547", accent: "#c49a71", glow: "#e4caac", ink: "#271d17", mist: "#eadecf" },
  becoming: { base: "#7e6b5f", accent: "#d8b69a", glow: "#f0ddcf", ink: "#261f1b", mist: "#ebe1da" },
  birth: { base: "#768a5e", accent: "#c6d396", glow: "#e5efc5", ink: "#212618", mist: "#e6edd5" },
  "aging-death": { base: "#636169", accent: "#b3aeba", glow: "#e1dbe5", ink: "#1f1e22", mist: "#e8e4eb" },
};

const fallbackPalette = {
  base: "#c9ae78",
  accent: "#f0dfb1",
  glow: "#fff0c9",
  ink: "#2f2215",
  mist: "#f7ecd2",
};

function getPalette(node) {
  return segmentPalettes[node.id] ?? fallbackPalette;
}

function Cloud({ x, y, scale = 1, color = "#f7f0dd", opacity = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <ellipse cx="0" cy="7" rx="30" ry="14" fill={color} />
      <ellipse cx="-17" cy="0" rx="17" ry="12" fill={color} />
      <ellipse cx="7" cy="-3" rx="21" ry="14" fill={color} />
      <ellipse cx="28" cy="4" rx="13" ry="9" fill={color} />
    </g>
  );
}

function Mountain({ x, y, scale = 1, fill = "#6d5d47", accent = "#d3c39d" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -44 18 L -10 -36 L 18 18 Z" fill={fill} />
      <path d="M -18 18 L 26 -46 L 62 18 Z" fill={fill} opacity="0.95" />
      <path d="M -14 -18 L -10 -36 L -4 -18 Z" fill={accent} opacity="0.85" />
      <path d="M 18 -20 L 26 -46 L 36 -22 Z" fill={accent} opacity="0.85" />
    </g>
  );
}

function Lotus({ x, y, scale = 1, petal = "#efd399", center = "#b46d3b" }) {
  const petals = [-55, -30, -8, 8, 30, 55];

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      {petals.map((rotation) => (
        <ellipse
          key={rotation}
          cx="0"
          cy="-16"
          rx="9"
          ry="20"
          fill={petal}
          transform={`rotate(${rotation})`}
        />
      ))}
      <circle cx="0" cy="0" r="10" fill={center} />
    </g>
  );
}

function Person({
  x,
  y,
  scale = 1,
  skin = "#f2ddc8",
  robe = "#9a4f3e",
  outline = "#2c1c12",
  seated = false,
  direction = 1,
  armLift = false,
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale * direction} ${scale})`}>
      <circle cx="0" cy="-14" r="6.5" fill={skin} stroke={outline} strokeWidth="1.2" />
      {seated ? (
        <>
          <path d="M -9 1 C -6 -9 6 -9 9 1 L 12 17 L -12 17 Z" fill={robe} stroke={outline} strokeWidth="1.2" />
          <path d="M -13 16 C -5 11 5 11 13 16" fill="none" stroke={outline} strokeWidth="1.2" strokeLinecap="round" />
        </>
      ) : (
        <>
          <path d="M -7 -6 C -4 -2 4 -2 7 -6 L 7 12 L -7 12 Z" fill={robe} stroke={outline} strokeWidth="1.2" />
          <path d="M -4 12 L -7 27" stroke={outline} strokeWidth="1.3" strokeLinecap="round" />
          <path d="M 4 12 L 7 27" stroke={outline} strokeWidth="1.3" strokeLinecap="round" />
        </>
      )}
      <path
        d={armLift ? "M -8 2 L -16 -8 M 8 2 L 17 -9" : "M -8 2 L -16 8 M 8 2 L 15 9"}
        stroke={outline}
        strokeWidth="1.3"
        strokeLinecap="round"
      />
    </g>
  );
}

function Pig({ x, y, scale = 1, fill = "#c5a56b", stroke = "#2f2213" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="0" rx="28" ry="18" fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx="24" cy="-3" r="11" fill={fill} stroke={stroke} strokeWidth="2" />
      <ellipse cx="30" cy="0" rx="7" ry="5" fill="#efd1a7" stroke={stroke} strokeWidth="1.4" />
      <circle cx="28" cy="0" r="1.1" fill={stroke} />
      <circle cx="32" cy="0" r="1.1" fill={stroke} />
      <path d="M 17 -12 L 25 -24 L 29 -12 Z" fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx="22" cy="-6" r="1.7" fill={stroke} />
      <path d="M -27 2 q -8 0 -10 8 q 12 6 14 -2" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <path d="M -14 13 l -5 11 M 5 13 l -4 11" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Rooster({ x, y, scale = 1, fill = "#c96943", stroke = "#2e1710", accent = "#f1be69" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <ellipse cx="0" cy="4" rx="18" ry="15" fill={fill} stroke={stroke} strokeWidth="2" />
      <circle cx="18" cy="-6" r="8" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M 20 -17 q 5 -10 11 0 q -6 4 -11 0" fill="#d9584c" stroke={stroke} strokeWidth="1.4" />
      <path d="M -14 -1 q -24 -23 -13 -37 q 15 6 18 24" fill={accent} stroke={stroke} strokeWidth="1.6" />
      <path d="M -12 4 q -27 0 -31 -18 q 20 2 29 14" fill="#f0d39a" stroke={stroke} strokeWidth="1.6" />
      <path d="M 26 -5 L 33 -3 L 26 0 Z" fill="#d2ad72" stroke={stroke} strokeWidth="1.4" />
      <path d="M -1 19 L -5 32 M 11 19 L 8 32" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Snake({ x, y, scale = 1, stroke = "#d9dcc6", fill = "#6db1a0" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path
        d="M -36 6 C -22 -22, 14 -24, 10 2 C 8 22, -20 18, -14 -4 C -8 -20, 22 -10, 28 12"
        fill="none"
        stroke={fill}
        strokeWidth="11"
        strokeLinecap="round"
      />
      <path
        d="M -36 6 C -22 -22, 14 -24, 10 2 C 8 22, -20 18, -14 -4 C -8 -20, 22 -10, 28 12"
        fill="none"
        stroke={stroke}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path d="M 28 12 q 13 -5 17 7 q -9 4 -17 -7" fill={fill} stroke={stroke} strokeWidth="2" />
      <path d="M 42 18 L 51 23" stroke="#f6b998" strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Tree({ x, y, scale = 1, trunk = "#593e22", foliage = "#7f9059", barren = false }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M 0 24 L -4 -14 L 7 -14 L 4 24 Z" fill={trunk} />
      <path d="M -1 -12 C -16 -28, -28 -18, -25 -6" fill="none" stroke={trunk} strokeWidth="3" strokeLinecap="round" />
      <path d="M 3 -12 C 16 -30, 30 -18, 24 -4" fill="none" stroke={trunk} strokeWidth="3" strokeLinecap="round" />
      <path d="M 1 -6 C 4 -25, 12 -32, 22 -34" fill="none" stroke={trunk} strokeWidth="3" strokeLinecap="round" />
      {!barren ? (
        <>
          <circle cx="-15" cy="-8" r="10" fill={foliage} opacity="0.96" />
          <circle cx="15" cy="-10" r="12" fill={foliage} opacity="0.96" />
          <circle cx="0" cy="-19" r="12" fill={foliage} opacity="0.96" />
        </>
      ) : null}
    </g>
  );
}

function Bowl({ x, y, scale = 1, fill = "#c8a57e", stroke = "#2a1d15" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -18 0 Q 0 16 18 0 L 14 10 L -14 10 Z" fill={fill} stroke={stroke} strokeWidth="1.8" />
      <path d="M -9 10 L 9 10 L 6 16 L -6 16 Z" fill={fill} stroke={stroke} strokeWidth="1.4" />
    </g>
  );
}

function Temple({ x, y, scale = 1, fill = "#d6c494", roof = "#8d4b37", stroke = "#2b1e15" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <rect x="-22" y="-2" width="44" height="22" rx="4" fill={fill} stroke={stroke} strokeWidth="1.6" />
      <path d="M -28 -2 L 0 -19 L 28 -2 Z" fill={roof} stroke={stroke} strokeWidth="1.6" />
      <path d="M -18 20 L -18 4 M -6 20 L -6 4 M 6 20 L 6 4 M 18 20 L 18 4" stroke={stroke} strokeWidth="1.3" />
      <rect x="-5" y="6" width="10" height="14" rx="2" fill="#a56e43" stroke={stroke} strokeWidth="1.2" />
    </g>
  );
}

function Spear({ x, y, scale = 1, stroke = "#2d2016", fill = "#d8c79c", rotation = 0 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale}) rotate(${rotation})`}>
      <path d="M 0 -22 L 6 -8 L 0 0 L -6 -8 Z" fill={fill} stroke={stroke} strokeWidth="1.3" />
      <path d="M 0 0 L 0 34" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
    </g>
  );
}

function HouseSixWindows({ x, y, scale = 1, fill = "#d8c28c", stroke = "#2d2116" }) {
  const windows = [-10, 0, 10].flatMap((col) => [-5, 8].map((row) => ({ col, row })));

  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -26 -3 L 0 -24 L 26 -3 Z" fill="#8a533f" stroke={stroke} strokeWidth="1.6" />
      <rect x="-21" y="-3" width="42" height="30" rx="4" fill={fill} stroke={stroke} strokeWidth="1.6" />
      {windows.map((window) => (
        <rect
          key={`${window.col}-${window.row}`}
          x={window.col - 3}
          y={window.row}
          width="6"
          height="6"
          fill="#f6edd8"
          stroke={stroke}
          strokeWidth="0.9"
        />
      ))}
    </g>
  );
}

function Boat({ x, y, scale = 1, fill = "#765444", stroke = "#2b1d15" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -30 10 Q 0 28 30 10 L 26 20 L -26 20 Z" fill={fill} stroke={stroke} strokeWidth="1.6" />
      <path d="M 0 -18 L 0 12" stroke={stroke} strokeWidth="1.6" />
      <path d="M 0 -18 Q 18 -10 15 8 L 0 8 Z" fill="#e5d3a3" stroke={stroke} strokeWidth="1.2" />
      <circle cx="-9" cy="2" r="4.5" fill="#f2ddc8" stroke={stroke} strokeWidth="1.1" />
      <circle cx="10" cy="2" r="4.5" fill="#f2ddc8" stroke={stroke} strokeWidth="1.1" />
    </g>
  );
}

function EyeIcon({ x, y, scale = 1, stroke = "#2c1d17", iris = "#bd7c54" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -28 0 Q 0 -18 28 0 Q 0 18 -28 0 Z" fill="#f6eddf" stroke={stroke} strokeWidth="1.6" />
      <circle cx="0" cy="0" r="8" fill={iris} stroke={stroke} strokeWidth="1.3" />
      <circle cx="0" cy="0" r="3" fill={stroke} />
    </g>
  );
}

function Cup({ x, y, scale = 1, fill = "#b67c50", stroke = "#2a1c14" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -10 -8 H 10 L 6 9 H -6 Z" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <path d="M 10 -5 Q 20 -3 16 7" fill="none" stroke={stroke} strokeWidth="1.4" />
    </g>
  );
}

function BranchFruit({ x, y, scale = 1, stroke = "#51361d", fill = "#8a9e57", fruit = "#d27747" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -20 16 C -8 -10, 8 -14, 24 -28" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="2" cy="-4" rx="12" ry="7" fill={fill} transform="rotate(-28 2 -4)" />
      <ellipse cx="16" cy="-19" rx="10" ry="6" fill={fill} transform="rotate(-22 16 -19)" />
      <circle cx="-2" cy="5" r="4.5" fill={fruit} />
      <circle cx="17" cy="-12" r="4.5" fill={fruit} />
      <path d="M -24 12 q 10 -5 17 4" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function PregnantFigure({ x, y, scale = 1, fill = "#8f5a44", stroke = "#2b1d15" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-20" r="6.5" fill="#f2ddc8" stroke={stroke} strokeWidth="1.1" />
      <path d="M -9 -12 C -7 -4 -7 18 0 18 C 9 18 11 0 9 -12 Z" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <circle cx="7" cy="0" r="10" fill="#cc9b7e" opacity="0.9" stroke={stroke} strokeWidth="1.1" />
      <path d="M -3 18 L -7 31 M 7 18 L 12 31" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
    </g>
  );
}

function InfantGlow({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="18" fill="#fff4cf" opacity="0.7" />
      <circle cx="0" cy="-3" r="6" fill="#f2ddc8" stroke="#2b1d15" strokeWidth="1" />
      <path d="M -10 7 Q 0 15 10 7" fill="none" stroke="#2b1d15" strokeWidth="1.2" />
      <path d="M -9 9 Q 0 19 9 9" fill="#dfc7a0" stroke="#2b1d15" strokeWidth="1" />
    </g>
  );
}

function Skull({ x, y, scale = 1, fill = "#efe8db", stroke = "#2a2019" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <path d="M -14 10 C -18 -12 -8 -24 0 -24 C 8 -24 18 -12 14 10 Z" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <rect x="-10" y="10" width="20" height="10" rx="4" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <circle cx="-5" cy="-4" r="3.5" fill={stroke} />
      <circle cx="5" cy="-4" r="3.5" fill={stroke} />
      <path d="M 0 2 L -2 7 H 2 Z" fill={stroke} />
      <path d="M -6 14 V 19 M -2 14 V 19 M 2 14 V 19 M 6 14 V 19" stroke={stroke} strokeWidth="1" />
    </g>
  );
}

function Monkey({ x, y, scale = 1, fill = "#a57d4d", stroke = "#2e2013" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-8" r="8" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <ellipse cx="0" cy="9" rx="10" ry="13" fill={fill} stroke={stroke} strokeWidth="1.5" />
      <path d="M -7 15 L -15 26 M 7 15 L 16 26" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M -8 0 L -20 9 M 8 0 L 20 8" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M 10 18 C 28 12 28 -11 7 -11" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Potter({ x, y, scale = 1, fill = "#ab764d", stroke = "#2b1d15" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="-12" cy="-7" r="5" fill="#f2ddc8" stroke={stroke} strokeWidth="1" />
      <path d="M -17 -2 Q -10 2 -8 10 L -5 22 L -21 22 Z" fill="#8b5b44" stroke={stroke} strokeWidth="1.2" />
      <circle cx="10" cy="16" r="13" fill="none" stroke={stroke} strokeWidth="2" />
      <path d="M 6 -1 Q 14 -18 20 -3 Q 20 6 12 9 Q 4 6 6 -1 Z" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <path d="M -4 4 L 7 8" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
    </g>
  );
}

function BlindFigure({ x, y, scale = 1, fill = "#88614a", stroke = "#2b1c14" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="-18" r="6" fill="#f2ddc8" stroke={stroke} strokeWidth="1.1" />
      <rect x="-5" y="-20" width="10" height="3" rx="1.5" fill={stroke} />
      <path d="M -7 -10 L -7 12 L 7 12 L 7 -10 Z" fill={fill} stroke={stroke} strokeWidth="1.4" />
      <path d="M -2 12 L -8 30 M 3 12 L 7 30" stroke={stroke} strokeWidth="1.4" strokeLinecap="round" />
      <path d="M 10 -2 L 10 28" stroke={stroke} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function BuddhaFigure({ x, y, scale = 1, accent = "#f0d59d" }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Lotus x="0" y="22" scale="1.1" petal="#d7b26d" center="#915433" />
      <Person x="0" y="8" scale="1.15" robe="#bf6f4e" outline="#28180f" seated armLift />
      <circle cx="0" cy="-29" r="4" fill={accent} opacity="0.95" />
      <path d="M 10 -4 C 31 -22, 48 -31, 66 -35" fill="none" stroke="#e9d7af" strokeWidth="3" strokeLinecap="round" />
    </g>
  );
}

function MoonSymbol({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <circle cx="0" cy="0" r="26" fill="#fff8e3" opacity="0.95" />
      <circle cx="8" cy="-3" r="22" fill="rgba(246, 240, 225, 0.65)" />
      <path d="M -28 7 Q 0 -26 28 7" fill="none" stroke="#d7c493" strokeWidth="2.2" />
    </g>
  );
}

function ImpermanenceMarker({ x, y, scale = 1 }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
      <Skull x="-5" y="-2" scale="0.65" />
      <path d="M 9 -12 C 18 -20 26 -14 27 -5 C 28 5 17 8 9 15 C 4 7 2 -2 9 -12 Z" fill="#d99a65" stroke="#2a1d15" strokeWidth="1.4" />
      <path d="M 11 -5 L 21 2" stroke="#2a1d15" strokeWidth="1.2" strokeLinecap="round" />
      <path d="M 10 5 L 18 10" stroke="#2a1d15" strokeWidth="1.2" strokeLinecap="round" />
    </g>
  );
}

function RealmLabel({ node, x, y }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <rect x="-34" y="-12" width="68" height="24" rx="11" className="realm-ribbon" />
      <text className="realm-ribbon-text" textAnchor="middle" y="5">
        {node.shortLabel}
      </text>
    </g>
  );
}

function InnerLabel({ node, x, y, angle }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${angle})`} aria-hidden="true">
      <rect x="-40" y="-11" width="80" height="22" rx="11" className="inner-ribbon" />
      <text className="inner-ribbon-text" textAnchor="middle" y="4">
        {node.shortLabel}
      </text>
    </g>
  );
}

function OuterLinkLabel({ node, x, y, number }) {
  return (
    <g transform={`translate(${x} ${y})`} aria-hidden="true">
      <circle r="13" className="outer-number-badge" />
      <text className="outer-number-text" textAnchor="middle" y="4">
        {number}
      </text>
      <text className="outer-link-caption" textAnchor="middle" y="28">
        {node.shortLabel}
      </text>
    </g>
  );
}

function ThornVine({ color = "#f1c78f", stroke = "#2b1c14" }) {
  return (
    <path
      d="M -74 18 C -44 -7 -25 -5 -7 16 C 16 44 38 26 72 2"
      fill="none"
      stroke={color}
      strokeWidth="10"
      strokeLinecap="round"
    />
  );
}

function renderHubScene(node, centroid, palette) {
  switch (node.id) {
    case "ignorance":
      return (
        <>
          <Cloud x={centroid.x - 12} y={centroid.y - 26} scale="0.52" color={palette.mist} opacity="0.32" />
          <Pig x={centroid.x + 8} y={centroid.y + 6} scale="1.08" fill={palette.glow} stroke={palette.ink} />
        </>
      );
    case "craving":
      return (
        <>
          <path d={`M ${centroid.x - 44} ${centroid.y + 36} q 26 -23 56 -6`} fill="none" stroke={palette.mist} strokeWidth="8" strokeLinecap="round" />
          <Rooster x={centroid.x - 2} y={centroid.y + 2} scale="1.02" fill={palette.accent} stroke={palette.ink} accent={palette.glow} />
        </>
      );
    case "aversion":
      return (
        <>
          <path d={`M ${centroid.x - 44} ${centroid.y + 35} q 33 -44 79 -18`} fill="none" stroke={palette.mist} strokeWidth="8" strokeLinecap="round" opacity="0.45" />
          <Snake x={centroid.x - 3} y={centroid.y + 2} scale="1" stroke={palette.ink} fill={palette.glow} />
        </>
      );
    default:
      return null;
  }
}

function renderKarmaScene(node, centroid, palette) {
  const isRising = node.id === "rising-path";
  const direction = isRising ? -1 : 1;
  const baseX = centroid.x + (isRising ? -58 : 58);
  const baseY = centroid.y + (isRising ? 48 : -48);

  return (
    <>
      <path
        d={isRising ? `M ${baseX} ${baseY} C ${baseX + 35} ${baseY - 30}, ${baseX + 66} ${baseY - 76}, ${baseX + 108} ${baseY - 116}` : `M ${baseX} ${baseY} C ${baseX - 35} ${baseY + 30}, ${baseX - 66} ${baseY + 76}, ${baseX - 108} ${baseY + 116}`}
        fill="none"
        stroke={palette.glow}
        strokeWidth="15"
        strokeLinecap="round"
        opacity="0.55"
      />
      <Person x={centroid.x - 34 * direction} y={centroid.y + 28 * direction} scale="0.76" robe={isRising ? "#f0ddaa" : "#957d95"} outline={palette.ink} />
      <Person x={centroid.x} y={centroid.y} scale="0.88" robe={isRising ? "#f4e8c8" : "#a3899e"} outline={palette.ink} armLift />
      <Person x={centroid.x + 35 * direction} y={centroid.y - 32 * direction} scale="1" robe={isRising ? "#fff1d6" : "#b49cb1"} outline={palette.ink} />
      {isRising ? (
        <>
          <Lotus x={centroid.x + 68} y={centroid.y - 62} scale="0.74" petal="#f4e5be" center="#8f5835" />
          <Cloud x={centroid.x + 88} y={centroid.y - 88} scale="0.4" color="#fff7e5" opacity="0.72" />
        </>
      ) : (
        <>
          <path d={`M ${centroid.x - 88} ${centroid.y + 63} q 24 25 48 0 q -4 34 -48 0`} fill="#b24d48" opacity="0.7" />
          <path d={`M ${centroid.x - 68} ${centroid.y + 46} q 19 18 36 0 q -2 25 -36 0`} fill="#d17955" opacity="0.78" />
        </>
      )}
    </>
  );
}

function renderRealmScene(node, centroid, palette) {
  switch (node.id) {
    case "gods":
      return (
        <>
          <Cloud x={centroid.x - 40} y={centroid.y - 45} scale="0.85" color={palette.mist} opacity="0.9" />
          <Temple x={centroid.x + 8} y={centroid.y + 5} scale="1.04" fill="#d9cb9f" roof="#a25b3f" stroke={palette.ink} />
          <Lotus x={centroid.x - 56} y={centroid.y + 47} scale="0.68" petal="#f3dfa7" center="#9c5e3d" />
        </>
      );
    case "demi-gods":
      return (
        <>
          <Tree x={centroid.x + 6} y={centroid.y + 12} scale="1.1" trunk="#50341c" foliage="#7f9052" />
          <Spear x={centroid.x - 44} y={centroid.y + 8} scale="0.94" rotation="-12" />
          <Spear x={centroid.x + 48} y={centroid.y - 4} scale="0.94" rotation="15" />
          <Person x={centroid.x - 2} y={centroid.y + 34} scale="0.8" robe="#a95f45" outline={palette.ink} armLift />
        </>
      );
    case "humans":
      return (
        <>
          <Mountain x={centroid.x + 8} y={centroid.y + 18} scale="0.9" fill="#6c6356" accent="#d3c49d" />
          <Person x={centroid.x - 48} y={centroid.y + 34} scale="0.82" robe="#c67d51" outline={palette.ink} />
          <Lotus x={centroid.x + 56} y={centroid.y + 42} scale="0.62" petal="#e7d195" center="#8e5536" />
          <path d={`M ${centroid.x - 24} ${centroid.y + 55} q 32 -13 60 -3`} fill="none" stroke={palette.mist} strokeWidth="6" strokeLinecap="round" opacity="0.5" />
        </>
      );
    case "animals":
      return (
        <>
          <Mountain x={centroid.x - 10} y={centroid.y + 28} scale="0.85" fill="#615540" accent="#bba97f" />
          <Pig x={centroid.x + 18} y={centroid.y + 4} scale="0.7" fill="#bfa06a" stroke={palette.ink} />
          <path d={`M ${centroid.x - 56} ${centroid.y + 23} q 24 -30 45 -8`} fill="none" stroke={palette.glow} strokeWidth="5" opacity="0.55" />
        </>
      );
    case "hungry-ghosts":
      return (
        <>
          <Tree x={centroid.x + 18} y={centroid.y + 2} scale="1.05" trunk="#4f3422" barren />
          <Person x={centroid.x - 40} y={centroid.y + 34} scale="0.68" robe="#8b665c" outline={palette.ink} />
          <Bowl x={centroid.x + 52} y={centroid.y + 48} scale="0.8" fill="#c6a480" stroke={palette.ink} />
        </>
      );
    case "hell":
      return (
        <>
          <path d={`M ${centroid.x - 76} ${centroid.y + 54} q 12 -44 28 0 q 10 -35 24 0 q 12 -28 26 0 q 8 -33 23 0`} fill="#d66b45" opacity="0.9" />
          <path d={`M ${centroid.x - 48} ${centroid.y + 60} l 12 -37 l 12 37 l 11 -30 l 11 30`} fill="#8db7c3" opacity="0.82" />
          <path d={`M ${centroid.x - 56} ${centroid.y - 4} h 72`} stroke={palette.ink} strokeWidth="2.6" opacity="0.55" />
          <path d={`M ${centroid.x - 36} ${centroid.y - 18} v 42 M ${centroid.x - 10} ${centroid.y - 18} v 42 M ${centroid.x + 16} ${centroid.y - 18} v 42`} stroke={palette.ink} strokeWidth="2.1" opacity="0.55" />
        </>
      );
    default:
      return null;
  }
}

function renderOuterLinkScene(node, centroid, palette) {
  switch (node.id) {
    case "ignorance-link":
      return <BlindFigure x={centroid.x} y={centroid.y + 4} scale="0.85" fill="#8e6a4f" stroke={palette.ink} />;
    case "formations":
      return <Potter x={centroid.x} y={centroid.y + 4} scale="0.84" fill="#b8875d" stroke={palette.ink} />;
    case "consciousness":
      return <Monkey x={centroid.x} y={centroid.y + 4} scale="0.84" fill="#af8d55" stroke={palette.ink} />;
    case "name-and-form":
      return <Boat x={centroid.x} y={centroid.y + 4} scale="0.76" fill="#806455" stroke={palette.ink} />;
    case "six-senses":
      return <HouseSixWindows x={centroid.x} y={centroid.y + 2} scale="0.72" fill="#d6c59d" stroke={palette.ink} />;
    case "contact":
      return (
        <>
          <Person x={centroid.x - 12} y={centroid.y + 7} scale="0.56" robe="#8b6250" outline={palette.ink} />
          <path d={`M ${centroid.x - 2} ${centroid.y + 7} L ${centroid.x + 26} ${centroid.y + 1}`} stroke={palette.ink} strokeWidth="2.2" strokeLinecap="round" />
          <circle cx={centroid.x + 29} cy={centroid.y - 1} r="4" fill={palette.glow} stroke={palette.ink} strokeWidth="1.2" />
        </>
      );
    case "feeling":
      return (
        <>
          <EyeIcon x={centroid.x} y={centroid.y + 2} scale="0.68" stroke={palette.ink} iris="#c4855d" />
          <path d={`M ${centroid.x + 22} ${centroid.y - 16} L ${centroid.x + 36} ${centroid.y - 26}`} stroke={palette.ink} strokeWidth="2" strokeLinecap="round" />
        </>
      );
    case "craving-link":
      return (
        <>
          <Person x={centroid.x - 8} y={centroid.y + 6} scale="0.6" robe="#935645" outline={palette.ink} />
          <Cup x={centroid.x + 20} y={centroid.y - 6} scale="0.8" fill="#bb8658" stroke={palette.ink} />
          <path d={`M ${centroid.x + 3} ${centroid.y - 10} L ${centroid.x + 13} ${centroid.y - 7}`} stroke={palette.ink} strokeWidth="1.8" strokeLinecap="round" />
        </>
      );
    case "clinging":
      return <BranchFruit x={centroid.x} y={centroid.y + 6} scale="0.88" stroke={palette.ink} fill="#80945a" fruit="#cf7750" />;
    case "becoming":
      return <PregnantFigure x={centroid.x} y={centroid.y + 7} scale="0.7" fill="#8e6252" stroke={palette.ink} />;
    case "birth":
      return (
        <>
          <path d={`M ${centroid.x - 26} ${centroid.y + 18} Q ${centroid.x} ${centroid.y - 24} ${centroid.x + 26} ${centroid.y + 18}`} fill="none" stroke={palette.ink} strokeWidth="2.4" />
          <InfantGlow x={centroid.x} y={centroid.y + 1} scale="0.72" />
        </>
      );
    case "aging-death":
      return (
        <>
          <Skull x={centroid.x} y={centroid.y + 4} scale="0.76" fill="#ece5d8" stroke={palette.ink} />
          <path d={`M ${centroid.x - 22} ${centroid.y + 18} q 23 19 44 0`} fill="none" stroke="#c7afb0" strokeWidth="5" strokeLinecap="round" opacity="0.7" />
        </>
      );
    default:
      return null;
  }
}

export function SegmentIllustration({ node, cx, cy, clipId }) {
  if (node.position?.shape !== "segment") {
    return null;
  }

  const centroid = getSegmentCentroid(
    cx,
    cy,
    node.position.innerRadius,
    node.position.outerRadius,
    node.position.startAngle,
    node.position.endAngle,
  );
  const palette = getPalette(node);

  let artwork = null;

  if (node.ring === "hub") {
    artwork = renderHubScene(node, centroid, palette);
  } else if (node.ring === "inner") {
    artwork = renderKarmaScene(node, centroid, palette);
  } else if (node.ring === "realms") {
    artwork = renderRealmScene(node, centroid, palette);
  } else if (node.ring === "outer") {
    artwork = renderOuterLinkScene(node, centroid, palette);
  }

  return (
    <g clipPath={`url(#${clipId})`} className="segment-illustration" aria-hidden="true">
      <circle cx={centroid.x} cy={centroid.y} r={node.ring === "outer" ? 54 : 82} fill={palette.glow} opacity={node.ring === "outer" ? "0.3" : "0.24"} />
      <circle cx={centroid.x - 18} cy={centroid.y - 12} r={node.ring === "outer" ? 28 : 36} fill={palette.mist} opacity={node.ring === "outer" ? "0.24" : "0.18"} />
      {artwork}
    </g>
  );
}

export function SegmentLabel({ node, cx, cy }) {
  if (node.position?.shape !== "segment") {
    return null;
  }

  const { innerRadius, outerRadius, startAngle, endAngle } = node.position;
  const centroid = getSegmentCentroid(cx, cy, innerRadius, outerRadius, startAngle, endAngle);
  const midAngle = startAngle + (endAngle - startAngle) / 2;

  if (node.ring === "hub") {
    return null;
  }

  if (node.ring === "inner") {
    const anchor = polarToCartesian(cx, cy, innerRadius + (outerRadius - innerRadius) * 0.52, midAngle);
    return <InnerLabel node={node} x={anchor.x} y={anchor.y} angle={midAngle - 90} />;
  }

  if (node.ring === "realms") {
    const anchor = polarToCartesian(cx, cy, innerRadius + (outerRadius - innerRadius) * 0.63, midAngle);
    return <RealmLabel node={node} x={anchor.x} y={anchor.y} />;
  }

  if (node.ring === "outer") {
    const number = node.title.split(".")[0];
    const badge = polarToCartesian(cx, cy, outerRadius - 19, midAngle);
    return <OuterLinkLabel node={node} x={badge.x} y={badge.y} number={number} />;
  }

  return null;
}

export function TagArtwork({ node }) {
  const { x, y, w, h } = node.position;

  return (
    <g aria-hidden="true">
      <circle cx={x + 16} cy={y + h / 2} r="5" className="tag-seal" />
      <circle cx={x + w - 16} cy={y + h / 2} r="5" className="tag-seal" />
      <path d={`M ${x + 24} ${y + h / 2} H ${x + w - 24}`} className="tag-divider" />
      <text x={x + w / 2} y={y + 17} textAnchor="middle" className="wheel-tag-title">
        {node.shortLabel}
      </text>
      <text x={x + w / 2} y={y + 33} textAnchor="middle" className="wheel-tag-meta">
        Interactive overview
      </text>
    </g>
  );
}

export function FrameNodeArtwork({ node }) {
  if (node.id === "yama") {
    return (
      <g aria-hidden="true">
        <path d="M -24 -18 q -14 -22 -28 -10 q 10 12 24 14" className="frame-icon-stroke" />
        <path d="M 24 -18 q 14 -22 28 -10 q -10 12 -24 14" className="frame-icon-stroke" />
        <circle cx="0" cy="2" r="22" className="frame-node-base yama-node" />
        <circle cx="-7" cy="-2" r="3.5" className="frame-node-eye" />
        <circle cx="7" cy="-2" r="3.5" className="frame-node-eye" />
        <path d="M -10 9 q 10 7 20 0" className="frame-icon-stroke" />
        <path d="M -6 12 l 3 6 l 3 -6" className="frame-fang" />
      </g>
    );
  }

  if (node.id === "buddha") {
    return (
      <g aria-hidden="true">
        <circle cx="0" cy="0" r="24" className="frame-node-base buddha-node" />
        <Lotus x="0" y="9" scale="0.52" petal="#dcb275" center="#8d4d31" />
        <Person x="0" y="-1" scale="0.54" robe="#b56745" outline="#2a1a12" seated armLift />
      </g>
    );
  }

  if (node.id === "liberation") {
    return (
      <g aria-hidden="true">
        <circle cx="0" cy="0" r="24" className="frame-node-base liberation-node" />
        <MoonSymbol x="0" y="0" scale="0.62" />
      </g>
    );
  }

  if (node.id === "impermanence") {
    return (
      <g aria-hidden="true">
        <circle cx="0" cy="0" r="22" className="frame-node-base impermanence-node" />
        <ImpermanenceMarker x="0" y="0" scale="0.62" />
      </g>
    );
  }

  return null;
}

export function ThangkaBackdrop() {
  const flames = Array.from({ length: 28 }, (_, index) => {
    const angle = index * (360 / 28);
    const left = polarToCartesian(350, 350, 356, angle - 5);
    const right = polarToCartesian(350, 350, 356, angle + 5);
    const tip = polarToCartesian(350, 350, 404 + (index % 2 === 0 ? 10 : 0), angle);
    const inner = polarToCartesian(350, 350, 345, angle);

    return (
      <path
        key={angle}
        d={`M ${left.x} ${left.y} Q ${inner.x} ${inner.y} ${tip.x} ${tip.y} Q ${inner.x} ${inner.y} ${right.x} ${right.y}`}
        className="thangka-flame"
      />
    );
  });

  const clawAngles = [-44, 28, 152, 224];
  const claws = clawAngles.map((angle, index) => {
    const anchor = polarToCartesian(350, 350, 365, angle);
    const tip1 = polarToCartesian(350, 350, 406, angle - 8);
    const tip2 = polarToCartesian(350, 350, 420, angle);
    const tip3 = polarToCartesian(350, 350, 406, angle + 8);

    return (
      <g key={index} className="yama-claw">
        <path d={`M ${anchor.x} ${anchor.y} Q ${tip1.x} ${tip1.y} ${tip2.x} ${tip2.y}`} />
        <path d={`M ${anchor.x} ${anchor.y} Q ${tip2.x} ${tip2.y} ${tip3.x} ${tip3.y}`} />
      </g>
    );
  });

  return (
    <g aria-hidden="true">
      <path
        d="M 118 642 C 56 580 46 454 72 346 C 95 249 173 139 280 93 C 426 29 562 67 635 129 C 715 198 750 320 729 431 C 711 531 652 622 563 671 L 515 610 C 582 571 633 498 643 414 C 653 330 621 241 559 177 C 506 120 409 88 307 106 C 204 124 129 194 104 287 C 78 381 92 512 164 590 Z"
        className="yama-shadow-body"
      />
      <path d="M 245 94 C 264 38 309 17 348 43 C 382 10 436 26 455 91" className="yama-horn" />
      <path d="M 592 166 C 648 171 672 217 649 255" className="yama-arm" />
      <path d="M 103 196 C 47 213 36 258 62 289" className="yama-arm" />
      <g className="thangka-flames">{flames}</g>
      <g className="thangka-claws">{claws}</g>
      <g transform="translate(350 646)" className="yama-face">
        <path d="M -56 14 q -30 -69 10 -108 q 40 -36 86 0 q 39 38 10 108" />
        <circle cx="-18" cy="-28" r="10" className="yama-eye" />
        <circle cx="18" cy="-28" r="10" className="yama-eye" />
        <path d="M -22 18 q 22 18 44 0" className="yama-mouth" />
        <path d="M -12 22 l 6 18 l 6 -18" className="yama-fangs" />
        <circle cx="0" cy="-64" r="8" className="skull-crown" />
        <circle cx="-20" cy="-59" r="7" className="skull-crown" />
        <circle cx="20" cy="-59" r="7" className="skull-crown" />
      </g>
    </g>
  );
}

export function getSegmentFill(node) {
  return getPalette(node).base;
}
