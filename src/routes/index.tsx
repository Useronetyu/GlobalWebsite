import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import {
  ArrowRight, Play, Globe, Ship, Container, Truck, Plane, TrainFront, FileCheck, Warehouse,
  Search, Menu, X, ChevronDown, ShieldCheck, Headphones, Globe2, Leaf, Linkedin, Twitter, Youtube, Instagram, TrendingUp,
} from "lucide-react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Toaster } from "@/components/ui/sonner";
import { I18nProvider, useI18n, LANGS } from "@/lib/i18n";
import { BookingProvider, useOpenBooking } from "@/components/BookingWizard";
import { AIAnalyzer } from "@/components/AIAnalyzer";
import { Reveal } from "@/components/Reveal";
import { WorldMap } from "@/components/WorldMap";
import { ShipmentTracker, TradeChart } from "@/components/TrackingPanel";
import hero from "@/assets/hero.jpg";
import map from "@/assets/map.jpg";
import port from "@/assets/port.jpg";
import ship from "@/assets/ship.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "GlobalLink — Connecting Business. Moving the World." },
      { name: "description", content: "GlobalLink delivers end-to-end import, export and logistics solutions across 180+ countries." },
      { property: "og:title", content: "GlobalLink — Connecting Business. Moving the World." },
      { property: "og:description", content: "End-to-end import, export and logistics across 180+ countries." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const FU = { h: { opacity: 0, y: 30 }, s: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.22, 1, 0.36, 1] as const } } };

const NAV_IDS = ["home", "about", "services", "destinations", "track-shipment", "resources", "contact"];

function Logo() {
  return (
    <a href="#" className="flex items-center gap-2 shrink-0">
      <Globe className="h-8 w-8 text-primary" />
      <div className="leading-tight">
        <div className="text-lg font-bold">GlobalLink</div>
        <div className="text-[9px] tracking-[0.2em] text-muted-foreground">IMPORT / EXPORT / LOGISTICS</div>
      </div>
    </a>
  );
}

function PrimaryBtn({ children }: { children?: React.ReactNode }) {
  const open = useOpenBooking(); const { t } = useI18n();
  children = children ?? t.start;
  return (
    <button type="button" onClick={open} className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all hover:brightness-110 hover:shadow-[0_0_24px] hover:shadow-primary/50">
      {children} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </button>
  );
}
function OutlineBtn({ children }: { children: React.ReactNode }) {
  return (
    <a href="#" className="group inline-flex items-center gap-2 rounded-full border border-foreground/30 px-6 py-3 text-sm font-semibold transition-all hover:border-primary hover:text-primary">
      {children} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
    </a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const [lo, setLo] = useState(false);
  const { t, lang, setLang } = useI18n();
  const NAV = t.nav;
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 md:px-12">
        <Logo />
        <nav className="hidden items-center gap-6 lg:flex">
          {NAV.map((n, i) => (
            <a key={n} href={`#${NAV_IDS[i]}`} className={`relative text-sm transition-colors hover:text-foreground after:absolute after:-bottom-1 after:left-0 after:h-0.5 after:bg-primary after:transition-all hover:after:w-full ${i === 0 ? "text-foreground after:w-full" : "text-muted-foreground after:w-0"}`}>{n}</a>
          ))}
        </nav>
        <div className="flex items-center gap-4">
          <div className="relative">
            <button onClick={() => setLo(!lo)} aria-label="Language" className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground"><Globe2 className="h-4 w-4" /> {lang} <ChevronDown className={`h-3 w-3 transition-transform ${lo ? "rotate-180" : ""}`} /></button>
            {lo && <div className="glass absolute right-0 top-8 z-50 w-32 overflow-hidden rounded-lg py-1">
              {LANGS.map((l) => <button key={l} onClick={() => { setLang(l); setLo(false); }} className={`block w-full px-3 py-2 text-left text-sm hover:bg-secondary ${l === lang ? "text-primary" : "text-muted-foreground"}`}>{l} · {({ EN: "English", ID: "Indonesia", ES: "Español" })[l]}</button>)}
            </div>}
          </div>
          <div className="hidden sm:block"><PrimaryBtn /></div>
          <button className="lg:hidden" onClick={() => setOpen(!open)} aria-label="Menu">{open ? <X /> : <Menu />}</button>
        </div>
      </div>
      {open && (
        <nav className="flex flex-col gap-1 border-t border-border bg-background px-4 py-4 lg:hidden">
          {NAV.map((n, i) => <a key={n} href={`#${NAV_IDS[i]}`} onClick={() => setOpen(false)} className="rounded-md px-3 py-2 text-muted-foreground hover:bg-secondary hover:text-foreground">{n}</a>)}
          <div className="mt-2"><PrimaryBtn /></div>
        </nav>
      )}
    </header>
  );
}

