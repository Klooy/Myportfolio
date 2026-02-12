# 🏗️ Arquitectura del Sistema de Facturación

## Diagrama General

```
┌─────────────────────────────────────────────────────────────────────┐
│                          APLICACIÓN REACT                           │
│                     (portafolioReactjs/App.jsx)                     │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                               ↓
┌─────────────────────────────────────────────────────────────────────┐
│                    Redux Store Provider                             │
│  (src/redux/store.js - Provee estado global a toda la app)         │
└──────────────────────────────┬──────────────────────────────────────┘
                               │
                ┌──────────────┼──────────────┐
                ↓              ↓              ↓
        ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
        │ Facturacion │ │  Clientes   │ │ Productos   │
        │   Slice     │ │   Slice     │ │   Slice     │
        └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
               │               │               │
               └───────────────┼───────────────┘
                               ↓
        ┌──────────────────────────────────────────┐
        │      Componentes React (UI)              │
        ├──────────────────────────────────────────┤
        │  • InvoicingModule.jsx (Main Page)       │
        │  • CrearFacturaForm.jsx (Create)         │
        │  • ListadoFacturas.jsx (List)            │
        │  • GestionClientes.jsx (Clients CRUD)    │
        │  • GestionProductos.jsx (Products CRUD)  │
        └──────────────────────────────────────────┘
```

---

## Flujo de Datos

```
Usuario (UI)
    │
    ↓
┌─────────────────────┐
│  Component JSX      │
│ (Ej: CrearFactura)  │
└──────────┬──────────┘
           │ dispatch(action)
           ↓
┌─────────────────────────┐
│  Redux Action/Thunk     │
│ (Ej: crearFactura)      │
└──────────┬──────────────┘
           │ async call
           ↓
┌──────────────────────────────┐
│  Services (API/Database)     │
├──────────────────────────────┤
│ • factusAPI.js (HTTP)        │
│ • localDataService.js (DB)   │
└──────────┬───────────────────┘
           │ response
           ↓
┌────────────────────────┐
│  Reducer Updates State │
│ (Redux Slice)          │
└──────────┬─────────────┘
           │ state change
           ↓
┌────────────────────────┐
│  Component Re-renders  │
│ (useSelector)          │
└──────────┬─────────────┘
           ↓
      UI Actualizado
```

---

## Flujo Específico: Crear una Factura

```
1. Usuario llena formulario en CrearFacturaForm.jsx
                        │
                        ↓
2. Presiona botón "Crear Factura"
                        │
                        ↓
3. dispatch(crearFactura(datosFactura))
                        │
                        ↓
4. Redux Thunk ejecuta:
   ├─ Valida datos
   ├─ Calcula totales con calcularTotalesFactura()
   ├─ Envía a Supabase (localDataService.create())
   │       │
   │       ↓ INSERT INTO invoicing_facturas
   │ Retorna factura con ID
   │
   └─ Actualiza Redux state (reducer)
                        │
                        ↓
5. ListadoFacturas.jsx se actualiza automáticamente
   (useSelector detecta cambio)
                        │
                        ↓
6. Nueva factura visible en tabla
```

---

## Flujo: Enviar a Factus DIAN

```
Factura en estado "borrador"
                        │
                        ↓
Usuario presiona "Enviar a Factus"
                        │
                        ↓
dispatch(enviarFacturaAFactus(facturaId))
                        │
                        ↓
Redux Thunk:
├─ Obtiene factura de state
├─ Prepara formato Factus
├─ Llama factusAPI.crearFactura()
│        │
│        ↓ POST a https://api-sandbox.factus.com.co
│        │ OAuth2 Token + Datos
│        │
│        ↓ Respuesta DIAN
├─ Actualiza BD (estado = 'enviada')
├─ Guarda respuesta Factus en JSON
│
└─ Actualiza Redux state
                        │
                        ↓
Estado cambia a "Enviada"
                        │
                        ↓
UI muestra botón "Verificar Estado DIAN"
```

---

## Validación en Cascada

