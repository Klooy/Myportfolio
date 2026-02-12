import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, CheckCircle, AlertCircle } from 'lucide-react';
import ScrollReveal from './ScrollReveal';
import ParallaxBackground from './ParallaxBackground';

export default function Contact() {
  const [result, setResult] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isError, setIsError] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setResult("Enviando...");
    setIsSuccess(false);
    setIsError(false);

    const formData = new FormData(event.target);
    formData.append("access_key", "4f340e12-d80c-451b-849c-0da667db241e");

    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      }).then((res) => res.json());

      if (res.success) {
        console.log("Éxito", res);
        setResult("¡Mensaje enviado con éxito! Te responderé pronto.");
        setIsSuccess(true);
        event.target.reset();
      } else {
        console.log("Error", res);
        setResult("Hubo un error al enviar el mensaje. Intenta de nuevo.");
        setIsError(true);
      }
    } catch (error) {
      setResult("Error de conexión. Verifica tu internet e intenta de nuevo.");
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ParallaxBackground>
      <div id="contact" className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-white font-montserrat relative">

        <ScrollReveal animation="slideDown" delay={0.1}>
          <h4 className="text-center mb-2 text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
            Contáctame
          </h4>
        </ScrollReveal>
        <ScrollReveal animation="slideDown" delay={0.2}>
          <h2 className="text-center text-5xl mb-4 font-bold">
            Ponte en contacto
          </h2>
        </ScrollReveal>
        <ScrollReveal animation="slideUp" delay={0.3}>
          <p className="text-center max-w-2xl mx-auto mt-5 mb-16 text-[#1f2937]/80 dark:text-gray-300 text-lg">
            ¿Tienes un proyecto en mente? Me encantaría colaborar contigo. Déjame un mensaje y te responderé lo antes posible.
          </p>
        </ScrollReveal>

        <ScrollReveal animation="scale" delay={0.4}>
          <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
            <input type="hidden" name="subject" value="Nuevo envío de formulario" />

            <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
              <motion.input
                type="text"
                placeholder="Tu nombre"
                className="flex-1 px-4 py-3 focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] dark:focus:ring-[#60a5fa] dark:focus:border-[#60a5fa] outline-none border-2 border-gray-200 dark:border-[#60a5fa]/30 rounded-xl bg-white dark:bg-white/5 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                required
                name="name"
                whileFocus={{ scale: 1.02 }}
              />
              <motion.input
                type="email"
                placeholder="tu@correo.com"
                className="flex-1 px-4 py-3 focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] dark:focus:ring-[#60a5fa] dark:focus:border-[#60a5fa] outline-none border-2 border-gray-200 dark:border-[#60a5fa]/30 rounded-xl bg-white dark:bg-white/5 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition-all duration-300"
                required
                name="email"
                whileFocus={{ scale: 1.02 }}
              />
            </div>

            <motion.textarea
              rows="6"
              placeholder="Cuéntame sobre tu proyecto o pregunta..."
              className="w-full px-4 py-3 focus:ring-2 focus:ring-[#2563eb] focus:border-[#2563eb] dark:focus:ring-[#60a5fa] dark:focus:border-[#60a5fa] outline-none border-2 border-gray-200 dark:border-[#60a5fa]/30 rounded-xl bg-white dark:bg-white/5 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 mb-6 transition-all duration-300 resize-none"
              required
              name="message"
              whileFocus={{ scale: 1.01 }}
            ></motion.textarea>

            <div className="flex justify-center">
              <motion.button
                type='submit'
                className="group relative py-3 px-10 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-bold rounded-full hover:shadow-2xl hover:shadow-[#2563eb]/50 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden"
                disabled={isLoading}
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
              >
                {/* Efecto de brillo */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700"></span>

                {isLoading ? (
                  <>
                    <motion.div
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                    />
                    <span className="relative z-10">Enviando...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5 relative z-10" />
                    <span className="relative z-10">Enviar mensaje</span>
                  </>
                )}
              </motion.button>
            </div>

            {/* Mensaje de resultado con animación */}
            {result && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mt-6 p-4 rounded-xl flex items-center gap-3 ${isSuccess
                    ? 'bg-green-50 dark:bg-green-900/20 border-2 border-green-500/30 text-green-700 dark:text-green-400'
                    : isError
                      ? 'bg-red-50 dark:bg-red-900/20 border-2 border-red-500/30 text-red-700 dark:text-red-400'
                      : 'bg-blue-50 dark:bg-blue-900/20 border-2 border-blue-500/30 text-blue-700 dark:text-blue-400'
                  }`}
              >
                {isSuccess && <CheckCircle className="w-6 h-6 flex-shrink-0" />}
                {isError && <AlertCircle className="w-6 h-6 flex-shrink-0" />}
                <p className='font-semibold'>{result}</p>
              </motion.div>
            )}
          </form>
        </ScrollReveal>
      </div>
    </ParallaxBackground>
  );
}
