# 🧪 Guía de Testing - Sistema de Facturación

## Requisitos Previos

✅ Proyecto ejecutándose: `npm run dev`
✅ Navegador abierto en: `http://localhost:5173`
✅ Datos de Supabase configurados en `.env.local`
✅ Módulo accesible en: `/facturas`

---

## 📋 Test 1: Gestión de Clientes

### Crear Cliente

**Pasos**:
1. Navega a `/facturas`
2. Haz clic en pestaña "👥 Clientes"
3. Haz clic en botón "➕ Nuevo Cliente"

**Formulario a completar**:
```
Sección Básica:
  ├─ Razón Social: "Empresa XYZ Ltda"
  ├─ NIT: "123456789-0"
  ├─ Tipo de Persona: "Jurídica"
  └─ Email: "contacto@empresa.com"

Sección Contacto:
  ├─ Teléfono: "+57 1 234 5678"
  ├─ Celular: "+57 312 3456789"
  └─ Contacto Principal: "Juan Pérez - Gerente"

Sección Dirección:
  ├─ Dirección: "Calle 10 No 20-30"
  ├─ Ciudad: "Bogotá"
  ├─ Departamento: "Cundinamarca"
  ├─ Código Postal: "110111"
  └─ País: "Colombia"

Sección Fiscal:
  ├─ Responsabilidad Fiscal: "Responsable de IVA"
  └─ Notas: "Cliente frecuente"
```

**Validaciones**:
- ✅ Razón Social requerida (mensaje de error si está vacío)
- ✅ NIT requerido
- ✅ Formulario se limpia después de guardar
- ✅ Cliente aparece en la tabla

### Editar Cliente

**Pasos**:
1. En la tabla de clientes, haz clic en "✏️ Editar"
2. Modifica algún campo (ej: email)
3. Haz clic en "💾 Actualizar Cliente"

**Validaciones**:
- ✅ Los datos se cargan en el formulario
- ✅ Cambios se guardan correctamente
- ✅ Tabla se actualiza automáticamente

### Eliminar Cliente

**Pasos**:
1. En la tabla de clientes, haz clic en "🗑️ Eliminar"
2. Confirma en el cuadro de diálogo

**Validaciones**:
- ✅ Se solicita confirmación
- ✅ Cliente desaparece de la tabla después de confirmar

### Buscar Cliente

**Pasos**:
1. En la barra de búsqueda, escribe "Empresa"
2. Observa los resultados

**Validaciones**:
- ✅ Se filtran los resultados en tiempo real
- ✅ Búsqueda funciona por razón social y NIT
- ✅ Se limpia correctamente cuando se borra la búsqueda

---

## 📦 Test 2: Gestión de Productos

### Crear Producto

**Pasos**:
1. Navega a `/facturas`
2. Haz clic en pestaña "📦 Productos"
3. Haz clic en botón "➕ Nuevo Producto"

**Formulario a completar**:
```
Sección Información Básica:
  ├─ Nombre del Producto: "Camiseta Blanca 100% Algodón"
  ├─ Código: "PROD-001"
  ├─ Descripción: "Camiseta para hombre, color blanco, talla M-XXL"
  ├─ Categoría: "Ropa"
  └─ Proveedor: "Textiles Colombianos S.A."

Sección Precios e Impuestos:
  ├─ Precio Base: "25000"
  ├─ IVA: "19%"
  ├─ Margen Ganancia: "30"
  └─ Unidad: "UND"

Sección Inventario:
  └─ Stock Disponible: "50"
```

**Validaciones**:
- ✅ Nombre requerido (error si está vacío)
- ✅ Código requerido
- ✅ Precio debe ser > 0 (error si es 0 o negativo)
- ✅ Cálculo automático de precio con IVA: 25,000 × 1.19 = $29,750
- ✅ Producto aparece en la tabla

### Crear Segundo Producto (Categoría diferente)

**Pasos**:
1. Haz clic nuevamente en "➕ Nuevo Producto"

**Formulario**:
```
Nombre: "Mouse Inalámbrico Logitech"
Código: "ELEC-001"
Descripción: "Mouse inalámbrico, batería 12 meses"
Categoría: "Electrónica"
Proveedor: "Distribuidor Tech"
Precio Base: "85000"
IVA: "19%"
Margen Ganancia: "25"
Unidad: "UND"
Stock: "30"
```

**Validaciones**:
- ✅ Se crea correctamente en categoría diferente
- ✅ Tabla se agrupa automáticamente por categoría

### Visualizar Agrupación por Categoría

**Pasos**:
1. En la tabla de productos, observa la estructura

**Validaciones**:
- ✅ Productos agrupados por "📂 Ropa" y "📂 Electrónica"
- ✅ Cada categoría muestra cantidad de productos
- ✅ Tabla separada para cada categoría

### Indicadores de Stock

