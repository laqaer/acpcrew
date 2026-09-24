import { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useInView, AnimatePresence } from 'framer-motion';
import { FadeUp, useScrollProgress } from './animations';
import { GITHUB_URL, TERMINAL_LINES } from './data';
import { X, Check, Sun, Moon } from 'lucide-react';
import { useTheme } from './ThemeContext';
import { AppPreview } from './AppPreview';

export function ScrollProgress() {
  const scaleX = useScrollProgress();
  return <motion.div className="fixed top-0 left-0 right-0 h-[2px] bg-[#e4a54a] origin-left z-[200]" style={{ scaleX }} />;
}

function Mark({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} fill="none" aria-hidden="true">
      <path d="M10 6v7.5c0 2.8 2.2 5 6 5h0c3.8 0 6-2.2 6-5V6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M16 18.5V26" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <motion.nav initial={{ y: -12, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.4 }}
      className={`fixed inset-x-0 top-0 z-[100] transition-colors duration-300 ${scrolled ? 'bg-[#f3eee4]/92 dark:bg-[#0c0d12]/90 backdrop-blur-xl border-b border-[#e4a54a]/20' : ''}`}>
      <div className="max-w-[1120px] mx-auto flex items-center justify-between px-5 md:px-8 h-16">
        <a href="/" className="flex items-center gap-2.5 no-underline text-[#1c160f] dark:text-[#f4efe6]">
          <span className="text-[#e4a54a]"><Mark className="w-7 h-7" /></span>
          <span className="font-display text-[1.65rem] leading-none tracking-[-0.03em]">Junction</span>
        </a>
        <div className="flex gap-0.5 items-center">
          {[['#architecture', 'Planes'], ['#roles', 'Routing'], ['#how-it-works', 'Install'], ['#faq', 'FAQ']].map(([href, label]) => (
            <a key={href} href={href} className="hidden md:block px-3 py-2 text-[13px] font-medium text-[#5c5348] dark:text-[#b7aea2] hover:text-[#1c160f] dark:hover:text-white no-underline">{label}</a>
          ))}
          <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hidden md:block px-3 py-2 text-[13px] font-medium text-[#5c5348] dark:text-[#b7aea2] hover:text-[#1c160f] dark:hover:text-white no-underline">Source</a>
          <button onClick={toggle} className="p-2 text-[#5c5348] dark:text-[#b7aea2]" aria-label="Toggle theme">
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <a href="#how-it-works" className="ml-1 px-3.5 py-2 text-[13px] font-semibold bg-[#e4a54a] text-[#0c0d12] no-underline">Install locally</a>
        </div>
      </div>
    </motion.nav>
  );
}

export function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  return (
    <>
    <motion.section id="hero" ref={ref} style={{ y, opacity }} className="pt-28 md:pt-36 pb-8 px-5 md:px-8">
      <div className="max-w-[1120px] mx-auto grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] gap-10 lg:gap-16 items-end">
        <div>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="flex gap-x-4 gap-y-1 mb-7 flex-wrap text-[11px] tracking-[0.18em] uppercase text-[#a56b22] dark:text-[#e4a54a]">
            <span>Stay on loopback</span>
            <span aria-hidden="true">/</span>
            <span>Dock agents</span>
            <span aria-hidden="true">/</span>
            <span>Route spend</span>
          </motion.div>
          <motion.h1 initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1, duration: 0.5 }}
            className="font-display text-[clamp(3.1rem,7.2vw,6.15rem)] font-medium leading-[0.92] tracking-[-0.03em] text-[#1c160f] dark:text-[#f6f1e7] mb-6">
            Where coding agents<br />meet the models you want.
          </motion.h1>
          <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.16 }}
            className="text-lg md:text-xl text-[#5c5348] dark:text-[#b7aea2] max-w-[38rem] mb-8 leading-relaxed">
            A CLI is one harness talking to one vendor model. Junction is the local switch: dock the agent in one pane, pick what the tokens buy in the other. Memory and cron stay on your machine.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3 flex-wrap">
            <a href="#how-it-works" className="inline-flex items-center px-6 py-3 text-[15px] font-semibold bg-[#e4a54a] text-[#0c0d12] no-underline">Install locally</a>
            <a href="#architecture" className="inline-flex items-center px-6 py-3 text-[15px] font-semibold text-[#1c160f] dark:text-[#f6f1e7] border border-[#1c160f]/15 dark:border-[#e4a54a]/30 no-underline">See the two planes</a>
          </motion.div>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.24 }}
            className="mt-5 text-sm text-[#6d6458] dark:text-[#a39b90]">
            Loopback dashboard. Never paste provider keys into chat.
          </motion.p>
        </div>
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.18 }}
          className="plate border-l-2 border-l-[#e4a54a] px-5 py-5">
          <div className="kicker mb-3">On this machine</div>
          <pre className="font-mono text-[12.5px] md:text-[13px] leading-relaxed text-[#1c160f] dark:text-[#e4a54a] overflow-x-auto whitespace-pre-wrap break-all">
{`curl -fsSL https://raw.githubusercontent.com/laqaer/junction/main/scripts/get-junction.sh | sh
junction setup && junction up`}
          </pre>
          <p className="mt-3 text-xs text-[#6d6458] dark:text-[#a39b90] leading-relaxed">
            Tracks the default branch. Read the script before you run it. The dashboard binds to loopback on this machine.
          </p>
        </motion.div>
      </div>
    </motion.section>
    <AppPreview />
    </>
  );
}

