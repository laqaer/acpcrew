import './App.css';
import { ScrollProgress, Nav, Hero, TerminalDemo, ProblemSolution } from './SectionsTop';
import { InAction, HowItWorks, Architecture, RoleDag, FaqSection, Cta, Footer } from './SectionsBottom';
import { ThemeProvider } from './ThemeContext';

function Landing() {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-space overflow-x-hidden bg-[#f3eee4] text-[#1c160f] dark:bg-[#0c0d12] dark:text-[#e7e2d8]">
        <ScrollProgress />
        <div className="fixed inset-0 z-0 rail-field pointer-events-none" />
        <div className="relative z-[1]">
          <Nav />
          <Hero />
          <div className="relative z-10">
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
