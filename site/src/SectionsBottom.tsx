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
    <section className="max-w-[1120px] mx-auto px-5 md:px-8 pb-24" id="in-action">
      <FadeUp>
        <div className="kicker mb-3">In use</div>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-3">On the rails</h2>
      </FadeUp>
      <FadeUp delay={0.1}><p className="text-[#6d6458] dark:text-[#a39b90] text-lg mb-10 max-w-[36rem]">Dock an agent, then spend tokens on purpose</p></FadeUp>
      <ScaleIn>
        <div className="flex gap-6 mb-6 flex-wrap border-b border-[#e4a54a]/20">
          {IN_ACTION.map((item, i) => (
            <button key={i} onClick={() => setActive(i)}
              className={`px-0 py-2 text-xs font-medium border-b-2 -mb-px cursor-pointer ${active === i ? 'border-[#e4a54a] text-[#1c160f] dark:text-[#f6f1e7]' : 'border-transparent text-[#8a8175]'}`}>
              {item.label}
            </button>
          ))}
        </div>
        <div className="min-h-[200px]">
          <AnimatePresence mode="wait">
            <motion.div key={active} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.2 }}
              className="grid md:grid-cols-2 gap-px bg-[#e4a54a]/25">
              <div className="bg-[#f3eee4] dark:bg-[#0c0d12] p-6">
                <div className="kicker mb-3">You</div>
                <p className="text-sm leading-relaxed max-w-[42ch]">{ex.user}</p>
              </div>
              <div className="bg-[#f7f3eb] dark:bg-[#14151c] p-6">
                <div className="kicker mb-3">Junction</div>
                <p className="text-sm leading-relaxed text-[#5c5348] dark:text-[#b7aea2] whitespace-pre-wrap">{ex.bot}</p>
              </div>
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
      code: 'curl -fsSL https://raw.githubusercontent.com/myrmitis/junction/main/scripts/get-junction.sh | sh',
    },
    {
      n: '2',
      title: 'First run',
      code: 'junction setup',
      note: 'Writes a local marker so the dashboard opens on this machine. An extra agent CLI is optional.',
    },
    {
      n: '3',
      title: 'Start',
      code: 'junction up',
      note: 'Composes both planes, then binds the dashboard to loopback. junction doctor --quick is the same snapshot without starting the server. junction planes shows both rails and the role DAG; junction router catalog lists model choices.',
    },
  ];
  return (
    <section className="max-w-[1120px] mx-auto px-5 md:px-8 py-8 pb-24" id="how-it-works">
      <FadeUp>
        <div className="kicker mb-3">Three stations</div>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-3">Install locally</h2>
      </FadeUp>
      <FadeUp delay={0.1}><p className="text-[#6d6458] dark:text-[#a39b90] text-lg mb-12 max-w-[40rem]">macOS and Linux. Python 3.10+. Node.js 22+ builds the dashboard. A vendor agent CLI is optional. Read the script before you run it.</p></FadeUp>
      <div className="grid md:grid-cols-3 gap-8">
        {steps.map((s, i) => (
          <FadeUp key={s.n} delay={i * 0.08}>
            <div className="border-t-2 border-[#e4a54a] pt-4 h-full">
              <div className="font-display text-3xl text-[#e4a54a] mb-2">{s.n}</div>
              <h3 className="text-lg font-semibold mb-3">{s.title}</h3>
              {s.code && <code className="block plate px-3 py-3 font-mono text-[12px] text-[#a56b22] dark:text-[#e4a54a] leading-relaxed whitespace-pre-wrap break-all">{s.code}</code>}
              {s.note && <p className="text-[#6d6458] dark:text-[#a39b90] text-sm leading-relaxed mt-3">{s.note}</p>}
            </div>
          </FadeUp>
        ))}
      </div>
    </section>
  );
}

