import './App.css';
import { ScrollProgress, Particles, Nav, Hero, TerminalDemo, ProblemSolution } from './SectionsTop';
import { InAction, HowItWorks, Architecture, RoleDag, FaqSection, Cta, Footer } from './SectionsBottom';
import { ThemeProvider } from './ThemeContext';

function Landing() {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-space overflow-x-hidden bg-white text-slate-800 dark:bg-[#0c0d12] dark:text-slate-200 transition-colors">
        <ScrollProgress />
        <div className="fixed inset-0 z-0 bg-grid" />
        <div className="fixed z-0 w-[700px] h-[700px] rounded-full blur-[140px] opacity-12 pointer-events-none -top-[300px] -left-[200px] bg-[#e4a54a]/40 dark:bg-[#e4a54a]/25 animate-float" />
        <div className="fixed z-0 w-[700px] h-[700px] rounded-full blur-[140px] opacity-12 pointer-events-none -bottom-[300px] -right-[200px] bg-orange-300/50 dark:bg-[#e4a54a]/15 animate-float-reverse" />
        <Particles />
        <div className="relative z-[1]">
          <Nav />
          <Hero />
          <div className="relative z-10 bg-white dark:bg-[#0c0d12] transition-colors">
            <Architecture />
            <RoleDag />
            <TerminalDemo />
            <ProblemSolution />
            <InAction />
            <HowItWorks />
            <FaqSection />
            <Cta />
            <Footer />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

function App() {
  return <Landing />;
}

export default App;
