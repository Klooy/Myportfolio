import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

export default function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Detectar si es móvil
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768 || 'ontouchstart' in window);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        if (isMobile) return;

        const updatePosition = (e) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        // Detectar hover en elementos interactivos
        const handleMouseOver = (e) => {
            const target = e.target;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.style.cursor === 'pointer' ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(true);
            }
        };

        const handleMouseOut = (e) => {
            const target = e.target;
            if (
                target.tagName === 'A' ||
                target.tagName === 'BUTTON' ||
                target.closest('a') ||
                target.closest('button') ||
                target.style.cursor === 'pointer' ||
                target.classList.contains('cursor-pointer')
            ) {
                setIsHovering(false);
            }
        };

        window.addEventListener('mousemove', updatePosition);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('mouseover', handleMouseOver);
        document.addEventListener('mouseout', handleMouseOut);

        return () => {
            window.removeEventListener('mousemove', updatePosition);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
            window.removeEventListener('resize', checkMobile);
            document.removeEventListener('mouseover', handleMouseOver);
            document.removeEventListener('mouseout', handleMouseOut);
        };
    }, [isMobile]);

    if (isMobile) return null;

    return (
        <>
            {/* Cursor principal */}
            <motion.div
                className="custom-cursor"
                animate={{
                    x: position.x - 10,
                    y: position.y - 10,
                    scale: isClicking ? 0.8 : isHovering ? 1.5 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 500,
                    damping: 28,
                    mass: 0.5
                }}
            />

            {/* Cursor secundario (efecto trail) */}
            <motion.div
                className="custom-cursor-trail"
                animate={{
                    x: position.x - 4,
                    y: position.y - 4,
                    scale: isClicking ? 0.5 : isHovering ? 2 : 1,
                }}
                transition={{
                    type: "spring",
                    stiffness: 150,
                    damping: 20,
                    mass: 0.8
                }}
            />

            <style>{`
        .custom-cursor,
        .custom-cursor-trail {
          position: fixed;
          pointer-events: none;
          z-index: 9999;
          border-radius: 50%;
          mix-blend-mode: difference;
        }

        .custom-cursor {
          width: 20px;
          height: 20px;
          border: 2px solid #2563eb;
          background: transparent;
        }

        .custom-cursor-trail {
          width: 8px;
          height: 8px;
          background: #60a5fa;
          opacity: 0.6;
        }

        /* Ocultar cursor nativo en elementos interactivos */
        body {
          cursor: none;
        }

        a, button, [role="button"], .cursor-pointer {
          cursor: none !important;
        }

        @media (max-width: 768px) {
          body {
            cursor: auto;
          }
          
          a, button, [role="button"], .cursor-pointer {
            cursor: pointer !important;
          }
        }
      `}</style>
        </>
    );
}
