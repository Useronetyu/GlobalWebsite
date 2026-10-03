import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Search, Loader2, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import ship from "@/assets/ship.jpg";

const ROUTES = [["Shanghai, CN", "Los Angeles, US"], ["Rotterdam, NL", "New York, US"], ["Dubai, AE", "Singapore, SG"], ["Singapore, SG", "Hamburg, DE"]];
const STEPS = ["Order Received", "Customs Clearance", "Arrived at Port", "Shipment in Transit", "Delivered"];

function hash(s: string) { let h = 7; for (const c of s) h = (h * 31 + c.charCodeAt(0)) >>> 0; return h; }
function fmt(d: Date) { return d.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" }); }

function buildShipment(id: string) {
  const h = hash(id);
  const [o, dest] = ROUTES[h % ROUTES.length]!;
  const progress = 1 + (h % 4); // steps done
  const base = new Date(); base.setDate(base.getDate() - progress * 2);
  const steps = STEPS.map((t, i) => {
    const d = new Date(base); d.setDate(base.getDate() + i * 2);
    return { t, d: i < progress ? fmt(d) : `Estimated: ${fmt(d)}`, done: i < progress, current: i === progress - 1 };
  }).reverse();
  return {
    container: `MSKU${(h % 9000000 + 1000000)}`, type: h % 2 ? "40ft High Cube" : "20ft Standard",
    status: progress >= 5 ? "Delivered" : "In Transit", origin: o, destination: dest, steps,
  };
}

export function ShipmentTracker() {
  const [id, setId] = useState("GL8247391587");
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(() => buildShipment("GL8247391587"));
  const search = () => {
    const v = id.trim();
    if (!v) { toast.error("Please enter a tracking ID"); return; }
    setLoading(true);
    setTimeout(() => { setData(buildShipment(v.toUpperCase())); setLoading(false); toast.success("Tracking info updated", { description: `Shipment ${v.toUpperCase()}` }); }, 1200);
  };
  return (
    <div className="glass grid gap-4 rounded-2xl p-5 sm:grid-cols-2">
      <div>
        <label htmlFor="tid" className="text-xs text-muted-foreground">Tracking ID</label>
        <form onSubmit={(e) => { e.preventDefault(); search(); }} className="mt-1 flex items-center rounded-lg border border-input bg-background/60 px-3 py-2 transition-colors focus-within:border-primary">
          <input id="tid" value={id} onChange={(e) => setId(e.target.value)} placeholder="Enter tracking ID" className="w-full min-w-0 bg-transparent text-sm outline-none" />
          <button type="submit" aria-label="Search" disabled={loading} className="text-muted-foreground transition-colors hover:text-primary">
            {loading ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Search className="h-4 w-4" />}
          </button>
        </form>
        <div className={`mt-5 transition-opacity ${loading ? "opacity-40" : ""}`}>
          <AnimatePresence mode="wait">
            <motion.ol key={data.container} className="space-y-5" initial="h" animate="s" exit={{ opacity: 0 }} variants={{ s: { transition: { staggerChildren: 0.1 } } }}>
              {data.steps.map((s, i) => (
                <motion.li key={s.t} variants={{ h: { opacity: 0, x: -12 }, s: { opacity: 1, x: 0 } }} className="relative flex gap-3">
                  {i < data.steps.length - 1 && <span className="absolute left-[7px] top-4 h-[calc(100%+8px)] w-px bg-accent/50" />}
                  <span className={`relative mt-0.5 h-4 w-4 shrink-0 rounded-full border-2 ${s.done ? "border-accent bg-accent" : "border-muted-foreground"} ${s.current ? "glow-dot animate-pulse" : ""}`} />
                  <div className="text-xs"><div className="text-sm font-semibold">{s.t}</div><div className="text-muted-foreground">{s.d}</div></div>
                </motion.li>
              ))}
            </motion.ol>
          </AnimatePresence>
        </div>
      </div>
      <div className="overflow-hidden rounded-xl border border-border bg-background/50">
        <img src={ship} alt="Container ship" width={1600} height={640} loading="lazy" className="h-28 w-full object-cover" />
        <div className="p-4">
          <div className="text-sm font-semibold">Container Details</div>
          <dl className="mt-3 grid grid-cols-2 gap-3 text-xs">
            {([["Container No.", data.container], ["Type", data.type], ["Status", `● ${data.status}`], ["Origin", data.origin], ["Destination", data.destination]] as [string, string][]).map(([k, v]) => (
              <div key={k}><dt className="text-muted-foreground">{k}</dt><dd className={v.startsWith("●") ? "text-success" : ""}>{v}</dd></div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}

type Range = "24h" | "7d" | "30d";
const RANGES: Record<Range, { label: string; n: number; unit: string; m: [string, string, string][] }> = {
  "24h": { label: "Last 24 Hours", n: 24, unit: "h", m: [["Total Shipments", "186", "3.1%"], ["On-Time Delivery", "99.2%", "0.6%"], ["Total Value", "$31M", "4%"]] },
  "7d": { label: "Last 7 Days", n: 7, unit: "d", m: [["Total Shipments", "1,204", "7.8%"], ["On-Time Delivery", "98.4%", "1.2%"], ["Total Value", "$214M", "9%"]] },
  "30d": { label: "Last 30 Days", n: 30, unit: "d", m: [["Total Shipments", "4,892", "12%"], ["On-Time Delivery", "98.7%", "2.4%"], ["Total Value", "$842M", "16%"]] },
};
function series(r: Range) {
  const { n, unit } = RANGES[r]; const seed = r.length * 13 + n;
  return Array.from({ length: n }, (_, i) => ({ x: `${unit === "h" ? i + ":00" : "D" + (i + 1)}`, v: Math.round(40 + i * (60 / n) + Math.sin(i * 0.9 + seed) * 18 + Math.cos(i * 0.4 + seed) * 10) }));
}

export function TradeChart() {
  const [r, setR] = useState<Range>("30d");
  const data = series(r);
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center justify-between gap-2">
        <div className="text-xs tracking-[0.2em]">LIVE GLOBAL TRADE</div>
        <select value={r} onChange={(e) => setR(e.target.value as Range)} className="rounded-md border border-border bg-background px-2 py-1 text-xs text-muted-foreground outline-none focus:border-primary">
          {(Object.keys(RANGES) as Range[]).map((k) => <option key={k} value={k}>{RANGES[k].label}</option>)}
        </select>
      </div>
      <div className="mt-4 h-40">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
            <defs><linearGradient id="tg" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stopColor="var(--accent)" stopOpacity={0.5} /><stop offset="1" stopColor="var(--accent)" stopOpacity={0} /></linearGradient></defs>
            <XAxis dataKey="x" hide />
            <Tooltip contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 8, fontSize: 12 }} labelStyle={{ color: "var(--muted-foreground)" }} />
            <Area type="monotone" dataKey="v" name="Shipments" stroke="var(--accent)" strokeWidth={2} fill="url(#tg)" animationDuration={800} style={{ filter: "drop-shadow(0 0 6px var(--accent))" }} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 grid grid-cols-3 gap-2">
        {RANGES[r].m.map(([l, v, c]) => (
          <div key={l}><div className="text-[11px] text-muted-foreground">{l}</div>
            <motion.div key={v} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="text-lg font-bold">{v}</motion.div>
            <div className="flex items-center gap-1 text-xs text-success"><TrendingUp className="h-3 w-3" />{c}</div></div>
        ))}
      </div>
    </div>
  );
}
