import { useId } from "react";
import type { ArtKind } from "@/lib/types";

interface ProductArtProps {
  kind: ArtKind;
  tone: string;
  accent?: string;
  className?: string;
  /** Short label printed on book covers. */
  label?: string;
}

const OUTLINE = "rgba(20,24,35,0.16)";

/** Illustrated product avatar — custom SVG per category, tinted with the product's colours. */
export function ProductArt({ kind, tone, accent = "#fcc81f", className, label }: ProductArtProps) {
  const uid = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-hidden="true">
      {renderArt(kind, tone, accent, uid, label)}
    </svg>
  );
}

function Book({
  x,
  y,
  w,
  h,
  tone,
  accent,
  label,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tone: string;
  accent: string;
  label?: string;
}) {
  return (
    <g>
      {/* pages */}
      <rect x={x + 4} y={y + 3} width={w} height={h} rx={3} fill="#fffdf7" stroke={OUTLINE} />
      {/* cover */}
      <rect x={x} y={y} width={w} height={h} rx={3} fill={tone} />
      {/* spine shade */}
      <rect x={x} y={y} width={7} height={h} rx={2} fill="rgba(0,0,0,0.18)" />
      <rect x={x + 14} y={y + 12} width={w - 22} height={4} rx={2} fill={accent} />
      <rect x={x + 14} y={y + 20} width={(w - 22) * 0.6} height={3} rx={1.5} fill={accent} opacity={0.6} />
      {label ? (
        <text
          x={x + 14}
          y={y + h - 10}
          fontSize={9}
          fontWeight={700}
          fill={accent}
          fontFamily="var(--font-heading)"
        >
          {label}
        </text>
      ) : null}
    </g>
  );
}