**Pasos**:
1. Crea productos con diferente stock:
   - Producto 1: Stock = 50 (badge verde)
   - Producto 2: Stock = 5 (badge amarillo)
   - Producto 3: Stock = 0 (badge rojo)

**Validaciones**:
- ✅ Stock > 10: Verde ✅
- ✅ Stock 1-10: Amarillo ⚠️
- ✅ Stock = 0: Rojo ❌

### Editar Producto

**Pasos**:
1. Haz clic en "✏️ Editar" en cualquier producto
2. Modifica el precio a "95000"
3. Haz clic en "💾 Actualizar Producto"

**Validaciones**:
- ✅ Datos se cargan correctamente
- ✅ Cambios se guardan
- ✅ Tabla se actualiza

### Buscar Producto

**Pasos**:
1. En la barra de búsqueda, escribe "Camiseta"
2. Observa los resultados

**Validaciones**:
- ✅ Filtra por nombre
- ✅ También filtra por código (prueba: "PROD")
- ✅ Búsqueda en tiempo real

---

## 📄 Test 3: Creación de Facturas

### Crear Factura

**Pasos**:
1. Navega a `/facturas`
2. Haz clic en pestaña "📝 Nueva Factura"
3. Completa el formulario:

```
Cliente: "Empresa XYZ Ltda" (selecciona del dropdown)
Items a Agregar:
  ├─ Item 1:
  │  ├─ Producto: "Camiseta Blanca 100% Algodón"
  │  ├─ Cantidad: "10"
  │  └─ Precio Unitario: "25000" (se carga automáticamente)
  │
  └─ Item 2:
     ├─ Producto: "Mouse Inalámbrico Logitech"
     ├─ Cantidad: "5"
     └─ Precio Unitario: "85000"

Nota: "Pago con cheque postfechado"
```

**Validaciones**:
- ✅ Cliente se selecciona correctamente
- ✅ Precio unitario se carga automáticamente
- ✅ Cálculo de totales:
  - Subtotal: (10×25,000) + (5×85,000) = $675,000
  - IVA estimado: ~$128,250
  - Total estimado: ~$803,250
- ✅ Factura se guarda como "Borrador"

---

## 🎫 Test 4: Generación de PDF y Ticket

### Ver Ticket de Factura

**Pasos**:
1. Navega a `/facturas`
2. Haz clic en pestaña "📋 Facturas"
3. En la tabla, busca la factura que creaste
4. Haz clic en botón "🎫 Ticket"

**Validaciones**:
- ✅ Se abre modal con vista previa del ticket
- ✅ Header mostrando "FACTURA #FAC-001"
- ✅ Información del cliente se muestra correctamente
- ✅ Items con cantidades y precios
- ✅ Cálculo de totales visible
- ✅ Botones "📥 Descargar PDF" y "🖨️ Imprimir" presentes

### Descargar PDF

**Pasos**:
1. En el modal del ticket, haz clic en "📥 Descargar PDF"

**Validaciones**:
- ✅ Se descarga archivo `factura-FAC-001.pdf`
- ✅ Archivo se abre correctamente en lector PDF
- ✅ Contiene:
  - Número de factura
  - Fecha de emisión
  - Datos del cliente
  - Tabla de items con cantidades y precios
  - Totales (subtotal, IVA, total)
  - Notas de la factura

### Imprimir Factura

**Pasos**:
1. En el modal del ticket, haz clic en "🖨️ Imprimir"

**Validaciones**:
- ✅ Se abre diálogo de impresión del navegador
- ✅ Vista previa muestra el ticket correctamente
- ✅ Puedes seleccionar impresora
- ✅ Puedes guardar como PDF también
- ✅ Márgenes y layout se ven bien

### Cerrar Modal

**Pasos**:
1. Haz clic en botón "✕" en la esquina superior derecha del modal

**Validaciones**:
- ✅ Modal se cierra correctamente
- ✅ Vuelves a la tabla de facturas

---

## 📊 Test 5: Dashboard y Estadísticas

### Ver Dashboard

**Pasos**:
1. Navega a `/facturas`
2. Haz clic en pestaña "📊 Dashboard"

**Validaciones**:
- ✅ Se muestran tarjetas con:
  - Total de Facturas
  - Total de Clientes
  - Total de Productos
  - Ventas Totales (suma de todas las facturas)
- ✅ Se muestran facturas recientes
- ✅ Se muestran acciones rápidas (botones)
- ✅ Status del sistema (conexión a Supabase)

---

## 🔄 Test 6: Flujo Completo End-to-End

**Escenario**: Crear una factura completa desde cero

**Pasos ordenados**:
1. ✅ Crear Cliente
   - Ir a "👥 Clientes"
   - Clic en "➕ Nuevo Cliente"
   - Completar todos los datos
   - Guardar

2. ✅ Crear Productos
   - Ir a "📦 Productos"
   - Clic en "➕ Nuevo Producto" (mínimo 2)
   - Completar formulario
   - Guardar

