import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp, ScaleIn, StaggerIn, staggerChild, Parallax } from './animations';
import { FEATURES, TAG_CLS, ARCH, ARCH_PLANES, IN_ACTION, FAQ, THEMES } from './data';
import { GitMerge, Route, Clock, Brain, GitFork, ClipboardList, Wrench, Monitor, Shield } from 'lucide-react';

const FEATURE_ICONS = [GitMerge, Route, Clock, Brain, GitFork, ClipboardList, Wrench, Monitor, Shield];
const PLANE_ICONS = [GitMerge, Route];

export function Features() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-24" id="features">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">Everything you need</h2></FadeUp>
      <FadeUp delay={0.1}><p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-16 font-space">A local control plane for agents and models</p></FadeUp>
      <StaggerIn className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
        {FEATURES.map((f, i) => {
          const Icon = FEATURE_ICONS[i];
          return (
          <motion.div key={f.title} variants={staggerChild}
            whileHover={{ y: -6, borderColor: 'rgba(245,158,11,0.4)', boxShadow: '0 16px 48px rgba(0,0,0,0.35), 0 0 20px rgba(245,158,11,0.08)' }}
            className="bg-slate-100 dark:bg-[#111827] border border-amber-500/12 rounded-2xl p-8 relative overflow-hidden transition-colors group">
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <Icon size={24} className="text-amber-400 mb-4" />
            <h3 className="text-[17px] font-semibold mb-2 font-space">{f.title}</h3>
            <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            <span className={`inline-block mt-3 px-2.5 py-0.5 rounded-md text-[11px] font-semibold uppercase tracking-wide ${TAG_CLS[f.tag]}`}>{f.tag}</span>
          </motion.div>
          );
        })}
      </StaggerIn>
    </section>
  );
}

