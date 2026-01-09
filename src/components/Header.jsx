export default function Header() {
    return (
        <div className="w-11/12 max-w-3xl text-center mx-auto min-h-screen flex flex-col items-center justify-center gap-6 text-[#1f2937] dark:text-white font-montserrat relative overflow-hidden">
            {/* Fondo decorativo */}
            <div className="absolute inset-0 -z-10 opacity-30">
                <div className="absolute top-20 left-10 w-72 h-72 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl"></div>
                <div className="absolute bottom-20 right-10 w-72 h-72 bg-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl"></div>
            </div>

            {/* Imagen de perfil con efecto */}
            <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#2563eb] to-[#60a5fa] rounded-full blur-lg opacity-50 group-hover:opacity-75 transition"></div>
                <img 
                    src="./assets/profile-img.png" 
                    alt="Michael Felipe Corrales Flórez" 
                    className="relative rounded-full w-40 border-4 border-white dark:border-[#1f2937] shadow-2xl" 
                />
            </div>

            {/* Saludo */}
            <h3 className="flex items-end gap-2 text-xl md:text-2xl text-[#2563eb] dark:text-[#60a5fa] font-semibold">
                ¡Hola! Soy Michael Felipe Corrales Flórez
                <img src="./assets/hand-icon.png" alt="mano saludando" className="w-6 mb-1 animate-bounce" />
            </h3>

            {/* Descripción principal con gradiente */}
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-tight bg-gradient-to-r from-[#2563eb] via-[#1f2937] to-[#2563eb] dark:from-[#60a5fa] dark:via-white dark:to-[#60a5fa] bg-clip-text text-transparent">
                Ingeniero de Sistemas & Desarrollador Full Stack
            </h1>

            {/* Información adicional */}
            <p className="max-w-2xl mx-auto text-[#1f2937]/80 dark:text-gray-300 text-lg leading-relaxed">
                Especializado en soluciones web escalables con C#, ASP.NET, React, Node.js y Python. Creo aplicaciones modernas que transforman ideas en resultados.
            </p>

            {/* Botones mejorados */}
            <div className="flex flex-col sm:flex-row items-center gap-4 mt-8">
                <a
                    href="#contact"
                    className="group px-8 py-3 rounded-full bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-semibold flex items-center gap-2 hover:shadow-2xl hover:shadow-[#2563eb]/50 transition-all duration-300 transform hover:scale-105"
                >
                    Contáctame 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>

                <a
                    href="#work"
                    className="group px-8 py-3 rounded-full border-2 border-[#2563eb] text-[#2563eb] dark:text-[#60a5fa] dark:border-[#60a5fa] font-semibold hover:bg-[#2563eb]/10 dark:hover:bg-[#60a5fa]/10 flex items-center gap-2 transition-all duration-300 transform hover:scale-105"
                >
                    Ver proyectos 
                    <svg className="w-4 h-4 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                </a>
            </div>
        </div>
    )
}
