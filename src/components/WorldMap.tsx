import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { geoEquirectangular, geoContains } from "d3-geo";
import { feature } from "topojson-client";
import land from "world-atlas/land-110m.json";

const W = 800, H = 420;
export const CITIES = [
  { n: "New York", c: "USA", lon: -74, lat: 40.7 },
  { n: "Rotterdam", c: "Netherlands", lon: 4.5, lat: 51.9 },
  { n: "Dubai", c: "UAE", lon: 55.3, lat: 25.2 },
  { n: "Shanghai", c: "China", lon: 121.5, lat: 31.2 },
  { n: "Singapore", c: "Singapore", lon: 103.8, lat: 1.35 },
];
const LINKS: [number, number][] = [[0, 1], [0, 2], [1, 2], [1, 3], [2, 3], [2, 4], [3, 4], [0, 4]];

export function WorldMap() {
  const [hover, setHover] = useState<number | null>(null);
  const { dots, pts } = useMemo(() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const geo = feature(land as any, (land as any).objects.land) as any;
    const proj = geoEquirectangular().scale(W / (2 * Math.PI)).translate([W / 2, H / 2 + 30]);
    const dots: [number, number][] = [];
    for (let lat = 80; lat > -58; lat -= 2.6) for (let lon = -180; lon < 180; lon += 2.6) {
      if (geoContains(geo, [lon, lat])) dots.push(proj([lon, lat]) as [number, number]);
    }
    const pts = CITIES.map((c) => proj([c.lon, c.lat]) as [number, number]);
    return { dots, pts };
  }, []);

  return (
    <div className="relative h-full min-h-[300px] w-full cursor-grab overflow-hidden rounded-2xl border border-border bg-card/40 active:cursor-grabbing">
      <motion.svg drag dragConstraints={{ left: -120, right: 120, top: -60, bottom: 60 }} dragElastic={0.15}
        whileHover={{ scale: 1.03 }} transition={{ type: "spring", stiffness: 120, damping: 20 }}
        viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="xMidYMid meet" className="absolute inset-0 h-full w-full">
        {dots.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={1.1} fill="var(--muted-foreground)" opacity={0.45} />)}
        {LINKS.map(([a, b], i) => {
          const p = pts[a]!, q = pts[b]!;
          const mx = (p[0] + q[0]) / 2, my = Math.min(p[1], q[1]) - Math.abs(p[0] - q[0]) * 0.25;
          const d = `M${p[0]} ${p[1]} Q${mx} ${my} ${q[0]} ${q[1]}`;
          const active = hover === null || hover === a || hover === b;
          const col = i % 2 ? "var(--primary)" : "var(--accent)";
          return (
            <g key={i} opacity={active ? 1 : 0.15} style={{ transition: "opacity .3s" }}>
              <path d={d} fill="none" stroke={col} strokeWidth={1} strokeDasharray="4 4" opacity={0.7}>
                <animate attributeName="stroke-dashoffset" from="16" to="0" dur="1.2s" repeatCount="indefinite" />
              </path>
              <circle r={3} fill={col} style={{ filter: `drop-shadow(0 0 4px ${col})` }}>
                <animateMotion dur={`${4 + (i % 3)}s`} begin={`${i * 0.5}s`} repeatCount="indefinite" path={d} rotate="auto" />
              </circle>
              <path d="M-4 -3 L3 0 L-4 3 Z" fill={col}>
                <animateMotion dur={`${4 + (i % 3)}s`} begin={`${i * 0.5 + 1.5}s`} repeatCount="indefinite" path={d} rotate="auto" />
              </path>
            </g>
          );
        })}
        {pts.map(([x, y], i) => (
          <g key={i} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(null)} className="cursor-pointer">
            <circle cx={x} cy={y} r={hover === i ? 14 : 9} fill="var(--primary)" opacity={0.2} style={{ transition: "r .3s" }}>
              <animate attributeName="opacity" values="0.35;0.05;0.35" dur="2s" repeatCount="indefinite" />
            </circle>
            <circle cx={x} cy={y} r={4} fill="var(--primary)" />
            <text x={x + 8} y={y - 6} fontSize={11} fontWeight={700} fill="var(--foreground)">{CITIES[i]!.n}</text>
            <text x={x + 8} y={y + 6} fontSize={9} fill="var(--muted-foreground)">{CITIES[i]!.c}</text>
          </g>
        ))}
      </motion.svg>
      <div className="pointer-events-none absolute bottom-4 right-4 hidden border-l-2 border-primary pl-3 text-xs italic tracking-[0.2em] text-foreground/80 md:block">ANY PORT.<br />ANY COUNTRY.<br />ANY TIME.</div>
      <div className="pointer-events-none absolute left-4 top-4 text-[10px] tracking-widest text-muted-foreground">DRAG TO EXPLORE · HOVER A PORT</div>
    </div>
  );
}
