# 🚀 Guía de Instalación y Configuración

## 📋 Requisitos Previos

- **Node.js**: v16.0.0 o superior
- **npm**: v7.0.0 o superior (incluido con Node.js)
- **Git**: para clonar el repositorio (opcional)
- **Cuenta Supabase**: para base de datos PostgreSQL

---

## 🛠️ Instalación Local

### Paso 1: Clonar/Descargar el Proyecto

```bash
# Si tienes Git instalado:
git clone <URL_DEL_REPOSITORIO>
cd portafolioReactjs

# Si descargaste el ZIP:
# Descomprime el archivo y abre la carpeta en la terminal
```

### Paso 2: Instalar Dependencias

```bash
npm install
```

**Esto instalará todas las dependencias listadas en `package.json`:**
- ✅ react & react-dom
- ✅ react-router-dom
- ✅ @reduxjs/toolkit & react-redux
- ✅ @supabase/supabase-js
- ✅ jspdf & html2canvas
- ✅ tailwindcss
- ✅ Y muchas más...

**Tiempo estimado**: 2-5 minutos (depende de tu conexión)

### Paso 3: Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```bash
# Crear archivo (Windows)
echo. > .env.local

# O crear manualmente:
# Haz clic derecho en la carpeta → Nuevo → Archivo de texto → Renombra a .env.local
```

**Contenido del archivo `.env.local`:**

```env
# 🔑 SUPABASE - REQUIRED
VITE_SUPABASE_URL=https://zfawsensftohwfrbmebo.supabase.co
VITE_SUPABASE_KEY=sb_publishable_BdYz_AI-dVbeKPj4-ZlAeg_17iJ4P-U

# 🏢 FACTUS COLOMBIA - OPTIONAL (Sandbox)
VITE_FACTUS_ENABLED=false
VITE_FACTUS_CLIENT_ID=<TU_CLIENT_ID>
VITE_FACTUS_CLIENT_SECRET=<TU_CLIENT_SECRET>

# 🌐 API URL - For Development
VITE_API_URL=http://localhost:5173
```

**Nota**: 
- Las credenciales de Supabase ya están configuradas y funcionan
- Para Factus, necesitas credenciales de tu cuenta (actualmente en sandbox)
- Mantén `.env.local` secreto - nunca lo subas a Git

### Paso 4: Iniciar el Servidor de Desarrollo

```bash
npm run dev
```

**Salida esperada:**
```
  VITE v5.3.4  ready in 1234 ms

  ➜  Local:   http://localhost:5173/
  ➜  press h to show help
```

**Abre en tu navegador**: `http://localhost:5173`

---

## 📊 Configuración de Supabase

### Paso 1: Verificar la Conexión

El proyecto ya tiene credenciales de Supabase. Para verificar:

1. Abre DevTools (F12)
2. Ve a Console
3. Deberías ver logs de conexión exitosa

### Paso 2: Revisar las Tablas (Opcional)