export function InAction() {
  const [active, setActive] = useState(0);
  const ex = IN_ACTION[active];
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-24" id="in-action">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">See it in action</h2></FadeUp>
      <FadeUp delay={0.1}><p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-16 font-space">Real conversations, real workflows</p></FadeUp>
      <ScaleIn className="max-w-[640px] mx-auto">
        <div className="flex gap-1 mb-4 justify-center flex-wrap">
          {IN_ACTION.map((item, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all font-space cursor-pointer ${active === i ? 'bg-amber-500 text-white border-amber-500' : 'bg-slate-100 dark:bg-[#111827] text-slate-400 border-amber-500/12 hover:border-amber-500/30 hover:text-slate-900 dark:hover:text-white'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-[#0b1022] border border-amber-500/12 rounded-2xl p-6 min-h-[200px] shadow-lg dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
              <div className="self-end"><div className="px-4 py-2.5 rounded-xl rounded-br-sm text-sm bg-amber-500 text-white max-w-[420px] font-space">{ex.user}</div></div>
              <div className="self-start"><div className="px-4 py-2.5 rounded-xl rounded-bl-sm text-sm bg-slate-100 dark:bg-[#111827] text-slate-700 dark:text-slate-200 border border-amber-500/12 max-w-[480px] whitespace-pre-wrap font-space">{ex.bot}</div></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </ScaleIn>
    </section>
  );
}



export function HowItWorks() {
  const steps = [
    { n: '1', title: 'Clone & install', code: 'git clone https://github.com/laqaer/acpcrew.git\ncd acpcrew && pip install .' },
    { n: '2', title: 'Start', code: 'junction gateway', note: 'Dashboard opens at localhost:5476. Run junction doctor to verify. `acpcrew` and `kirocrew` remain aliases for `junction`.' },
    { n: '3', title: 'Connect', note: 'Open the dashboard, or connect Slack. Type !dashboard in Slack for a 1-click link.' },
  ];
  return (
    <section className="max-w-[800px] mx-auto px-6 pt-24 pb-24" id="how-it-works">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">Install from source</h2></FadeUp>
      <FadeUp delay={0.1}><p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-16 font-space">Python 3.10+ and Node.js 22+. kiro-cli is optional.</p></FadeUp>
      <div className="flex flex-col gap-6">
        {steps.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.15}>
            <div className="flex gap-5 items-start">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white text-xl font-bold flex items-center justify-center shrink-0 font-space">{s.n}</motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 font-space">{s.title}</h3>
                {s.code && <code className="block bg-slate-100 dark:bg-[#111827] border border-amber-500/12 rounded-lg px-4 py-3 font-mono text-[13px] text-amber-400 leading-relaxed whitespace-pre-wrap break-all">{s.code}</code>}
                {s.note && <p className="text-slate-400 text-sm leading-relaxed mt-2">{s.note}</p>}
              </div>
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

export function Architecture() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-24" id="architecture">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">Two planes</h2></FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-[680px] mx-auto font-space">
          Junction docks ACP agents and routes their models. The model sidecar is optional. If it is absent, the gateway still works.
        </p>
      </FadeUp>
      <StaggerIn className="grid md:grid-cols-2 gap-5 max-w-[860px] mx-auto mb-14">
        {ARCH_PLANES.map((plane, i) => {
          const Icon = PLANE_ICONS[i];
          return (
            <motion.div key={plane.label} variants={staggerChild}
              whileHover={{ y: -6, borderColor: 'rgba(245,158,11,0.4)' }}
              className="bg-slate-100 dark:bg-[#111827] border border-amber-500/12 rounded-2xl p-8 text-left transition-all">
              <Icon size={24} className="text-amber-400 mb-4" />
              <div className="text-lg font-semibold font-space mb-1">{plane.label}</div>
              <div className="text-[11px] uppercase tracking-wide text-amber-500 mb-3">{plane.sub}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{plane.detail}</p>
            </motion.div>
          );
        })}
      </StaggerIn>
      <StaggerIn className="flex items-center justify-center flex-wrap gap-0 py-10">
        {ARCH.map((node, i) => (
          <span key={node.label} style={{ display: 'contents' }}>
            <motion.div variants={staggerChild} whileHover={{ y: -6, borderColor: 'rgba(245,158,11,0.4)' }}
              className="bg-slate-100 dark:bg-[#111827] border border-amber-500/12 rounded-xl px-7 py-5 text-center min-w-[140px] transition-all cursor-default">
              <div className="text-sm font-semibold font-space">{node.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{node.sub}</div>
            </motion.div>
            {i < ARCH.length - 1 && <span className="text-2xl text-amber-500 px-2">&rarr;</span>}
          </span>
        ))}
      </StaggerIn>
    </section>
  );
}

export function ThemesSection() {
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-24">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">Make it yours</h2></FadeUp>
      <FadeUp delay={0.1}><p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-12 font-space">22 built-in themes + custom theme creator</p></FadeUp>
      <FadeUp delay={0.2}>
        <div className="flex gap-3 justify-center flex-wrap">
          {THEMES.map((c) => (
            <motion.div key={c} whileHover={{ scale: 1.35, y: -6 }} transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              className="w-11 h-11 rounded-xl border-2 border-transparent hover:border-white/50 hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)] transition-[border-color] cursor-default"
              style={{ background: c }} />
          ))}
        </div>
      </FadeUp>
    </section>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-[700px] mx-auto px-6 pb-24" id="faq">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-16 font-space">Frequently asked questions</h2></FadeUp>
      <div className="flex flex-col gap-2">
        {FAQ.map((item, i) => (
          <FadeUp key={i} delay={i * 0.05}>
            <motion.div whileHover={{ borderColor: 'rgba(245,158,11,0.3)' }}
              onClick={() => setOpen(open === i ? null : i)}
              className={`bg-slate-100 dark:bg-[#111827] border rounded-xl px-5 py-4 cursor-pointer transition-colors ${open === i ? 'border-amber-500/30' : 'border-amber-500/12'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-medium font-space">{item.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-xl text-amber-400 font-light">+</motion.span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden">
                    <p className="text-sm text-slate-400 leading-relaxed pt-3">{item.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

export function Cta() {
  return (
    <section className="text-center px-6 pt-24 pb-16 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(245,158,11,0.06),transparent)]">
      <Parallax speed={-0.15}>
        <FadeUp><h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">Ready to get started?</h2></FadeUp>
        <FadeUp delay={0.1}><p className="text-slate-500 dark:text-slate-400 text-lg mb-8">One local install. Dock agents, route models, keep memory and cron on your machine.</p></FadeUp>
        <FadeUp delay={0.2}>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-[0_0_24px_rgba(245,158,11,0.35)] hover:-translate-y-0.5 transition-all no-underline font-space">Install Junction</a>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="flex gap-4 justify-center mt-6 text-sm">
            <a href="https://github.com/laqaer/acpcrew" target="_blank" rel="noopener noreferrer" className="text-amber-400 no-underline hover:underline">GitHub</a>
            <span className="text-slate-600">&middot;</span>
            <a href="https://github.com/laqaer/acpcrew/discussions" target="_blank" rel="noopener noreferrer" className="text-amber-400 no-underline hover:underline">Discussions</a>
            <span className="text-slate-600">&middot;</span>
            <a href="https://github.com/laqaer/acpcrew/issues" target="_blank" rel="noopener noreferrer" className="text-amber-400 no-underline hover:underline">Issues</a>
          </div>
        </FadeUp>
      </Parallax>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="text-center py-10 px-6 border-t border-amber-500/12 text-slate-500 text-xs">
      <div className="flex gap-6 justify-center mb-3">
        {[['https://github.com/laqaer/acpcrew', 'Source'], ['https://github.com/laqaer/acpcrew/issues', 'Issues']].map(([href, label]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-amber-400 no-underline hover:underline">{label}</a>
        ))}
      </div>
      <p>Junction — Where coding agents meet the models you want.</p>
    </footer>
  );
}
