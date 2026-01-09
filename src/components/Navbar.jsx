import { useEffect, useRef, useState } from 'react';

export default function Navbar() {
  const sideMenuRef = useRef();
  const navRef = useRef();
  const navLinkRef = useRef();
  const [isDark, setIsDark] = useState(false);

  const openMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(-16rem)';
  }

  const closeMenu = () => {
    sideMenuRef.current.style.transform = 'translateX(16rem)';
  }

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.theme = 'dark';
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.theme = 'light';
    }
  }

  useEffect(() => {
    // Detectar tema del sistema y preferencias guardadas
    const initializeTheme = () => {
      let shouldBeDark = false;

      // Verificar si hay una preferencia guardada
      if (localStorage.theme === 'dark') {
        shouldBeDark = true;
      } else if (localStorage.theme === 'light') {
        shouldBeDark = false;
      } else {
        // Si no hay preferencia guardada, detectar del sistema
        shouldBeDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      }

      setIsDark(shouldBeDark);

      if (shouldBeDark) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    initializeTheme();

    // Escuchar cambios en el tema del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemThemeChange = (e) => {
      // Solo cambiar si no hay preferencia guardada
      if (!localStorage.theme) {
        setIsDark(e.matches);
        if (e.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    };

    // Listener para cambios del sistema
    mediaQuery.addEventListener('change', handleSystemThemeChange);

    return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        navRef.current.classList.add('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:bg-darkTheme', 'dark:shadow-white/20');
        navLinkRef.current.classList.remove('bg-white', 'shadow-sm', 'bg-opacity-50', 'dark:border', 'dark:border-white/30', "dark:bg-transparent");
      } else {
        navRef.current.classList.remove('bg-white', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:bg-darkTheme', 'dark:shadow-white/20');
        navLinkRef.current.classList.add('bg-white', 'shadow-sm', 'bg-opacity-50', 'dark:border', 'dark:border-white/30', "dark:bg-transparent");
      }
    }

    window.addEventListener('scroll', handleScroll);

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <nav ref={navRef} className="w-full fixed px-5 lg:px-8 xl:px-[8%] py-4 flex items-center justify-between z-50 font-montserrat">

        {/* Logo */}
        <a href="#" className="flex-shrink-0">
          <img src="./assets/logo.png" alt="Logo" className="w-20 sm:w-24 lg:w-28 cursor-pointer dark:hidden" />
          <img src="./assets/logo_dark.png" alt="Logo" className="w-20 sm:w-24 lg:w-28 cursor-pointer hidden dark:block" />
        </a>

        {/* Menú principal */}
        <ul ref={navLinkRef} className="hidden md:flex items-center gap-4 lg:gap-8 rounded-full px-6 lg:px-12 py-2 lg:py-3 bg-white shadow-sm bg-opacity-50 dark:border dark:border-white/30 dark:bg-transparent text-sm lg:text-base">
          <li><a className='hover:text-gray-500 dark:hover:text-gray-300 transition' href="#top">Inicio</a></li>
          <li><a className='hover:text-gray-500 dark:hover:text-gray-300 transition' href="#about">Sobre mí</a></li>
          <li><a className='hover:text-gray-500 dark:hover:text-gray-300 transition' href="#services">Servicios</a></li>
          <li><a className='hover:text-gray-500 dark:hover:text-gray-300 transition' href="#work">Proyectos</a></li>
          <li><a className='hover:text-gray-500 dark:hover:text-gray-300 transition' href="#contact">Contacto</a></li>
        </ul>

        {/* Botones y menú móvil */}
        <div className="flex items-center gap-2 sm:gap-4">

          {/* Cambiar tema */}
          <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition">
            <img src="./assets/moon_icon.png" alt="" className="w-4 sm:w-5 dark:hidden" />
            <img src="./assets/sun_icon.png" alt="" className="w-4 sm:w-5 hidden dark:block" />
          </button>

          {/* Botón de contacto */}
          <a href="#contact" className="hidden lg:flex items-center gap-2 px-6 lg:px-8 py-2 text-sm border border-gray-300 hover:bg-slate-100/70 dark:hover:bg-darkHover rounded-full dark:border-white/30 transition">
            Contactar
            <img src="./assets/arrow-icon.png" alt="" className="w-3 dark:hidden" />
            <img src="./assets/arrow-icon-dark.png" alt="" className="w-3 hidden dark:block" />
          </a>

          {/* Botón menú móvil */}
          <button className="block md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-white/10 transition" onClick={openMenu}>
            <img src="./assets/menu-black.png" alt="" className="w-6 dark:hidden" />
            <img src="./assets/menu-white.png" alt="" className="w-6 hidden dark:block" />
          </button>

        </div>

        {/* Menú móvil */}
        <ul ref={sideMenuRef} className="flex md:hidden flex-col gap-6 py-24 px-6 sm:px-10 fixed -right-64 sm:-right-80 top-0 bottom-0 w-64 sm:w-80 z-50 h-screen bg-rose-50 transition duration-500 font-montserrat dark:bg-darkHover dark:text-white text-lg">
          <div className="absolute right-4 sm:right-6 top-4 sm:top-6 cursor-pointer hover:opacity-70 transition" onClick={closeMenu}>
            <img src="./assets/close-black.png" alt="" className="w-5 dark:hidden" />
            <img src="./assets/close-white.png" alt="" className="w-5 hidden dark:block" />
          </div>
          <li><a href="#top" onClick={closeMenu} className="hover:text-gray-600 dark:hover:text-gray-300 transition">Inicio</a></li>
          <li><a href="#about" onClick={closeMenu} className="hover:text-gray-600 dark:hover:text-gray-300 transition">Sobre mí</a></li>
          <li><a href="#services" onClick={closeMenu} className="hover:text-gray-600 dark:hover:text-gray-300 transition">Servicios</a></li>
          <li><a href="#work" onClick={closeMenu} className="hover:text-gray-600 dark:hover:text-gray-300 transition">Mis proyectos</a></li>
          <li><a href="#contact" onClick={closeMenu} className="hover:text-gray-600 dark:hover:text-gray-300 transition">Contáctame</a></li>
        </ul>

      </nav>
    </>
  );
}
