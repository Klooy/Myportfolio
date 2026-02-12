import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Award, Users, Briefcase, TrendingUp } from 'lucide-react';

export default function Stats() {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.3,
    });

    const stats = [
        {
            icon: <Briefcase className="w-8 h-8" />,
            value: 5,
            suffix: '+',
            label: 'Años de Experiencia',
            color: 'from-blue-500 to-cyan-500'
        },
        {
            icon: <Award className="w-8 h-8" />,
            value: 15,
            suffix: '+',
            label: 'Proyectos Completados',
            color: 'from-purple-500 to-pink-500'
        },
        {
            icon: <Users className="w-8 h-8" />,
            value: 10,
            suffix: '+',
            label: 'Clientes Satisfechos',
            color: 'from-orange-500 to-red-500'
        },
        {
            icon: <TrendingUp className="w-8 h-8" />,
            value: 100,
            suffix: '%',
            label: 'Tasa de Éxito',
            color: 'from-green-500 to-emerald-500'
        }
    ];

    return (
        <section className="w-full px-[5%] sm:px-[8%] md:px-[12%] py-16 text-[#1f2937] dark:text-white font-montserrat relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 opacity-10">
                <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {stats.map((stat, index) => (
                    <StatCard
                        key={index}
                        stat={stat}
                        index={index}
                        inView={inView}
                    />
                ))}
            </div>
        </section>
    );
}

function StatCard({ stat, index, inView }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        if (inView) {
            let start = 0;
            const end = stat.value;
            const duration = 2000; // 2 segundos
            const increment = end / (duration / 16); // 60fps

            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setCount(end);
                    clearInterval(timer);
                } else {
                    setCount(Math.floor(start));
                }
            }, 16);

            return () => clearInterval(timer);
        }
    }, [inView, stat.value]);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
            transition={{ duration: 0.6, delay: index * 0.1 }}
            className="group relative"
        >
            {/* Card */}
            <div className="relative bg-white/80 dark:bg-white/5 backdrop-blur-sm border-2 border-gray-200 dark:border-white/10 rounded-2xl p-6 hover:shadow-2xl hover:border-[#2563eb]/50 dark:hover:border-[#60a5fa]/50 transition-all duration-500 hover:-translate-y-2">

                {/* Icono con gradiente */}
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${stat.color} text-white mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {stat.icon}
                </div>

                {/* Número animado */}
                <div className="mb-2">
                    <span className={`text-4xl md:text-5xl font-bold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {count}{stat.suffix}
                    </span>
                </div>

                {/* Label */}
                <p className="text-sm md:text-base text-[#1f2937]/70 dark:text-gray-300 font-medium">
                    {stat.label}
                </p>

                {/* Efecto de brillo en hover */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
            </div>
        </motion.div>
    );
}
