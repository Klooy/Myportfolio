import { Code2, Layout, Globe } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from './ScrollReveal';
import ParallaxBackground from './ParallaxBackground';

export default function Services() {

  const services = [
    {
      number: "01",
      name: "Desarrollo Web Full Stack",
      icon: <Layout className="w-10 h-10" />,
      description:
        "Desarrollo de aplicaciones web completas con C#, ASP.NET MVC, .NET Core, React y Node.js, integrando bases de datos SQL Server y PostgreSQL.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      number: "02",
      name: "Análisis de Datos",
      icon: <Code2 className="w-10 h-10" />,
      description:
        "Creación de informes y dashboards interactivos con Excel avanzado, Power BI y SQL. Gestión y optimización de bases de datos para análisis estadístico.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      number: "03",
      name: "Soporte TI y Ciberseguridad",
      icon: <Globe className="w-10 h-10" />,
      description:
        "Mantenimiento preventivo/correctivo, monitoreo de sistemas, protección de datos personales e implementación de controles de seguridad informática.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
  ];

  return (
    <ParallaxBackground>
      <section
        id="services"
        className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-gray-200 transition-colors duration-500 font-montserrat relative"
      >
        {/* Encabezado */}
        <ScrollReveal animation="slideDown" delay={0.1}>
          <h4 className="text-center mb-2 text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
            Servicios que ofrezco
          </h4>
        </ScrollReveal>
        <ScrollReveal animation="slideDown" delay={0.2}>
          <h2 className="text-center text-5xl mb-16 font-bold">
            Mis Servicios
          </h2>
        </ScrollReveal>

        {/* Contenedor principal */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-12">
          {/* Sección de servicios */}
          <div className="flex flex-col gap-6 w-full max-w-2xl">
            {services.map((service, index) => (
              <ScrollReveal key={index} animation="slideRight" delay={0.3 + index * 0.15}>
                <motion.div
                  className={`group relative flex gap-6 p-6 rounded-2xl ${service.bgColor} cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-[#2563eb]/30 overflow-hidden`}
                  whileHover={{ scale: 1.05, y: -8 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* Número decorativo grande en el fondo */}
                  <div className="absolute -right-4 -top-4 text-[120px] font-black text-[#2563eb]/5 dark:text-[#60a5fa]/5 select-none pointer-events-none">
                    {service.number}
                  </div>

                  {/* Número pequeño en la esquina superior izquierda */}
                  <div className={`absolute top-4 left-4 text-2xl font-bold bg-gradient-to-r ${service.color} bg-clip-text text-transparent`}>
                    {service.number}
                  </div>

                  {/* Icono */}
                  <motion.div
                    className={`flex items-center justify-center p-4 rounded-xl bg-gradient-to-br ${service.color} text-white flex-shrink-0 shadow-lg mt-8`}
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.6 }}
                  >
                    {service.icon}
                  </motion.div>

                  {/* Contenido */}
                  <div className="flex-1 mt-8">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                      {service.name}
                    </h3>
                    <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                      {service.description}
                    </p>
                  </div>

                  {/* Efecto de brillo en hover */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </motion.div>
              </ScrollReveal>
            ))}
          </div>

          {/* Imagen lateral con parallax */}
          <ScrollReveal animation="slideLeft" delay={0.5}>
            <motion.div
              className="relative hidden md:block"
              whileHover={{ scale: 1.05, rotate: 2 }}
              transition={{ duration: 0.3 }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-2xl blur-xl opacity-30 group-hover:opacity-50 transition"></div>
              <img
                src="./assets/img-service.png"
                alt="Servicios de desarrollo web"
                className="relative max-w-md w-full rounded-2xl shadow-2xl select-none"
              />
            </motion.div>
          </ScrollReveal>
        </div>
      </section>
    </ParallaxBackground>
  );
}
