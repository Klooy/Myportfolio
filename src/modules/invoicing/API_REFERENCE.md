# Referencia Rápida API y Troubleshooting

## 📚 Referencia de Slices Redux

### `facturacionSlice.js`

**Actions (Thunks):**
- `fetchFacturas(filtros)` - Obtener todas las facturas del usuario
- `crearFactura(datosFactura)` - Crear nueva factura
- `actualizarFactura({id, datos})` - Actualizar factura existente
- `enviarFacturaAFactus(facturaId)` - Enviar a DIAN vía Factus
- `verificarEstadoFactura(facturaId)` - Verificar estado en DIAN
- `obtenerPDF({facturaId, formato})` - Descargar PDF

**Reducers:**
- `setFiltros(filtros)` - Aplicar filtros a la lista
- `limpiarFiltros()` - Limpiar todos los filtros
- `seleccionarFactura(factura)` - Seleccionar factura actual
- `limpiarError()` - Limpiar mensaje de error

**Estado:**
```javascript
{
  facturas: [],
  loading: false,
  error: null,
  facturaSeleccionada: null,
  filtros: {
    estado: null,
    cliente_id: null,
    fecha_inicio: null,
    fecha_fin: null
  }
}
```

### `clientesSlice.js`

**Actions (Thunks):**
- `fetchClientes()` - Obtener todos los clientes
- `crearCliente(datos)` - Crear nuevo cliente
- `actualizarCliente({id, datos})` - Actualizar cliente
- `eliminarCliente(clienteId)` - Eliminar cliente
- `buscarClientePorNIT(nit)` - Buscar por NIT

**Reducers:**
- `setBusqueda(texto)` - Establecer término de búsqueda
- `limpiarBusqueda()` - Limpiar búsqueda
- `seleccionarCliente(cliente)` - Seleccionar cliente
- `limpiarError()` - Limpiar error

### `productosSlice.js`

**Actions (Thunks):**
- `fetchProductos()` - Obtener todos los productos
- `crearProducto(datos)` - Crear nuevo producto
- `actualizarProducto({id, datos})` - Actualizar producto
- `eliminarProducto(productoId)` - Eliminar producto
- `obtenerProductoPorCodigo(codigo)` - Buscar por código

---

## 🔧 Funciones Utilidad

### Validaciones (`facturacionUtils.js`)

```javascript
validarNIT(nit)              // Valida NIT con algoritmo DIAN
validarEmail(email)          // Valida formato de email
validarTelefono(telefono)    // Valida teléfono colombiano
```

### Cálculos

```javascript
calcularIVA(monto, porcentaje)                    // Calcula IVA
calcularINC(monto, tipoProducto)                  // Calcula INC
calcularDescuento(monto, descuento, esporcentaje) // Calcula descuento
calcularTotalLinea(cantidad, precio, iva, desc)   // Calcula línea completa
calcularTotalesFactura(items, descuentoGlobal)    // Calcula totales
```

### Formatos

```javascript
formatearMoneda(valor, moneda)    // Formato moneda (COP, USD, EUR)
formatearFecha(fecha)             // Formato fecha DD/MM/YYYY
formatearHora(fecha)              // Formato hora HH:MM:SS
redondear(numero)                 // Redondea a 2 decimales
```

### Generadores

```javascript
generarConsecutivo(ultimoConsecutivo)           // Número siguiente
generarNumeroFactura(prefijo, resolucion, cons) // Factura con formato
generarUUID()                                    // UUID v4
```

### Estados

```javascript
getEstadoFacturaLabel(estado)  // Etiqueta legible del estado
getEstadoColor(estado)         // Color asociado al estado
```

---

## 🚨 Troubleshooting

### Error: "Usuario no autenticado"

**Causa:** El usuario no ha iniciado sesión en Supabase

**Solución:**
```javascript
// Verificar autenticación antes de usar
const { data: { user } } = await supabase.auth.getUser();
if (!user) {
  // Redirigir a login o mostrar mensaje
  window.location.href = '/login';
}
```

---

### Error: "Token inválido de Factus"