3. ✅ Crear Factura
   - Ir a "📝 Nueva Factura"
   - Seleccionar cliente
   - Agregar items (los productos creados)
   - Guardar

4. ✅ Ver Factura
   - Ir a "📋 Facturas"
   - Buscar la factura
   - Haz clic en "Ver"
   - Verifica datos

5. ✅ Generar PDF
   - Haz clic en "🎫 Ticket"
   - Verifica vista previa
   - Descarga PDF
   - Abre PDF en lector

6. ✅ Imprimir
   - En modal de ticket, clic en "🖨️ Imprimir"
   - Selecciona "Guardar como PDF"
   - Guarda con nombre diferente

**Validaciones finales**:
- ✅ Todos los datos son consistentes
- ✅ PDFs se generan correctamente
- ✅ Layout profesional y legible
- ✅ Información completa del cliente en PDF
- ✅ Tabla de items con cálculos correctos

---

## 🐛 Pruebas de Error / Edge Cases

### Test 7: Validaciones de Formulario

#### Cliente sin Razón Social
**Pasos**:
1. Ir a "👥 Clientes"
2. Clic en "➕ Nuevo Cliente"
3. Dejar vacío "Razón Social"
4. Clic en "Guardar"

**Validación**:
- ✅ Muestra error: "Razón Social es requerido"
- ✅ El botón se desactiva o muestra estado de error
- ✅ Formulario no se envía

#### Producto sin Código
**Pasos**:
1. Ir a "📦 Productos"
2. Clic en "➕ Nuevo Producto"
3. Completar todo excepto "Código"
4. Clic en "Guardar"

**Validación**:
- ✅ Muestra error: "Código es requerido"
- ✅ Formulario no se envía

#### Precio inválido
**Pasos**:
1. En formulario de producto
2. En campo "Precio Base", ingresa "0" o "-100"
3. Clic en "Guardar"

**Validación**:
- ✅ Muestra error: "Precio debe ser mayor a 0"
- ✅ Formulario no se envía

---

## ✅ Checklist de Testing

**Gestión de Clientes**:
- [ ] Crear cliente con todos los datos
- [ ] Editar cliente
- [ ] Eliminar cliente
- [ ] Buscar cliente
- [ ] Validación de campos requeridos
- [ ] Modal se abre y cierra correctamente

**Gestión de Productos**:
- [ ] Crear producto en categoría 1
- [ ] Crear producto en categoría 2
- [ ] Verificar agrupación por categoría
- [ ] Indicadores de stock (verde, amarillo, rojo)
- [ ] Cálculo automático de precio con IVA
- [ ] Editar producto
- [ ] Eliminar producto
- [ ] Buscar producto

**Facturas**:
- [ ] Crear factura con cliente y items
- [ ] Cálculos correctos (subtotal, IVA, total)
- [ ] Ver detalles de factura
- [ ] Cambiar estado de factura

**PDF y Ticket**:
- [ ] Abrir modal de ticket
- [ ] Ticket muestra datos correctos
- [ ] Descargar PDF
- [ ] PDF abre en lector
- [ ] Imprimir desde modal
- [ ] Cerrar modal

**Dashboard**:
- [ ] Ver tarjetas de estadísticas
- [ ] Números actualizados correctamente
- [ ] Facturas recientes se muestran

**Búsqueda y Filtrado**:
- [ ] Búsqueda en clientes
- [ ] Búsqueda en productos
- [ ] Búsqueda en facturas
- [ ] Filtrado por estado

---

## 📱 Testing de Responsividad

### Mobile (375px - 425px)
- [ ] Tabla de clientes se adapta
- [ ] Modal se ve correctamente
- [ ] Botones son tocables
- [ ] Texto legible

### Tablet (768px - 1024px)
- [ ] Layout se adapta
- [ ] Dos columnas donde sea posible
- [ ] Todo legible

### Desktop (1920px+)
- [ ] Layout completo
- [ ] Espaciado óptimo
- [ ] Tablas con scroll horizontal si es necesario

---

## 🎯 Testing de Performance

### Carga de Página
- [ ] Tiempo de carga < 3 segundos
- [ ] Sin errores de consola
- [ ] Imágenes se cargan correctamente

### Generación de PDF
- [ ] PDF se genera en < 2 segundos
- [ ] No hay freezing de UI
- [ ] Archivo descargado correctamente

### Búsqueda
- [ ] Búsqueda responde en < 500ms
- [ ] No hay lag al escribir

---

## 📝 Notas para Reportar Bugs

Si encuentras un problema, anota:

```
Título: [Breve descripción del problema]
Fecha/Hora: [Cuándo ocurrió]
Navegador: [Chrome/Firefox/Safari/Edge]
Versión: [Versión del navegador]
Pasos para reproducir:
  1. ...
  2. ...
  3. ...
Resultado esperado: ...
Resultado actual: ...
Captura de pantalla: [Si es posible]
Errores en consola: [Si los hay]
```

---

**Última actualización**: 2024
**Versión**: 2.0
