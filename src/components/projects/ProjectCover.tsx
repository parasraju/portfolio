import type { CSSProperties, ReactNode } from "react";

const INK = "var(--cv-ink)";
const LINE = "var(--cv-line)";
const SOFT = "var(--cv-soft)";
const CARD = "var(--cv-card)";
const ACC = "var(--cv-accent)";
const MONO = "ui-monospace, SFMono-Regular, Menlo, monospace";

const ACCENTS: Record<string, string> = {
  hexlens: "#3b82f6",
  leakedapis: "#f59e0b",
  locus: "#10b981",
  plumber: "#ef4444",
  kinder: "#8b5cf6",
  eureka: "#eab308",
  domaindigger: "#06b6d4",
  scholardex: "#f97316",
};

const d = (ms: number): CSSProperties => ({ animationDelay: `${ms}ms` });

function T({ x, y, children, size = 9, fill = INK, weight, anchor, className, style }: { x: number; y: number; children: ReactNode; size?: number; fill?: string; weight?: number; anchor?: "start" | "middle" | "end"; className?: string; style?: CSSProperties }) {
  return (
    <text x={x} y={y} fontSize={size} fontFamily={MONO} fill={fill} fontWeight={weight} textAnchor={anchor} className={className} style={style}>
      {children}
    </text>
  );
}

function HexLens() {
  const rows = ["7f 45 4c 46 02 01 01 00", "00 00 00 00 00 00 00 00", "02 00 3e 00 01 00 00 00", "40 10 40 00 00 00 00 00", "e8 3a 00 00 ff 25 d2 2f", "c3 90 90 48 89 e5 5d c3"];
  const ascii = [".ELF....", "........", "..>.....", "@.@.....", ".:...%./", "...H..].", ""];
  return (
    <>
      {rows.map((r, i) => (
        <g key={i}>
          <T x={18} y={30 + i * 18} fill={LINE}>{`0x${(i * 16).toString(16).padStart(4, "0")}`}</T>
          <T x={68} y={30 + i * 18}>{r}</T>
          <T x={250} y={30 + i * 18} fill={LINE}>{ascii[i]}</T>
        </g>
      ))}
      <rect className="scan" x={12} y={19} width={296} height={16} rx={3} fill={ACC} opacity={0.16} style={{ "--cv-d": "90px" } as CSSProperties} />
      <g className="drift" style={{ "--cv-x": "130px", "--cv-y": "18px", animationDuration: "6s" } as CSSProperties}>
        <circle cx={110} cy={62} r={24} fill={ACC} fillOpacity={0.08} stroke={ACC} strokeWidth={2} />
        <line x1={127} y1={79} x2={142} y2={94} stroke={ACC} strokeWidth={4} strokeLinecap="round" />
      </g>
    </>
  );
}

function ApiInstructor() {
  const keys = ["AKIA••••••7Q2X", "sk_live_••••3f9a", "ghp_••••••a91c", "AIza••••••Xk2p"];
  return (
    <>
      {keys.map((k, i) => {
        const leak = i === 1;
        return (
          <g key={k}>
            <rect x={16} y={24 + i * 27} width={154} height={19} rx={4} fill={CARD} stroke={leak ? ACC : LINE} />
            <T x={26} y={37 + i * 27} fill={leak ? ACC : INK}>{k}</T>
            {leak && (
              <g className="blink">
                <rect x={130} y={28 + i * 27} width={34} height={11} rx={2} fill={ACC} />
                <T x={147} y={36.5 + i * 27} size={7} fill="#fff" weight={700} anchor="middle">LEAK</T>
              </g>
            )}
          </g>
        );
      })}
      {[22, 44, 62].map((r) => (
        <circle key={r} cx={240} cy={75} r={r} fill="none" stroke={LINE} />
      ))}
      <line x1={178} y1={75} x2={302} y2={75} stroke={LINE} strokeDasharray="2 3" />
      <line x1={240} y1={13} x2={240} y2={137} stroke={LINE} strokeDasharray="2 3" />
      <g className="spin" style={{ animationDuration: "3.6s" }}>
        <circle cx={240} cy={75} r={62} fill="transparent" />
        <path d="M240 75 L240 13 A62 62 0 0 1 293.7 44 Z" fill={ACC} opacity={0.22} />
        <line x1={240} y1={75} x2={240} y2={13} stroke={ACC} strokeWidth={1.5} />
      </g>
      {[
        [266, 50, 0],
        [214, 98, 900],
        [258, 108, 1700],
      ].map(([x, y, delay]) => (
        <g key={x}>
          <circle className="ping" cx={x} cy={y} r={4} fill="none" stroke={ACC} style={d(delay)} />
          <circle cx={x} cy={y} r={2.5} fill={ACC} />
        </g>
      ))}
    </>
  );
}

