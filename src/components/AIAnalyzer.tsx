import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bot, Loader2, Info, ListChecks } from "lucide-react";
import { toast } from "sonner";
import { useI18n, type Lang } from "@/lib/i18n";

type R = { s: string; n: string[] };
const PORTS = ["Shanghai", "Singapore", "Rotterdam", "Hamburg", "Dubai", "Los Angeles", "New York", "Jakarta", "Tanjung Priok", "Busan"];

function analyze(text: string, lang: Lang): R {
  const t = text.toLowerCase();
  const port = PORTS.find((p) => t.includes(p.toLowerCase())) ?? ({ EN: "the transit hub", ID: "hub transit", ES: "el centro de tránsito" } as const)[lang];
  const kind = /customs|hold|inspect|pabean|tertahan|aduana/.test(t) ? "customs" : /delay|late|weather|congest|terlambat|retras/.test(t) ? "delay" : /deliver|pod|signed|terkirim|entregad/.test(t) ? "done" : "transit";
  const M: Record<Lang, Record<string, R>> = {
    EN: {
      customs: { s: `Your cargo is currently held at ${port} customs for a routine inspection. This is common and usually clears within 24–48 hours.`, n: ["Prepare the commercial invoice and Form A-12 in case customs requests them.", "Confirm the HS codes on your packing list match the declaration.", "Expect an updated release estimate by tomorrow."] },
      delay: { s: `Your shipment is delayed near ${port}, most likely due to port congestion or weather. The cargo is safe, but the ETA will shift.`, n: ["Notify your consignee of a possible 2–3 day delay.", "No documents are needed right now.", "We will push a new ETA as soon as the vessel berths."] },
      done: { s: `Good news — your shipment has been delivered at ${port} and proof of delivery is recorded.`, n: ["Verify the goods and seal condition with the consignee.", "Download the proof of delivery for your records.", "No further action required."] },
      transit: { s: `Your cargo is moving normally and was last scanned at ${port}. Everything is on schedule.`, n: ["No action is required — just wait for the next update.", "Keep your tracking ID handy for arrival notifications."] },
    },
    ID: {
      customs: { s: `Kargo Anda saat ini sedang tertahan di pabean ${port} karena pemeriksaan rutin. Ini hal umum dan biasanya selesai dalam 24–48 jam.`, n: ["Siapkan invoice komersial dan dokumen Form A-12 jika diminta pabean.", "Pastikan kode HS di packing list sesuai dengan deklarasi.", "Tunggu estimasi rilis terbaru besok."] },
      delay: { s: `Pengiriman Anda tertunda di sekitar ${port}, kemungkinan karena kepadatan pelabuhan atau cuaca. Kargo aman, tetapi ETA akan bergeser.`, n: ["Beri tahu penerima tentang kemungkinan keterlambatan 2–3 hari.", "Tidak ada dokumen yang diperlukan saat ini.", "ETA baru akan dikirim setelah kapal sandar."] },
      done: { s: `Kabar baik — kiriman Anda telah diterima di ${port} dan bukti pengiriman telah tercatat.`, n: ["Periksa kondisi barang dan segel bersama penerima.", "Unduh bukti pengiriman untuk arsip Anda.", "Tidak ada tindakan lanjutan yang diperlukan."] },
      transit: { s: `Kargo Anda bergerak normal dan terakhir dipindai di ${port}. Semua sesuai jadwal.`, n: ["Tidak ada tindakan yang diperlukan, tunggu pembaruan berikutnya.", "Simpan nomor resi Anda untuk notifikasi kedatangan."] },
    },
    ES: {
      customs: { s: `Su carga está retenida en la aduana de ${port} por una inspección de rutina. Es habitual y suele liberarse en 24–48 horas.`, n: ["Prepare la factura comercial y el Formulario A-12 por si la aduana lo solicita.", "Confirme que los códigos HS coinciden con la declaración.", "Espere una nueva estimación de liberación mañana."] },
      delay: { s: `Su envío está retrasado cerca de ${port}, probablemente por congestión portuaria o clima. La carga está segura, pero el ETA cambiará.`, n: ["Avise al destinatario de un posible retraso de 2–3 días.", "No se requieren documentos por ahora.", "Enviaremos un nuevo ETA cuando el buque atraque."] },
      done: { s: `Buenas noticias: su envío fue entregado en ${port} y la prueba de entrega está registrada.`, n: ["Verifique la mercancía y el precinto con el destinatario.", "Descargue la prueba de entrega para sus registros.", "No se requiere ninguna acción."] },
      transit: { s: `Su carga avanza con normalidad y fue escaneada por última vez en ${port}. Todo va según lo previsto.`, n: ["No se requiere acción, espere la próxima actualización.", "Tenga a mano su número de rastreo para avisos de llegada."] },
    },
  };
  return M[lang][kind]!;
}

export function AIAnalyzer() {
  const { t, lang } = useI18n();
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [res, setRes] = useState<R | null>(null);
  const run = () => {
    if (!text.trim()) { toast.error(t.ai.empty); return; }
    setLoading(true); setRes(null);
    setTimeout(() => { setRes(analyze(text, lang)); setLoading(false); }, 1600);
  };
  return (
    <div className="glass rounded-2xl p-5">
      <div className="flex items-center gap-3">
        <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary/15 text-primary"><Bot className="h-5 w-5" /></span>
        <div><div className="font-semibold">{t.ai.title}</div><div className="text-xs text-muted-foreground">{t.ai.sub}</div></div>
      </div>
      <div className="mt-4 grid gap-4 lg:grid-cols-2">
        <div className="flex flex-col gap-3">
          <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder={t.ai.ph} rows={6}
            className="w-full resize-none rounded-lg border border-input bg-background/60 p-3 text-sm outline-none transition-colors focus:border-primary" />
          <button onClick={run} disabled={loading} className="inline-flex items-center justify-center gap-2 self-start rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 disabled:opacity-60">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bot className="h-4 w-4" />} {loading ? t.ai.busy : t.ai.btn}
          </button>
        </div>
        <div className="min-h-[180px] rounded-lg border border-border bg-background/40 p-4">
          <AnimatePresence mode="wait">
            {loading && (
              <motion.div key="sk" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-3">
                {[90, 75, 60, 40, 80, 55].map((w, i) => <div key={i} className="h-3 animate-pulse rounded bg-muted" style={{ width: `${w}%` }} />)}
              </motion.div>
            )}
            {res && !loading && (
              <motion.div key="r" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} className="space-y-4 text-sm">
                <div><div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-accent"><Info className="h-4 w-4" />{t.ai.status.toUpperCase()}</div><p className="mt-1.5 text-foreground/90">{res.s}</p></div>
                <div><div className="flex items-center gap-2 text-xs font-semibold tracking-wider text-primary"><ListChecks className="h-4 w-4" />{t.ai.next.toUpperCase()}</div>
                  <ul className="mt-1.5 space-y-1">{res.n.map((x, i) => <motion.li key={x} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + i * 0.1 }} className="flex gap-2 text-muted-foreground"><span className="text-primary">→</span>{x}</motion.li>)}</ul></div>
              </motion.div>
            )}
            {!res && !loading && <motion.div key="e" className="grid h-full min-h-[150px] place-items-center text-center text-xs text-muted-foreground"><Bot className="mb-2 h-8 w-8 opacity-40" /></motion.div>}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
