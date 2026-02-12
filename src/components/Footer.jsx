import { Linkedin, Facebook, Instagram, Github, Mail, Heart } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  const socialLinks = [
    {
      icon: <Linkedin className="w-6 h-6" />,
      url: "https://www.linkedin.com/in/mfcorrales/",
      color: "hover:text-[#0077B5]",
      label: "LinkedIn"
    },
    {
      icon: <Facebook className="w-6 h-6" />,
      url: "https://www.facebook.com/michael.corrales.863615/",
      color: "hover:text-[#1877F2]",
      label: "Facebook"
    },
    {
      icon: <Github className="w-6 h-6" />,
      url: "https://github.com/Klooy",
      color: "hover:text-[#333] dark:hover:text-white",
      label: "GitHub"
    },
    {
      icon: <Instagram className="w-6 h-6" />,
      url: "https://www.instagram.com/mc_klooy/",
      color: "hover:text-[#C13584]",
      label: "Instagram"
    },
  ];

  return (
    <footer className="mt-20 text-[#1f2937] dark:text-white font-sans relative overflow-hidden">
      {/* Gradiente de fondo */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#2563eb]/5 to-[#2563eb]/10 dark:via-[#60a5fa]/5 dark:to-[#60a5fa]/10 -z-10"></div>

      <div className="px-[10%] py-12">
        {/* Logo */}
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <img src="./assets/logo_dark.png" alt="Logo" className="w-36 mx-auto mb-2 dark:hidden" />
          <img src="./assets/logo.png" alt="Logo" className="w-36 mx-auto mb-2 hidden dark:block" />

          {/* Email con efecto glow */}
          <motion.div
            className="w-max flex items-center gap-2 mx-auto mb-6 group"
            whileHover={{ scale: 1.05 }}
          >
            <Mail className="w-5 h-5 text-[#2563eb] dark:text-[#60a5fa]" />
            <a
              href="mailto:mfcorrales26@gmail.com"
              className="relative hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              mfcorrales26@gmail.com
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563eb] dark:bg-[#60a5fa] group-hover:w-full transition-all duration-300"></span>
            </a>
          </motion.div>

          {/* Redes sociales con efectos mejorados */}
          <div className="flex items-center justify-center gap-4 mb-8">
            {socialLinks.map((social, index) => (
              <motion.a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`relative p-3 rounded-full bg-gray-100 dark:bg-white/5 ${social.color} transition-all duration-300 group`}
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                aria-label={social.label}
              >
                {social.icon}
                {/* Efecto glow en hover */}
                <span className="absolute inset-0 rounded-full bg-current opacity-0 group-hover:opacity-20 blur-lg transition-opacity duration-300"></span>
              </motion.a>
            ))}
          </div>

          {/* Enlaces rápidos */}
          <motion.div
            className="flex flex-wrap items-center justify-center gap-4 mb-8 text-sm"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {['Inicio', 'Sobre mí', 'Servicios', 'Proyectos', 'Certificaciones', 'Contacto'].map((link, index) => (
              <a
                key={index}
                href={`#${link.toLowerCase().replace(' ', '')}`}
                className="relative group hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
              >
                {link}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#2563eb] dark:bg-[#60a5fa] group-hover:w-full transition-all duration-300"></span>
              </a>
            ))}
          </motion.div>
        </motion.div>

        {/* Pie de página */}
        <motion.div
          className="text-center sm:flex items-center justify-center gap-2 border-t border-gray-300 dark:border-gray-700 pt-6 text-sm"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <p className="flex items-center justify-center gap-1 flex-wrap">
            © {new Date().getFullYear()}
            <a
              href="https://my-portfolio-mc.netlify.app/"
              className="font-semibold hover:text-[#2563eb] dark:hover:text-[#60a5fa] transition-colors"
            >
              Michael Felipe Corrales Flórez
            </a>
            . Hecho con
            <Heart className="w-4 h-4 text-red-500 inline-block animate-pulse" fill="currentColor" />
            y React.
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