function Locus() {
  const nodes: [number, number][] = [
    [214, 40],
    [272, 34],
    [298, 82],
    [252, 112],
    [200, 100],
  ];
  const hub: [number, number] = [248, 72];
  return (
    <>
      <rect x={18} y={18} width={142} height={116} rx={6} fill={CARD} stroke={LINE} />
      <T x={30} y={38} size={11} weight={700}># Notes</T>
      <rect x={30} y={48} width={104} height={4} rx={2} fill={LINE} />
      <rect x={30} y={58} width={86} height={4} rx={2} fill={LINE} />
      <rect className="blink" x={120} y={55} width={1.5} height={9} fill={INK} />
      <T x={30} y={78} fill={ACC}>[[locus]]</T>
      <rect x={84} y={73} width={52} height={4} rx={2} fill={LINE} />
      <rect x={30} y={86} width={96} height={4} rx={2} fill={LINE} />
      <rect x={30} y={98} width={116} height={24} rx={3} fill={ACC} opacity={0.1} />
      <rect x={30} y={98} width={2} height={24} fill={ACC} />
      <rect x={38} y={105} width={70} height={4} rx={2} fill={ACC} opacity={0.5} />
      <rect x={38} y={113} width={48} height={4} rx={2} fill={ACC} opacity={0.35} />
      <path className="flow" d="M136 75 C 170 75, 190 72, 240 72" fill="none" stroke={ACC} strokeOpacity={0.6} />
      {nodes.map(([x, y]) => (
        <line key={`e${x}`} x1={hub[0]} y1={hub[1]} x2={x} y2={y} stroke={LINE} />
      ))}
      <line x1={214} y1={40} x2={272} y2={34} stroke={LINE} />
      <line x1={252} y1={112} x2={200} y2={100} stroke={LINE} />
      {nodes.map(([x, y], i) => (
        <circle key={`n${x}`} className="pulse" cx={x} cy={y} r={5} fill={CARD} stroke={ACC} strokeWidth={1.5} style={d(i * 380)} />
      ))}
      <circle className="ping" cx={hub[0]} cy={hub[1]} r={8} fill="none" stroke={ACC} />
      <circle cx={hub[0]} cy={hub[1]} r={8} fill={ACC} />
    </>
  );
}

function Plumber() {
  const stages = ["lint", "test", "build", "deploy"];
  const wave = Array.from({ length: 14 }, (_, i) => `q 3 ${i % 2 ? 3 : -3} 6 0`).join(" ");
  return (
    <>
      {stages.slice(0, -1).map((_, i) => {
        const x1 = 20 + i * 75 + 58;
        const x2 = 20 + (i + 1) * 75;
        return (
          <g key={i}>
            <line x1={x1} y1={60} x2={x2} y2={60} stroke={LINE} strokeWidth={3} />
            <line className="flow" x1={x1} y1={60} x2={x2} y2={60} stroke={INK} strokeWidth={1.5} style={d(i * 200)} />
          </g>
        );
      })}
      {stages.map((s, i) => {
        const x = 20 + i * 75;
        const flagged = s === "build";
        return (
          <g key={s}>
            <rect x={x} y={46} width={58} height={28} rx={6} fill={CARD} stroke={flagged ? ACC : LINE} strokeWidth={flagged ? 1.5 : 1} />
            <T x={x + 29} y={63} anchor="middle" fill={flagged ? ACC : INK}>{s}</T>
          </g>
        );
      })}
      <circle className="ping" cx={228} cy={46} r={7} fill="none" stroke={ACC} />
      <circle cx={228} cy={46} r={7} fill={ACC} />
      <T x={228} y={49.5} size={9} fill="#fff" weight={700} anchor="middle">!</T>
      <rect x={20} y={96} width={280} height={30} rx={5} fill={CARD} stroke={LINE} />
      <T x={32} y={115} size={10}>API_KEY = </T>
      <T x={92} y={115} size={10} fill={ACC}>&quot;sk-••••••••&quot;</T>
      <path className="fade" d={`M92 121 ${wave}`} fill="none" stroke={ACC} strokeWidth={1.2} />
      <T x={290} y={115} size={8} fill={LINE} anchor="end">plumber</T>
    </>
  );
}

