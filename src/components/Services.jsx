import { Code2, Layout, Globe } from "lucide-react";

export default function Services() {

  const services = [
    {
      name: "Desarrollo Web Full Stack",
      icon: <Layout className="w-10 h-10" />,
      description:
        "Desarrollo de aplicaciones web completas con C#, ASP.NET MVC, .NET Core, React y Node.js, integrando bases de datos SQL Server y PostgreSQL.",
      color: "from-blue-500 to-cyan-500",
      bgColor: "bg-blue-50 dark:bg-blue-950/20"
    },
    {
      name: "Análisis de Datos",
      icon: <Code2 className="w-10 h-10" />,
      description:
        "Creación de informes y dashboards interactivos con Excel avanzado, Power BI y SQL. Gestión y optimización de bases de datos para análisis estadístico.",
      color: "from-purple-500 to-pink-500",
      bgColor: "bg-purple-50 dark:bg-purple-950/20"
    },
    {
      name: "Soporte TI y Ciberseguridad",
      icon: <Globe className="w-10 h-10" />,
      description:
        "Mantenimiento preventivo/correctivo, monitoreo de sistemas, protección de datos personales e implementación de controles de seguridad informática.",
      color: "from-orange-500 to-red-500",
      bgColor: "bg-orange-50 dark:bg-orange-950/20"
    },
  ];

  return (
    <section
      id="services"
      className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-gray-200 transition-colors duration-500 font-montserrat relative"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      {/* Encabezado */}
      <h4 className="text-center mb-2 text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
        Servicios que ofrezco
      </h4>
      <h2 className="text-center text-5xl mb-16 font-bold">
        Mis Servicios
      </h2>

      {/* Contenedor principal */}
      <div className="flex flex-col md:flex-row items-center justify-center gap-12">
        {/* Sección de servicios */}
        <div className="flex flex-col gap-6 w-full max-w-2xl">
          {services.map((service, index) => (
            <div
              key={index}
              className={`group flex gap-6 p-6 rounded-2xl ${service.bgColor} cursor-pointer transition-all duration-500 hover:shadow-2xl transform hover:scale-105 hover:-translate-y-2 border border-transparent hover:border-[#2563eb]/30`}
            >
              <div className={`flex items-center justify-center p-4 rounded-xl bg-gradient-to-br ${service.color} text-white flex-shrink-0 shadow-lg`}>
                {service.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-xl font-bold mb-2 group-hover:text-[#2563eb] dark:group-hover:text-[#60a5fa] transition-colors">
                  {service.name}
                </h3>
                <p className="text-sm leading-6 text-gray-600 dark:text-gray-300">
                  {service.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Imagen lateral */}
        <div className="relative hidden md:block">
          <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-2xl blur-xl opacity-30"></div>
          <img
            src="./assets/img-service.png"
            alt="Servicios de desarrollo web"
            className="relative max-w-md w-full rounded-2xl shadow-2xl select-none"
          />
        </div>
      </div>
    </section>
  );
}


