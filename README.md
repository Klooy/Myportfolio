# 🚀 MC Klooy.Dev - Portafolio Personal

Portafolio interactivo y moderno de **Michael Felipe Corrales Flórez**, Ingeniero de Sistemas especializado en desarrollo Full Stack.

## 🌟 Características

- ✨ **Diseño moderno y responsivo** - Adaptado para todos los dispositivos
- 🌓 **Tema claro/oscuro automático** - Detecta las preferencias del sistema y permite cambio manual
- ⚡ **Rendimiento optimizado** - Construido con Vite para máxima velocidad
- 📱 **Mobile-first** - Totalmente optimizado para dispositivos móviles
- 🎨 **UI/UX atractiva** - Gradientes, animaciones y efectos visuales modernos
- 🔧 **Totalmente funcional** - Formulario de contacto, proyectos interactivos y navegación fluida

## 🛠️ Tecnologías Utilizadas

### Frontend
- **React 18** - Librería de interfaz de usuario
- **Vite** - Herramienta de construcción rápida
- **Tailwind CSS** - Framework de estilos utility-first
- **Lucide React** - Iconos modernos
- **Lenis Scroll** - Desplazamiento suave

### Herramientas de Desarrollo
- **Node.js** - Runtime de JavaScript
- **npm** - Gestor de paquetes
- **Git** - Control de versiones

### Backend/Servicios
- **Web3Forms** - Servicio para formularios (configurable)
- **Netlify** - Despliegue de proyectos

## 📦 Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Klooy/Myportfolio.git
cd Myportfolio
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Ejecutar en desarrollo**
```bash
npm run dev
```

4. **Compilar para producción**
```bash
npm run build
```

## 🎯 Secciones del Portafolio

### 1. **Header**
Sección de bienvenida con presentación personal y botones de acción rápida.

### 2. **About (Sobre mí)**
Información profesional, educación, experiencia y herramientas/tecnologías utilizadas.

### 3. **Services (Servicios)**
Servicios profesionales ofrecidos:
- Desarrollo Web Full Stack
- Análisis de Datos
- Soporte TI y Ciberseguridad

### 4. **Work (Proyectos)**
Carrusel de proyectos destacados:
- **Cúspide Store** - E-commerce React + Supabase
- **CaféGest** - Sistema de Gestión Cafetera
- **Portfolio Desktop** - Portafolio Interactivo React

### 5. **Contact (Contacto)**
Formulario funcional para contacto directo mediante Web3Forms.

### 6. **Footer**
Enlaces a redes sociales y contacto.

## 🎨 Tema Claro/Oscuro

El portafolio incluye un sistema de temas inteligente:
- **Detección automática** - Identifica el tema del sistema operativo
- **Preferencia persistente** - Recuerda la elección del usuario en localStorage
- **Cambio manual** - Botón en la navbar para alternar entre temas
- **Sincronización en tiempo real** - Se actualiza automáticamente si cambia el sistema

## 📱 Responsividad

Optimizado para todos los tamaños de pantalla:
- **Móvil** - Menú lateral, navbar compacto
- **Tablet** - Adaptaciones de espaciado y tamaño
- **Desktop** - Experiencia completa con efectos visuales

## 🚀 Despliegue

El proyecto está configurado para desplegar en:
- **Netlify** (recomendado)
- **Vercel**
- **GitHub Pages**

### Desplegar en Netlify
```bash
npm run build
# Arrastra la carpeta 'dist' a Netlify
```

## 🔗 Enlaces Importantes

- **Sitio en vivo** - https://mcklooy.dev (cuando esté desplegado)
- **LinkedIn** - https://www.linkedin.com/in/mfcorrales/
- **GitHub** - https://github.com/Klooy
- **Email** - mfcorrales26@gmail.com

## 📧 Configuración del Formulario

Para que el formulario de contacto funcione:

1. Visita [Web3Forms](https://web3forms.com)
2. Registrate con tu correo
3. Copia tu Access Key
4. Abre `src/components/Contact.jsx`
5. Reemplaza `"--- ingresa tu access key aquí ---"` con tu clave

```jsx
formData.append("access_key", "TU_CLAVE_AQUI");
```

## 📁 Estructura del Proyecto

```
portafolioReactjs/
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── LenisScroll.jsx
│   │   ├── Navbar.jsx
│   │   ├── Services.jsx
│   │   └── Work.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── public/
│   └── assets/
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🛡️ Licencia

Este proyecto está disponible bajo la Licencia MIT. Siéntete libre de usarlo como referencia o adaptarlo para tu propio portafolio.

## 👤 Autor

**Michael Felipe Corrales Flórez**
- Ingeniero de Sistemas
- Desarrollador Full Stack
- Especialista en C#, ASP.NET, React, Node.js
- Apasionado por crear soluciones tecnológicas innovadoras

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Si tienes sugerencias o encuentras errores, no dudes en abrir un issue.

## 📞 Contacto

¿Tienes un proyecto en mente? ¡Contáctame!
- 📧 Email: mfcorrales26@gmail.com
- 📱 WhatsApp: +57 310 622 6041
- 💼 LinkedIn: [@mfcorrales](https://www.linkedin.com/in/mfcorrales/)

---

**Última actualización**: Enero 2026

⭐ Si te gusta este proyecto, ¡considera darle una estrella en GitHub!
