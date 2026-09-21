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

export function Particles() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {Array.from({ length: 25 }, (_, i) => (
        <div key={i} className="absolute bottom-0 w-[2px] h-[2px] rounded-full bg-[#e4a54a] opacity-40 dark:opacity-100 animate-rise"
          style={{ left: `${Math.random() * 100}%`, animationDelay: `${Math.random() * 20}s`, animationDuration: `${15 + Math.random() * 20}s` }} />
      ))}
    </div>
  );
}

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggle } = useTheme();
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);
  return (
    <motion.nav initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.5 }}
      className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between px-6 md:px-10 py-4 max-w-[1200px] mx-auto transition-all duration-300 ${scrolled ? 'bg-white/85 dark:bg-[#0c0d12]/85 backdrop-blur-xl border-b border-[#e4a54a]/10' : ''}`}>
      <a href="/" className="flex items-center gap-2 no-underline">
        <span className="w-8 h-8 rounded-lg bg-[#e4a54a]/15 border border-[#e4a54a]/30 flex items-center justify-center">
          <svg viewBox="0 0 24 24" className="w-[18px] h-[18px] text-[#e4a54a]" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M10 6v7.5c0 2.8 2.2 5 6 5" />
          </svg>
        </span>
        <span className="text-xl font-bold text-slate-900 dark:text-white font-space tracking-[0.18em] uppercase">
          Junction
        </span>
      </a>
      <div className="flex gap-1 items-center">
        {[['#architecture', 'Planes'], ['#roles', 'Routing'], ['#how-it-works', 'Install'], ['#faq', 'FAQ']].map(([href, label]) => (
          <a key={href} href={href} className="hidden md:block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 no-underline transition-all">{label}</a>
        ))}
        <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer" className="hidden md:block px-4 py-2 rounded-lg text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 no-underline transition-all">Source</a>
        <button onClick={toggle} className="p-2 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-black/5 dark:hover:bg-white/5 transition-all" aria-label="Toggle theme">
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <a href="#how-it-works" className="px-4 py-2 rounded-lg text-sm font-medium bg-[#e4a54a] text-[#0c0d12] hover:bg-[#f0b45a] no-underline transition-all">Install locally</a>
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
    <motion.section id="hero" ref={ref} style={{ y, opacity }} className="text-center pt-36 md:pt-40 pb-16 px-6 max-w-[900px] mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex gap-3 justify-center mb-8 flex-wrap">
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-green-500/8 text-green-600 dark:text-green-400 border border-green-500/20">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 dark:bg-green-400 animate-pulse-dot" /> Stay on loopback
        </span>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-[#e4a54a]/10 text-[#b07a28] dark:text-[#e4a54a] border border-[#e4a54a]/25">Dock agents</span>
        <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium bg-slate-500/8 text-slate-600 dark:text-slate-400 border border-slate-500/20">Route spend</span>
      </motion.div>
      <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.7 }}
        className="text-5xl md:text-7xl lg:text-8xl font-bold leading-[1.05] mb-6 animate-shimmer font-space">
        Where coding agents<br />meet the models you want.
      </motion.h1>
      <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
        className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-[640px] mx-auto mb-10 leading-relaxed font-space">
        A CLI is one harness talking to one vendor model. Junction is the local switch: dock the agent in one pane, pick what the tokens buy in the other. Memory and cron stay on your machine.
      </motion.p>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 }} className="flex gap-3 justify-center flex-wrap">
        <a href="#how-it-works" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold bg-[#e4a54a] text-[#0c0d12] shadow-[0_0_24px_rgba(228,165,74,0.35)] hover:-translate-y-0.5 transition-all no-underline font-space">Install locally</a>
        <a href="#architecture" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl text-[15px] font-semibold bg-slate-100 dark:bg-white/5 text-slate-800 dark:text-white border border-[#e4a54a]/15 hover:bg-slate-200 dark:hover:bg-white/8 hover:-translate-y-0.5 transition-all no-underline font-space">See the two planes</a>
      </motion.div>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}
        className="mt-6 text-sm text-slate-500 dark:text-slate-400 font-space">
        Loopback dashboard. Provider keys stay in the sidecar — never in chat.
      </motion.p>
      <motion.pre initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }}
        className="mt-8 text-left max-w-[560px] mx-auto bg-slate-100 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-xl px-4 py-3 font-mono text-[13px] text-[#e4a54a] leading-relaxed overflow-x-auto">
{`curl -fsSL https://raw.githubusercontent.com/laqaer/acpcrew/main/scripts/get-junction.sh | sh
junction setup && junction up`}
      </motion.pre>
      <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
        className="mt-3 text-xs text-slate-500 dark:text-slate-400 font-space">
        Tracks the default branch. Read the script before you run it. The dashboard binds to loopback on this machine.
      </motion.p>
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
    <FadeUp className="max-w-[720px] mx-auto mb-20 px-6">
      <div ref={ref} className="bg-slate-900 dark:bg-[#14151c] border border-[#e4a54a]/12 rounded-2xl overflow-hidden shadow-lg dark:shadow-[0_24px_80px_rgba(0,0,0,0.5),0_0_60px_rgba(228,165,74,0.08)]">
        <div className="flex items-center gap-2 px-4 py-3 bg-black/20 dark:bg-black/40 border-b border-[#e4a54a]/12">
          <div className="w-3 h-3 rounded-full bg-red-500" /><div className="w-3 h-3 rounded-full bg-[#e4a54a]" /><div className="w-3 h-3 rounded-full bg-green-500" />
          <span className="flex-1 text-center text-xs text-slate-400 font-mono">junction — planes</span>
        </div>
        <div className="p-6 font-mono text-[13.5px] leading-[1.8] min-h-[220px]">
          <AnimatePresence>
            {TERMINAL_LINES.slice(0, lines).map((l, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }}>
                {l.prompt && <><span className="text-green-400">$ </span><span className="text-slate-100">{l.text}</span></>}
                {!l.prompt && !l.comment && <><span className="text-[#e4a54a]">{l.text}</span>{l.hl && <span className="text-[#e4a54a]">{l.hl}</span>}</>}
                {l.comment && <span className="text-slate-500">{l.comment}</span>}
              </motion.div>
            ))}
          </AnimatePresence>
          {lines > 0 && lines < TERMINAL_LINES.length && <span className="text-green-400 animate-blink">|</span>}
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
    'Harness plane docks the agent; model plane routes inference',
    'Keys stay in the sidecar — never paste them into chat',
    'Role routing: economy for orchestration, capable for planning',
    'Dock Cursor beside Codex. Memory stays with each thread',
  ];

  return (
    <div className="max-w-[900px] mx-auto px-6 pb-20">
      <FadeUp><h2 className="text-center text-4xl md:text-5xl font-bold mb-16 font-space">Two planes, one machine</h2></FadeUp>
      <div className="space-y-3">
        {BEFORE.map((b, i) => (
          <FadeUp key={i} delay={i * 0.08}>
            <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 md:gap-6">
              <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.5 }}
                className="flex items-center gap-3 justify-end text-right">
                <span className="text-sm text-slate-500 leading-relaxed line-through decoration-rose-500/40">{b}</span>
                <span className="shrink-0 w-6 h-6 rounded-full bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400 text-xs font-bold"><X size={12} /></span>
              </motion.div>
              <motion.div initial={{ scaleY: 0 }} whileInView={{ scaleY: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.2, duration: 0.4 }}
                className="w-px h-10 bg-gradient-to-b from-rose-500/40 via-slate-300 dark:via-slate-600 to-green-500/40 origin-top" />
              <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 + 0.15, duration: 0.5 }}
                className="flex items-center gap-3">
                <span className="shrink-0 w-6 h-6 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center text-green-400 text-xs font-bold"><Check size={12} /></span>
                <span className="text-sm text-slate-800 dark:text-white leading-relaxed font-medium">{AFTER[i]}</span>
              </motion.div>
            </div>
          </FadeUp>
        ))}
      </div>
    </div>
  );
}
