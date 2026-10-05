import { createContext, useContext, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { X, Ship, Plane, Check, Copy } from "lucide-react";
import { toast } from "sonner";
import { useI18n } from "@/lib/i18n";

const Ctx = createContext<() => void>(() => {});
export const useOpenBooking = () => useContext(Ctx);

type F = { origin: string; dest: string; mode: "ocean" | "air"; weight: string; dims: string; date: string };
const EMPTY: F = { origin: "", dest: "", mode: "ocean", weight: "", dims: "", date: "" };

export function BookingProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  return <Ctx.Provider value={() => setOpen(true)}>{children}<AnimatePresence>{open && <Wizard onClose={() => setOpen(false)} />}</AnimatePresence></Ctx.Provider>;
}

function Wizard({ onClose }: { onClose: () => void }) {
  const { t } = useI18n(); const w = t.wz;
  const [step, setStep] = useState(0);
  const [f, setF] = useState<F>(EMPTY);
  const [err, setErr] = useState<Partial<Record<keyof F, boolean>>>({});
  const [tid, setTid] = useState("");
  const set = (k: keyof F, v: string) => { setF({ ...f, [k]: v }); setErr({ ...err, [k]: false }); };

  const kg = Math.max(1, Number(f.weight) || 1);
  const price = Math.round((f.mode === "air" ? 850 + kg * 4.2 : 1400 + kg * 0.9) / 10) * 10;
  const eta = f.mode === "air" ? "3–5" : "18–25";

  const next = () => {
    const req: (keyof F)[] = step === 0 ? ["origin", "dest"] : ["weight", "dims", "date"];
    const e = Object.fromEntries(req.filter((k) => !f[k].trim()).map((k) => [k, true]));
    if (Object.keys(e).length) { setErr(e); return; }
    setStep(step + 1);
  };
  const book = () => { setTid("GL" + Math.floor(1e9 + Math.random() * 9e9)); setStep(3); };

  const input = (k: keyof F, label: string, type = "text", ph = "") => (
    <label className="block text-xs text-muted-foreground">{label}
      <input type={type} value={f[k]} placeholder={ph} min={type === "number" ? 1 : undefined} onChange={(e) => set(k, e.target.value)}
        className={`mt-1 w-full rounded-lg border bg-background/60 px-3 py-2.5 text-sm text-foreground outline-none transition-colors focus:border-primary ${err[k] ? "border-destructive" : "border-input"}`} />
      {err[k] && <span className="mt-1 block text-destructive">{w.req}</span>}
    </label>
  );

  return (
    <motion.div className="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 p-4 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose}>
      <motion.div role="dialog" aria-modal className="glass relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-2xl p-6 md:p-8" initial={{ scale: 0.94, y: 30, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.94, y: 30, opacity: 0 }} transition={{ type: "spring", damping: 26, stiffness: 300 }} onClick={(e) => e.stopPropagation()}>
        <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"><X className="h-5 w-5" /></button>
        <h2 className="text-xl font-bold md:text-2xl">{w.title}</h2>
        <ol className="mt-5 flex gap-2">
          {w.steps.map((s, i) => (
            <li key={s} className="flex-1">
              <div className="h-1 overflow-hidden rounded-full bg-muted"><motion.div className="h-full bg-primary" animate={{ width: i <= step ? "100%" : "0%" }} transition={{ duration: 0.4 }} /></div>
              <div className={`mt-2 hidden text-xs sm:block ${i <= step ? "text-foreground" : "text-muted-foreground"}`}>{i + 1}. {s}</div>
            </li>
          ))}
        </ol>
        <div className="mt-6 min-h-[260px]">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.25 }}>
              {step === 0 && (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">{input("origin", w.origin, "text", "Shanghai, CN")}{input("dest", w.dest, "text", "Los Angeles, US")}</div>
                  <div className="text-xs text-muted-foreground">{w.mode}</div>
                  <div className="grid grid-cols-2 gap-3">
                    {([["ocean", Ship, w.ocean], ["air", Plane, w.air]] as const).map(([k, I, l]) => (
                      <button key={k} type="button" onClick={() => set("mode", k)} className={`flex items-center gap-3 rounded-xl border p-4 text-sm font-semibold transition-all ${f.mode === k ? "border-primary bg-primary/10 text-primary" : "border-border hover:border-primary/50"}`}><I className="h-5 w-5" />{l}</button>
                    ))}
                  </div>
                </div>
              )}
              {step === 1 && <div className="grid gap-4 sm:grid-cols-2">{input("weight", w.weight, "number", "1200")}{input("dims", w.dims, "text", "120×80×100")}<div className="sm:col-span-2">{input("date", w.date, "date")}</div></div>}
              {step === 2 && (
                <div className="space-y-4">
                  <div className="rounded-xl border border-border bg-background/40 p-4 text-sm">
                    <div className="text-xs text-muted-foreground">{w.summary}</div>
                    <div className="mt-2 font-semibold">{f.origin} → {f.dest}</div>
                    <div className="mt-1 text-muted-foreground">{f.mode === "air" ? w.air : w.ocean} · {f.weight} kg · {f.dims} · {f.date}</div>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-xl border border-primary/40 bg-primary/10 p-5"><div className="text-xs text-muted-foreground">{w.price}</div><div className="mt-1 text-3xl font-black text-primary">${price.toLocaleString("en-US")}</div></div>
                    <div className="rounded-xl border border-border bg-background/40 p-5"><div className="text-xs text-muted-foreground">{w.eta}</div><div className="mt-1 text-3xl font-black">{eta} <span className="text-base font-semibold text-muted-foreground">{w.days}</span></div></div>
                  </div>
                </div>
              )}
              {step === 3 && (
                <div className="flex flex-col items-center py-4 text-center">
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 260, damping: 14 }} className="grid h-20 w-20 place-items-center rounded-full bg-success/20 shadow-[0_0_40px] shadow-success/40">
                    <motion.div initial={{ scale: 0, rotate: -45 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.25 }}><Check className="h-10 w-10 text-success" strokeWidth={3} /></motion.div>
                  </motion.div>
                  <h3 className="mt-5 text-2xl font-bold">{w.done}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{w.doneP}</p>
                  <button onClick={() => { navigator.clipboard?.writeText(tid); toast.success(tid); }} className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-background/60 px-4 py-2 font-mono text-lg tracking-wider text-primary hover:border-primary">{tid}<Copy className="h-4 w-4" /></button>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
        <div className="mt-6 flex justify-between gap-3">
          {step > 0 && step < 3 ? <button onClick={() => setStep(step - 1)} className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:border-primary">{w.back}</button> : <span />}
          <button onClick={step < 2 ? next : step === 2 ? book : onClose} className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_24px] hover:shadow-primary/50">
            {step < 2 ? w.next : step === 2 ? w.confirm : w.home}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
