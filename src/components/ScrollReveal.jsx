import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

/**
 * Componente wrapper para animaciones de entrada al hacer scroll
 * @param {Object} props
 * @param {React.ReactNode} props.children - Contenido a animar
 * @param {'fade'|'slideUp'|'slideDown'|'slideLeft'|'slideRight'|'scale'|'rotate'} props.animation - Tipo de animación
 * @param {number} props.delay - Delay en segundos
 * @param {number} props.duration - Duración en segundos
 */
export default function ScrollReveal({
    children,
    animation = 'slideUp',
    delay = 0,
    duration = 0.6,
    className = ''
}) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    const animations = {
        fade: {
            initial: { opacity: 0 },
            animate: { opacity: 1 }
        },
        slideUp: {
            initial: { opacity: 0, y: 60 },
            animate: { opacity: 1, y: 0 }
        },
        slideDown: {
            initial: { opacity: 0, y: -60 },
            animate: { opacity: 1, y: 0 }
        },
        slideLeft: {
            initial: { opacity: 0, x: 60 },
            animate: { opacity: 1, x: 0 }
        },
        slideRight: {
            initial: { opacity: 0, x: -60 },
            animate: { opacity: 1, x: 0 }
        },
        scale: {
            initial: { opacity: 0, scale: 0.8 },
            animate: { opacity: 1, scale: 1 }
        },
        rotate: {
            initial: { opacity: 0, rotate: -10, scale: 0.9 },
            animate: { opacity: 1, rotate: 0, scale: 1 }
        }
    };

    const selectedAnimation = animations[animation] || animations.slideUp;

    return (
        <motion.div
            ref={ref}
            initial={selectedAnimation.initial}
            animate={inView ? selectedAnimation.animate : selectedAnimation.initial}
            transition={{
                duration,
                delay,
                ease: [0.25, 0.1, 0.25, 1] // Easing suave
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}

/**
 * Componente para animar listas con efecto stagger (escalonado)
 */
export function ScrollRevealList({ children, staggerDelay = 0.1, animation = 'slideUp' }) {
    const [ref, inView] = useInView({
        triggerOnce: true,
        threshold: 0.1,
    });

    return (
        <div ref={ref}>
            {Array.isArray(children) ? (
                children.map((child, index) => (
                    <ScrollReveal
                        key={index}
                        animation={animation}
                        delay={index * staggerDelay}
                    >
                        {child}
                    </ScrollReveal>
                ))
            ) : (
                <ScrollReveal animation={animation}>
                    {children}
                </ScrollReveal>
            )}
        </div>
    );
}
