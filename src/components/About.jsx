import {
  Code2,
  GraduationCap,
  FolderCode,
  Atom,
  FileCode2,
  GitBranch,
  Server,
  Database,
  Github,
  Globe,
  Palette,
} from "lucide-react";
import ScrollReveal from './ScrollReveal';
import ParallaxBackground from './ParallaxBackground';

export default function About() {
  const data = [
    {
      name: "Lenguajes",
      icon: <Code2 className="w-7 h-7 text-[#2563eb]" />,
      description: "C#, ASP.NET, JavaScript, Python, Java, PHP",
    },
    {
      name: "Educación",
      icon: <GraduationCap className="w-7 h-7 text-[#2563eb]" />,
      description:
        "Ingeniero de Sistemas - Universidad de Pamplona. Diplomados en Minería de Datos y Protección de Datos.",
    },
    {
      name: "Proyectos",
      icon: <FolderCode className="w-7 h-7 text-[#2563eb]" />,
      description:
        "Sistema de Gestión Cafetera, Portafolio Desktop, Noticiero Digital y más proyectos web.",
    },
  ];

  const tools = [
    { name: "HTML", icon: <FileCode2 className="w-6 h-6 text-[#e34c26]" /> },
    { name: "CSS", icon: <Palette className="w-6 h-6 text-[#1572B6]" /> },
    { name: "JavaScript", icon: <Code2 className="w-6 h-6 text-[#f7df1e]" /> },
    { name: "C#", icon: <Code2 className="w-6 h-6 text-[#953DAC]" /> },
    { name: "ASP.NET", icon: <Globe className="w-6 h-6 text-[#512BD4]" /> },
    { name: "React", icon: <Atom className="w-6 h-6 text-[#61dafb]" /> },
    { name: "Vue", icon: <Atom className="w-6 h-6 text-[#42b883]" /> },
    { name: "Node.js", icon: <Server className="w-6 h-6 text-[#83cd29]" /> },
    { name: "SQL Server", icon: <Database className="w-6 h-6 text-[#CC2927]" /> },
    { name: "Supabase", icon: <Database className="w-6 h-6 text-[#3ECF8E]" /> },
    { name: "Git", icon: <GitBranch className="w-6 h-6 text-[#f1502f]" /> },
    { name: "GitHub", icon: <Github className="w-6 h-6 text-[#333] dark:text-white" /> },
  ];

  return (
    <ParallaxBackground>
      <div
        id="about"
        className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-white font-montserrat relative"
      >

        <ScrollReveal animation="slideDown" delay={0.1}>
          <h4 className="text-center mb-2 text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
            Introducción
          </h4>
        </ScrollReveal>
        <ScrollReveal animation="slideDown" delay={0.2}>
          <h2 className="text-center text-5xl font-bold text-[#1f2937] dark:text-white mb-16">
            Sobre mí
          </h2>
        </ScrollReveal>

        <div className="flex w-full flex-col lg:flex-row items-center gap-20 my-16">
          {/* Imagen de perfil mejorada */}
          <ScrollReveal animation="slideRight" delay={0.3}>
            <div className="max-w-max mx-auto relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-3xl blur-2xl opacity-40"></div>
              <img
                src="./assets/user-image.png"
                alt="Michael Felipe Corrales Flórez"
                className="relative w-64 sm:w-80 rounded-3xl max-w-none border-4 border-white dark:border-[#1f2937] shadow-2xl"
              />

              <div className="bg-gradient-to-br from-[#2563eb] to-[#1d4ed8] w-1/2 aspect-square absolute right-0 bottom-0 rounded-full translate-x-1/4 translate-y-1/3 shadow-2xl flex items-center justify-center border-4 border-white">
                <img
                  src="./assets/circular-text.png"
                  alt=""
                  className="w-full animate-spin_slow invert"
                />
                <Atom className="w-8 h-8 absolute text-white" />
              </div>
            </div>
          </ScrollReveal>

          {/* Descripción mejorada */}
          <div className="flex-1">
            <ScrollReveal animation="slideLeft" delay={0.4}>
              <p className="mb-10 max-w-2xl text-lg text-[#1f2937]/80 dark:text-gray-300 leading-relaxed">
                Soy{" "}
                <span className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-xl">Michael Felipe Corrales Flórez</span>,
                <span className="font-semibold"> Ingeniero de Sistemas</span> con experiencia en desarrollo de aplicaciones web
                utilizando tecnologías Microsoft como C#, ASP.NET MVC, .NET Core y SQL Server.
                Tengo habilidades en diseño de soluciones eficientes, integración de APIs RESTful, análisis de datos,
                ciberseguridad y desarrollo con React, Node.js y Python.
              </p>
            </ScrollReveal>

            {/* Botón descargar CV */}
            <ScrollReveal animation="scale" delay={0.5}>
              <a
                href="./assets/CV_MFCF.pdf"
                download="CV_Michael_Felipe_Corrales.pdf"
                className="group relative inline-flex items-center gap-2 px-8 py-4 mb-10 bg-gradient-to-r from-[#2563eb] via-[#1d4ed8] to-[#2563eb] text-white font-bold text-lg rounded-xl hover:shadow-2xl hover:shadow-[#2563eb]/60 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1 animate-pulse hover:animate-none overflow-hidden"
              >
                {/* Efecto de brillo animado */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></span>

                <svg className="w-6 h-6 group-hover:animate-bounce relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2v16m0 0l-4-4m4 4l4-4M2 20h20" />
                </svg>
                <span className="relative z-10">Descargar CV</span>

                {/* Brillo de fondo */}
                <span className="absolute inset-0 rounded-xl bg-[#2563eb] blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></span>
              </a>
            </ScrollReveal>

            {/* Secciones de información mejoradas */}
            <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mb-10">
              {data.map((item, index) => (
                <ScrollReveal key={item.name} animation="slideUp" delay={0.6 + index * 0.1}>
                  <li
                    className="group bg-gradient-to-br from-[#f0f9ff] to-[#eff6ff] dark:from-[#0f172a] dark:to-[#1e3a8a] border-2 border-[#2563eb]/20 dark:border-[#60a5fa]/30 rounded-2xl p-6 cursor-pointer hover:shadow-xl hover:border-[#2563eb]/50 dark:hover:border-[#60a5fa]/50 hover:-translate-y-2 transition-all duration-500"
                  >
                    <div className="text-3xl mb-3 group-hover:scale-110 transition">
                      {item.icon}
                    </div>
                    <h3 className="mb-2 font-bold text-[#2563eb] dark:text-[#60a5fa] text-lg">
                      {item.name}
                    </h3>
                    <p className="text-gray-600 text-sm dark:text-white/80 leading-relaxed">
                      {item.description}
                    </p>
                  </li>
                </ScrollReveal>
              ))}
            </ul>

            {/* Herramientas mejoradas */}
            <ScrollReveal animation="slideUp" delay={0.9}>
              <div>
                <h4 className="mb-4 text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg">
                  Herramientas que utilizo
                </h4>
                <ul className="flex flex-wrap items-center gap-3 sm:gap-4">
                  {tools.map((tool) => (
                    <li
                      key={tool.name}
                      className="group relative flex items-center justify-center w-14 sm:w-16 aspect-square bg-gradient-to-br from-[#2563eb]/10 to-[#60a5fa]/10 dark:from-[#2563eb]/20 dark:to-[#60a5fa]/20 border-2 border-[#2563eb]/20 dark:border-[#60a5fa]/30 rounded-xl cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:border-[#2563eb]/50 dark:hover:border-[#60a5fa]/50 duration-300 transform group-hover:scale-110"
                    >
                      <div className="text-xl group-hover:scale-125 transition">
                        {tool.icon}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#1f2937] dark:bg-white text-white dark:text-[#1f2937] px-3 py-1 rounded-lg text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
                        {tool.name}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </ParallaxBackground>
  );
}
