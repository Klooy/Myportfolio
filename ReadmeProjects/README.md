# 👗 PASARELA - Siempre Trendy

![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react)
![Vite](https://img.shields.io/badge/Vite-7.x-646CFF?style=for-the-badge&logo=vite)
![TailwindCSS](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss)
![Supabase](https://img.shields.io/badge/Supabase-Database-3FCF8E?style=for-the-badge&logo=supabase)
![ADDI](https://img.shields.io/badge/ADDI-Payments-00D26A?style=for-the-badge)
![EmailJS](https://img.shields.io/badge/EmailJS-Email-F4A023?style=for-the-badge&logo=maildotru)

> **Tienda online de botas para dama en Colombia con sistema completo de e-commerce, integración de pagos ADDI y panel administrativo avanzado**

Una plataforma de comercio electrónico moderna, elegante y completamente funcional para venta de botas y calzado femenino. Diseñada con una paleta de colores vinotinto exclusiva, efectos visuales premium, integración con ADDI para pagos en cuotas y un sistema robusto de gestión de stock a dos niveles.

---

## 📊 Diagrama de Base de Datos (ER)

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         MODELO RELACIONAL                                 │
└─────────────────────────────────────────────────────────────────────────┘

                          ┌──────────────────┐
                          │    PRODUCTOS     │
                          ├──────────────────┤
                          │ id (UUID) PK     │
                          │ nombre           │
                          │ descripcion      │
                          │ precio_venta     │
                          │ precio_oferta    │
                          │ precio_compra_inicial
                          │ precio_compra_ultimo ⭐
                          │ inversion_acumulada
                          │ cantidad ⭐ (SUM de variantes)
                          │ colores[]        │
                          │ tallas[]         │
                          │ categoria[]      │
                          │ marca            │
                          │ oferta           │
                          │ visible          │
                          │ created_at       │
                          │ updated_at       │
                          └──────────────────┘
                                  │
                                  │ 1:N
                                  ├─────────────────────────────┐
                                  │                             │
                    ┌─────────────────────────┐   ┌──────────────────────┐
                    │  PRODUCTO_VARIANTES     │   │  PEDIDOS              │
                    ├─────────────────────────┤   ├──────────────────────┤
                    │ id (UUID) PK            │   │ id (UUID) PK         │
                    │ producto_id (FK) ⭐    │   │ cliente_nombre       │
                    │ color ⭐ (requerido)    │   │ cliente_email        │
                    │ talla ⭐ (requerido)    │   │ cliente_telefono     │
                    │ cantidad ⭐ (stock)     │   │ direccion_entrega    │
                    │ precio_compra_ultimo ⭐ │   │ subtotal             │
                    │ sku                     │   │ envio                │
                    │ precio_adicional        │   │ total                │
                    │ created_at              │   │ metodo_pago ⭐       │
                    │ updated_at              │   │ estado ⭐            │
                    │ UNIQUE(prod_id,         │   │ numero_guia          │
                    │    color, talla)        │   │ productos (JSONB)    │
                    └─────────────────────────┘   │ created_at           │
                                                  │ updated_at           │
                                                  └──────────────────────┘

                    ┌─────────────────────────┐
                    │  COMPRAS                │
                    ├─────────────────────────┤
                    │ id (UUID) PK            │
                    │ producto_id (FK)       │
                    │ cantidad                │
                    │ precio_compra           │
                    │ proveedor               │
                    │ color ⭐ (nullable)     │
                    │ talla ⭐ (nullable)     │
                    │ grupo_compra ⭐ (UUID) │
                    │ estado ⭐               │
                    │ fecha                   │
                    │ created_at              │
                    └─────────────────────────┘

                    ┌─────────────────────────┐
                    │  VENTAS                 │
                    ├─────────────────────────┤
                    │ id (UUID) PK            │
                    │ producto_id (FK)       │
                    │ cantidad                │
                    │ precio_venta            │
                    │ cliente                 │
                    │ origen ⭐ (ONLINE/MANUAL)
                    │ color ⭐ (nullable)     │
                    │ talla ⭐ (nullable)     │
                    │ grupo_venta ⭐ (UUID)  │
                    │ pedido_id (FK, nullable)
                    │ fecha                   │
                    │ created_at              │
                    └─────────────────────────┘

⭐ = Cambios/Mejoras implementadas en Enero 2026
```

---

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| 🍷 Vinotinto Principal | `#8c2238` | Botones, acentos, headers |
| 🍷 Vinotinto Oscuro | `#671929` | Hover states, textos importantes |
| 🌸 Pastel Rosado | `#f8f1f1` | Fondos, backgrounds |
| ✨ Dorado | `#d4af37` | Acentos premium, estrellas |
| 💚 WhatsApp | `#25d366` | Botón flotante WhatsApp |
| 💚 Addi | `#00D26A` | Método de pago Addi |
| 💚 Emerald | `#10b981` | Envío gratis, éxito |

---

## ✨ Características Principales

### 🛒 E-Commerce Completo
- **Catálogo de productos** con filtros por categoría, marca, stock y rating
- **Carrito de compras** persistente con Redux
- **Sistema de variantes avanzado** (Color × Talla) con stock individual por combinación
- **Imágenes por color** - Hasta 4 imágenes asociadas a cada color del producto
- **Color principal configurable** - El admin elige qué color/imagen se muestra primero
- **Matriz de stock por variante** - Administra stock específico para cada color/talla
- **Control de stock de dos niveles**:
  - Nivel 1: `productos.cantidad` (stock total del producto)
  - Nivel 2: `producto_variantes.cantidad` (stock por color/talla)
  - 📌 **Siempre sincronizados**: `productos.cantidad = SUM(producto_variantes.cantidad)`
- **Límite de compra** - Máximo 5 unidades por talla por pedido
- **Precios con ofertas** y porcentaje de descuento
- **Ordenamiento** por precio, nombre, fecha o popularidad

### 💳 Integración ADDI - Pagos en Cuotas
- **Pago en cuotas sin tarjeta** - Financiación directa con ADDI
- **Pago con PSE** - Débito bancario
- **Pago con tarjeta** - Crédito/débito
- **Widget de simulación** - Muestra cuotas en página de producto
- **Edge Functions** - 4 funciones serverless para la integración:
  - `addi-auth` - Autenticación OAuth con ADDI
  - `addi-config` - Configuración del comercio
  - `addi-create-application` - Crear solicitud de financiamiento
  - `addi-webhook` - Recibir notificaciones de estado
- **Estados de pago ADDI**:
  - `esperando_addi` → Pendiente de respuesta
  - `procesado` → Aprobado por ADDI
  - `cancelado` → Rechazado/Abandonado/Expirado
- **Clasificación manual** - Admin puede marcar pedidos como "Addi Cuotas" o "Addi PSE"

### 💰 Sistema de Precios Inteligente
- **Precio de compra a nivel de variante** - `producto_variantes.precio_compra_ultimo`
- **Precio ponderado a nivel de producto** - Refleja el costo promedio real
  - Fórmula: `SUM(stock × precio_variante) / SUM(stock)`
  - Se actualiza automáticamente al entregar compras
- **Rastreo de inversión acumulada** - `productos.inversion_acumulada` para análisis financiero
- **Precio más reciente registrado** - `productos.precio_compra_ultimo` es el promedio ponderado

### 🎯 Experiencia de Usuario
- **Diseño responsive** optimizado para móvil y desktop
- **Navegación fluida** entre productos (Anterior/Siguiente)
- **Galería de imágenes** con zoom, swipe y miniaturas
- **Vista previa de colores** - Muestra una imagen de cada color disponible
- **Compartir con contexto** - Enlaces incluyen el color seleccionado
- **Favoritos inteligentes** - Guarda producto, color e imagen seleccionada
- **Notificaciones visuales** de compras en tiempo real
- **Indicador de personas viendo** el producto
- **Filtros persistentes** guardados en localStorage

### 💬 Comunicación y Correos
- **Botón flotante de WhatsApp** para consultas rápidas
- **Formulario de contacto** integrado con Web3Forms
- **EmailJS** - Correos de confirmación automáticos al cliente tras cada pedido
- **Web3Forms** - Notificación al admin cuando llega un nuevo pedido
- **Sistema dual de emails**: EmailJS (cliente) + Web3Forms (admin) funcionando en paralelo
- **Mensajes predefinidos** para WhatsApp según contexto
- **Redes sociales** - Instagram y Facebook integrados en Footer, Contact y About

### � Marketing y Publicidad (Admin)
- **Panel /store/marketing** para colecciones, carruseles y heroes
- **Programación temporal** de carruseles con fecha inicio/fin
- **Reordenamiento visual** (subir/bajar)
- **Plantillas rápidas** para crear carruseles
- **Vista previa móvil/desktop** en el modal de carrusel
- **Filtros avanzados** en selección de productos (marca, stock, precio)
- **Métricas globales** de vistas/clicks con CTR (guardadas en DB)
- **Validaciones UX** (imagen requerida, orden válido y único)

### �🔐 Seguridad y Administración
- **Panel de administración** protegido con autenticación Supabase
- **Rutas admin ofuscadas** - Paths dinámicos via `.env` (no exponen `/admin` ni `/store`)
- **Session timeout automático**:
  - 15 minutos de inactividad → cierre de sesión
  - 2 horas máximo de sesión → cierre obligatorio
  - Aviso 2 minutos antes del cierre por inactividad
- **Validación de rol admin** por lista de emails autorizados
- **Rate limiting** para protección contra abusos
- **Sanitización de inputs** contra XSS
- **Logging seguro** (sin datos sensibles en producción)
- **Almacenamiento seguro** con ofuscación en localStorage

---

## 🆕 Cambios Implementados (Enero - Febrero 2026)

### ⚙️ Sistema de Sincronización de Stock (CRITICAL FIX)
- ✅ **Stock de dos niveles** - `productos.cantidad` + `producto_variantes.cantidad` 
- ✅ **Sincronización completa en TODOS los módulos**:
  - StoreOrders (pedidos online)
  - RegistrarCompras (compras a proveedores)
  - RegistrarVentas (ventas manuales)
  - Inventario (gestión general)
- ✅ **Objeto-based grouping** - Usa objetos `{}` en lugar de arrays `[]` para evitar duplicados
- ✅ **Agregación correcta** - Cuando múltiples variantes (color/talla) se venden juntas:
  ```javascript
  // ✅ CORRECTO: Agrupa por composite key y suma cantidades
  const lineas = {};
  ventas.forEach(v => {
    const clave = `${v.color}_${v.talla}`;
    lineas[clave] = lineas[clave] || { ...v, cantidad: 0 };
    lineas[clave].cantidad += Number(v.cantidad);
  });
  
  // ❌ INCORRECTO: Array que sobrescribe duplicados
  const lineas = [];
  ventas.forEach(v => lineas.push(v)); // Pierde agregación
  ```

### 📊 Reversión de Stock en Múltiples Estados
- ✅ **StoreOrders - actualizarEstadoPedido()** (líneas 145-227)
  - Reversión cuando pedido cambia de "entregado" a otro estado
  - Agrupa variantes por composite key: `${color}_${talla}`
  - Usa `for...of` para procesamiento secuencial y confiable
- ✅ **StoreOrders - guardarCancelacion()** (líneas 282-410)
  - Reversión completa al cancelar pedido
  - Maneja correctamente multi-variantes
- ✅ **RegistrarCompras - actualizarEstadoCompra()** (líneas 515-575)
  - Reversión cuando compra cambia de "entregado" a otro estado
  - Llama a RPC `revertir_compra()` para transacción atómica
  - Recalcula `precio_compra_ultimo` y `inversion_acumulada`
- ✅ **RPC Functions** - Atomicidad garantizada en database-level
  - `entregar_compra()` - Agrega stock, actualiza precios
  - `revertir_compra()` - Quita stock, revierte precios al anterior

### 💰 Rastreo de Precios a Nivel Variante
- ✅ **Nueva columna en producto_variantes** - `precio_compra_ultimo NUMERIC(10,2)`
- ✅ **Actualización automática** - Se actualiza en `entregar_compra()` RPC
- ✅ **Promedio ponderado a nivel producto**:
  ```sql
  -- Fórmula en RPC: calcular promedio ponderado
  precio_compra_ultimo = SUM(cantidad * precio_compra_ultimo)::NUMERIC 
                       / NULLIF(SUM(cantidad), 0)
  ```
- ✅ **Displays en Inventario.jsx** (línea 1023)
  - Muestra `variante.precio_compra_ultimo` en columna "P.C. Actual"
  - Con fallback a `producto.precio_compra_ultimo` si no existe
  - Cálculo de inversión por color usa variantes específicas
- ✅ **Migraciones SQL preparadas** - MIGRACION_PRECIO_VARIANTES_v2.sql lista

### 🛒 Ventas y Compras Múltiples
- ✅ **Modo Múltiple** - Registrar varias variantes (color/talla) en una sola operación
- ✅ **Agrupación automática** - Las ventas/compras múltiples se agrupan con `grupo_venta` / `grupo_compra`
- ✅ **Historial agrupado** - Visualización expandible de grupos en tablas y cards
- ✅ **Agrupación inteligente por producto + fecha**:
  - Compras sin `grupo_compra` se agrupan si comparten:
    - `producto_id` (mismo producto)
    - `created_at` (misma fecha YYYY-MM-DD)
  - **Preserva historial**: Diferentes fechas = diferentes grupos
  - Mantiene trazabilidad de reabastecimientos en el tiempo
- ✅ **Agrupación condicional**: Solo agrupa si hay 2+ variantes del mismo producto el mismo día
- ✅ **Precio manual editable** - Permite sobrescribir el precio de venta
- ✅ **Cantidad por variante** - En modo múltiple se ingresa cantidad para cada color/talla

### 📦 Inventario y Stock
- ✅ **Validación completa** - Todos los módulos sincronizan con `producto_variantes`
- ✅ **Stock acumulativo** - Descuento correcto en ventas múltiples
- ✅ **Doble actualización**:
  - Al vender: `productos.cantidad` ↓ y `producto_variantes.cantidad` ↓
  - Al reversar: `productos.cantidad` ↑ y `producto_variantes.cantidad` ↑
- ✅ **Cálculo de inversión preciso** - Para análisis financiero y reportes
- ✅ **Interfaz mejorada** - Botón Limpiar para resetear formularios rápidamente

### 💳 Sistema de Métodos de Pago
- ✅ **Selector visual de pago** - Botones con iconos para elegir método
- ✅ **Contraentrega** - Pago en efectivo al recibir (opción por defecto)
- ✅ **Addi - Pago en cuotas** - Integración completa con pasarela Addi
- ✅ **Logo Addi** - SVG oficial en verde (#00D26A)
- ✅ **Persistencia** - Método guardado en `pedidos.metodo_pago`
- ✅ **Clasificador manual ADDI** - Admin puede distinguir "Addi Cuotas" vs "Addi PSE"
- ✅ **Transiciones de estado ADDI** - Pedidos ADDI pueden ir directo a "procesado"

### 🖼️ Color Principal de Productos (Febrero 2026)
- ✅ **Nueva columna** - `productos.color_principal TEXT` nullable
- ✅ **Selector en admin** - Al editar producto, elegir color a mostrar primero
- ✅ **Indicador visual** - Estrella dorada (★) marca el color principal
- ✅ **Afecta carruseles y catálogo** - El ProductCard muestra imagen del color principal
- ✅ **Afecta detalles** - ProductDetails inicia con el color principal seleccionado
- ✅ **Migración requerida** - `MIGRACION_COLOR_PRINCIPAL.sql`

### 🔍 SEO y Meta Tags (Febrero 2026)
- ✅ **Actualización de marca** - De "Cuspide Store" a "Pasarela"
- ✅ **Keywords optimizadas** - "botas para dama en Colombia"
- ✅ **Open Graph completo** - Imágenes y descripciones para redes sociales
- ✅ **Twitter Cards** - Formato summary_large_image
- ✅ **Sitemap actualizado** - Nueva URL /catalogo agregada
- ✅ **useMetaTags hook** - Meta tags dinámicos por página

### 🎠 Hero Promocional (Febrero 2026)
- ✅ **Slide ADDI** - "¡Compra ahora, paga después!" con información de cuotas
- ✅ **Enlace externo** - Botón "Conocer ADDI" lleva a co.addi.com
- ✅ **Diseño atractivo** - Destaca beneficios del pago en cuotas
- ✅ **Visualización en admin** - StoreOrders muestra el método en tarjetas y tickets

### 🔧 Correcciones Críticas
- ✅ **Input controlado** - Fix warnings de React
- ✅ **Expansión en desktop** - Filas expandibles correctas en historial
- ✅ **SQL sin conflictos** - Migraciones idempotentes
- ✅ **Error handling robusto** - Manejo de todos los edge cases
- ✅ **Transactions atómicas** - Operaciones seguras en base de datos

### 🖼️ Sistema de Imágenes por Color
- ✅ **Imágenes asociadas a cada color** - Máximo 4 por color
- ✅ **Modo Vista Previa** - Muestra una imagen de cada color
- ✅ **Vista Completa** - Al seleccionar color muestra todas sus imágenes

### 🔗 Compartir y Favoritos
- ✅ **Compartir con color** - URL incluye color seleccionado (?color=X)
- ✅ **Favoritos v2** - Guarda producto, color, imagen, nombre, precio

### 📱 Redes Sociales
- ✅ **Instagram y Facebook** en Footer, Contact, About
- ✅ **Iconos con hover effects**

### 🛒 Control de Cantidad
- ✅ **Máximo 5 unidades** por talla por pedido
- ✅ **Notificaciones inteligentes** según límites

### 🎨 UI/UX
- ✅ **Corazones vinotinto** en características
- ✅ **Diseño elegante** con Lucide React

### � Marketing y Publicidad (Febrero 2026)
- ✅ **Panel /store/marketing** para colecciones, carruseles y heroes
- ✅ **Programación temporal** en DB (`fecha_inicio`, `fecha_fin`)
- ✅ **Reordenamiento** de carruseles (subir/bajar)
- ✅ **Plantillas rápidas** para carruseles
- ✅ **Preview móvil/desktop** en modal
- ✅ **Filtros avanzados** de productos (marca, stock, precio min/max)
- ✅ **Métricas globales** de vistas/clicks + **CTR** en admin
- ✅ **Validaciones UX** (imagen requerida, orden único y válido)
- ✅ **UI/UX mejorada** con resumen, filtros, ordenación y responsive móvil

### �🔒 Seguridad
- ✅ Rate limiting
- ✅ Sanitización XSS
- ✅ Logging seguro
- ✅ Storage ofuscado
- ✅ Validación de admin- ✅ Rutas admin ofuscadas via `.env`
- ✅ Session timeout (15 min inactividad + 2 h máximo)
### 🎛️ Panel Admin
- ✅ Toggle de **Visibilidad** (ocultar/mostrar en tienda)

### 📐 Responsive
- ✅ Breakpoints correctos
- ✅ Filtros mobile/desktop

### 🗂️ Colecciones Públicas (Febrero 2026)
- ✅ **Página /colecciones** - Lista todas las colecciones activas
- ✅ **Página /coleccion/:id** - Muestra productos de una colección específica
- ✅ **Imágenes de portada** - Soporte para JPG, PNG, WebP y GIF animados
- ✅ **Subida de imágenes** - Admin puede subir imágenes/GIFs para cada colección
- ✅ **Hero "Ver colecciones"** - Primer slide del Hero enlaza a /colecciones
- ✅ **Integración con Marketing** - Usa tablas existentes `colecciones` y `coleccion_productos`

### 💝 Hero del Mes (Febrero 2026)
- ✅ **Hero temático** - Slide principal cambiable mensualmente
- ✅ **San Valentín** - Diseño especial con badges románticos
- ✅ **Estilos temáticos** - Badges con colores rosa, rose y rojo
- ✅ **Intervalo 8 segundos** - Carrusel más lento para mejor lectura
- ✅ **Métodos de pago en Hero ADDI** - Incluye pago contraentrega
- ✅ **Gradiente carmesí vívido** - Tonos brillantes (#8c2238, #a82d4a, #c43a5c) en vez de oscuros
- ✅ **Título estilizado** - "San Valentín en PASARELA" en blanco con contorno vinotinto (`text-stroke`)
- ✅ **Efectos visuales premium** - Fondo fondo.jpg + bokeh + pétalos + viñeta + brillo

### 📧 EmailJS - Correos al Cliente (Febrero 2026)
- ✅ **Integración @emailjs/browser** - 200 emails/mes gratis, sin dominio propio
- ✅ **Confirmación automática** - Cliente recibe email con detalles del pedido tras checkout
- ✅ **Template personalizado** - Incluye productos, precios, dirección, método de pago
- ✅ **Coexistencia con Web3Forms** - Admin sigue recibiendo notificación vía Web3Forms
- ✅ **Función `enviarConfirmacionCliente()`** - En OrderSummary.jsx, usa EmailJS

### 🔐 Rutas Admin Ofuscadas (Febrero 2026)
- ✅ **Paths dinámicos** - `/admin` y `/store` renombrados via variables `.env`
- ✅ **`VITE_ADMIN_PATH`** - Path personalizado para login (default: `gestion-pst`)
- ✅ **`VITE_STORE_PATH`** - Path personalizado para panel admin (default: `operaciones-pst`)
- ✅ **Centralizado** - `src/utils/adminPaths.js` exporta `ADMIN_PATH`, `STORE_PATH`, `storePath()`
- ✅ **8 archivos actualizados** - App.jsx, Login, ProtectedRoute, Navbar, StoreNavbar, StoreSidebar
- ✅ **Sin URLs hardcodeadas** - Todo referencia las constantes centrales

### ⏱️ Session Timeout Automático (Febrero 2026)
- ✅ **Hook `useSessionTimeout`** - Controla inactividad y duración máxima de sesión
- ✅ **15 min inactividad** - Detecta mouse, teclado, scroll, touch
- ✅ **2 horas máximo** - Tiempo absoluto desde el login (sessionStorage)
- ✅ **Aviso 2 min antes** - Toast informativo antes de cerrar por inactividad
- ✅ **Integrado en StoreLayout** - Solo activo dentro del panel admin
- ✅ **Limpieza automática** - Timers y listeners se limpian al desmontar

### 📋 Política de Garantías (Febrero 2026)
- ✅ **Nueva página /politica-garantias** - Cambios, garantías y retracto
- ✅ **Secciones completas**:
  - Condiciones generales (plazos de 15, 5 y 30 días)
  - Política de cambios (requisitos y proceso)
  - Política de garantías (1 mes, motivos de negación)
  - Derecho de retracto (5 días hábiles)
  - Prenda equivocada (corrección de errores)
- ✅ **Contacto WhatsApp** - Enlace directo al 320 267 4420
- ✅ **Enlace en Footer** - Acceso desde todas las páginas

---

## 🗄️ Migraciones SQL Requeridas

Ejecutar en **Supabase SQL Editor** en este orden:

```bash
1. MIGRACION_COMPRAS_VARIANTES.sql     
2. MIGRACION_GRUPO_COMPRAS.sql         
3. MIGRACION_VENTAS_VARIANTES.sql      
4. MIGRACION_GRUPO_VENTAS.sql          
5. MIGRACION_PRECIO_VARIANTES_v2.sql   
6. MIGRACION_MARKETING.sql             
7. ALTER_CARRUSELES_PROGRAMACION.sql  
8. FUNCIONES_RPC_ESTADISTICAS.sql      
9. MIGRACION_COLOR_PRINCIPAL.sql       # ← NUEVO: Color principal de productos
```

**Las migraciones son idempotentes** (pueden ejecutarse múltiples veces sin error)

---

## 📁 Estructura del Proyecto

```
sistema-react-supabase/
├── public/
│   ├── images/           # Imágenes estáticas (logo, hero, etc.)
│   ├── robots.txt        # SEO
│   └── sitemap.xml       # Mapa del sitio
├── src/
│   ├── components/
│   │   ├── common/       # Componentes reutilizables
│   │   └── home/         # Componentes específicos (Hero, etc.)
│   ├── pages/            # Páginas principales
│   │   ├── Colecciones.jsx         # Lista de colecciones públicas
│   │   ├── ColeccionDetalle.jsx    # Productos de una colección
│   │   ├── PoliticaGarantias.jsx   # Política de cambios y garantías
│   │   ├── PoliticaPrivacidad.jsx  # Política de privacidad
│   │   ├── PoliticaCookies.jsx     # Política de cookies
│   │   └── ...                     # Otras páginas
│   ├── store/            # Panel de administración
│   │   ├── StoreOrders.jsx         # Gestión de pedidos online
│   │   ├── StoreManageProducts.jsx # Editar productos
│   │   ├── StoreMarketing.jsx      # Colecciones, carruseles y heroes
│   │   ├── RegistrarVentas.jsx     # Registrar ventas manuales
│   │   ├── RegistrarCompras.jsx    # Registrar compras a proveedores
│   │   ├── Inventario.jsx          # Control de inventario
│   │   ├── Dashboard.jsx           # Resumen de ventas/compras
│   │   └── StoreAddProduct.jsx     # Agregar nuevos productos
│   ├── redux/            # Gestión de estado
│   ├── services/         # APIs y servicios
│   ├── utils/            # Funciones utilitarias
│   │   └── adminPaths.js       # Paths dinámicos admin/store desde .env
│   ├── hook/             # Custom React hooks
│   │   ├── useAuth.js          # Autenticación Supabase
│   │   ├── useSessionTimeout.js # Timeout inactividad + sesión máxima
│   │   └── useNotify.jsx       # Sistema de toasts
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── supabase/
│   └── functions/        # Edge Functions (serverless)
│       ├── addi-auth/          # OAuth con ADDI
│       ├── addi-config/        # Configuración de comercio
│       ├── addi-create-application/ # Crear solicitud de crédito
│       └── addi-webhook/       # Webhook para notificaciones
├── DATABASE_SCHEMA.sql   # Schema completo regenerable
├── DATABASE_COMPLETE.sql # Versión mejorada con comentarios
├── MIGRACION_*.sql       # Migraciones específicas
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## 🚀 Instalación

### Prerrequisitos
- Node.js 18+
- npm o yarn
- Cuenta en Supabase

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/Klooy/PASARELA-STORE.git
cd PASARELA-STORE
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Crear base de datos en Supabase**
- Ir a Supabase SQL Editor
- Ejecutar `DATABASE_SCHEMA.sql` completo
- Luego ejecutar migraciones en orden

4. **Configurar variables de entorno**

Crear archivo `.env` en la raíz:
```env
# Supabase (Obligatorias)
VITE_SUPABASE_URL=tu_supabase_url
VITE_SUPABASE_ANON_KEY=tu_supabase_anon_key

# Contacto y Emails
VITE_WHATSAPP_NUMBER=573001234567
VITE_ADMIN_EMAILS=admin@email.com,otro_admin@email.com
VITE_WEB3FORMS_ACCESS_KEY=tu_web3forms_key       # Notificaciones al admin
VITE_EMAILJS_SERVICE_ID=tu_emailjs_service_id     # Confirmación al cliente
VITE_EMAILJS_TEMPLATE_ID=tu_emailjs_template_id
VITE_EMAILJS_PUBLIC_KEY=tu_emailjs_public_key

# ADDI - Pagos en Cuotas (Opcional)
VITE_ADDI_ALLY_SLUG=tu_ally_slug_de_addi
VITE_ADDI_STAGING=true    # 'true' para sandbox, 'false' para producción
VITE_SITE_URL=https://tu-sitio.com   # URL base para redirects de ADDI

# Seguridad Admin (Rutas ofuscadas)
VITE_ADMIN_PATH=gestion-pst       # Path para login admin (default: admin)
VITE_STORE_PATH=operaciones-pst   # Path para panel admin (default: store)
```

**Variables secretas de ADDI** (en Supabase Edge Functions):
- `ADDI_CLIENT_ID` - ID de cliente OAuth
- `ADDI_CLIENT_SECRET` - Secreto de cliente OAuth

5. **Iniciar en desarrollo**
```bash
npm run dev
```

6. **Build para producción**
```bash
npm run build
```

---

## 📱 Páginas Principales

| Ruta | Descripción | Rol |
|------|-------------|-----|
| `/` | Página principal con Hero y productos destacados | Público |
| `/products` | Catálogo completo con filtros | Público |
| `/product/:id` | Detalles del producto con galería | Público |
| `/cart` | Carrito de compras | Público |
| `/about` | Sobre nosotros | Público |
| `/contact` | Formulario de contacto | Público |
| `/track-order` | Seguimiento de pedidos | Público |
| `/{ADMIN_PATH}` | Login administrador (ruta ofuscada) | Admin |
| `/{STORE_PATH}/orders` | Gestión de pedidos online | Admin |
| `/{STORE_PATH}/manage-products` | Editar productos | Admin |
| `/{STORE_PATH}/add-product` | Agregar productos | Admin |
| `/{STORE_PATH}/registrar-ventas` | Registrar ventas manuales | Admin |
| `/{STORE_PATH}/registrar-compras` | Registrar compras | Admin |
| `/{STORE_PATH}/inventario` | Control de inventario | Admin |
| `/{STORE_PATH}/marketing` | Marketing (colecciones y carruseles) | Admin |
| `/{STORE_PATH}/dashboard` | Resumen de ventas | Admin |

> **Nota:** `{ADMIN_PATH}` y `{STORE_PATH}` son configurables via `.env` para ocultar las rutas del panel admin.

---

## 🛠️ Tecnologías

### Frontend
- **React 18** - Biblioteca UI
- **Vite 7** - Build tool ultra rápido
- **Tailwind CSS 3** - Estilos utility-first
- **Redux Toolkit** - Gestión de estado global
- **React Router DOM** - Enrutamiento SPA
- **Lucide React** - Iconografía moderna
- **@emailjs/browser** - Emails de confirmación al cliente

### Backend & Database
- **Supabase** - PostgreSQL + Auth + Storage
- **RPC Functions** - Lógica atómica en base de datos
- **Vercel** - Despliegue y hosting

### Fuentes
- **Playfair Display** - Títulos elegantes (serif)
- **Montserrat** - Texto general (sans-serif)

---

## 🎨 Componentes Destacados

### 🖼️ ProductDetails
- Galería con zoom y swipe
- **Imágenes por color** con modo preview/completo
- Selector de colores visual
- Selector de tallas con validación
- Indicador de stock en tiempo real
- Límite de 5 unidades por compra
- Botones de navegación
- Compartir con color incluido
- Favoritos mejorados
- Botón WhatsApp contextual

### 🛒 Cart & Counter
- Lista de productos con variantes
- Control de cantidad con validación de stock TOTAL
- Resumen de pedido
- Checkout vía WhatsApp
- Descuentos aplicados

### 🏠 Hero
- Carrusel automático
- Texto rotativo con animaciones
- Efectos glamour
- Call-to-action destacado
- **Programación temporal** de carruseles (inicio/fin)
- **Métricas de vistas/clicks** con CTR

### 📞 Contact
- Tarjetas de métodos de contacto
- Formulario con Web3Forms (notificación admin)
- EmailJS (confirmación automática al cliente)
- Integración WhatsApp

### 🛡️ StoreManageProducts (Admin)
- Toggle de **Stock** (disponible/agotado)
- Toggle de **Oferta** (activa/inactiva)
- Toggle de **Visibilidad** (visible/oculto)
- Deshabilitar colores/tallas
- Edición completa

### 📣 StoreMarketing (Admin)
- Gestión de **colecciones** (productos, portada, estado)
- Gestión de **carruseles y heroes** (orden, estado, CTA)
- **Programación temporal** por rango de fechas
- **Métricas globales** (vistas, clicks, CTR)
- **Plantillas** y **preview móvil/desktop**
- **Filtros avanzados** y UX mejorada

---

## 📊 Flujos de Datos

### 📦 Flujo de Pedidos Online
```
1. Cliente selecciona productos + variantes
   └─→ Validación de stock TOTAL
   
2. Cliente elige método de pago
   └─→ Contraentrega o Addi
   
3. Checkout vía WhatsApp
   └─→ Email de confirmación
   
4. Admin confirma en panel
   └─→ Estado: pendiente → confirmado
   
5. Admin envía pedido
   └─→ Estado: confirmado → enviado
   └─→ Registra número de guía
   
6. Admin marca como entregado
   └─→ Estado: enviado → entregado
   └─→ Se registran VENTAS automáticamente
   └─→ Stock REVERSIBLE si regresa a "enviado"
   
7. (Opcional) Cancelación
   └─→ Se restaura stock completo
   └─→ Se eliminan ventas
```

### 💳 Flujo de Compras
```
1. Admin registra compra (pendiente)
   └─→ Sin actualizar stock aún
   
2. Admin marca como entregado
   └─→ Estado: pendiente → entregado
   └─→ Stock se actualiza (AMBOS niveles)
   └─→ Precio_compra_ultimo se actualiza
   └─→ Inversión acumulada se recalcula
   
3. (Opcional) Reversión
   └─→ Compra regresa a pendiente
   └─→ Stock se restaura
   └─→ Precio se revierte al anterior
```

### 📈 Flujo de Stock
```
NIVEL 1: productos.cantidad (stock total)
  = SUM(producto_variantes.cantidad)
  
NIVEL 2: producto_variantes (stock por color/talla)
  - Actualizado en compras (entregar_compra)
  - Actualizado en ventas (registrar_venta)
  - Reversible en ambos casos
  
SINCRONIZACIÓN:
  - Al vender: ambos niveles ↓
  - Al reversar: ambos niveles ↑
  - Siempre consistentes
```

---

## 💾 Schema SQL Completo

### Tabla: productos
```sql
CREATE TABLE productos (
  id UUID PRIMARY KEY,
  nombre TEXT NOT NULL,
  descripcion TEXT,
  precio_venta NUMERIC(10,2) NOT NULL,
  precio_oferta NUMERIC(10,2),
  precio_compra_inicial NUMERIC(10,2),
  precio_compra_ultimo NUMERIC(10,2),
  inversion_acumulada NUMERIC(12,2) DEFAULT 0,
  cantidad INTEGER DEFAULT 0,
  colores TEXT[] DEFAULT '{}',
  tallas TEXT[] DEFAULT '{}',
  categoria TEXT[] DEFAULT '{}',
  marca TEXT,
  oferta BOOLEAN DEFAULT false,
  destacado BOOLEAN DEFAULT false,
  es_nuevo BOOLEAN DEFAULT true,
  visible BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Tabla: producto_variantes
```sql
CREATE TABLE producto_variantes (
  id UUID PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  color TEXT NOT NULL,
  talla TEXT NOT NULL,
  cantidad INTEGER DEFAULT 0,
  precio_compra_ultimo NUMERIC(10,2),
  sku TEXT,
  precio_adicional NUMERIC(10,2) DEFAULT 0,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(producto_id, color, talla)
);
```

### Tabla: compras
```sql
CREATE TABLE compras (
  id UUID PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL,
  precio_compra NUMERIC(10,2) NOT NULL,
  proveedor TEXT,
  color TEXT,
  talla TEXT,
  grupo_compra UUID,
  estado TEXT DEFAULT 'pendiente',
  fecha DATE NOT NULL,
  created_at TIMESTAMP
);
```

### Tabla: ventas
```sql
CREATE TABLE ventas (
  id UUID PRIMARY KEY,
  producto_id UUID REFERENCES productos(id) ON DELETE CASCADE,
  cantidad INTEGER NOT NULL,
  precio_venta NUMERIC(10,2) NOT NULL,
  cliente TEXT,
  origen TEXT DEFAULT 'ONLINE',
  color TEXT,
  talla TEXT,
  grupo_venta UUID,
  pedido_id UUID REFERENCES pedidos(id) ON DELETE SET NULL,
  fecha DATE NOT NULL,
  created_at TIMESTAMP
);
```

### RPC Function: entregar_compra()
```sql
-- Agrega stock al inventario y actualiza precios
-- Actualiza AMBOS niveles: productos + producto_variantes
-- Calcula promedio ponderado si tiene variantes
FUNCTION entregar_compra(p_compra_id UUID)
```

### RPC Function: revertir_compra()
```sql
-- Quita stock del inventario
-- Revierte precios al anterior
-- Maneja compras pendientes (sin afectar stock)
-- Maneja compras entregadas (revierte stock)
FUNCTION revertir_compra(p_compra_id UUID)
```

---

## 🚀 Despliegue en Vercel

1. Conectar repositorio de GitHub
2. Configurar variables de entorno:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
   - `VITE_WHATSAPP_NUMBER`
   - `VITE_ADMIN_EMAILS`
   - `VITE_WEB3FORMS_ACCESS_KEY`
   - `VITE_EMAILJS_SERVICE_ID`
   - `VITE_EMAILJS_TEMPLATE_ID`
   - `VITE_EMAILJS_PUBLIC_KEY`
   - `VITE_ADMIN_PATH`
   - `VITE_STORE_PATH`
   - `VITE_SITE_URL`
3. Build command: `npm run build`
4. Output directory: `dist`
5. Deploy automático en push a `main`

---

## 📝 Scripts Disponibles

```bash
npm run dev      # Servidor de desarrollo
npm run build    # Build de producción
npm run preview  # Preview del build
npm run lint     # ESLint
```

---

## 🔄 Lógica de Agrupación

### Agrupación por grupo_compra (Explícita)
Cuando se registra una "compra múltiple", se asigna un UUID común (`grupo_compra`) a todas las variantes:
```javascript
// Múltiples tallas de Botas en una sola "compra múltiple"
- Botas Rojo-S (grupo_compra: ABC-123)
- Botas Rojo-M (grupo_compra: ABC-123) 
- Botas Azul-S (grupo_compra: ABC-123)

// Aparecen como 1 grupo colapsado en historial
```

### Agrupación por producto_id + fecha (Implícita)
Cuando se agregan variantes sin `grupo_compra`:
```javascript
// Nuevas Botas agregadas el 28 enero
- Botas Rojo-S (28 enero, sin grupo_compra)
- Botas Rojo-M (28 enero, sin grupo_compra) 
- Botas Azul-S (28 enero, sin grupo_compra)

// Se agrupan automáticamente por producto_id + YYYY-MM-DD
// Aparecen como 1 grupo colapsado

// 30 enero - Botas Rojo-L (diferente fecha)
// → Aparecen como OTRO grupo separado (diferente reabastecimiento)
```

---

## 🎯 Patrones de Código

### Aggregación Correcta de Variantes
```javascript
// ✅ CORRECTO: Objeto con composite key
const groups = {};
items.forEach(item => {
  const key = `${item.color}_${item.talla}`;
  groups[key] = groups[key] || { ...item, cantidad: 0 };
  groups[key].cantidad += Number(item.cantidad);
});
```

### Procesamiento Secuencial de Async
```javascript
// ✅ CORRECTO: for...of para async
for (const item of items) {
  await updateStock(item);
  await updatePrice(item);
}

// ❌ INCORRECTO: forEach con async
items.forEach(async item => {
  await updateStock(item);  // Corre en paralelo sin control
});
```

### Validación de Stock
```javascript
// ✅ Validar stock TOTAL del producto (nivel pedido)
if (producto.cantidad < totalUnidades) {
  throw "Stock insuficiente";
}

// ✅ Al vender: actualizar variante específica
await updateVariante(color, talla, -cantidad);

// ✅ Al actualizar producto: recalcular desde variantes
producto.cantidad = SUM(variantes.cantidad);
```

---

## 🧪 Testing

### Stock Sync Test
```javascript
// 1. Crear producto con 10 unidades (2 colores, 5 tallas cada uno)
// 2. Vender 3 unidades de Rojo-S
// 3. Verificar:
//    - productos.cantidad = 7
//    - producto_variantes[Rojo-S].cantidad = 2
// 4. Reversar venta
// 5. Verificar:
//    - productos.cantidad = 10
//    - producto_variantes[Rojo-S].cantidad = 5
```

### Price Weighted Average Test
```javascript
// 1. Compra 1: 5 uds de Rojo-S a $100 c/u
// 2. Compra 2: 5 uds de Rojo-M a $120 c/u
// 3. Verificar:
//    - producto_variantes[Rojo-S].precio_compra_ultimo = 100
//    - producto_variantes[Rojo-M].precio_compra_ultimo = 120
//    - productos.precio_compra_ultimo = 110 (promedio ponderado)
```

---

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama feature (`git checkout -b feature/NuevaCaracteristica`)
3. Commit cambios (`git commit -m 'Agregar nueva característica'`)
4. Push a la rama (`git push origin feature/NuevaCaracteristica`)
5. Abrir Pull Request

---

## 📄 Licencia

Este proyecto es privado y de uso exclusivo para **PASARELA - Siempre Trendy**.

---

## 👨‍💻 Desarrollo

Desarrollado con ❤️ para **PASARELA Store**

**Última actualización:** Febrero 7, 2026

**Build Status:** ✅ Passing

---

<p align="center">
  <img src="public/images/logo.png" alt="PASARELA Logo" width="150">
  <br>
  <strong>PASARELA - Siempre Trendy</strong>
  <br>
  <em>Tu destino de moda online</em>
</p>