function renderArt(kind: ArtKind, tone: string, accent: string, uid: string, label?: string) {
  switch (kind) {
    case "course-pack":
    case "bundle":
      return (
        <g>
          <rect x={22} y={86} width={78} height={14} rx={3} fill={accent} stroke={OUTLINE} />
          <rect x={22} y={86} width={78} height={3} fill="rgba(0,0,0,0.08)" />
          <rect x={26} y={72} width={70} height={14} rx={3} fill="#fffdf7" stroke={OUTLINE} />
          <rect x={26} y={72} width={70} height={14} rx={3} fill={tone} opacity={0.55} />
          <Book x={30} y={18} w={58} h={54} tone={tone} accent={accent} label={label} />
        </g>
      );
    case "o-a-level":
      return (
        <g>
          <Book x={30} y={14} w={60} h={88} tone={tone} accent={accent} label={label} />
          <circle cx={74} cy={68} r={10} fill="none" stroke={accent} strokeWidth={2.5} opacity={0.8} />
          <path d="M70 68 l3 3 l6 -7" fill="none" stroke={accent} strokeWidth={2.5} strokeLinecap="round" />
        </g>
      );
    case "revision":
      return (
        <g>
          <rect x={86} y={30} width={12} height={10} rx={2} fill="#ef4444" />
          <rect x={86} y={46} width={12} height={10} rx={2} fill="#22c55e" />
          <rect x={86} y={62} width={12} height={10} rx={2} fill="#3b82f6" />
          <Book x={28} y={16} w={60} h={86} tone={tone} accent={accent} label={label} />
          <path d="M44 62 h30 M44 70 h22 M44 78 h26" stroke={accent} strokeWidth={2.5} strokeLinecap="round" opacity={0.7} />
        </g>
      );
    case "children":
      return (
        <g>
          <Book x={26} y={20} w={66} h={80} tone={tone} accent={accent} label={label} />
          <circle cx={66} cy={64} r={13} fill={accent} />
          <path
            d="M66 52 l3.5 7 7.5 1 -5.5 5.2 1.4 7.6 -6.9 -3.7 -6.9 3.7 1.4 -7.6 -5.5 -5.2 7.5 -1z"
            fill={tone}
            transform="translate(0 2) scale(1) "
          />
        </g>
      );
    case "shirt":
      return (
        <g>
          <path
            d="M44 20 L28 26 L12 42 L22 56 L32 49 L32 100 L88 100 L88 49 L98 56 L108 42 L92 26 L76 20 Q60 32 44 20 Z"
            fill={tone}
            stroke={OUTLINE}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path d="M44 20 L60 36 L52 42 Z M76 20 L60 36 L68 42 Z" fill={tone} stroke={OUTLINE} strokeWidth={1.5} />
          <line x1={60} y1={36} x2={60} y2={100} stroke={OUTLINE} strokeWidth={1.5} />
          {[50, 64, 78, 92].map((cy) => (
            <circle key={cy} cx={60} cy={cy} r={1.6} fill={OUTLINE} />
          ))}
          <rect x={70} y={52} width={12} height={12} rx={2} fill="none" stroke={OUTLINE} strokeWidth={1.2} />
          <circle cx={76} cy={57} r={3.5} fill={accent} />
        </g>
      );
    case "blazer":
      return (
        <g>
          <path
            d="M44 18 L26 24 L12 44 L18 100 L102 100 L108 44 L94 24 L76 18 Z"
            fill={tone}
            stroke={OUTLINE}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path d="M46 18 L60 58 L74 18 Q60 26 46 18 Z" fill="#ffffff" />
          <path d="M56 22 L60 58 L64 22 Z" fill={accent} opacity={0.9} />
          <path d="M44 18 L60 70 L50 44 L38 40 Z M76 18 L60 70 L70 44 L82 40 Z" fill="rgba(0,0,0,0.18)" />
          <circle cx={60} cy={78} r={2.6} fill={accent} />
          <circle cx={60} cy={90} r={2.6} fill={accent} />
          <circle cx={42} cy={58} r={5} fill={accent} opacity={0.95} />
          <path d="M24 82 h18" stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
          <path d="M78 82 h18" stroke="rgba(0,0,0,0.2)" strokeWidth={2} />
        </g>
      );
    case "trousers":
      return (
        <g>
          <path
            d="M36 16 H84 L92 104 H66 L60 44 L54 104 H28 Z"
            fill={tone}
            stroke={OUTLINE}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <rect x={36} y={16} width={48} height={8} fill={accent} opacity={0.75} />
          {[44, 56, 68, 76].map((x) => (
            <rect key={x} x={x} y={15} width={3} height={10} rx={1} fill="rgba(0,0,0,0.25)" />
          ))}
          <path d="M60 24 V44" stroke="rgba(0,0,0,0.25)" strokeWidth={1.5} />
          <path d="M42 30 Q46 38 52 34 M78 30 Q74 38 68 34" fill="none" stroke="rgba(0,0,0,0.22)" strokeWidth={1.5} />
        </g>
      );
    case "tie": {
      const clip = `tie-${uid}`;
      return (
        <g>
          <defs>
            <clipPath id={clip}>
              <path d="M53 16 H67 L71 28 L64 35 L76 92 L60 106 L44 92 L56 35 L49 28 Z" />
            </clipPath>
          </defs>
          <path d="M53 16 H67 L71 28 L64 35 L76 92 L60 106 L44 92 L56 35 L49 28 Z" fill={tone} />
          <g clipPath={`url(#${clip})`}>
            {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
              <rect
                key={i}
                x={20}
                y={14 + i * 13}
                width={90}
                height={4}
                fill={accent}
                transform={`rotate(-35 60 ${16 + i * 13})`}
              />
            ))}
          </g>
          <path d="M53 16 H67 L71 28 L64 35 L56 35 L49 28 Z" fill="rgba(0,0,0,0.12)" />
        </g>
      );
    }
    case "sash":
      return (
        <g>
          <path
            d="M18 34 Q60 22 102 34 L100 48 Q60 36 20 48 Z"
            fill={tone}
            stroke={OUTLINE}
            strokeWidth={1.5}
          />
          <path d="M22 41 Q60 30 98 41" fill="none" stroke={accent} strokeWidth={2} strokeDasharray="4 3" />
          <rect x={52} y={30} width={16} height={18} rx={4} fill={tone} stroke={OUTLINE} strokeWidth={1.5} />
          <path d="M54 48 L44 98 L56 90 L60 100 L62 48 Z" fill={tone} stroke={OUTLINE} strokeWidth={1.5} />
          <path d="M64 48 L76 96 L66 90 L60 100 Z" fill={tone} stroke={OUTLINE} strokeWidth={1.5} opacity={0.9} />
        </g>
      );
    case "pe-kit":
      return (
        <g>
          <path
            d="M38 14 L24 20 L12 34 L22 44 L30 38 L30 76 L74 76 L74 38 L82 44 L92 34 L80 20 L66 14 Q52 24 38 14 Z"
            fill={tone}
            stroke={OUTLINE}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <path d="M24 20 L12 34 L16 38 L28 24 Z M80 20 L92 34 L88 38 L76 24 Z" fill={accent} opacity={0.85} />
          <text x={52} y={60} textAnchor="middle" fontSize={16} fontWeight={800} fill={accent} fontFamily="var(--font-heading)">
            7
          </text>
          <path
            d="M62 72 H106 L110 108 H90 L84 88 L80 108 H58 Z"
            fill={accent}
            stroke={OUTLINE}
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
          <rect x={62} y={72} width={44} height={6} fill="rgba(0,0,0,0.15)" />
          <path d="M60 100 L58 108 M108 100 L110 108" stroke={tone} strokeWidth={3} />
        </g>
      );
  }
}