```
CrearFacturaForm
    │
    ├─ validarFormulario() [Frontend]
    │  ├─ Cliente seleccionado?
    │  ├─ Items agregados?
    │  └─ Totales válidos?
    │
    ↓
Redux Thunk (crearFactura)
    │
    ├─ Validaciones de negocio
    │  ├─ Cliente existe en BD?
    │  ├─ Productos existen?
    │  └─ Precios válidos?
    │
    ↓
Supabase (Backend)
    │
    ├─ RLS policies (Seguridad)
    ├─ Constraints SQL
    └─ Triggers
         │
         ↓
BD actualizada
```

---

## Mapeo: Componentes ↔ Redux Slices

```
┌──────────────────────────────────────────────────┐
│             CrearFacturaForm.jsx                 │
│                                                  │
│ Usa:                                             │
│  • dispatch(crearFactura)                        │
│  • dispatch(fetchClientes)                       │
│  • dispatch(fetchProductos)                      │
│  • useSelector(clientes)                         │
│  • useSelector(productos)                        │
└────────┬──────────────────────────────────────┬──┘
         │                                      │
         ↓                                      ↓
┌─────────────────┐    ┌──────────────┐  ┌──────────────┐
│ facturacionSlice│    │clientesSlice │  │productosSlice│
│                 │    │              │  │              │
│ • crearFactura  │    │ •fetchClientes│  │•fetchProductos
│ • updateFactura │    │ •crearCliente │  │•crearProducto
│ • enviarAFactus │    │ •actualizarCl │  │•actualizarProd
└─────────────────┘    └──────────────┘  └──────────────┘


┌──────────────────────────────────────────────────┐
│             ListadoFacturas.jsx                  │
│                                                  │
│ Usa:                                             │
│  • useSelector(facturas)                         │
│  • dispatch(fetchFacturas)                       │
│  • dispatch(setFiltros)                          │
│  • dispatch(enviarFacturaAFactus)                │
└────────┬──────────────────────────────────────┬──┘
         │                                      │
         ↓                                      ↓
┌──────────────────────────────────────────────────┐
│            facturacionSlice                      │
│                                                  │
│ • fetchFacturas                                  │
│ • setFiltros                                     │
│ • enviarFacturaAFactus                           │
│ • verificarEstadoFactura                         │
└──────────────────────────────────────────────────┘
```

---

## Flujo de Datos: Base de Datos

```
┌─────────────────────────────────────────┐
│         SUPABASE PostgreSQL             │
├─────────────────────────────────────────┤
│                                         │
│  invoicing_clientes                     │
│  ├─ id (UUID)                           │
│  ├─ user_id (FK auth.users)             │
│  ├─ razonSocial, nit, email...          │
│  ├─ cliente_factus_id (sync Factus)     │
│  └─ timestamps                          │
│                                         │
│  invoicing_productos                    │
│  ├─ id (UUID)                           │
│  ├─ user_id (FK auth.users)             │
│  ├─ nombre, codigo, precio, iva...      │
│  └─ timestamps                          │
│                                         │
│  invoicing_facturas                     │
│  ├─ id (UUID)                           │
│  ├─ user_id (FK auth.users)             │
│  ├─ cliente_id (FK invoicing_clientes)  │
│  ├─ numero, items (JSONB), totales      │
│  ├─ estado (borrador→enviada→aceptada)  │
│  ├─ datos_factus (JSONB response)       │
│  └─ timestamps                          │
│                                         │
└─────────────────────────────────────────┘
         ↑              ↑              ↑
         │              │              │
    SELECT         INSERT/UPDATE    DELETE
         │              │              │
         └──────────────┴──────────────┘
              localDataService.js
              (Supabase Queries)
```

---

## Flujo de Integración Factus