export function TerminalDemo() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-100px' });
  const [lines, setLines] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let i = 0;
    const iv = setInterval(() => { i++; setLines(i); if (i >= TERMINAL_LINES.length) clearInterval(iv); }, 400);
    return () => clearInterval(iv);
  }, [inView]);

  return (
    <FadeUp className="max-w-[1120px] mx-auto mb-20 px-5 md:px-8">
      <div ref={ref} className="bg-[#14151c] border border-[#e4a54a]/20 overflow-hidden">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[#e4a54a]/15">
          <span className="w-6 h-px bg-[#e4a54a]" />
          <span className="text-xs text-[#a39b90] font-mono tracking-wide">junction — planes</span>
        </div>
        <div className="p-6 font-mono text-[13.5px] leading-[1.8] min-h-[220px]">
          <AnimatePresence>
            {TERMINAL_LINES.slice(0, lines).map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {l.prompt && <><span className="text-[#e4a54a]">$ </span><span className="text-slate-100">{l.text}</span></>}
                {!l.prompt && !l.comment && <><span className="text-[#e4a54a]">{l.text}</span>{l.hl && <span className="text-[#e4a54a]">{l.hl}</span>}</>}
                {l.comment && <span className="text-slate-500">{l.comment}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
          {lines > 0 && lines < TERMINAL_LINES.length && <span className="text-[#e4a54a] animate-blink">|</span>}
        </div>
      </div>
    </FadeUp>
  );
}

export function ProblemSolution() {
  const BEFORE = [
    'One agent, one vendor model, no switch',
    'Paste provider keys into chat to “just try” a model',
    'Orchestration burns a flagship on glue tokens',
    'A single window that only speaks one harness',
  ];
  const AFTER = [
    'Harness plane docks the agent you already run',
    'Keys stay out of chat — the catalog does not forward traffic',
    'Role routing: economy for orchestration, capable for planning',
    'Dock Cursor beside Codex. Memory stays with each thread',
  ];

  return (
    <div className="max-w-[1120px] mx-auto px-5 md:px-8 pb-24">
      <FadeUp>
        <div className="kicker mb-3">The difference</div>
        <h2 className="font-display text-4xl md:text-6xl font-medium tracking-[-0.03em] mb-12">Two planes, one machine</h2>
      </FadeUp>
      <div className="grid md:grid-cols-2 gap-12 md:gap-16">
        <div>
          <div className="kicker mb-5">One harness</div>
          <div className="flex flex-col gap-4">
            {BEFORE.map((b) => (
              <div key={b} className="flex items-start gap-3 border-t border-[#1c160f]/10 dark:border-[#e4a54a]/15 pt-4">
                <X size={14} className="mt-0.5 shrink-0 text-[#8a8175]" />
                <span className="text-sm text-[#6d6458] dark:text-[#a39b90] leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="kicker mb-5">The switch</div>
          <div className="flex flex-col gap-4">
            {AFTER.map((b) => (
              <div key={b} className="flex items-start gap-3 border-t border-[#e4a54a]/40 pt-4">
                <Check size={14} className="mt-0.5 shrink-0 text-[#e4a54a]" />
                <span className="text-sm text-[#1c160f] dark:text-[#f6f1e7] leading-relaxed">{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