**Causa:** Las credenciales en `.env.local` son incorrectas

**Solución:**
```bash
# Verifica que .env.local tenga:
VITE_FACTUS_CLIENT_ID=9e9929e9-5ff9-4b69-8690-a9c93736d49c
VITE_FACTUS_CLIENT_SECRET=UDMf4UKXIehCXaCBSz78EfJahLIXgfW1dhrS8lDk
VITE_FACTUS_USERNAME=sandbox@factus.com.co
VITE_FACTUS_PASSWORD=sandbox2024%
```

---

### Error: "NIT inválido"

**Causa:** El NIT no cumple validación DIAN

**Solución:**
```javascript
// Verificar un NIT conocido válido
console.log(validarNIT('9007654321')); // true - Válido
console.log(validarNIT('123456789'));  // false - Inválido

// El NIT debe:
// 1. Tener entre 6 y 10 dígitos
// 2. Incluir el dígito de verificación
// 3. Pasar el algoritmo DIAN
```

---

### Error: "Cliente no encontrado"

**Causa:** El cliente_id no existe o fue eliminado

**Solución:**
```javascript
// Verificar que el cliente existe antes de crear factura
const cliente = await dispatch(fetchClientes());
const clienteExiste = cliente.payload.find(c => c.id === cliente_id);
if (!clienteExiste) {
  throw new Error('Cliente no existe');
}
```

---

### Error: "Tabla no existe en Supabase"

**Causa:** Las tablas SQL no fueron creadas

**Solución:**
1. Abre tu proyecto en Supabase
2. Ve a "SQL Editor"
3. Copia y ejecuta el SQL en README.md

---

### Error: "Redux Store no está configurado"

**Causa:** El Provider no está en main.jsx

**Solución:**
```javascript
// src/main.jsx
import { Provider } from 'react-redux'
import store from './redux/store'

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <App />
  </Provider>
)
```

---

### Error: "Cannot read property 'map' of undefined"

**Causa:** Los datos aún no se han cargado del servidor

**Solución:**
```javascript
// Agregar verificación de carga
const { facturas, loading } = useSelector(state => state.facturacion);

if (loading) return <div>Cargando...</div>;

return (
  <ul>
    {facturas?.map(f => <li key={f.id}>{f.numero}</li>)}
  </ul>
);
```

---

### Error: "CORS Policy"

**Causa:** Problema de política de recursos entre dominios

**Solución:**
- Este error es generalmente manejado por Factus
- Si persiste, verifica que uses HTTPS en producción
- Contacta a Factus Colombia: support@factus.com.co

---

## 🔍 Debugging Tips

### Ver estado completo de Redux
```javascript
// En el componente
const state = useSelector(state => state);
console.log('Estado completo:', state);
```

### Ver lo que envía a Factus
```javascript
// En factusAPI.js, agrega antes de fetch:
console.log('Datos enviados a Factus:', JSON.stringify(datosFactura, null, 2));
```

### Ver datos de Supabase
```javascript
// En localDataService.js
const { data, error } = await supabase.from('invoicing_facturas').select('*');
console.log('Datos Supabase:', data, error);
```

### Usar React DevTools
1. Instala la extensión Redux DevTools en Chrome
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Redux"
4. Verás todas las acciones y cambios de estado en tiempo real

---

## ✅ Checklist de Instalación

- [ ] Instaladas dependencias: `npm install @reduxjs/toolkit react-redux @supabase/supabase-js`
- [ ] Creadas tablas SQL en Supabase
- [ ] Variables de entorno en `.env.local`
- [ ] Redux Store configurado en `src/redux/store.js`
- [ ] Provider agregado en `src/main.jsx`
- [ ] Módulo importado en `src/App.jsx`
- [ ] Página de login/autenticación implementada
- [ ] Factus API funcionando en ambiente Sandbox

---

## 📞 Soporte

- **Factus Colombia:** https://factus.com.co
- **Supabase Docs:** https://supabase.com/docs
- **Redux Toolkit:** https://redux-toolkit.js.org

---

¡Si necesitas ayuda, revisa estos recursos!
