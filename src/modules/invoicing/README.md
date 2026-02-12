# Sistema de Facturación Electrónica - Guía de Instalación

Este es un módulo completo de facturación electrónica integrado con Factus Colombia para tu proyecto portfolio.

## Instalación Rápida

### 1. Dependencias Requeridas

```bash
npm install @reduxjs/toolkit react-redux @supabase/supabase-js
```

### 2. Variables de Entorno

Crea un archivo `.env.local` en la raíz de tu proyecto:

```env
# Factus API Configuration
VITE_FACTUS_API_URL=https://api-sandbox.factus.com.co
VITE_FACTUS_CLIENT_ID=9e9929e9-5ff9-4b69-8690-a9c93736d49c
VITE_FACTUS_CLIENT_SECRET=UDMf4UKXIehCXaCBSz78EfJahLIXgfW1dhrS8lDk
VITE_FACTUS_USERNAME=sandbox@factus.com.co
VITE_FACTUS_PASSWORD=sandbox2024%

# Supabase Configuration
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_KEY=tu_clave_de_supabase
```

### 3. Configurar Redux Store

Si aún no tienes Redux configurado, actualiza tu archivo principal de Redux (`src/redux/store.js` o similar):

```javascript
import { configureStore } from '@reduxjs/toolkit';
import facturacionReducer from '../modules/invoicing/features/facturacionSlice';
import clientesReducer from '../modules/invoicing/features/clientesSlice';
import productosReducer from '../modules/invoicing/features/productosSlice';

export const store = configureStore({
  reducer: {
    facturacion: facturacionReducer,
    clientes: clientesReducer,
    productos: productosReducer,
  },
});

export default store;
```

### 4. Crear Tablas en Supabase

Ejecuta las siguientes consultas SQL en tu base de datos Supabase:

```sql
-- Tabla de Clientes
CREATE TABLE IF NOT EXISTS invoicing_clientes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  razonSocial TEXT NOT NULL,
  nit TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  telefono TEXT,
  direccion TEXT,
  ciudad TEXT,
  departamento TEXT,
  cliente_factus_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Tabla de Productos
CREATE TABLE IF NOT EXISTS invoicing_productos (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nombre TEXT NOT NULL,
  codigo TEXT NOT NULL,
  descripcion TEXT,
  precio DECIMAL(12, 2) NOT NULL,
  iva INTEGER DEFAULT 19,
  inc DECIMAL(5, 2) DEFAULT 0,
  stock INTEGER DEFAULT 0,
  unidad TEXT DEFAULT 'UND',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, codigo)
);

-- Tabla de Facturas
CREATE TABLE IF NOT EXISTS invoicing_facturas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES invoicing_clientes(id) ON DELETE RESTRICT,
  numero TEXT NOT NULL,
  items JSONB NOT NULL,
  subtotal DECIMAL(12, 2),
  descuentos DECIMAL(12, 2) DEFAULT 0,
  impuestos DECIMAL(12, 2),
  total DECIMAL(12, 2),
  notas TEXT,
  estado TEXT DEFAULT 'borrador',
  datos_factus JSONB,
  fecha_emision TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Índices para mejor rendimiento
CREATE INDEX idx_invoicing_clientes_user_id ON invoicing_clientes(user_id);
CREATE INDEX idx_invoicing_productos_user_id ON invoicing_productos(user_id);
CREATE INDEX idx_invoicing_facturas_user_id ON invoicing_facturas(user_id);
CREATE INDEX idx_invoicing_facturas_cliente_id ON invoicing_facturas(cliente_id);
CREATE INDEX idx_invoicing_facturas_estado ON invoicing_facturas(estado);
```

### 5. Integrar en tu Aplicación

En tu archivo `App.jsx`, importa el módulo:

```jsx
import InvoicingModule from './modules/invoicing/pages/InvoicingModule';

function App() {
  return (
    <div>
      {/* ... otros componentes ... */}
      <InvoicingModule />
    </div>
  );
}
```

O crea una ruta específica:

