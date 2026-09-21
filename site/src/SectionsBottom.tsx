import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeUp, ScaleIn, StaggerIn, staggerChild, Parallax } from './animations';
import { ARCH, ARCH_PLANES, FAQ, GITHUB_URL, IN_ACTION, ROLE_DAG, SITE_URL } from './data';
import { GitMerge, Route } from 'lucide-react';

const PLANE_ICONS = [GitMerge, Route];

export function InAction() {
  const [active, setActive] = useState(0);
  const ex = IN_ACTION[active];
  return (
    <section className="max-w-[1200px] mx-auto px-6 pb-24" id="in-action">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">On the rails</h2></FadeUp>
      <FadeUp delay={0.1}><p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-16 font-space">Dock an agent, then spend tokens on purpose</p></FadeUp>
      <ScaleIn className="max-w-[640px] mx-auto">
        <div className="flex gap-1 mb-4 justify-center flex-wrap">
          {IN_ACTION.map((item, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`px-4 py-2 rounded-lg text-xs font-medium border transition-all font-space cursor-pointer ${active === i ? 'bg-[#e4a54a] text-[#0c0d12] border-[#e4a54a]' : 'bg-slate-100 dark:bg-[#14151c] text-slate-400 border-[#e4a54a]/12 hover:border-[#e4a54a]/30 hover:text-slate-900 dark:hover:text-white'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="bg-slate-50 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-2xl p-6 min-h-[200px] shadow-lg dark:shadow-[0_24px_80px_rgba(0,0,0,0.4)]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }} className="flex flex-col gap-4">
              <div className="self-end"><div className="px-4 py-2.5 rounded-xl rounded-br-sm text-sm bg-[#e4a54a] text-[#0c0d12] max-w-[420px] font-space">{ex.user}</div></div>
              <div className="self-start"><div className="px-4 py-2.5 rounded-xl rounded-bl-sm text-sm bg-slate-100 dark:bg-[#0c0d12] text-slate-700 dark:text-slate-200 border border-[#e4a54a]/12 max-w-[480px] whitespace-pre-wrap font-space">{ex.bot}</div></div>
            </motion.div>
          </AnimatePresence>
        </div>
      </ScaleIn>
    </section>
  );
}

export function HowItWorks() {
  const steps = [
    {
      n: '1',
      title: 'Install the CLI',
      code: 'git clone https://github.com/laqaer/acpcrew.git\ncd acpcrew && pip install .',
    },
    {
      n: '2',
      title: 'Unlock the dashboard',
      code: 'junction setup',
      note: 'Writes the first-run marker so the local dashboard opens. An extra agent CLI is optional.',
    },
    {
      n: '3',
      title: 'Run',
      code: 'junction gateway',
      note: 'Dashboard binds to loopback. junction doctor --quick is the compose snapshot; junction doctor is the full probe. junction planes shows both rails and the role DAG; junction router catalog lists model choices.',
    },
  ];
  return (
    <section className="max-w-[800px] mx-auto px-6 pt-24 pb-24" id="how-it-works">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">Run it locally</h2></FadeUp>
      <FadeUp delay={0.1}><p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-16 font-space">Python 3.10+. Node.js 22+ only if you rebuild the dashboard. kiro-cli is optional.</p></FadeUp>
      <div className="flex flex-col gap-6">
        {steps.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.15}>
            <div className="flex gap-5 items-start">
              <motion.div whileHover={{ scale: 1.1, rotate: 5 }} className="w-12 h-12 rounded-xl bg-[#e4a54a] text-[#0c0d12] text-xl font-bold flex items-center justify-center shrink-0 font-space">{s.n}</motion.div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2 font-space">{s.title}</h3>
                {s.code && <code className="block bg-slate-100 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-lg px-4 py-3 font-mono text-[13px] text-[#e4a54a] leading-relaxed whitespace-pre-wrap break-all">{s.code}</code>}
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
              whileHover={{ y: -6, borderColor: 'rgba(228,165,74,0.4)' }}
              className="bg-slate-100 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-2xl p-8 text-left transition-all">
              <Icon size={24} className="text-[#e4a54a] mb-4" />
              <div className="text-lg font-semibold font-space mb-1">{plane.label}</div>
              <div className="text-[11px] uppercase tracking-wide text-[#e4a54a] mb-3">{plane.sub}</div>
              <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{plane.detail}</p>
            </motion.div>
          );
        })}
      </StaggerIn>
      <StaggerIn className="flex items-center justify-center flex-wrap gap-0 py-10">
        {ARCH.map((node, i) => (
          <span key={node.label} style={{ display: 'contents' }}>
            <motion.div variants={staggerChild} whileHover={{ y: -6, borderColor: 'rgba(228,165,74,0.4)' }}
              className="bg-slate-100 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-xl px-7 py-5 text-center min-w-[140px] transition-all cursor-default">
              <div className="text-sm font-semibold font-space">{node.label}</div>
              <div className="text-[11px] text-slate-500 mt-1">{node.sub}</div>
            </motion.div>
            {i < ARCH.length - 1 && (
              <span className="text-[#e4a54a] px-1" aria-hidden="true">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <path d="M10 6v7.5c0 2.8 2.2 5 6 5" />
                </svg>
              </span>
            )}
          </span>
        ))}
      </StaggerIn>
    </section>
  );
}

export function RoleDag() {
  return (
    <section className="max-w-[1000px] mx-auto px-6 pb-24" id="roles">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-3 font-space">Role routing</h2></FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-center text-slate-500 dark:text-slate-400 text-lg mb-12 max-w-[640px] mx-auto font-space">
          Orchestration, planning, and execution each pick a cost class so tokens buy the most work. Never paste provider keys into chat.
        </p>
      </FadeUp>
      <StaggerIn className="grid md:grid-cols-3 gap-5">
        {ROLE_DAG.map((row) => (
          <motion.div key={row.role} variants={staggerChild}
            className="bg-slate-100 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-2xl p-8">
            <div className="text-[11px] uppercase tracking-[0.2em] text-[#e4a54a] mb-2">{row.class}</div>
            <div className="text-lg font-semibold font-space mb-2">{row.role}</div>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{row.detail}</p>
          </motion.div>
        ))}
      </StaggerIn>
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
            <motion.div whileHover={{ borderColor: 'rgba(228,165,74,0.3)' }}
              onClick={() => setOpen(open === i ? null : i)}
              className={`bg-slate-100 dark:bg-[#14151c] border rounded-xl px-5 py-4 cursor-pointer transition-colors ${open === i ? 'border-[#e4a54a]/30' : 'border-[#e4a54a]/12'}`}>
              <div className="flex justify-between items-center">
                <span className="text-[15px] font-medium font-space">{item.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-xl text-[#e4a54a] font-light">+</motion.span>
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
    <section className="text-center px-6 pt-24 pb-16 bg-[radial-gradient(ellipse_60%_50%_at_50%_100%,rgba(228,165,74,0.08),transparent)]">
      <Parallax speed={-0.15}>
        <FadeUp><h2 className="text-4xl md:text-5xl font-bold mb-4 font-space">Ready to get started?</h2></FadeUp>
        <FadeUp delay={0.1}><p className="text-slate-500 dark:text-slate-400 text-lg mb-8">One local install. Dock agents, route models, keep memory and cron on your machine.</p></FadeUp>
        <FadeUp delay={0.2}>
          <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold bg-[#e4a54a] text-[#0c0d12] shadow-[0_0_24px_rgba(228,165,74,0.35)] hover:-translate-y-0.5 transition-all no-underline font-space">Run Junction</a>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="flex gap-4 justify-center mt-6 text-sm">
            <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="text-[#e4a54a] no-underline hover:underline">GitHub</a>
            <span className="text-slate-600">&middot;</span>
            <a href={`${GITHUB_URL}/issues`} target="_blank" rel="noopener noreferrer" className="text-[#e4a54a] no-underline hover:underline">Issues</a>
          </div>
        </FadeUp>
      </Parallax>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="text-center py-10 px-6 border-t border-[#e4a54a]/12 text-slate-500 text-xs">
      <div className="flex gap-6 justify-center mb-3">
        {[[GITHUB_URL, 'Source'], [`${GITHUB_URL}/issues`, 'Issues'], [SITE_URL, 'getjunction.dev']].map(([href, label]) => (
          <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[#e4a54a] no-underline hover:underline">{label}</a>
        ))}
      </div>
      <p>Junction — Where coding agents meet the models you want.</p>
    </footer>
  );
}
