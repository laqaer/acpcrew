import { motion } from 'framer-motion';
import {
  Menu, MessageSquare, CalendarDays, BookOpen, Box, Settings,
  PanelLeft, MoreVertical, Plus, ChevronDown, ChevronRight, Search, ListFilter,
  History, Sparkles, Mic, ArrowUp, FolderOpen, GitMerge, Bell, Route,
} from 'lucide-react';

// Ink + copper factory paint — fixed colors so this mock matches the
// dashboard even when the landing page is in light mode. No `dark:` variants.
const C = {
  bg: '#0c0d12',
  panel: '#14151c',
  railBg: '#0c0d12',
  border: '#27272a',
  borderSoft: '#1e2029',
  textStrong: '#fafafa',
  text: '#e4e4e7',
  muted: '#a1a1aa',
  mutedSoft: '#71717a',
  accent: '#e4a54a',
  accentBg: 'rgba(228,165,74,0.16)',
  pill: '#16171f',
};

const RAIL = [
  { icon: MessageSquare, active: true, dot: true },
  { icon: Route },
  { icon: CalendarDays },
  { gap: true, icon: BookOpen },
];

const SWITCH = [
  {
    plane: 'Harness',
    sub: 'auto',
    rows: [
      { name: 'Codex', state: 'docked' },
      { name: 'Claude', state: 'docked' },
      { name: 'Cursor', state: '—' },
    ],
  },
  {
    plane: 'Model',
    sub: 'sidecar optional',
    rows: [
      { name: 'orchestration', state: 'economy' },
      { name: 'planning', state: 'capable' },
      { name: 'execution', state: 'standard' },
    ],
  },
];

const SESSIONS = [
  { time: '12:39 PM', title: 'Route orchestration to an economy model', preview: 'Orchestration stays on an economy class…' },
  { time: '12:33 PM', title: 'Dock Codex and apply the role DAG', preview: 'junction router plan — orchestration → planning → execution' , active: true },
  { time: '12:22 PM', title: 'Sidecar health when the model plane is down', preview: 'Gateway still serves chat; catalog degrades honestly…' },
  { time: 'Thu 09:19 PM', title: 'Attach a local ACP runtime', preview: 'agent.acp_backend is auto; vendor CLIs optional…' },
];

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1 px-2 h-6 rounded-md text-[10px] font-medium"
      style={{ background: C.pill, color: C.muted, border: `1px solid ${C.border}` }}>
      {children}
    </span>
  );
}