```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import InvoicingModule from './modules/invoicing/pages/InvoicingModule';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ... otras rutas ... */}
        <Route path="/facturas" element={<InvoicingModule />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## Estructura de Carpetas

```
src/modules/invoicing/
├── components/
│   ├── CrearFacturaForm.jsx       # Formulario para crear/editar facturas
│   ├── ListadoFacturas.jsx        # Tabla de facturas con filtros
│   ├── GestionClientes.jsx        # CRUD de clientes
│   └── GestionProductos.jsx       # CRUD de productos
├── features/
│   ├── facturacionSlice.js        # Redux slice para facturas
│   ├── clientesSlice.js           # Redux slice para clientes
│   └── productosSlice.js          # Redux slice para productos
├── services/
│   ├── factusAPI.js               # Integración API Factus Colombia
│   └── localDataService.js        # Operaciones Supabase
├── utils/
│   └── facturacionUtils.js        # Utilidades (cálculos, validaciones, formatos)
├── pages/
│   └── InvoicingModule.jsx        # Página principal con tabs
└── README.md
```

## Características Principales

✅ **Gestión de Clientes**
- CRUD completo con validación DIAN de NIT
- Búsqueda y filtrado
- Sincronización automática con Factus

✅ **Catálogo de Productos**
- CRUD con configuración de impuestos (IVA, INC)
- Gestión de stock
- Múltiples unidades de medida

✅ **Creación de Facturas**
- Formulario multi-item con cálculos automáticos
- Descuentos por línea y globales
- Validación de totales en tiempo real
- Envío directo a Factus Colombia

✅ **Listado y Gestión**
- Tabla filtrable por estado, cliente y fecha
- Vista detallada de facturas
- Verificación de estado DIAN
- Descarga de PDF y XML

✅ **Cálculos Precisos**
- IVA (0%, 5%, 19%)
- INC variable según producto
- Descuentos con recálculo de impuestos
- Redondeo bancario a 2 decimales

✅ **Validaciones DIAN**
- Algoritmo de dígito verificador NIT
- Formato de email
- Teléfono colombiano
- Consecutivos secuenciales

## Ejemplos de Uso

### Crear un Cliente

```javascript
dispatch(crearCliente({
  razonSocial: 'Empresa S.A.S',
  nit: '9007654321',
  email: 'contacto@empresa.com',
  telefono: '6015551234',
  direccion: 'Calle 1 #123',
  ciudad: 'Bogotá',
  departamento: 'Cundinamarca'
}));
```

### Crear un Producto

```javascript
dispatch(crearProducto({
  nombre: 'Laptop',
  codigo: 'LAPTOP-001',
  descripcion: 'Laptop Dell XPS 13',
  precio: 2500000,
  iva: 19,
  inc: 0,
  stock: 10,
  unidad: 'UND'
}));
```

### Crear una Factura

```javascript
dispatch(crearFactura({
  numero: 'INV-001-000001',
  cliente_id: 'uuid-del-cliente',
  items: [
    {
      descripcion: 'Laptop',
      productoId: 'uuid-producto',
      cantidad: 1,
      precioUnitario: 2500000,
      iva: 19,
      descuento: 10
    }
  ],
  descuentoGlobal: 0,
  notas: 'Pago a 30 días'
}));
```

## Notas Importantes

⚠️ **Credenciales Sandbox**
- Las credenciales proporcionadas son para ambiente SANDBOX
- Para producción, contacta a Factus Colombia
- No expongas las credenciales en repositorios públicos

⚠️ **Validación DIAN**
- El NIT debe incluir el dígito de verificación
- Se valida automáticamente usando el algoritmo DIAN
- Ejemplo válido: `9007654321` (10 dígitos)

⚠️ **Supabase**
- Asegúrate de configurar correctamente las políticas de seguridad (RLS)
- Los datos se filtra por `user_id` automáticamente
- Requiere autenticación antes de usar

## Solución de Problemas

**Error: "Usuario no autenticado"**
- Verifica que el usuario esté logeado en Supabase
- Asegúrate de tener Supabase configurado correctamente

**Error: "Token inválido de Factus"**
- Verifica las credenciales en `.env.local`
- Comprueba que sean las del ambiente Sandbox correcto

**Error: "NIT inválido"**
- El NIT debe incluir el dígito de verificación
- Usa el algoritmo DIAN: `validarNIT('9007654321')`

## Próximos Pasos

1. Implementar descarga de PDF completo
2. Agregar generación de XML de DIAN
3. Implementar reportes y analytics
4. Agregar soporte para múltiples resoluciones
5. Crear dashboard de ventas

---

Para más información, contacta a Factus Colombia: https://factus.com.co