export function Architecture() {
  return (
    <section className="max-w-[1120px] mx-auto px-5 md:px-8 pb-24" id="architecture">
      <FadeUp>
        <div className="kicker mb-3">01</div>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-3">Two planes</h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-[#6d6458] dark:text-[#a39b90] text-lg mb-12 max-w-[40rem]">
          Junction docks ACP agents. junction up starts a loopback model catalog. The agent uses the models it already serves. If the catalog is down, the gateway still works.
        </p>
      </FadeUp>
      <StaggerIn className="grid md:grid-cols-2 gap-px bg-[#e4a54a]/25 mb-14">
        {ARCH_PLANES.map((plane, i) => {
          const Icon = PLANE_ICONS[i];
          return (
            <motion.div key={plane.label} variants={staggerChild}
              className="bg-[#f3eee4] dark:bg-[#0c0d12] p-8 text-left">
              <Icon size={20} className="text-[#e4a54a] mb-5" />
              <div className="font-display text-3xl mb-1">{plane.label}</div>
              <div className="kicker mb-4">{plane.sub}</div>
              <p className="text-sm text-[#5c5348] dark:text-[#b7aea2] leading-relaxed">{plane.detail}</p>
            </motion.div>
          );
        })}
      </StaggerIn>
      <StaggerIn className="flex items-center justify-start flex-wrap gap-0 py-10">
        {ARCH.map((node, i) => (
          <span key={node.label} style={{ display: 'contents' }}>
            <motion.div variants={staggerChild}
              className="px-4 py-3 text-left min-w-[120px] border-t border-[#e4a54a]/50">
              <div className="text-sm font-semibold">{node.label}</div>
              <div className="text-[11px] text-[#6d6458] dark:text-[#a39b90] mt-1">{node.sub}</div>
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
    <section className="max-w-[1120px] mx-auto px-5 md:px-8 pb-24" id="roles">
      <FadeUp>
        <div className="kicker mb-3">02</div>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-3">Role routing</h2>
      </FadeUp>
      <FadeUp delay={0.1}>
        <p className="text-[#6d6458] dark:text-[#a39b90] text-lg mb-12 max-w-[40rem]">
          Orchestration, planning, and execution each pick a cost class so tokens buy the most work. Never paste provider keys into chat.
        </p>
      </FadeUp>
      <StaggerIn className="grid md:grid-cols-3">
        {ROLE_DAG.map((row, i) => (
          <motion.div key={row.role} variants={staggerChild}
            className={`py-6 md:px-6 md:border-l border-[#e4a54a]/30 ${i === 0 ? 'md:border-l-0 md:pl-0' : ''}`}>
            <div className="kicker mb-2">{row.class}</div>
            <div className="font-display text-3xl mb-2">{row.role}</div>
            <p className="text-sm text-[#5c5348] dark:text-[#b7aea2] leading-relaxed">{row.detail}</p>
          </motion.div>
        ))}
      </StaggerIn>
    </section>
  );
}

export function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <section className="max-w-[760px] mx-auto px-5 md:px-8 pb-24" id="faq">
      <FadeUp>
        <div className="kicker mb-3">03</div>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-10">Questions</h2>
      </FadeUp>
      <div className="flex flex-col">
        {FAQ.map((item, i) => (
          <FadeUp key={i} delay={i * 0.02}>
            <motion.div
              onClick={() => setOpen(open === i ? null : i)}
              className="border-t border-[#1c160f]/10 dark:border-[#e4a54a]/20 px-0 py-4 cursor-pointer">
              <div className="flex justify-between items-baseline gap-6">
                <span className="text-[16px] font-medium">{item.q}</span>
                <motion.span animate={{ rotate: open === i ? 45 : 0 }} className="text-xl text-[#e4a54a] font-light shrink-0">+</motion.span>
              </div>
              <AnimatePresence>
                {open === i && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}
                    className="overflow-hidden">
                    <p className="text-sm text-[#5c5348] dark:text-[#b7aea2] leading-relaxed pt-3 max-w-[62ch]">{item.a}</p>
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
    <section className="px-5 md:px-8 py-20 border-t border-[#e4a54a]/30">
      <Parallax speed={-0.08}>
        <FadeUp>
          <div className="max-w-[1120px] mx-auto">
            <div className="kicker mb-3">Start</div>
            <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-4 max-w-[16ch]">Install it on this machine</h2>
          </div>
        </FadeUp>
        <FadeUp delay={0.1}><p className="max-w-[1120px] mx-auto text-[#6d6458] dark:text-[#a39b90] text-lg mb-8">One install command. Then setup, then start. Nothing leaves loopback except the models you already use.</p></FadeUp>
        <FadeUp delay={0.2}>
          <div className="max-w-[1120px] mx-auto">
            <a href="#how-it-works" className="inline-flex items-center px-6 py-3 text-[15px] font-semibold bg-[#e4a54a] text-[#0c0d12] no-underline">Install locally</a>
          </div>
        </FadeUp>
        <FadeUp delay={0.3}>
          <div className="flex gap-4 max-w-[1120px] mx-auto mt-6 text-sm">
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
    <footer className="py-10 px-5 md:px-8 border-t border-[#e4a54a]/20 text-[#6d6458] dark:text-[#a39b90] text-xs">
      <div className="max-w-[1120px] mx-auto">
        <div className="flex gap-6 mb-3">
          {[[GITHUB_URL, 'Source'], [`${GITHUB_URL}/issues`, 'Issues'], [SITE_URL, 'getjunction.dev']].map(([href, label]) => (
            <a key={label} href={href} target="_blank" rel="noopener noreferrer" className="text-[#e4a54a] no-underline hover:underline">{label}</a>
          ))}
        </div>
        <p>Junction — Where coding agents meet the models you want.</p>
      </div>
    </footer>
  );
}
