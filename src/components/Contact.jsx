import { useEffect, useState } from 'react';

export default function Contact() {
  const [result, setResult] = useState("");

  const onSubmit = async (event) => {
    event.preventDefault();

    setResult("Enviando...");

    const formData = new FormData(event.target);
    formData.append("access_key", "4f340e12-d80c-451b-849c-0da667db241e");

    const res = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      body: formData
    }).then((res) => res.json());

    if (res.success) {
      console.log("Éxito", res);
      setResult(res.message);
      event.target.reset();
    } else {
      console.log("Error", res);
      setResult(res.message);
    }
  };

  return (
    <div id="contact" className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-white font-montserrat relative">
      {/* Fondo decorativo */}
      <div className="absolute inset-0 -z-10 opacity-20">
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-[#2563eb] rounded-full mix-blend-multiply filter blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#60a5fa] rounded-full mix-blend-multiply filter blur-3xl"></div>
      </div>

      <h4 className="text-center mb-2 text-lg font-semibold text-[#2563eb] dark:text-[#60a5fa]">
        Contáctame
      </h4>
      <h2 className="text-center text-5xl mb-4 font-bold">
        Ponte en contacto
      </h2>
      <p className="text-center max-w-2xl mx-auto mt-5 mb-16 text-[#1f2937]/80 dark:text-gray-300 text-lg">
        ¿Tienes un proyecto en mente? Me encantaría colaborar contigo. Déjame un mensaje y te responderé lo antes posible.
      </p>

      <form onSubmit={onSubmit} className="max-w-2xl mx-auto">
        <input type="hidden" name="subject" value="Nuevo envío de formulario" />

        <div className="grid grid-cols-auto gap-6 mt-10 mb-8">
          <input 
            type="text" 
            placeholder="Tu nombre" 
            className="flex-1 px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none border-2 border-gray-200 dark:border-[#60a5fa]/30 rounded-xl bg-white dark:bg-white/5 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition" 
            required 
            name="name" 
          />
          <input 
            type="email" 
            placeholder="tu@correo.com" 
            className="flex-1 px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none border-2 border-gray-200 dark:border-[#60a5fa]/30 rounded-xl bg-white dark:bg-white/5 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 transition" 
            required 
            name="email" 
          />
        </div>

        <textarea 
          rows="6" 
          placeholder="Cuéntame sobre tu proyecto o pregunta..." 
          className="w-full px-4 py-3 focus:ring-2 focus:ring-[#2563eb] outline-none border-2 border-gray-200 dark:border-[#60a5fa]/30 rounded-xl bg-white dark:bg-white/5 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 mb-6 transition resize-none" 
          required 
          name="message"
        ></textarea>

        <div className="flex justify-center">
          <button 
            type='submit' 
            className="group py-3 px-10 flex items-center justify-center gap-2 bg-gradient-to-r from-[#2563eb] to-[#1d4ed8] text-white font-bold rounded-full hover:shadow-2xl hover:shadow-[#2563eb]/50 transition-all duration-300 transform hover:scale-105"
          >
            <span>Enviar mensaje</span>
            <svg className="w-5 h-5 group-hover:translate-x-1 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </div>

        {result && <p className='mt-6 text-center font-semibold text-[#2563eb] dark:text-[#60a5fa]'>{result}</p>}
      </form>
    </div>
  );
}
