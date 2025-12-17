import { useEffect } from 'react'
import Charts from './components/Charts'
import Footer from './components/Footer'
import GenderGapFAQ from './components/GenderGapFAQ'
import Header from './components/Header'
import Hero from './components/Hero'
import Insights from './components/Insights'
import Stats from './components/Stats'

function App() {

  useEffect(() => {
    const handleLoad = () => document.body.classList.remove("preload");
    window.addEventListener("load", handleLoad);
    return () => window.removeEventListener("load", handleLoad);
  }, []);

  return (
    <div>
      <Header />
      <Hero />
      <Stats />
      <GenderGapFAQ />
      <Charts />
      <Insights />
      <Footer />
    </div>
  )
}

export default App
