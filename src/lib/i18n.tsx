import { createContext, useContext, useState, type ReactNode } from "react";

export type Lang = "EN" | "ID" | "ES";
export const LANGS: Lang[] = ["EN", "ID", "ES"];

const D = {
  EN: {
    nav: ["Home", "About", "Services", "Destinations", "Track Shipment", "Resources", "Contact"],
    start: "Start Shipping", heroTag: "INTERNATIONAL TRADE & LOGISTICS SOLUTIONS", h1a: "CONNECTING BUSINESS.", h1b: "MOVING THE WORLD.",
    heroP: "We provide end-to-end import and export solutions, connecting businesses across continents with reliable logistics, global networks and innovative supply chain technology.",
    watch: "Watch Our Story", reach: "GLOBAL REACH", local: "LOCAL EXPERTISE",
    svcTag: "OUR SERVICES", svcH1: "End-to-End Logistics", svcH2: "for Global Trade",
    svcP: "From ocean freight to air cargo, rail, and land transport, we offer flexible, secure and cost-effective solutions to keep your business moving.",
    explore: "Explore All Services", network: "OUR GLOBAL NETWORK",
    trkTag: "TRACK YOUR SHIPMENT", trkH1: "Real-Time Tracking.", trkH2: "Total Transparency.",
    trkP: "Monitor your cargo at every stage with our advanced tracking system. Get live updates, ETA, and complete shipment visibility — anytime, anywhere.",
    track: "Track Shipment", dstTag: "OUR DESTINATIONS", dstH: "Trade Without Borders",
    dstP: "We ship to 180+ countries, connecting your business to new markets and opportunities worldwide.", viewAll: "View All Countries", shipments: "shipments",
    ftTag: "SMARTER SUPPLY CHAINS", ftH: "Your Global Trade Partner", ftP: "More than logistics — we build lasting partnerships.",
    ai: { title: "AI Tracking Analyzer", sub: "Paste raw carrier logs and get a plain-language explanation.", ph: "Paste your raw tracking updates or carrier logs here...", btn: "Analyze with AI", busy: "Analyzing...", status: "Status Explanation", next: "Recommended Next Steps", empty: "Please paste some tracking text first" },
    wz: { title: "Shipping Booking Wizard", steps: ["Route & Cargo", "Details", "Quotation", "Success"], origin: "Origin", dest: "Destination", mode: "Cargo Type", ocean: "Ocean", air: "Air", weight: "Weight (kg)", dims: "Dimensions (L×W×H cm)", date: "Shipping Date", next: "Next", back: "Back", confirm: "Confirm & Book", price: "Estimated Price", eta: "Estimated Transit", days: "days", done: "Booking Confirmed!", doneP: "Your shipment has been booked. Save your tracking ID:", home: "Back to Home", req: "This field is required", summary: "Summary" },
  },
  ID: {
    nav: ["Beranda", "Tentang", "Layanan", "Destinasi", "Lacak Kiriman", "Sumber Daya", "Kontak"],
    start: "Mulai Kirim", heroTag: "SOLUSI PERDAGANGAN & LOGISTIK INTERNASIONAL", h1a: "MENGHUBUNGKAN BISNIS.", h1b: "MENGGERAKKAN DUNIA.",
    heroP: "Kami menyediakan solusi ekspor dan impor menyeluruh, menghubungkan bisnis lintas benua dengan logistik andal, jaringan global, dan teknologi rantai pasok inovatif.",
    watch: "Tonton Kisah Kami", reach: "JANGKAUAN GLOBAL", local: "KEAHLIAN LOKAL",
    svcTag: "LAYANAN KAMI", svcH1: "Logistik Menyeluruh", svcH2: "untuk Perdagangan Global",
    svcP: "Dari kargo laut hingga udara, kereta, dan darat, kami menawarkan solusi fleksibel, aman, dan hemat biaya agar bisnis Anda terus bergerak.",
    explore: "Lihat Semua Layanan", network: "JARINGAN GLOBAL KAMI",
    trkTag: "LACAK KIRIMAN ANDA", trkH1: "Pelacakan Real-Time.", trkH2: "Transparansi Penuh.",
    trkP: "Pantau kargo Anda di setiap tahap dengan sistem pelacakan canggih kami. Dapatkan pembaruan langsung, ETA, dan visibilitas penuh — kapan saja, di mana saja.",
    track: "Lacak Kiriman", dstTag: "DESTINASI KAMI", dstH: "Perdagangan Tanpa Batas",
    dstP: "Kami mengirim ke 180+ negara, menghubungkan bisnis Anda dengan pasar dan peluang baru di seluruh dunia.", viewAll: "Lihat Semua Negara", shipments: "pengiriman",
    ftTag: "RANTAI PASOK LEBIH CERDAS", ftH: "Mitra Perdagangan Global Anda", ftP: "Lebih dari logistik — kami membangun kemitraan jangka panjang.",
    ai: { title: "Penganalisis Pelacakan AI", sub: "Tempel log kurir mentah dan dapatkan penjelasan yang mudah dipahami.", ph: "Tempel pembaruan pelacakan atau log kurir di sini...", btn: "Analisis dengan AI", busy: "Menganalisis...", status: "Penjelasan Status", next: "Langkah Selanjutnya", empty: "Tempel teks pelacakan terlebih dahulu" },
    wz: { title: "Wizard Pemesanan Pengiriman", steps: ["Rute & Kargo", "Detail", "Penawaran", "Berhasil"], origin: "Asal", dest: "Tujuan", mode: "Jenis Kargo", ocean: "Laut", air: "Udara", weight: "Berat (kg)", dims: "Dimensi (P×L×T cm)", date: "Tanggal Pengiriman", next: "Lanjut", back: "Kembali", confirm: "Konfirmasi & Pesan", price: "Estimasi Harga", eta: "Estimasi Transit", days: "hari", done: "Pemesanan Berhasil!", doneP: "Pengiriman Anda telah dipesan. Simpan nomor resi Anda:", home: "Kembali ke Beranda", req: "Wajib diisi", summary: "Ringkasan" },
  },
  ES: {
    nav: ["Inicio", "Nosotros", "Servicios", "Destinos", "Rastrear Envío", "Recursos", "Contacto"],
    start: "Empezar a Enviar", heroTag: "SOLUCIONES DE COMERCIO Y LOGÍSTICA INTERNACIONAL", h1a: "CONECTANDO NEGOCIOS.", h1b: "MOVIENDO EL MUNDO.",
    heroP: "Ofrecemos soluciones integrales de importación y exportación, conectando empresas entre continentes con logística confiable, redes globales y tecnología innovadora.",
    watch: "Ver Nuestra Historia", reach: "ALCANCE GLOBAL", local: "EXPERIENCIA LOCAL",
    svcTag: "NUESTROS SERVICIOS", svcH1: "Logística Integral", svcH2: "para el Comercio Global",
    svcP: "Del flete marítimo a la carga aérea, ferroviaria y terrestre, ofrecemos soluciones flexibles, seguras y rentables para que su negocio siga en movimiento.",
    explore: "Ver Todos los Servicios", network: "NUESTRA RED GLOBAL",
    trkTag: "RASTREE SU ENVÍO", trkH1: "Rastreo en Tiempo Real.", trkH2: "Transparencia Total.",
    trkP: "Supervise su carga en cada etapa con nuestro sistema avanzado. Actualizaciones en vivo, ETA y visibilidad completa — en cualquier momento y lugar.",
    track: "Rastrear Envío", dstTag: "NUESTROS DESTINOS", dstH: "Comercio Sin Fronteras",
    dstP: "Enviamos a más de 180 países, conectando su negocio con nuevos mercados y oportunidades.", viewAll: "Ver Todos los Países", shipments: "envíos",
    ftTag: "CADENAS DE SUMINISTRO INTELIGENTES", ftH: "Su Socio de Comercio Global", ftP: "Más que logística — construimos alianzas duraderas.",
    ai: { title: "Analizador de Rastreo IA", sub: "Pegue registros del transportista y obtenga una explicación clara.", ph: "Pegue aquí sus actualizaciones de rastreo o registros del transportista...", btn: "Analizar con IA", busy: "Analizando...", status: "Explicación del Estado", next: "Próximos Pasos Recomendados", empty: "Pegue primero algún texto de rastreo" },
    wz: { title: "Asistente de Reserva de Envío", steps: ["Ruta y Carga", "Detalles", "Cotización", "Éxito"], origin: "Origen", dest: "Destino", mode: "Tipo de Carga", ocean: "Marítimo", air: "Aéreo", weight: "Peso (kg)", dims: "Dimensiones (L×A×H cm)", date: "Fecha de Envío", next: "Siguiente", back: "Atrás", confirm: "Confirmar y Reservar", price: "Precio Estimado", eta: "Tránsito Estimado", days: "días", done: "¡Reserva Confirmada!", doneP: "Su envío ha sido reservado. Guarde su número de rastreo:", home: "Volver al Inicio", req: "Campo obligatorio", summary: "Resumen" },
  },
};

export type Dict = (typeof D)["EN"];
const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: Dict }>({ lang: "EN", setLang: () => {}, t: D.EN });

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("EN");
  return <Ctx.Provider value={{ lang, setLang, t: D[lang] as Dict }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
