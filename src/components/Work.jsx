import React from "react";
import { ExternalLink, X, Github, Globe } from "lucide-react";

export default function Work() {

  const work = [
    {
      name: 'Cúspide Store',
      icon: './assets/cuspidestore.png',
      description: 'E-commerce React + Supabase',
      fullDescription: 'Plataforma de e-commerce completa desarrollada con React y Supabase. Incluye gestión de productos, carrito de compras, autenticación de usuarios y procesamiento de pedidos en tiempo real.',
      technologies: ['React', 'Supabase', 'TailwindCSS', 'JavaScript'],
      features: [
        'Catálogo de productos dinámico',
        'Carrito de compras interactivo',
        'Autenticación de usuarios',
        'Panel de administración',
        'Base de datos en tiempo real'
      ],
      demo: 'https://cuspide-store-demo.vercel.app/',
      github: 'https://github.com/Klooy/cuspide-store',
    },
    {
      name: 'CaféGest',
      icon: './assets/cafegest.png',
      description: 'Sistema de Gestión Cafetera',
      fullDescription: 'Sistema web completo para la gestión integral de parcelas cafeteras. Desarrollado para el control detallado de producción, ventas e insumos. Incluye dashboard interactivo, control de recolección, facturación y gestión de inventarios con persistencia local.',
      technologies: ['HTML5', 'CSS3', 'JavaScript ES6+', 'LocalStorage', 'Chart.js', 'JSPDF'],
      features: [
        'Dashboard interactivo con estadísticas',
        'Módulo de recolección y pagos',
        'Facturación y control de ventas',
        'Gestión de inventario de insumos',
        'Exportación a Excel y PDF'
      ],
      demo: 'https://sistema-parcela.netlify.app/menu.html',
      github: 'https://github.com/Klooy/sistema-cafetera',
    },
    {
      name: 'Portfolio Desktop',
      icon: './assets/PortfolioTypeDeskopt.png',
      description: 'Portafolio Personal Interactivo',
      fullDescription: 'Portafolio moderno y responsivo diseñado con un enfoque mobile-first. Cuenta con detección automática de tema claro/oscuro, certificaciones interactivas con efecto 3D, y animaciones fluidas para una experiencia de usuario premium.',
      technologies: ['React 18', 'Vite', 'TailwindCSS', 'Lucide React', 'EmailJS', 'Web3Forms'],
      features: [
        'Certificaciones interactivas 3D',
        'Tema claro/oscuro automático',
        'Formulario de contacto funcional',
        'Diseño responsive y optimizado',
        'Animaciones y efectos visuales'
      ],
      demo: 'https://my-portfolio-mc.netlify.app/',
      github: 'https://github.com/Klooy/portfolio-desktop',
    },
    {
      name: 'Pasarela Store',
      icon: './assets/pasarela.webp',
      description: 'E-commerce de Moda en Producción',
      fullDescription: 'Plataforma de comercio electrónico completa para venta de calzado en producción real. Integra pagos con ADDI (financiación), gestión de inventario complejo (talla/color), panel administrativo avanzado y notificaciones automáticas. Optimizada para SEO y experiencia de usuario.',
      technologies: ['React 18', 'Vite 7', 'Supabase', 'TailwindCSS 3', 'Redux Toolkit', 'ADDI Payments'],
      features: [
        'Integración pagos ADDI (Cuotas sin tarjeta)',
        'Gestión de stock multinivel (Color/Talla)',
        'Panel administrativo protegido y completo',
        'Notificaciones automáticas (EmailJS/Web3Forms)',
        'Marketing: Carruseles programables',
        'SEO y Meta Tags dinámicos'
      ],
      demo: 'https://pasarela-store.vercel.app/',
      github: 'https://github.com/Klooy/PASARELA-STORE',
    }
  ];

  const [stopScroll, setStopScroll] = React.useState(false);
  const [selectedProject, setSelectedProject] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [activeFilter, setActiveFilter] = React.useState('Todos');
  const [currentIndex, setCurrentIndex] = React.useState(0);

  // Extraer todas las tecnologías únicas
  const allTechnologies = ['Todos', ...new Set(work.flatMap(project => project.technologies))];

  // Filtrar proyectos según la tecnología seleccionada
  const filteredWork = activeFilter === 'Todos'
    ? work
    : work.filter(project => project.technologies.includes(activeFilter));

  const openModal = (project) => {
    setSelectedProject(project);
    setIsModalOpen(true);
    document.body.style.overflow = 'hidden'; // Prevent background scroll
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProject(null);
    document.body.style.overflow = 'unset';
  };

  return (
    <>
      <style>{`

        .marquee-inner {
          animation: marqueeScroll linear infinite;
        }

        @keyframes marqueeScroll {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }

        .modal-enter {
          animation: modalEnter 0.3s ease-out;
        }

        @keyframes modalEnter {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Mejorar scroll en el modal */
        .modal-scroll-content {
          -webkit-overflow-scrolling: touch; /* Scroll suave en iOS */
          overscroll-behavior: contain; /* Prevenir scroll del fondo */
          scroll-behavior: smooth; /* Scroll suave */
        }

        /* Personalizar scrollbar para mejor UX */
        .modal-scroll-content::-webkit-scrollbar {
          width: 8px;
        }

        .modal-scroll-content::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 4px;
        }

        .modal-scroll-content::-webkit-scrollbar-thumb {
          background: rgba(37, 99, 235, 0.5);
          border-radius: 4px;
        }

        .modal-scroll-content::-webkit-scrollbar-thumb:hover {
          background: rgba(37, 99, 235, 0.7);
        }

        /* Scrollbar para tema oscuro */
        .dark .modal-scroll-content::-webkit-scrollbar-thumb {
          background: rgba(96, 165, 250, 0.5);
        }

        .dark .modal-scroll-content::-webkit-scrollbar-thumb:hover {
          background: rgba(96, 165, 250, 0.7);
        }

        /* Animaciones para el caso de éxito */
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.6),
                        0 0 40px rgba(255, 215, 0, 0.4),
                        inset 0 0 10px rgba(255, 215, 0, 0.3);
          }
          50% {
            box-shadow: 0 0 30px rgba(255, 215, 0, 0.8),
                        0 0 60px rgba(255, 215, 0, 0.6),
                        inset 0 0 15px rgba(255, 215, 0, 0.5);
          }
        }

        @keyframes shimmer {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes badge-pulse {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }

        .success-case-border {
          animation: pulse-glow 3s ease-in-out infinite;
        }

        .success-badge {
          background: linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%);
          background-size: 200% 200%;
          animation: shimmer 3s linear infinite, badge-pulse 2s ease-in-out infinite;
        }

        .success-ribbon {
          position: relative;
          overflow: hidden;
        }

        .success-ribbon::before {
          content: '';
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent);
          animation: ribbon-shine 3s ease-in-out infinite;
        }

        @keyframes ribbon-shine {
          0% {
            left: -100%;
          }
          50%, 100% {
            left: 100%;
          }
        }
      `}</style>

      <div
        id="work"
        className="w-full px-[12%] py-10 scroll-mt-20 text-[#1f2937] dark:text-white transition-colors duration-500"
      >
        <h4 className="text-center mb-2 text-lg text-[#2563eb] dark:text-[#60a5fa]">
          Mi portafolio
        </h4>
        <h2 className="text-center text-5xl mb-5 font-semibold">
          Proyectos Destacados
        </h2>
        <p className="text-center max-w-2xl mx-auto mb-12 text-[#1f2937]/80 dark:text-gray-300">
          Bienvenido a mi portafolio de desarrollo web. Explora una colección de
          proyectos que reflejan mi experiencia y crecimiento en el desarrollo
          front-end.
        </p>

        {/* Filtros por tecnología - Mobile First */}
        <div className="mb-8 max-w-4xl mx-auto">
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
            {allTechnologies.map((tech) => (
              <button
                key={tech}
                onClick={() => {
                  setActiveFilter(tech);
                  setCurrentIndex(0);
                }}
                className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 transform hover:scale-105 ${activeFilter === tech
                  ? 'bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white shadow-lg shadow-[#2563eb]/50'
                  : 'bg-gray-100 dark:bg-white/5 text-[#1f2937] dark:text-white border-2 border-gray-200 dark:border-white/10 hover:border-[#2563eb]/50'
                  }`}
              >
                {tech}
              </button>
            ))}
          </div>

          {/* Contador de proyectos */}
          <p className="text-center mt-4 text-sm text-gray-600 dark:text-gray-400">
            Mostrando <span className="font-bold text-[#2563eb] dark:text-[#60a5fa]">{filteredWork.length}</span> {filteredWork.length === 1 ? 'proyecto' : 'proyectos'}
          </p>
        </div>

        {/* Indicadores de progreso (dots) - Mobile Friendly */}
        {filteredWork.length > 1 && (
          <div className="flex justify-center gap-2 mb-6">
            {filteredWork.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-2 h-2 sm:w-3 sm:h-3 rounded-full transition-all duration-300 ${index === currentIndex % filteredWork.length
                  ? 'bg-[#2563eb] dark:bg-[#60a5fa] w-6 sm:w-8'
                  : 'bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500'
                  }`}
                aria-label={`Ir al proyecto ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Carrusel horizontal */}
        <div
          className="overflow-hidden w-full relative max-w-6xl mx-auto"
          onMouseEnter={() => setStopScroll(true)}
          onMouseLeave={() => setStopScroll(false)}
        >
          <div
            className="marquee-inner flex w-fit"
            style={{
              animationPlayState: stopScroll ? "paused" : "running",
              animationDuration: filteredWork.length * 2500 + "ms"
            }}
          >
            <div className="flex">
              {[...filteredWork, ...filteredWork].map((project, index) => (
                <div
                  key={index}
                  onClick={() => openModal(project)}
                  className={`w-56 mx-4 h-[20rem] relative group rounded-lg overflow-hidden shadow-lg cursor-pointer transition-all duration-300 ${project.name === 'Pasarela Store'
                    ? 'border-4 border-[#FFD700] success-case-border'
                    : ''
                    }`}
                  style={{
                    backgroundImage: `url(${project.icon})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {/* Badge de Caso de Éxito */}
                  {project.name === 'Pasarela Store' && (
                    <div className="absolute top-0 right-0 z-20">
                      <div className="success-badge success-ribbon text-[#8c2238] text-xs font-bold px-4 py-2 rounded-bl-lg shadow-lg">
                        <span className="relative z-10 flex items-center gap-1">
                          <span className="text-base">★</span>
                          <span className="font-extrabold tracking-wide">CASO DE ÉXITO</span>
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Overlay mejorado para Pasarela Store */}
                  <div className={`absolute bottom-0 left-0 w-full h-full flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 px-4 ${project.name === 'Pasarela Store'
                    ? 'bg-gradient-to-t from-[#8c2238]/90 via-[#8c2238]/70 to-transparent'
                    : 'bg-black/20'
                    }`}>
                    <h3 className="font-semibold text-lg text-white text-center">
                      {project.name}
                    </h3>
                    <p className="text-sm text-white/80 text-center">
                      {project.description}
                    </p>
                    <p className={`text-xs text-center mt-2 ${project.name === 'Pasarela Store'
                      ? 'text-[#FFD700] font-semibold'
                      : 'text-white/60'
                      }`}>
                      {project.name === 'Pasarela Store' ? '🛍️ En Producción Real' : 'Click para ver detalles'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Gradientes para los bordes */}
          <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white dark:from-[#0f172a] to-transparent" />
          <div className="absolute right-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-l from-white dark:from-[#0f172a] to-transparent" />
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedProject && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={closeModal}
        >
          <div
            className="modal-enter bg-white dark:bg-[#1e293b] rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header con imagen - Fixed */}
            <div className="relative h-64 rounded-t-2xl overflow-hidden flex-shrink-0">
              <img
                src={selectedProject.icon}
                alt={selectedProject.name}
                className="w-full h-full object-cover"
              />
              <div className={`absolute inset-0 ${selectedProject.name === 'Pasarela Store'
                ? 'bg-gradient-to-t from-[#8c2238]/80 via-[#8c2238]/40 to-transparent'
                : 'bg-gradient-to-t from-black/60 to-transparent'
                }`} />

              {/* Badge de Caso de Éxito en el Modal */}
              {selectedProject.name === 'Pasarela Store' && (
                <div className="absolute top-4 left-4 z-20">
                  <div className="success-badge success-ribbon text-[#8c2238] text-sm font-bold px-5 py-2.5 rounded-lg shadow-2xl">
                    <span className="relative z-10 flex items-center gap-2">
                      <span className="text-xl">★</span>
                      <span className="font-extrabold tracking-wide">CASO DE ÉXITO</span>
                      <span className="text-xs bg-[#8c2238] text-[#FFD700] px-2 py-0.5 rounded-full">EN PRODUCCIÓN</span>
                    </span>
                  </div>
                </div>
              )}

              {/* Botón cerrar */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition text-white z-20"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Título sobre la imagen */}
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className={`text-3xl font-bold mb-1 ${selectedProject.name === 'Pasarela Store'
                  ? 'text-[#FFD700] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]'
                  : 'text-white'
                  }`}>
                  {selectedProject.name}
                </h2>
                <p className="text-white/90 text-sm">
                  {selectedProject.description}
                </p>
              </div>
            </div>

            {/* Contenido Scrollable */}
            <div className="modal-scroll-content overflow-y-auto flex-1 p-6 space-y-6">
              {/* Alerta especial para Pasarela Store */}
              {selectedProject.name === 'Pasarela Store' && (
                <div className="bg-gradient-to-r from-[#8c2238]/10 via-[#FFD700]/10 to-[#8c2238]/10 border-2 border-[#FFD700]/50 rounded-xl p-4">
                  <div className="flex items-start gap-3">
                    <span className="text-2xl">🎯</span>
                    <div>
                      <h4 className="font-bold text-[#8c2238] dark:text-[#FFD700] mb-1">Proyecto en Producción Real</h4>
                      <p className="text-sm text-[#1f2937]/80 dark:text-gray-300">
                        Esta plataforma está actualmente en operación, procesando ventas reales y sirviendo a clientes en Colombia.
                        Incluye integración completa con pasarela de pagos ADDI para financiación sin tarjeta.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Métricas de impacto solo para Pasarela Store */}
              {selectedProject.name === 'Pasarela Store' && (
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gradient-to-br from-[#8c2238]/5 to-[#8c2238]/10 dark:from-[#8c2238]/20 dark:to-[#8c2238]/30 rounded-lg p-4 text-center border border-[#FFD700]/30">
                    <div className="text-2xl font-bold text-[#8c2238] dark:text-[#FFD700]">100%</div>
                    <div className="text-xs text-[#1f2937]/70 dark:text-gray-400 mt-1">Funcional</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#8c2238]/5 to-[#8c2238]/10 dark:from-[#8c2238]/20 dark:to-[#8c2238]/30 rounded-lg p-4 text-center border border-[#FFD700]/30">
                    <div className="text-2xl font-bold text-[#8c2238] dark:text-[#FFD700]">ADDI</div>
                    <div className="text-xs text-[#1f2937]/70 dark:text-gray-400 mt-1">Pagos</div>
                  </div>
                  <div className="bg-gradient-to-br from-[#8c2238]/5 to-[#8c2238]/10 dark:from-[#8c2238]/20 dark:to-[#8c2238]/30 rounded-lg p-4 text-center border border-[#FFD700]/30">
                    <div className="text-2xl font-bold text-[#8c2238] dark:text-[#FFD700]">24/7</div>
                    <div className="text-xs text-[#1f2937]/70 dark:text-gray-400 mt-1">Disponible</div>
                  </div>
                </div>
              )}

              {/* Descripción completa */}
              <div>
                <h3 className={`text-xl font-semibold mb-2 ${selectedProject.name === 'Pasarela Store'
                  ? 'text-[#8c2238] dark:text-[#FFD700]'
                  : 'text-[#1f2937] dark:text-white'
                  }`}>
                  Descripción
                </h3>
                <p className="text-[#1f2937]/80 dark:text-gray-300 leading-relaxed">
                  {selectedProject.fullDescription}
                </p>
              </div>

              {/* Tecnologías */}
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${selectedProject.name === 'Pasarela Store'
                  ? 'text-[#8c2238] dark:text-[#FFD700]'
                  : 'text-[#1f2937] dark:text-white'
                  }`}>
                  Tecnologías
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedProject.technologies.map((tech, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1 rounded-full text-sm font-medium ${selectedProject.name === 'Pasarela Store'
                        ? 'bg-[#8c2238]/10 dark:bg-[#FFD700]/10 text-[#8c2238] dark:text-[#FFD700] border border-[#FFD700]/30'
                        : 'bg-[#2563eb]/10 dark:bg-[#60a5fa]/10 text-[#2563eb] dark:text-[#60a5fa]'
                        }`}
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Características */}
              <div>
                <h3 className={`text-xl font-semibold mb-3 ${selectedProject.name === 'Pasarela Store'
                  ? 'text-[#8c2238] dark:text-[#FFD700]'
                  : 'text-[#1f2937] dark:text-white'
                  }`}>
                  Características Principales
                </h3>
                <ul className="space-y-2">
                  {selectedProject.features.map((feature, idx) => (
                    <li
                      key={idx}
                      className="flex items-start text-[#1f2937]/80 dark:text-gray-300"
                    >
                      <span className={`mr-2 font-bold ${selectedProject.name === 'Pasarela Store'
                        ? 'text-[#8c2238] dark:text-[#FFD700]'
                        : 'text-[#2563eb] dark:text-[#60a5fa]'
                        }`}>✓</span>
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botones de acción */}
              <div className="flex flex-col gap-3 pt-4">
                {/* Botón especial para Pasarela Store */}
                {selectedProject.name === 'Pasarela Store' && (
                  <div className="space-y-3">
                    <a
                      href="https://pasarela-store.vercel.app/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-[#8c2238] via-[#a82d4a] to-[#8c2238] hover:from-[#671929] hover:via-[#8c2238] hover:to-[#671929] text-white rounded-xl transition-all duration-300 font-bold shadow-xl hover:shadow-2xl hover:scale-[1.02] border-2 border-[#FFD700]/30"
                      style={{
                        backgroundSize: '200% 100%',
                        animation: 'shimmer 3s linear infinite'
                      }}
                    >
                      <Globe className="w-6 h-6" />
                      <span className="text-lg">🛍️ Visitar Tienda en Producción</span>
                      <ExternalLink className="w-5 h-5" />
                    </a>
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#FFD700] text-[#8c2238] dark:text-[#FFD700] hover:bg-[#FFD700]/10 rounded-lg transition-all duration-300 font-semibold hover:scale-[1.02]"
                    >
                      <Github className="w-5 h-5" />
                      Ver Código Fuente
                    </a>
                  </div>
                )}

                {/* Botones estándar (Ocultos para Pasarela Store) */}
                {selectedProject.name !== 'Pasarela Store' && (
                  <div className="flex flex-col sm:flex-row gap-3">
                    <a
                      href={selectedProject.demo}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-[#2563eb] hover:bg-[#1d4ed8] text-white rounded-lg transition font-medium"
                    >
                      <Globe className="w-5 h-5" />
                      Ver Demo
                    </a>
                    <a
                      href={selectedProject.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 border-2 border-[#2563eb] dark:border-[#60a5fa] text-[#2563eb] dark:text-[#60a5fa] hover:bg-[#2563eb]/10 dark:hover:bg-[#60a5fa]/10 rounded-lg transition font-medium"
                    >
                      <Github className="w-5 h-5" />
                      Ver Código
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
