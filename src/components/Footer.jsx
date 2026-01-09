import { Linkedin, Facebook, Instagram, Github } from "lucide-react";

export default function Footer() {
  return (
    <footer className="mt-20 text-[#1f2937] dark:text-white font-sans">
      {/* Logo */}
      <div className="text-center">
        <img src="./assets/logo.png" alt="Logo" className="w-36 mx-auto mb-2 dark:hidden" />
        <img src="./assets/logo_dark.png" alt="Logo" className="w-36 mx-auto mb-2 hidden dark:block" />

        {/* Email */}
        <div className="w-max flex items-center gap-2 mx-auto mb-4">
          <img src="./assets/mail_icon.png" alt="Correo" className="w-5 dark:hidden" />
          <img src="./assets/mail_icon_dark.png" alt="Correo" className="w-5 hidden dark:block" />
          <a href="mailto:mfcorrales26@gmail.com" className="hover:underline">
            mfcorrales26@gmail.com
          </a>
        </div>

        {/* Redes sociales */}
        <div className="flex items-center justify-center gap-6">
          <a href="https://www.linkedin.com/in/mfcorrales/" target="_blank" rel="noopener noreferrer">
            <Linkedin className="w-6 h-6 hover:text-[#0077B5] transition-colors" />
          </a>
          <a href="https://www.facebook.com/michael.corrales.863615/" target="_blank" rel="noopener noreferrer">
            <Facebook className="w-6 h-6 hover:text-[#1877F2] transition-colors" />
          </a>
          <a href="https://github.com/Klooy" target="_blank" rel="noopener noreferrer">
            <Github className="w-6 h-6 hover:text-[#333] dark:hover:text-white transition-colors" />
          </a>
          <a href="https://www.instagram.com/mc_klooy/" target="_blank" rel="noopener noreferrer">
            <Instagram className="w-6 h-6 hover:text-[#C13584] transition-colors" />
          </a>
        </div>
      </div>

      {/* Pie de página */}
      <div className="text-center sm:flex items-center justify-between border-t border-gray-400 mx-[10%] mt-12 py-3">
        <p>
          © {new Date().getFullYear()} <a href="https://my-portfolio-mc.netlify.app/" className="hover:underline">Michael Felipe Corrales Flórez</a>. Todos los derechos reservados.
        </p>
      </div>
    </footer>
  );
}
