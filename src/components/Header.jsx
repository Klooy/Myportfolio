import React from 'react';
import { motion } from 'framer-motion';
import ParallaxBackground from './ParallaxBackground';
import ScrollReveal from './ScrollReveal';

export default function Header() {
    const [isHovered, setIsHovered] = React.useState(false);

    return (
        <ParallaxBackground className="w-full">
            <div className="w-11/12 max-w-3xl text-center mx-auto min-h-screen flex flex-col items-center justify-center gap-6 text-[#1f2937] dark:text-white font-montserrat relative overflow-hidden">

                {/* Imagen de perfil con efecto hover/touch */}
                <ScrollReveal animation="scale" delay={0.2}>
                    <div
                        className="relative group cursor-pointer"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                        onTouchStart={() => setIsHovered(true)}
                        onTouchEnd={() => setIsHovered(false)}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition"></div>
                        <img
                            src={isHovered ? "./assets/mishi.webp" : "./assets/profile-img.png"}
                            alt="Michael Felipe Corrales Flórez"
                            className="relative rounded-full w-40 border-4 border-white dark:border-[#1f2937] shadow-2xl transition-all duration-300 group-hover:scale-105"
                        />
                    </div>
                </ScrollReveal>

                {/* Saludo */}
                <ScrollReveal animation="slideUp" delay={0.3}>
                    <h3 className="flex items-end gap-2 text-xl md:text-2xl text-[#2563eb] dark:text-[#60a5fa] font-semibold">
                        ¡Hola! Soy Michael Felipe Corrales Flórez
                        <img src="./assets/hand-icon.png" alt="mano saludando" className="w-6 mb-1 animate-bounce" />
                    </h3>
                </ScrollReveal>

                {/* Descripción principal con gradiente animado */}
                <ScrollReveal animation="slideUp" delay={0.4}>
                    <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight">
                        <span className="bg-gradient-to-r from-[#2563eb] via-[#1f2937] to-[#2563eb] dark:from-[#60a5fa] dark:via-white dark:to-[#60a5fa] bg-clip-text text-transparent animate-gradient bg-[length:200%_auto]">
                            Ingeniero de Sistemas & Desarrollador Full Stack
                        </span>
                    </h1>
                </ScrollReveal>

                {/* Información adicional */}
                <ScrollReveal animation="slideUp" delay={0.5}>
                    <p className="max-w-2xl mx-auto text-[#1f2937]/80 dark:text-gray-300 text-lg leading-relaxed">
                        Especializado en soluciones web escalables con C#, ASP.NET, React, Node.js y Python. Creo aplicaciones modernas que transforman ideas en resultados.
                    </p>
                </ScrollReveal>

                {/* Botones mejorados con efecto breathing */}
                <ScrollReveal animation="slideUp" delay={0.6}>
                    <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                        <motion.a
                            href="#contact"
                            className="group px-8 py-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-semibold flex items-center gap-2 hover:shadow-2xl hover:shadow-[#2563eb]/50 transition-all duration-300 transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Contáctame
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </motion.a>

                        <motion.a
                            href="./assets/CV_MFCF.pdf"
                            download="CV_Michael_Felipe_Corrales.pdf"
                            className="group relative px-8 py-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-bold hover:from-[#1d4ed8] hover:to-[#2563eb] flex items-center gap-2 transition-all duration-300 transform hover:scale-110 hover:shadow-2xl hover:shadow-[#2563eb]/50 overflow-hidden"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            animate={{
                                boxShadow: [
                                    "0 0 0 0 rgba(37, 99, 235, 0)",
                                    "0 0 0 10px rgba(37, 99, 235, 0.1)",
                                    "0 0 0 0 rgba(37, 99, 235, 0)"
                                ]
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                                ease: "easeInOut"
                            }}
                        >
                            {/* Efecto de brillo */}
                            <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>

                            <svg className="w-5 h-5 group-hover:animate-bounce relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v16m0 0l-4-4m4 4l4-4M2 20h20" />
                            </svg>
                            <span className="relative z-10">Descargar CV</span>
                        </motion.a>

                        <motion.a
                            href="#work"
                            className="group px-8 py-3 rounded-full border-2 border-[#2563eb] text-[#2563eb] dark:text-[#60a5fa] dark:border-[#60a5fa] font-semibold hover:bg-[#2563eb]/10 dark:hover:bg-[#60a5fa]/10 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Ver proyectos
                            <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                        </motion.a>
                    </div>
                </ScrollReveal>

                {/* CSS para gradiente animado */}
                <style>{`
                    @keyframes gradient {
                        0% { background-position: 0% 50%; }
                        50% { background-position: 100% 50%; }
                        100% { background-position: 0% 50%; }
                    }
                    
                    .animate-gradient {
                        animation: gradient 8s ease infinite;
                    }
                `}</style>
            </div>
        </ParallaxBackground>
    )
}
