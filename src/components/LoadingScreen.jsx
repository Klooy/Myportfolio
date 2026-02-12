import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LoadingScreen() {
    const [isLoading, setIsLoading] = useState(true);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        // Verificar si ya se mostró el loading en esta sesión
        const hasShownLoading = sessionStorage.getItem('hasShownLoading');

        if (hasShownLoading) {
            setIsLoading(false);
            return;
        }

        // Simular progreso de carga
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        setIsLoading(false);
                        sessionStorage.setItem('hasShownLoading', 'true');
                    }, 500);
                    return 100;
                }
                return prev + 10;
            });
        }, 150);

        return () => clearInterval(interval);
    }, []);

    if (!isLoading) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#1f2937]"
            >
                {/* Logo animado */}
                <motion.div
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="mb-8"
                >
                    <motion.div
                        animate={{
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-20 sm:w-24 h-20 sm:h-24 rounded-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] p-1"
                    >
                        <div className="w-full h-full rounded-full bg-white dark:bg-[#1f2937] flex items-center justify-center">
                            <span className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-[#2563eb] to-[#60a5fa] bg-clip-text text-transparent">
                                MC
                            </span>
                        </div>
                    </motion.div>
                </motion.div>

                {/* Texto de carga */}
                <motion.h2
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-xl sm:text-2xl font-bold text-[#1f2937] dark:text-white mb-8"
                >
                    Cargando portafolio...
                </motion.h2>

                {/* Barra de progreso */}
                <div className="w-48 sm:w-64 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.3 }}
                        className="h-full bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-full"
                    />
                </div>

                {/* Porcentaje */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-4 text-sm text-gray-600 dark:text-gray-400 font-semibold"
                >
                    {progress}%
                </motion.p>

                {/* Partículas decorativas */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            initial={{
                                x: Math.random() * window.innerWidth,
                                y: window.innerHeight + 50,
                                opacity: 0
                            }}
                            animate={{
                                y: -50,
                                opacity: [0, 1, 0]
                            }}
                            transition={{
                                duration: Math.random() * 3 + 2,
                                repeat: Infinity,
                                delay: Math.random() * 2
                            }}
                            className="absolute w-2 h-2 bg-[#2563eb] dark:bg-[#60a5fa] rounded-full"
                        />
                    ))}
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