export function AppPreview() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.8, duration: 0.8, ease: [0.32, 0.72, 0, 1] }}
      className="max-w-[1120px] mx-auto px-4 pb-20"
    >
      {/* Window frame */}
      <div className="rounded-xl overflow-hidden shadow-2xl"
        style={{ background: C.bg, border: `1px solid ${C.border}`, boxShadow: '0 40px 120px rgba(0,0,0,0.45), 0 0 0 1px rgba(255,255,255,0.04)' }}>
        {/* macOS title bar */}
        <div className="flex items-center gap-2 px-3.5 h-7 shrink-0" style={{ background: '#101118', borderBottom: `1px solid ${C.border}` }}>
          <span className="w-3 h-3 rounded-full" style={{ background: '#ff5f57' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#febc2e' }} />
          <span className="w-3 h-3 rounded-full" style={{ background: '#28c840' }} />
        </div>

        {/* Top bar */}
        <div className="flex items-center justify-between h-[46px] px-3" style={{ background: C.bg, borderBottom: `1px solid ${C.border}` }}>
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-md flex items-center justify-center" style={{ background: '#e4a54a' }}>
              <GitMerge size={14} style={{ color: '#0c0d12' }} />
            </div>
            <span className="text-[13px] font-bold tracking-[.08em]" style={{ color: C.textStrong }}>JUNCTION</span>
          </div>
          <div className="hidden lg:flex items-center gap-1.5">
            <Pill>Planes</Pill>
            <span className="w-1.5 h-1.5 rounded-full mx-0.5" style={{ background: '#22c55e' }} />
            <span className="relative inline-flex">
              <Pill><Bell size={10} /></Pill>
            </span>
            <Pill>Role DAG</Pill>
            <Pill><Box size={10} /> Terminal</Pill>
            <Pill>sidecar optional</Pill>
          </div>
        </div>

        {/* Body: rail | sidebar | content */}
        <div className="grid grid-cols-1 md:grid-cols-[52px_268px_1fr]" style={{ height: 470 }}>
          {/* Nav rail */}
          <div className="hidden md:flex flex-col items-center pt-2 pb-3 gap-1" style={{ background: C.railBg, borderRight: `1px solid ${C.borderSoft}` }}>
            <div className="w-8 h-8 flex items-center justify-center" style={{ color: C.mutedSoft }}><Menu size={15} /></div>
            {RAIL.map((r, i) => (
              <div key={i} className={`relative w-8 h-8 rounded-lg flex items-center justify-center ${r.gap ? 'mt-3' : ''}`}
                style={{ color: r.active ? C.accent : C.muted, background: r.active ? C.accentBg : 'transparent' }}>
                <r.icon size={15} />
                {r.dot && <span className="absolute top-1 right-1.5 w-1.5 h-1.5 rounded-full" style={{ background: C.accent }} />}
              </div>
            ))}
            <div className="flex-1" />
            <div className="w-8 h-8 flex items-center justify-center" style={{ color: C.muted }}><Settings size={15} /></div>
          </div>

          {/* Session sidebar */}
          <div className="hidden md:flex flex-col m-2 rounded-xl overflow-hidden" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
            {/* Header */}
            <div className="flex items-center justify-between px-2.5 h-11 shrink-0">
              <div className="flex items-center gap-2">
                <PanelLeft size={14} style={{ color: C.mutedSoft }} />
                <span className="text-[11px] font-semibold tracking-[.05em]" style={{ color: C.muted }}>SWITCH</span>
              </div>
              <div className="flex items-center gap-1.5">
                <MoreVertical size={13} style={{ color: C.mutedSoft }} />
                <div className="flex items-center rounded-md overflow-hidden" style={{ background: C.accent }}>
                  <span className="flex items-center gap-1 pl-1.5 pr-2 h-6 text-[11px] font-semibold" style={{ color: '#0c0d12' }}><Plus size={11} /> New chat</span>
                  <span className="w-px h-3.5" style={{ background: 'rgba(12,13,18,.3)' }} />
                  <span className="px-1 h-6 flex items-center" style={{ color: '#0c0d12' }}><ChevronDown size={11} /></span>
                </div>
              </div>
            </div>
            {/* Search */}
            <div className="px-2.5 pb-2 shrink-0">
              <div className="flex items-center gap-1.5 px-2 h-7 rounded-md" style={{ background: C.panel, border: `1px solid ${C.border}` }}>
                <Search size={11} style={{ color: C.mutedSoft }} />
                <span className="text-[11px] flex-1" style={{ color: C.mutedSoft }}>Search sessions...</span>
                <span className="relative">
                  <ListFilter size={12} style={{ color: C.muted }} />
                  <span className="absolute -top-1.5 -right-1.5 w-3 h-3 rounded-full text-[7px] font-bold flex items-center justify-center text-white" style={{ background: C.accent }}>1</span>
                </span>
              </div>
            </div>
            {/* Planes switchboard + sessions */}
            <div className="flex-1 overflow-hidden px-1.5">
              {SWITCH.map(block => (
                <div key={block.plane} className="mb-1.5">
                  <div className="flex items-center gap-1.5 px-1.5 h-7 rounded">
                    <Route size={11} style={{ color: C.accent }} />
                    <span className="text-[11px] flex-1 truncate font-medium" style={{ color: C.textStrong }}>{block.plane}</span>
                    <span className="text-[10px]" style={{ color: C.muted }}>{block.sub}</span>
                  </div>
                  {block.rows.map(row => (
                    <div key={row.name} className="flex items-center gap-1.5 pl-5 pr-1.5 h-6 rounded">
                      <ChevronRight size={10} style={{ color: C.mutedSoft }} />
                      <span className="text-[11px] flex-1 truncate" style={{ color: C.text }}>{row.name}</span>
                      <span className="text-[10px]" style={{ color: row.state === 'docked' ? C.accent : C.muted }}>{row.state}</span>
                    </div>
                  ))}
                </div>
              ))}
              <div className="mt-1.5 space-y-0.5">
                {SESSIONS.map((s, i) => (
                  <div key={i} className="px-2 py-1.5 rounded-lg" style={s.active ? { background: C.accentBg, boxShadow: `inset 2px 0 0 ${C.accent}` } : undefined}>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-semibold" style={{ color: C.accent }}>loop</span>
                      <span className="text-[10px] ml-auto" style={{ color: C.muted }}>{s.time}</span>
                    </div>
                    <div className="text-[11px] font-semibold leading-tight truncate mt-0.5" style={{ color: C.textStrong }}>{s.title}</div>
                    <div className="text-[10px] leading-tight truncate" style={{ color: C.muted }}>{s.preview}</div>
                  </div>
                ))}
              </div>
            </div>
            {/* Footer */}
            <div className="flex items-center gap-1.5 px-3 h-9 shrink-0" style={{ borderTop: `1px solid ${C.borderSoft}`, color: C.muted }}>
              <GitMerge size={11} /> <span className="text-[11px]">Two planes, one switch</span>
            </div>
          </div>

          {/* Main content */}
          <div className="hidden md:flex flex-col min-w-0" style={{ background: C.bg }}>
            <div className="flex-1 overflow-hidden px-6 py-4">
              {/* collapsible session header */}
              <div className="flex items-center gap-2 mb-4">
                <ChevronDown size={13} style={{ color: C.muted }} />
                <span className="text-[12px] font-mono font-semibold" style={{ color: C.textStrong }}>Pull latest mainline with changes</span>
              </div>
              {/* assistant text */}
              <p className="text-[12px] leading-relaxed mb-3" style={{ color: C.text }}>
                Studied the two planes and applied the role DAG — orchestration on
                an economy class, planning on a capable model, execution on the
                standard class that still lands the patch.
              </p>
              {/* user bubble */}
              <div className="flex justify-end mb-3">
                <div className="max-w-[78%] px-3 py-2 rounded-2xl text-[12px]" style={{ background: C.panel, border: `1px solid ${C.border}`, color: C.text }}>
                  Point execution at the economy model and keep the sidecar optional.
                </div>
              </div>
              {/* worked through steps */}
              <div className="flex items-center gap-1.5 mb-3 text-[11px]" style={{ color: C.muted }}>
                <ChevronRight size={11} /> Worked through 12 steps
              </div>
              {/* dev server line */}
              <p className="text-[12px] mb-3" style={{ color: C.text }}>
                Dev server is running at <span style={{ color: C.accent }}>http://127.0.0.1:5174/</span>
              </p>
              {/* diff block */}
              <div className="rounded-lg overflow-hidden text-[11px] font-mono" style={{ border: `1px solid ${C.border}` }}>
                <div className="px-3 py-1.5" style={{ background: C.panel, borderBottom: `1px solid ${C.border}`, color: C.muted }}>diff — role DAG</div>
                <div className="px-3 py-2" style={{ background: '#14151c' }}>
                  <div style={{ color: C.mutedSoft }}>@@ orchestration → planning → execution @@</div>
                  <div style={{ color: '#e4a54a' }}>+ role_models.orchestration = economy</div>
                  <div style={{ color: '#e4a54a' }}>+ role_models.planning = capable</div>
                  <div style={{ color: C.muted }}>  sidecar optional; keys stay off chat</div>
                </div>
              </div>
            </div>

            {/* Input bar */}
            <div className="px-4 pb-2 shrink-0">
              <div className="rounded-2xl px-3 py-2.5" style={{ background: C.bg, border: `1px solid ${C.border}` }}>
                <div className="text-[12px] mb-2.5" style={{ color: C.mutedSoft }}>Message Junction... <span style={{ color: C.mutedSoft }}>(/command · @file · $skill)</span></div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2" style={{ color: C.muted }}>
                    <Plus size={14} />
                    <History size={13} />
                    <span className="text-[10px] font-semibold flex items-center gap-1" style={{ color: C.accent }}>LOCAL</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mic size={14} style={{ color: C.muted }} />
                    <Sparkles size={14} style={{ color: C.muted }} />
                    <span className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: C.accent }}>
                      <ArrowUp size={13} className="text-white" />
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom shelf */}
            <div className="flex items-center gap-2 px-4 pb-2.5 shrink-0 text-[11px] font-mono" style={{ color: C.muted }}>
              <span className="flex items-center gap-1.5">
                <span className="w-0.5 h-3 rounded-full" style={{ background: C.accent }} /> loop
              </span>
              <span className="flex items-center gap-1"><FolderOpen size={11} /> my-project</span>
              <span className="ml-auto flex items-center gap-2">
                <span className="w-10 h-1 rounded-full" style={{ background: `linear-gradient(90deg, ${C.accent}, ${C.accentBg})` }} />
                auto <span style={{ color: C.mutedSoft }}>·</span> loopback
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
