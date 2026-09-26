import './App.css';
import { ScrollProgress, Nav, Hero, TerminalDemo, ProblemSolution } from './SectionsTop';
import { InAction, HowItWorks, Architecture, RoleDag, FaqSection, Cta, Footer } from './SectionsBottom';
import { ThemeProvider } from './ThemeContext';

function Landing() {
  return (
    <ThemeProvider>
      <div className="min-h-screen font-sans overflow-x-hidden bg-paper text-ink">
        <ScrollProgress />
        <div className="fixed inset-0 z-0 route-field pointer-events-none" />
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
