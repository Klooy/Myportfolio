import { lazy, Suspense } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CustomCursor from './components/CustomCursor'
import LenisScroll from './components/LenisScroll'
import Navbar from './components/Navbar'
import Header from './components/Header'
import LoadingScreen from './components/LoadingScreen'

// Lazy loading de componentes pesados
const About = lazy(() => import('./components/About'))
const Stats = lazy(() => import('./components/Stats'))
const Services = lazy(() => import('./components/Services'))
const Work = lazy(() => import('./components/Work'))
const Certifications = lazy(() => import('./components/Certifications'))
const Contact = lazy(() => import('./components/Contact'))
const Footer = lazy(() => import('./components/Footer'))
const InvoicingModule = lazy(() => import('./modules/invoicing/pages/InvoicingModule'))

// Loading fallback component
function LoadingFallback() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="relative">
                <div className="w-16 h-16 border-4 border-[#2563eb]/20 border-t-[#2563eb] rounded-full animate-spin"></div>
                <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-t-[#60a5fa] rounded-full animate-spin" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
            </div>
        </div>
    )
}

export default function App() {
    return (
        <>
            <LoadingScreen />
            <BrowserRouter>
                <Routes>
                    {/* Ruta principal - Portfolio */}
                    <Route path="/" element={
                        <>
                            <CustomCursor />
                            <LenisScroll />
                            <Navbar />
                            <Header />
                            <Suspense fallback={<LoadingFallback />}>
                                <About />
                                <Stats />
                                <Services />
                                <Work />
                                <Certifications />
                                <Contact />
                                <Footer />
                            </Suspense>
                        </>
                    } />

                    {/* Ruta de Facturación Electrónica */}
                    <Route path="/facturas" element={
                        <Suspense fallback={<LoadingFallback />}>
                            <InvoicingModule />
                        </Suspense>
                    } />
                </Routes>
            </BrowserRouter>
        </>
    )
}