function Hero() {
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 800], [0, 240]);
  const { t } = useI18n();
  return (
    <section className="relative min-h-[640px] overflow-hidden pt-24 md:min-h-[720px]">
      <motion.img style={{ y }} src={hero} alt="Cargo ship at port at sunset" width={1920} height={1024} className="absolute inset-0 h-[120%] w-full object-cover object-[70%_center]" />
      <div className="hero-overlay absolute inset-0" />
      <motion.div initial="h" animate="s" variants={{ s: { transition: { staggerChildren: 0.15 } } }} className="relative mx-auto max-w-7xl px-4 py-16 md:px-12 md:py-24">
        <div className="absolute right-12 top-10 hidden border-r-2 border-primary pr-3 text-right text-xs tracking-[0.25em] text-foreground/80 md:block">{t.reach}<br />{t.local}</div>
        <motion.div variants={FU}><p className="text-xs tracking-[0.25em] text-muted-foreground">{t.heroTag}</p></motion.div>
        <motion.div variants={FU}><h1 className="mt-4 text-4xl font-black leading-[1.05] sm:text-6xl lg:text-7xl">
          {t.h1a}<br /><span className="text-primary">{t.h1b}</span>
        </h1></motion.div>
        <motion.div variants={FU}><p className="mt-6 max-w-lg text-base text-muted-foreground md:text-lg">{t.heroP}</p></motion.div>
        <motion.div variants={FU}><div className="mt-8 flex flex-wrap items-center gap-6">
          <PrimaryBtn />
          <a href="#" className="group flex items-center gap-3 text-sm font-medium">
            <span className="grid h-11 w-11 place-items-center rounded-full border border-foreground/40 transition-all group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"><Play className="h-4 w-4" /></span>
            {t.watch}
          </a>
        </div></motion.div>
      </motion.div>
    </section>
  );
}

