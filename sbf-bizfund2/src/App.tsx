import Nav from './components/Nav';
import Hero from './components/Hero';
import AssessmentWizard from './components/wizard/AssessmentWizard';
import Framework from './components/Framework';
import ReportPreview from './components/ReportPreview';
import About from './components/About';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <AssessmentWizard />
        <Framework />
        <ReportPreview />
        <About />
      </main>
      <Footer />
    </>
  );
}
