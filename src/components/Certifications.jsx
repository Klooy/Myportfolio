import { useState } from 'react';
import ScrollReveal from './ScrollReveal';
import { ParallaxBackgroundGreen } from './ParallaxBackground';

export default function Certifications() {
  const [flippedCard, setFlippedCard] = useState(null);

  // Certificaciones directas con enlaces verificables
  const certifications = [
    {
      title: 'Introducción al Desarrollo Web',
      url: 'https://www.coursera.org/account/accomplishments/verify/69YGBHYW1D7L',
      platform: 'Coursera',
      code: '69YGBHYW1D7L',
      description: 'Curso fundamental que cubre los principios básicos del desarrollo web, incluyendo HTML5, CSS3 y conceptos de diseño responsivo. Aprendí a crear sitios web modernos y accesibles.'
    },
    {
      title: 'Fundamentos de Programación',
      url: 'https://www.coursera.org/account/accomplishments/verify/94TJ9HTJMA2R',
      platform: 'Coursera',
      code: '94TJ9HTJMA2R',
      description: 'Certificación que valida conocimientos en lógica de programación, estructuras de datos, algoritmos y paradigmas de programación orientada a objetos.'
    },
    {
      title: 'Desarrollo de Aplicaciones Web',
      url: 'https://www.coursera.org/account/accomplishments/verify/IS8KCIU51FRA',
      platform: 'Coursera',
      code: 'IS8KCIU51FRA',
      description: 'Curso avanzado de desarrollo web full-stack, cubriendo frameworks modernos, APIs RESTful, bases de datos y deployment de aplicaciones web escalables.'
    },
    {
      title: 'Certificación Profesional',
      url: 'https://drive.google.com/file/d/1cZL0HC3LD5Xk_X14evJpl6qP_0uvaKqt/view',
      platform: 'Google Drive',
      code: '1cZL0HC3LD5Xk_X14evJpl6qP_0uvaKqt',
      description: 'Certificación profesional que valida competencias técnicas y habilidades prácticas en el desarrollo de software y gestión de proyectos tecnológicos.'
    },
    {
      title: 'Certificación Complementaria',
      url: 'https://drive.google.com/file/d/1PHbfjZBmd65V2AnFhYSR5HLOdYAeEFXd/view',
      platform: 'Google Drive',
      code: '1PHbfjZBmd65V2AnFhYSR5HLOdYAeEFXd',
      description: 'Certificación adicional que complementa mi formación técnica, cubriendo áreas especializadas y mejores prácticas en el desarrollo de aplicaciones modernas.'
    }
  ];

  const toggleFlip = (idx) => {
    setFlippedCard(flippedCard === idx ? null : idx);
  };

  return (
    <ParallaxBackgroundGreen>
      <section id="certifications" className="w-full px-[12%] py-20 scroll-mt-20 text-[#1f2937] dark:text-white font-montserrat relative">

        <ScrollReveal animation="slideDown" delay={0.1}>
          <h4 className="text-center mb-2 text-lg font-semibold text-[#10b981] dark:text-[#34d399]">Certificaciones</h4>
        </ScrollReveal>
        <ScrollReveal animation="slideDown" delay={0.2}>
          <h2 className="text-center text-5xl mb-4 font-bold">Reconocimientos y Cursos</h2>
        </ScrollReveal>
        <ScrollReveal animation="slideUp" delay={0.3}>
          <p className="text-center max-w-2xl mx-auto mt-5 mb-12 text-[#1f2937]/80 dark:text-gray-300 text-lg">
            Enlaces directos y verificables a todas mis <span className="font-bold text-[#10b981] dark:text-[#34d399]">{certifications.length}</span> certificaciones profesionales. Haz clic para ver más detalles.
          </p>
        </ScrollReveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {certifications.map((cert, idx) => (
            <ScrollReveal key={idx} animation="scale" delay={0.4 + idx * 0.1}>
              <div
                className="relative h-80 cursor-pointer"
                style={{ perspective: '1000px' }}
                onClick={() => toggleFlip(idx)}
              >
                <div
                  className={`relative w-full h-full transition-transform duration-700 transform-gpu`}
                  style={{
                    transformStyle: 'preserve-3d',
                    transform: flippedCard === idx ? 'rotateY(180deg)' : 'rotateY(0deg)'
                  }}
                >
                  {/* Frente de la tarjeta */}
                  <div
                    className="absolute inset-0 p-6 rounded-2xl bg-white/80 dark:bg-white/5 border-2 border-gray-200 dark:border-white/10 shadow-xl flex flex-col justify-between"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400">
                          {cert.platform}
                        </span>
                        <svg className="w-6 h-6 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                      </div>

                      {/* Icono grande central temático */}
                      <div className="flex justify-center my-4">
                        {idx === 0 && (
                          <svg className="w-20 h-20 text-emerald-500/30 dark:text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                          </svg>
                        )}
                        {idx === 1 && (
                          <svg className="w-20 h-20 text-emerald-500/30 dark:text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" />
                          </svg>
                        )}
                        {idx === 2 && (
                          <svg className="w-20 h-20 text-emerald-500/30 dark:text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M20 4H4c-1.11 0-1.99.89-1.99 2L2 18c0 1.11.89 2 2 2h16c1.11 0 2-.89 2-2V6c0-1.11-.89-2-2-2zm-5 14H4v-4h11v4zm0-5H4V9h11v4zm5 5h-4V9h4v9z" />
                          </svg>
                        )}
                        {idx === 3 && (
                          <svg className="w-20 h-20 text-emerald-500/30 dark:text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                          </svg>
                        )}
                        {idx === 4 && (
                          <svg className="w-20 h-20 text-emerald-500/30 dark:text-emerald-400/20" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1c-1.3 0-2.4.84-2.82 2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 0c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zm0 4c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H6v-1.4c0-2 4-3.1 6-3.1s6 1.1 6 3.1V19z" />
                          </svg>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-4">
                        {cert.title}
                      </h3>
                      <p className="text-xs text-gray-500 dark:text-gray-500 font-mono">
                        {cert.code}
                      </p>
                    </div>
                    <div className="flex items-center justify-center text-sm text-emerald-600 dark:text-emerald-400 font-semibold mt-4">
                      <span>Toca para ver detalles</span>
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>

                  {/* Reverso de la tarjeta */}
                  <div
                    className="absolute inset-0 p-6 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 dark:from-emerald-600 dark:to-emerald-800 border-2 border-emerald-400 dark:border-emerald-600 shadow-xl flex flex-col justify-between text-white"
                    style={{
                      backfaceVisibility: 'hidden',
                      WebkitBackfaceVisibility: 'hidden',
                      transform: 'rotateY(180deg)'
                    }}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-xs font-semibold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                          {cert.platform}
                        </span>
                        <svg className="w-5 h-5 rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold mb-4">
                        {cert.title}
                      </h3>
                      <p className="text-sm text-white/90 leading-relaxed">
                        {cert.description}
                      </p>
                    </div>
                    <a
                      href={cert.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="mt-4 w-full py-3 px-4 bg-white text-emerald-600 rounded-lg font-semibold hover:bg-emerald-50 transition flex items-center justify-center"
                    >
                      Ver certificado
                      <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </section>
    </ParallaxBackgroundGreen>
  );
}