function Kinder() {
  const spokes = Array.from({ length: 8 }, (_, i) => (i * Math.PI) / 4);
  return (
    <>
      <circle cx={92} cy={75} r={54} fill={CARD} stroke={LINE} strokeWidth={2} />
      {spokes.map((a) => (
        <circle key={a} cx={92 + Math.cos(a + 0.39) * 47} cy={75 + Math.sin(a + 0.39) * 47} r={2.5} fill={LINE} />
      ))}
      <circle cx={92} cy={75} r={38} fill="none" stroke={LINE} strokeDasharray="3 4" />
      <g className="spin" style={{ animationDuration: "12s" }}>
        <circle cx={92} cy={75} r={34} fill="transparent" />
        {spokes.map((a) => (
          <line key={a} x1={92 + Math.cos(a) * 14} y1={75 + Math.sin(a) * 14} x2={92 + Math.cos(a) * 32} y2={75 + Math.sin(a) * 32} stroke={INK} strokeWidth={2} strokeLinecap="round" />
        ))}
      </g>
      <circle className="pulse" cx={92} cy={75} r={10} fill={ACC} fillOpacity={0.25} stroke={ACC} strokeWidth={1.5} />
      {[0, 1, 2].map((i) => (
        <g key={i}>
          <rect x={170} y={34 + i * 30} width={132} height={22} rx={5} fill={CARD} stroke={i === 0 ? ACC : LINE} />
          <rect x={180} y={44 + i * 30} width={9} height={7} rx={1.5} fill={ACC} />
          <path d={`M182 ${44 + i * 30} v-2.5 a2.5 2.5 0 0 1 5 0 v2.5`} fill="none" stroke={ACC} strokeWidth={1.3} />
          <T x={198} y={50 + i * 30} className="fade" style={d(i * 500)}>
            ••••••••••••
          </T>
        </g>
      ))}
    </>
  );
}

function Eureka() {
  const heights = [48, 74, 38, 88, 62, 104, 70];
  const best = 5;
  return (
    <>
      <T x={22} y={22}>creativity@k</T>
      <line x1={20} y1={130} x2={300} y2={130} stroke={LINE} />
      <line className="flow" x1={20} y1={52} x2={300} y2={52} stroke={ACC} strokeOpacity={0.5} />
      {heights.map((h, i) => (
        <rect
          key={i}
          className="grow"
          x={34 + i * 38}
          y={130 - h}
          width={22}
          height={h}
          rx={3}
          fill={i === best ? ACC : LINE}
          style={{ ...d(i * 260), "--cv-from": String(0.35 + (i % 3) * 0.15) } as CSSProperties}
        />
      ))}
      <path
        className="pulse"
        d="M282 14 L285 23 L294 26 L285 29 L282 38 L279 29 L270 26 L279 23 Z"
        fill={ACC}
      />
    </>
  );
}