Accede a [Supabase Dashboard](https://app.supabase.com):

1. Login con tus credenciales
2. Selecciona el proyecto
3. Ve a "SQL Editor" o "Tables"
4. Deberías ver 3 tablas:
   - `invoicing_clientes`
   - `invoicing_productos`
   - `invoicing_facturas`

### Paso 3: Entender Row Level Security (RLS)

Las tablas tienen RLS habilitado con políticas permisivas:

```sql
-- Política para invoicing_clientes
CREATE POLICY "Enable all operations for authenticated users"
ON invoicing_clientes
USING (true)
WITH CHECK (true);
```

Esto permite que todos los usuarios autenticados (o públicos) puedan:
- ✅ SELECT (leer)
- ✅ INSERT (crear)
- ✅ UPDATE (editar)
- ✅ DELETE (eliminar)

---

## 📱 Estructura del Proyecto

```
portafolioReactjs/
│
├── src/
│   ├── modules/invoicing/          ← MÓDULO PRINCIPAL
│   │   ├── components/             ← Componentes React
│   │   ├── features/               ← Redux slices
│   │   ├── services/               ← Servicios API
│   │   ├── utils/                  ← Funciones útiles
│   │   └── docs/                   ← Documentación
│   │
│   ├── App.jsx                     ← Componente raíz con Router
│   ├── main.jsx                    ← Punto entrada
│   └── index.css                   ← Estilos globales
│
├── public/                         ← Archivos estáticos
├── .env.local                      ← Variables de entorno
├── package.json                    ← Dependencias
├── vite.config.js                  ← Configuración Vite
├── tailwind.config.js              ← Configuración Tailwind
└── ...
```

---

## 🚀 Comandos Disponibles

### Desarrollo

```bash
# Iniciar servidor de desarrollo
npm run dev

# Esto abre:
# - http://localhost:5173 (aplicación)
# - Con hot reload automático
# - Accesible desde otros dispositivos en la red local
```

### Producción

```bash
# Compilar para producción
npm run build

# Esto crea:
# - Carpeta 'dist/' con archivos optimizados
# - Listo para desplegar en un servidor

# Vista previa de la build
npm run preview
```

### Linting

```bash
# Verificar y corregir errores de código
npm run lint
```

---

## 🔧 Configuración Adicional

### Tailwind CSS

**Ya está configurado en `tailwind.config.js`**

Para personalizar colores:

```javascript
// tailwind.config.js
export default {
  theme: {
    extend: {
      colors: {
        primary: '#10B981',    // Verde Emerald
        secondary: '#6366f1',  // Índigo
      }
    }
  }
}
```

### Vite Config

**Ya está configurado en `vite.config.js`**

Incluye:
- ✅ React plugin
- ✅ CORS proxy para Factus API
- ✅ Optimizaciones de build

```javascript
// Proxy ejemplo
server: {
  proxy: {
    '/api-factus': {
      target: 'https://api-sandbox.factus.com.co',
      changeOrigin: true,
      rewrite: (path) => path.replace(/^\/api-factus/, '')
    }
  }
}
```

---

## 🔌 Integraciones Externas

### Supabase

**Estado**: ✅ Completamente configurado

```javascript
// Importar cliente
import { supabase } from '@/services/supabase';

// Usar en componentes
const { data, error } = await supabase
  .from('invoicing_clientes')
  .select('*');
```

### Factus Colombia

**Estado**: 🟡 Sandbox (requiere credenciales)

```javascript
// Servicio en: src/modules/invoicing/services/factusAPI.js
// Requiere: VITE_FACTUS_CLIENT_ID y VITE_FACTUS_CLIENT_SECRET
// Estado: VITE_FACTUS_ENABLED=false (deshabilitado localmente)
```

---

## 🐛 Solución de Problemas

### Error: "Module not found: jspdf"

**Solución**:
```bash
npm install jspdf html2canvas
```

### Error: "Cannot read property 'supabase' of undefined"

**Solución**:
1. Verifica que `.env.local` tiene `VITE_SUPABASE_URL` y `VITE_SUPABASE_KEY`
2. Reinicia el servidor: `npm run dev`
3. Limpia cache: `rm -rf node_modules && npm install`

### Error: "CORS error when calling Factus API"

**Solución**:
1. Verifica `vite.config.js` tiene la configuración de proxy
2. Comprueba que usas `/api-factus` en lugar de la URL completa
3. Factus sandbox puede estar limitado - normal

### Puerto 5173 en uso

**Solución**:
```bash
# Especificar puerto diferente
npm run dev -- --port 3000

# O terminar proceso en puerto 5173
# Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### Tabla de BD vacía o no existe

**Solución**:
1. Accede a [Supabase](https://app.supabase.com)
2. Ve a SQL Editor
3. Ejecuta los siguientes scripts para crear tablas

**SQL para crear tablas**:
```sql
-- Clientes
CREATE TABLE invoicing_clientes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  razon_social VARCHAR NOT NULL,
  nit VARCHAR NOT NULL UNIQUE,
  tipo_persona VARCHAR,
  email VARCHAR,
  telefono VARCHAR,
  celular VARCHAR,
  direccion VARCHAR,
  ciudad VARCHAR,
  departamento VARCHAR,
  codigo_postal VARCHAR,
  pais VARCHAR,
  responsabilidad_fiscal VARCHAR,
  contacto_nombre VARCHAR,
  contacto_cargo VARCHAR,
  notas TEXT,
  cliente_factus_id VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Productos
CREATE TABLE invoicing_productos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nombre VARCHAR NOT NULL,
  codigo VARCHAR NOT NULL UNIQUE,
  descripcion TEXT,
  precio DECIMAL(10,2) NOT NULL,
  iva INTEGER DEFAULT 19,
  stock INTEGER DEFAULT 0,
  unidad VARCHAR DEFAULT 'UND',
  categoria VARCHAR,
  proveedor VARCHAR,
  margen_ganancia DECIMAL(5,2) DEFAULT 30,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Facturas
CREATE TABLE invoicing_facturas (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cliente_id UUID REFERENCES invoicing_clientes(id),
  numero VARCHAR NOT NULL UNIQUE,
  fecha_emision DATE NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2),
  descuentos DECIMAL(10,2) DEFAULT 0,
  impuestos DECIMAL(10,2),
  total DECIMAL(10,2),
  estado VARCHAR DEFAULT 'borrador',
  notas TEXT,
  factura_factus_id VARCHAR,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS
ALTER TABLE invoicing_clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoicing_productos ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoicing_facturas ENABLE ROW LEVEL SECURITY;

-- Crear políticas permisivas
CREATE POLICY "Enable all operations for authenticated users"
ON invoicing_clientes
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users"
ON invoicing_productos
USING (true)
WITH CHECK (true);

CREATE POLICY "Enable all operations for authenticated users"
ON invoicing_facturas
USING (true)
WITH CHECK (true);
```

---

## 🚢 Despliegue en Producción

### Opción 1: Vercel (Recomendado)

```bash
# 1. Instalar Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Configurar variables de entorno en Vercel dashboard
VITE_SUPABASE_URL=...
VITE_SUPABASE_KEY=...
```

### Opción 2: Netlify

```bash
# 1. Instalar Netlify CLI
npm i -g netlify-cli

# 2. Deploy
netlify deploy --prod

# 3. Configurar variables en Netlify dashboard
```

### Opción 3: GitHub Pages

```bash
# 1. Actualizar package.json
"homepage": "https://tu-usuario.github.io/portafolioReactjs"

# 2. Deploy
npm run build
npm run deploy
```

---

## 📚 Recursos Útiles

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Redux Toolkit**: https://redux-toolkit.js.org
- **React Router**: https://reactrouter.com
- **Supabase Docs**: https://supabase.com/docs
- **Tailwind CSS**: https://tailwindcss.com
- **jsPDF**: https://github.com/parallax/jsPDF
- **html2canvas**: https://html2canvas.hertzen.com

---

## 💡 Tips y Mejores Prácticas

### 1. Seguridad

```javascript
// ✅ BIEN: Usa .env para secretos
const apiKey = import.meta.env.VITE_SUPABASE_KEY;

// ❌ MALO: Nunca hardcodees secretos
const apiKey = "sk_test_123456789";
```

### 2. Organización de Código

```javascript
// ✅ BIEN: Importa desde paths relativos
import { fetchClientes } from '../features/clientesSlice';

// ❌ MALO: Paths muy largos
import { fetchClientes } from '../../../../../../../features/clientesSlice';
```

### 3. Performance

```javascript
// ✅ BIEN: Usa useCallback para funciones
const handleClick = useCallback(() => {
  // acción
}, []);

// ✅ BIEN: Lazy load componentes
const Dashboard = lazy(() => import('./Dashboard'));

// ❌ MALO: Crear funciones en cada render
const handleClick = () => { /* acción */ };
```

### 4. Estado Global

```javascript
// ✅ BIEN: Usa Redux para estado compartido
const clientes = useSelector(state => state.clientes.clientes);

// ❌ MALO: Pasar props en cascada (prop drilling)
<Cliente prop1={prop1} prop2={prop2} prop3={prop3} />
```

---

## 📞 Soporte y Contacto

**Si tienes problemas**:
1. Revisa esta documentación
2. Consulta la [Guía de Testing](./GUIA_TESTING.md)
3. Abre un issue en GitHub
4. Contacta al equipo de desarrollo

---

## ✅ Checklist de Instalación

- [ ] Node.js v16+ instalado
- [ ] Proyecto clonado/descargado
- [ ] `npm install` completado
- [ ] `.env.local` creado con credenciales
- [ ] `npm run dev` ejecutado sin errores
- [ ] Navegador abre http://localhost:5173
- [ ] Módulo de facturación accesible en /facturas
- [ ] Base de datos Supabase conectada
- [ ] Primera factura creada y probada
- [ ] PDF generado y descargado exitosamente

---

**Última actualización**: 2024
**Versión**: 2.0
**Estado**: Listo para producción ✅
