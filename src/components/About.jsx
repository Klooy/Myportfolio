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
    <div
      id="about"
      className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-white font-montserrat relative"
    >
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <h4 className="text-center mb-2 text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
        Introducción
      </h4>
      <h2 className="text-center text-5xl font-bold text-[#1f2937] dark:text-white mb-16">
        Sobre mí
      </h2>

      <div className="flex w-full flex-col lg:flex-row items-center gap-20 my-16">
        {/* Imagen de perfil mejorada */}
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

        {/* Descripción mejorada */}
        <div className="flex-1">
          <p className="mb-10 max-w-2xl text-lg text-[#1f2937]/80 dark:text-gray-300 leading-relaxed">
            Soy{" "}
            <span className="text-[#2563eb] dark:text-[#60a5fa] font-bold text-xl">Michael Felipe Corrales Flórez</span>,
            <span className="font-semibold"> Ingeniero de Sistemas</span> con experiencia en desarrollo de aplicaciones web
            utilizando tecnologías Microsoft como C#, ASP.NET MVC, .NET Core y SQL Server.
            Tengo habilidades en diseño de soluciones eficientes, integración de APIs RESTful, análisis de datos,
            ciberseguridad y desarrollo con React, Node.js y Python.
          </p>

          {/* Secciones de información mejoradas */}
          <ul className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mb-10">
            {data.map((item) => (
              <li
                key={item.name}
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
            ))}
          </ul>

          {/* Herramientas mejoradas */}
          <div>
            <h4 className="mb-4 text-[#2563eb] dark:text-[#60a5fa] font-bold text-lg">
              Herramientas que utilizo
            </h4>
            <ul className="flex flex-wrap items-center gap-3 sm:gap-4">
              {tools.map((tool) => (
                <li
                  key={tool.name}
                  className="group flex items-center justify-center w-14 sm:w-16 aspect-square bg-gradient-to-br from-[#2563eb]/10 to-[#60a5fa]/10 dark:from-[#2563eb]/20 dark:to-[#60a5fa]/20 border-2 border-[#2563eb]/20 dark:border-[#60a5fa]/30 rounded-xl cursor-pointer hover:-translate-y-2 hover:shadow-xl hover:border-[#2563eb]/50 dark:hover:border-[#60a5fa]/50 duration-300 transform group-hover:scale-110"
                  title={tool.name}
                >
                  <div className="text-xl group-hover:scale-125 transition">
                    {tool.icon}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
