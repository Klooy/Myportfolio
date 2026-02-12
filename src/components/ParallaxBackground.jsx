import { useEffect, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

/**
 * Componente para agregar efecto parallax a los fondos decorativos
 */
export default function ParallaxBackground({ children, className = '' }) {
    const { scrollY } = useScroll();
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Transformaciones para diferentes elementos
    const y1 = useTransform(scrollY, [0, windowHeight * 2], [0, -100]);
    const y2 = useTransform(scrollY, [0, windowHeight * 2], [0, 100]);
    const opacity = useTransform(scrollY, [0, windowHeight], [0.3, 0.1]);

    return (
        <div className={`relative ${className}`}>
            {/* Círculos con parallax */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl"
                />
                <motion.div
                    style={{ y: y2, opacity }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl"
                />
            </div>

            {children}
        </div>
    );
}

/**
 * Versión específica para diferentes colores
 */
export function ParallaxBackgroundGreen({ children, className = '' }) {
    const { scrollY } = useScroll();
    const [windowHeight, setWindowHeight] = useState(0);

    useEffect(() => {
        setWindowHeight(window.innerHeight);
        const handleResize = () => setWindowHeight(window.innerHeight);
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const y1 = useTransform(scrollY, [0, windowHeight * 2], [0, -80]);
    const y2 = useTransform(scrollY, [0, windowHeight * 2], [0, 80]);
    const opacity = useTransform(scrollY, [0, windowHeight], [0.3, 0.1]);

    return (
        <div className={`relative ${className}`}>
            <div className="absolute inset-0 -z-10 overflow-hidden">
                <motion.div
                    style={{ y: y1, opacity }}
                    className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#10b981] rounded-full mix-blend-multiply filter blur-3xl"
                />
                <motion.div
                    style={{ y: y2, opacity }}
                    className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#34d399] rounded-full mix-blend-multiply filter blur-3xl"
                />
            </div>

            {children}
        </div>
    );
}
