import { useEffect } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom'
import { Footer, Header } from './components/Shell'
import { useHolds } from './store/useHolds'
import { useBenang, attachBenangBus } from './store/useBenang'
import { Home } from './routes/Home'
import { Tempah } from './routes/Tempah'
import { Pakej, PakejDetail } from './routes/Pakej'
import { Dewan } from './routes/Dewan'
import { Kalendar } from './routes/Kalendar'
import { Tempahan } from './routes/Tempahan'
import { Benang } from './routes/Benang'
import { GiftPage } from './routes/GiftPage'
import { Hubungi } from './routes/Hubungi'
import { NotFound } from './routes/NotFound'

function ScrollTop() {
  const { pathname } = useLocation()
  useEffect(() => window.scrollTo(0, 0), [pathname])
  return null
}

export function App() {
  useEffect(() => {
    // Stores hydrate synchronously at creation (localStorage is sync), so by
    // the time this runs the persisted draft is already in place and seeding
    // cannot race a write from another tab.
    useHolds.getState().seed()
    useBenang.getState().seed()
    return attachBenangBus()
  }, [])

  return (
    <BrowserRouter>
      <ScrollTop />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tempah" element={<Tempah />} />
            <Route path="/pakej" element={<Pakej />} />
            <Route path="/pakej/:slug" element={<PakejDetail />} />
            <Route path="/dewan" element={<Dewan />} />
            <Route path="/kalendar" element={<Kalendar />} />
            <Route path="/tempahan/:ref" element={<Tempahan />} />
            <Route path="/benang" element={<Benang />} />
            <Route path="/b/:kod" element={<GiftPage />} />
            <Route path="/hubungi" element={<Hubungi />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}