```
┌────────────────────────────────┐
│      factusAPI.js              │
│   (Factus Colombia API Client) │
├────────────────────────────────┤
│                                │
│  Autenticación:                │
│  getAccessToken()              │
│  ├─ POST /v1/auth/token        │
│  ├─ OAuth2 (username/password) │
│  └─ Caching de token           │
│                                │
│  Clientes:                      │
│  ├─ getClientes()              │
│  ├─ crearCliente()             │
│  └─ sync con BD local          │
│                                │
│  Facturas:                      │
│  ├─ crearFactura()             │
│  ├─ getFacturas()              │
│  ├─ getEstadoFactura() [DIAN]  │
│  └─ validarFactura()           │
│                                │
│  Descargas:                     │
│  ├─ obtenerPDF()               │
│  └─ obtenerXML()               │
│                                │
└────────┬──────────────────────┬┘
         │                      │
    OAuth2                  HTTP/JSON
    Token                      ↓
         │           ┌─────────────────────┐
         └──────────→│ FACTUS SANDBOX API  │
                     │ https://api-sandbox │
                     │ .factus.com.co      │
                     └──────────┬──────────┘
                                │
                                ↓
                            ┌─────────┐
                            │ DIAN    │
                            │ Colombia│
                            └─────────┘
```

---

## Validaciones DIAN

```
NIT Validation (facturacionUtils.js)
│
├─ validarNIT(nit)
│  │
│  ├─ Longitud: 6-10 dígitos
│  │
│  ├─ Separar dígito verificador
│  │  Ej: 9007654321 → 900765432 + 1
│  │
│  ├─ Aplicar algoritmo DIAN
│  │  └─ Multiplicador 2-9
│  │  └─ Suma de productos
│  │  └─ Módulo 11
│  │
│  └─ Comparar dígitos
│     └─ Si Match → Válido
│     └─ Si NoMatch → Inválido
│
└─ Usado en:
   ├─ GestionClientes.jsx
   ├─ crearCliente (thunk)
   └─ factusAPI.crearCliente()
```

---

## Cálculos de Factura

```
Línea de Factura:
  Cantidad × Precio Unit
         │
         ↓
    Subtotal
         │
    ┌────┴────┐
    ↓         ↓
Descuento   Monto
(linea)     Descuento
    │         │
    └────┬────┘
         ↓
   Monto Neto
         │
         ↓
    IVA (19%)
         │
    ┌────┴─────┐
    ↓          ↓
 Impuesto    Total
             Línea


Factura Completa:
  ∑ Subtotales
     │
     ↓
  Subtotal
  Factura
     │
  ┌──┴──┐
  ↓     ↓
Desc   ├─ Descuentos línea
Linea  └─ Descuento global
  │
  └─→ Monto Neto
      │
      ├─ IVA
      ├─ INC
      ↓
   Total Factura
```

---

## Flujo de Error

```
Error en cualquier punto:
          │
    ┌─────┴─────┐
    ↓           ↓
Frontend    Backend
Error       Error
    │           │
    └─────┬─────┘
          ↓
   Redux Action Rejected
          │
    ┌─────┴─────────────────┐
    ↓                       ↓
Set state.error      Mostrar alert
   ↓                     ↓
Componente       usuario ve
Muestra error    mensaje
```

---

## Performance: Caching de Token

```
Primera solicitud:
  getAccessToken() → Token nulo
         ↓
  Genera nuevo token (OAuth2)
         ↓
  Almacena en variable global
         ↓
  Retorna token

Solicitudes siguientes (< 5 min):
  getAccessToken() → Token en cache
         ↓
  Valida expiración
         ↓
  Retorna token sin nueva call

Token a punto de expirar:
  Genera nuevo token
  (5 min antes del vencimiento)
```

---

## Resumen: Todas las Piezas Juntas

```
Usuario
  │
  └─→ UI React Component
      ├─ CrearFacturaForm.jsx
      ├─ ListadoFacturas.jsx
      ├─ GestionClientes.jsx
      └─ GestionProductos.jsx
          │
          ↓ dispatch + useSelector
          │
      Redux Store
      ├─ facturacionSlice
      ├─ clientesSlice
      └─ productosSlice
          │
          ↓ async thunks
          │
      Services
      ├─ factusAPI.js (HTTP)
      └─ localDataService.js (Supabase)
          │
          ├─→ https://api-sandbox.factus.com.co
          │       │
          │       ↓
          │    DIAN Colombia
          │
          └─→ https://supabase.co
                  │
                  ↓
              PostgreSQL DB
```

---

Este diagrama muestra la arquitectura completa del sistema. 
¡Cada componente está implementado y listo para usar!