const STATS = [
  { icon: Globe, label: "Global Trade Volume", v: "$2.8T+", s: "Annual Trade Value" },
  { icon: Ship, v: "15+", s: "Years of Excellence" },
  { icon: Container, v: "180+", s: "Countries Served" },
  { icon: Truck, v: "5,000+", s: "Shipments Delivered Monthly" },
];
function Stats() {
  return (
    <section className="border-y border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto grid max-w-7xl grid-cols-2 lg:grid-cols-4">
        {STATS.map((x, i) => (
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} key={i} className={`flex items-center gap-4 p-4 md:p-8 ${i % 2 ? "border-l" : ""} ${i > 1 ? "border-t lg:border-t-0" : ""} ${i === 2 ? "lg:border-l" : ""} border-border`}>
            <x.icon className="h-8 w-8 shrink-0 text-foreground/80" strokeWidth={1.3} />
            <div className="min-w-0">
              {x.label && <div className="text-xs text-muted-foreground">{x.label}</div>}
              <div className="text-2xl font-bold md:text-3xl">{x.v}</div>
              <div className="text-xs text-muted-foreground">{x.s}</div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

const SERVICES = [
  { icon: Ship, t: "Ocean Freight", s: "FCL / LCL / Bulk" },
  { icon: Plane, t: "Air Freight", s: "Fast & Reliable" },
  { icon: TrainFront, t: "Rail Freight", s: "Efficient & Green" },
  { icon: Truck, t: "Road Transport", s: "Flexible & Secure" },
  { icon: FileCheck, t: "Customs Clearance", s: "Smooth & Compliant" },
  { icon: Warehouse, t: "Warehousing", s: "Safe & Scalable" },
];
function Services() {
  const { t } = useI18n();
  return (
    <section id="services" className="mx-auto flex max-w-7xl flex-col gap-12 px-4 py-16 md:px-12 md:py-24 lg:flex-row lg:items-stretch">
      <Reveal className="lg:w-2/5">
        <p className="text-xs tracking-[0.25em] text-muted-foreground">{t.svcTag}</p>
        <h2 className="mt-3 text-3xl font-bold md:text-4xl">{t.svcH1}<br />{t.svcH2}</h2>
        <p className="mt-4 text-muted-foreground">{t.svcP}</p>
        <a href="#" className="group mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">{t.explore} <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" /></a>
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3">
          {SERVICES.map((x, i) => (
            <motion.a initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }} key={x.t} href="#" className="group relative rounded-xl border border-border bg-card/50 p-4 transition-all hover:-translate-y-1 hover:border-primary/60 hover:bg-card hover:shadow-[0_10px_30px_-10px] hover:shadow-primary/40 duration-300">
              <x.icon className="h-6 w-6 text-accent transition-colors group-hover:text-primary" strokeWidth={1.5} />
              <div className="mt-4 text-sm font-semibold">{x.t}</div>
              <div className="text-xs text-muted-foreground">{x.s}</div>
              <ArrowRight className="absolute bottom-4 right-4 h-3.5 w-3.5 text-muted-foreground transition-all group-hover:text-primary" />
            </motion.a>
          ))}
        </div>
      </Reveal>
      <Reveal delay={0.2} className="flex flex-col lg:w-3/5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <p className="text-xs tracking-[0.25em] text-muted-foreground">{t.network}</p>
          <div className="flex divide-x divide-border">
            {[["180+", "Countries"], ["320+", "Ports"], ["1,200+", "Trade Lanes"]].map(([v, l]) => (
              <div key={l} className="px-4 first:pl-0"><div className="text-xl font-bold">{v}</div><div className="text-xs text-muted-foreground">{l}</div></div>
            ))}
          </div>
        </div>
        <div className="mt-6 flex-1"><WorldMap /></div>
      </Reveal>
    </section>
  );
}

function Tracking() {
  const { t } = useI18n();
  return (
    <section id="track-shipment" className="bg-surface">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-16 md:px-12 md:py-24 lg:grid-cols-[1fr_1.6fr_1.1fr]">
        <Reveal>
          <p className="text-xs tracking-[0.25em] text-muted-foreground">{t.trkTag}</p>
          <h2 className="mt-3 text-3xl font-bold">{t.trkH1}<br />{t.trkH2}</h2>
          <p className="mt-4 text-muted-foreground">{t.trkP}</p>
          <div className="mt-6"><OutlineBtn>{t.track}</OutlineBtn></div>
        </Reveal>
        <Reveal delay={0.15}><ShipmentTracker /></Reveal>
        <Reveal delay={0.3}><TradeChart /></Reveal>
        <Reveal className="lg:col-span-3"><AIAnalyzer /></Reveal>
      </div>
    </section>
  );
}

const DEST = [
  { n: "USA", c: "24+", img: "https://images.unsplash.com/photo-1605130284535-11dd9eedc58a?w=600&q=80" },
  { n: "Europe", c: "32+", img: "https://images.unsplash.com/photo-1511739001486-6bfe10ce785f?w=600&q=80" },
  { n: "Asia", c: "45+", img: "https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=600&q=80" },
  { n: "Middle East", c: "28+", img: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=600&q=80" },
  { n: "Africa", c: "19+", img: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?w=600&q=80" },
];
function Destinations() {
  const { t } = useI18n();
  return (
    <section id="destinations" className="flex flex-col lg:flex-row">
      <img src={port} alt="Container port" width={1024} height={768} loading="lazy" className="h-56 w-full object-cover lg:h-auto lg:w-1/5" />
      <div className="flex flex-1 flex-col gap-8 px-4 py-12 md:px-12 lg:flex-row lg:items-center">
        <div className="lg:w-64 lg:shrink-0">
          <p className="text-xs tracking-[0.25em] text-muted-foreground">{t.dstTag}</p>
          <h2 className="mt-3 text-3xl font-bold">{t.dstH}</h2>
          <p className="mt-3 text-sm text-muted-foreground">{t.dstP}</p>
          <div className="mt-5"><OutlineBtn>{t.viewAll}</OutlineBtn></div>
        </div>
        <div className="flex flex-1 gap-3 overflow-x-auto pb-2 lg:grid lg:grid-cols-5 lg:overflow-visible">
          {DEST.map((d, i) => (
            <motion.a initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }} key={d.n} href="#" className="group relative h-72 w-44 shrink-0 overflow-hidden rounded-xl border border-border lg:w-auto">
              <img src={d.img} alt={d.n} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
              <div className="card-overlay absolute inset-0" />
              <div className="absolute inset-x-0 bottom-0 p-4">
                <div className="font-semibold">{d.n}</div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">{d.c} {t.shipments} <ArrowRight className="h-3 w-3 transition-colors group-hover:text-primary" /></div>
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

function Footer() {
  const { t } = useI18n(); const NAV = t.nav;
  const feats = [[ShieldCheck, "Secure", "Transactions"], [Headphones, "24/7", "Support"], [Globe2, "Global", "Network"], [Leaf, "Sustainable", "Future"]] as const;
  return (
    <footer id="contact">
      <section className="relative overflow-hidden">
        <img src={ship} alt="Cargo ship at sea" width={1600} height={640} loading="lazy" className="absolute inset-0 h-full w-full object-cover object-right" />
        <div className="hero-overlay absolute inset-0" />
        <div className="relative mx-auto flex max-w-7xl flex-col gap-8 px-4 py-14 md:px-12 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs tracking-[0.25em] text-muted-foreground">{t.ftTag}</p>
            <h2 className="mt-2 text-3xl font-bold">{t.ftH}</h2>
            <p className="mt-2 text-sm text-muted-foreground">{t.ftP}</p>
            <div className="mt-5"><PrimaryBtn /></div>
          </div>
          <div className="glass grid grid-cols-2 gap-6 rounded-2xl p-6 md:grid-cols-4">
            {feats.map(([I, a, b]) => (
              <div key={a} className="flex items-center gap-3 text-sm"><I className="h-6 w-6 shrink-0 text-accent" strokeWidth={1.5} /><div>{a}<br />{b}</div></div>
            ))}
          </div>
        </div>
      </section>
      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-6 px-4 py-8 md:px-12 lg:flex-row lg:justify-between">
          <Logo />
          <nav className="flex flex-wrap justify-center gap-5">
            {NAV.map((n, i) => <a key={n} href={`#${NAV_IDS[i]}`} className="text-xs text-muted-foreground transition-colors hover:text-primary">{n}</a>)}
          </nav>
          <div className="flex items-center gap-4">
            {[Linkedin, Twitter, Youtube, Instagram].map((I, i) => <a key={i} href="#" className="text-muted-foreground transition-colors hover:text-primary"><I className="h-4 w-4" /></a>)}
            <span className="text-xs text-muted-foreground">© 2025 GlobalLink</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Index() {
  return (
    <I18nProvider><BookingProvider>
    <div className="min-h-screen bg-background font-sans text-foreground">
      <Header />
      <main>
        <Hero />
        <Stats />
        <Services />
        <Tracking />
        <Destinations />
      </main>
      <Footer />
      <Toaster theme="dark" position="top-right" />
    </div>
    </BookingProvider></I18nProvider>
  );
}