function DomainDigger() {
  const root: [number, number] = [160, 26];
  const l1: [string, number, number][] = [
    ["com", 70, 66],
    ["dev", 160, 66],
    ["io", 250, 66],
  ];
  const l2: [string, number, number, number][] = [
    ["x", 70, 104, 0],
    ["api", 120, 104, 1],
    ["www", 160, 104, 1],
    ["mail", 200, 104, 1],
    ["cdn", 250, 104, 2],
  ];
  return (
    <>
      {l1.map(([, x, y]) => (
        <line key={x} x1={root[0]} y1={root[1]} x2={x} y2={y} stroke={LINE} />
      ))}
      {l2.map(([, x, y, p]) => (
        <line key={x} x1={l1[p][1]} y1={l1[p][2]} x2={x} y2={y} stroke={LINE} />
      ))}
      <path className="flow" d="M160 26 L160 66 L120 104" fill="none" stroke={ACC} strokeWidth={1.5} />
      <circle className="ping" cx={root[0]} cy={root[1]} r={8} fill="none" stroke={ACC} />
      <circle cx={root[0]} cy={root[1]} r={8} fill={ACC} />
      <T x={172} y={29} fill={INK}>.</T>
      {l1.map(([label, x, y]) => (
        <g key={label}>
          <circle cx={x} cy={y} r={6} fill={CARD} stroke={label === "dev" ? ACC : INK} strokeWidth={1.5} />
          <T x={x + 10} y={y + 3}>{label}</T>
        </g>
      ))}
      {l2.map(([label, x, y], i) => (
        <g key={label}>
          <circle className={label === "api" ? "pulse" : undefined} cx={x} cy={y} r={4} fill={label === "api" ? ACC : LINE} style={d(i * 200)} />
          <T x={x} y={y + 14} size={8} anchor="middle">{label}</T>
        </g>
      ))}
      <T x={16} y={143} size={8} fill={INK}>$ dig +trace api.parasraju.dev</T>
      <rect className="blink" x={170} y={136} width={5} height={9} fill={ACC} />
    </>
  );
}

function ScholarDex() {
  return (
    <>
      {[2, 1, 0].map((i) => (
        <rect key={i} x={24 + i * 10} y={26 - i * 6} width={104} height={108} rx={4} fill={CARD} stroke={LINE} />
      ))}
      <rect x={34} y={36} width={64} height={6} rx={2} fill={ACC} opacity={0.75} />
      {[0, 1, 2, 3, 4, 5, 6].map((i) => (
        <rect key={i} x={34} y={52 + i * 10} width={i % 3 === 2 ? 58 : 82} height={4} rx={2} fill={LINE} />
      ))}
      <g className="drift" style={{ "--cv-x": "36px", "--cv-y": "34px", animationDuration: "4.5s" } as CSSProperties}>
        <circle cx={64} cy={58} r={17} fill={SOFT} fillOpacity={0.55} stroke={INK} strokeWidth={2.5} />
        <line x1={76} y1={70} x2={88} y2={82} stroke={INK} strokeWidth={4} strokeLinecap="round" />
      </g>
      <path className="flow" d="M148 76 C 160 76, 162 76, 174 76" fill="none" stroke={ACC} strokeWidth={1.5} />
      <rect x={176} y={26} width={126} height={100} rx={6} fill={CARD} stroke={ACC} />
      <T x={188} y={44} fill={ACC} weight={700}>✦ summary</T>
      {[96, 84, 102, 70, 90].map((w, i) => (
        <rect key={i} className="fade" x={188} y={56 + i * 12} width={w} height={4} rx={2} fill={INK} style={d(i * 350)} />
      ))}
    </>
  );
}

const COVERS: Record<string, () => ReactNode> = {
  hexlens: HexLens,
  leakedapis: ApiInstructor,
  locus: Locus,
  plumber: Plumber,
  kinder: Kinder,
  eureka: Eureka,
  domaindigger: DomainDigger,
  scholardex: ScholarDex,
};

export function ProjectCover({ slug, title }: { slug: string; title: string }) {
  const Art = COVERS[slug];
  const patternId = `cv-dots-${slug}`;
  return (
    <svg
      viewBox="0 0 320 150"
      role="img"
      aria-label={`${title} illustration`}
      className="cv block h-auto w-full transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      style={{ "--cv-accent": ACCENTS[slug] ?? "#71717a" } as CSSProperties}
    >
      <defs>
        <pattern id={patternId} width={12} height={12} patternUnits="userSpaceOnUse">
          <circle cx={1} cy={1} r={0.8} fill={LINE} />
        </pattern>
      </defs>
      <rect width={320} height={150} fill={SOFT} />
      <rect width={320} height={150} fill={`url(#${patternId})`} />
      {Art && <Art />}
    </svg>
  );
}
