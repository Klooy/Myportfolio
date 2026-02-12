# Ejemplos de Uso del Sistema de Facturación

Aquí encontrarás ejemplos prácticos para usar el sistema de facturación en tu código.

## 1. Ejemplo: Crear un Cliente desde un Componente

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { crearCliente } from '../features/clientesSlice';

export default function MiComponente() {
  const dispatch = useDispatch();
  const { loading, error } = useSelector(state => state.clientes);

  const handleCrearCliente = async () => {
    const nuevoCliente = {
      razonSocial: 'Tech Solutions S.A.S',
      nit: '9007654321', // Con dígito verificador
      email: 'contacto@techsolutions.com',
      telefono: '6015551234',
      direccion: 'Calle 50 #10-40 Piso 5',
      ciudad: 'Bogotá',
      departamento: 'Cundinamarca'
    };

    try {
      await dispatch(crearCliente(nuevoCliente));
      alert('Cliente creado exitosamente');
    } catch (err) {
      console.error('Error:', err);
    }
  };

  return (
    <button 
      onClick={handleCrearCliente}
      disabled={loading}
    >
      {loading ? 'Creando...' : 'Crear Cliente'}
    </button>
  );
}
```

## 2. Ejemplo: Listar Clientes y Filtrar

```javascript
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchClientes, setBusqueda } from '../features/clientesSlice';

export default function ListarClientes() {
  const dispatch = useDispatch();
  const { clientes, loading, busqueda } = useSelector(state => state.clientes);

  useEffect(() => {
    dispatch(fetchClientes());
  }, [dispatch]);

  const clientesFiltrados = clientes.filter(cliente =>
    cliente.razonSocial.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <input
        type="text"
        placeholder="Buscar cliente..."
        value={busqueda}
        onChange={(e) => dispatch(setBusqueda(e.target.value))}
      />
      
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <ul>
          {clientesFiltrados.map(cliente => (
            <li key={cliente.id}>
              {cliente.razonSocial} - {cliente.nit}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

## 3. Ejemplo: Crear un Producto

```javascript
import { useDispatch } from 'react-redux';
import { crearProducto } from '../features/productosSlice';
import { formatearMoneda } from '../utils/facturacionUtils';

export default function CrearProducto() {
  const dispatch = useDispatch();

  const handleCrear = async () => {
    const producto = {
      nombre: 'Servicio de Consultoría',
      codigo: 'CONS-2024-001',
      descripcion: 'Consultoría empresarial - 8 horas',
      precio: 1500000, // $1.500.000 COP
      iva: 19, // IVA de 19%
      inc: 0, // Sin INC
      stock: 100, // Stock ilimitado para servicios
      unidad: 'UND'
    };

    try {
      await dispatch(crearProducto(producto));
      alert(`Producto creado: ${formatearMoneda(producto.precio)}`);
    } catch (error) {
      console.error(error);
    }
  };

  return <button onClick={handleCrear}>Crear Producto</button>;
}
```

## 4. Ejemplo: Validación de NIT

```javascript
import { validarNIT, validarEmail } from '../utils/facturacionUtils';

// Ejemplos de NIT válidos
const nitValido = '9007654321'; // Válido
const nitInvalido = '123456789'; // Inválido

console.log(validarNIT(nitValido)); // true
console.log(validarNIT(nitInvalido)); // false

// Validar email
console.log(validarEmail('empresa@gmail.com')); // true
console.log(validarEmail('email-invalido')); // false
```

## 5. Ejemplo: Cálculos de Factura

```javascript
import { 
  calcularTotalLinea, 
  calcularTotalesFactura,
  formatearMoneda 
} from '../utils/facturacionUtils';

// Calcular una línea individual
const lineaCalculada = calcularTotalLinea(
  cantidad = 2,
  precioUnitario = 500000,
  iva = 19,
  descuento = 10 // 10% descuento
);

console.log(lineaCalculada);
// {
//   subtotal: 1000000,
//   descuento: 100000,
//   montoConDescuento: 900000,
//   impuesto: 171000,
//   total: 1071000
// }

// Calcular totales completos
const items = [
  {
    cantidad: 2,
    precioUnitario: 500000,
    iva: 19,
    descuento: 10
  },
  {
    cantidad: 1,
    precioUnitario: 300000,
    iva: 5,
    descuento: 0
  }
];

const totales = calcularTotalesFactura(items, descuentoGlobal = 5);
console.log(totales);
// {
//   subtotal: 1300000,
//   totalDescuentos: 185000,
//   totalImpuestos: 217500,
//   totalGeneral: 1332500,
//   detalleImpuestos: { iva: 217500, inc: 0 }
// }

// Formatear como moneda
console.log(formatearMoneda(1332500)); // $1.332.500
```

## 6. Ejemplo: Crear Factura Completa

```javascript
import { useDispatch, useSelector } from 'react-redux';
import { crearFactura } from '../features/facturacionSlice';
import { generarNumeroFactura } from '../utils/facturacionUtils';

export default function CrearFacturaCompleta() {
  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.facturacion);

  const crearFacturaEjemplo = async () => {
    const factura = {
      numero: generarNumeroFactura('INV', '001', 1),
      cliente_id: 'uuid-cliente-existente',
      items: [
        {
          descripcion: 'Laptop Dell XPS 13',
          productoId: 'uuid-producto-1',
          cantidad: 1,
          precioUnitario: 2500000,
          iva: 19,
          descuento: 5
        },
        {
          descripcion: 'Mouse Logitech',
          productoId: 'uuid-producto-2',
          cantidad: 2,
          precioUnitario: 75000,
          iva: 19,
          descuento: 0
        }
      ],
      descuentoGlobal: 10, // 10% descuento sobre el total
      notas: 'Factura por compra de equipos de cómputo. Pago a 30 días.'
    };

    try {
      const resultado = await dispatch(crearFactura(factura));
      console.log('Factura creada:', resultado);
    } catch (error) {
      console.error('Error al crear factura:', error);
    }
  };

  return (
    <button onClick={crearFacturaEjemplo} disabled={loading}>
      {loading ? 'Creando...' : 'Crear Factura Ejemplo'}
    </button>
  );
}
```

## 7. Ejemplo: Enviar Factura a Factus

```javascript
import { useDispatch } from 'react-redux';
import { enviarFacturaAFactus, verificarEstadoFactura } from '../features/facturacionSlice';

export default function EnviarAFactus() {
  const dispatch = useDispatch();

  const enviar = async (facturaId) => {
    try {
      // Enviar factura a Factus
      await dispatch(enviarFacturaAFactus(facturaId));
      console.log('Factura enviada a Factus');

      // Esperar 2 segundos y verificar estado
      setTimeout(async () => {
        const estado = await dispatch(verificarEstadoFactura(facturaId));
        console.log('Estado DIAN:', estado);
      }, 2000);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <button onClick={() => enviar('uuid-factura')}>
      Enviar a Factus
    </button>
  );
}
```

## 8. Ejemplo: Usar Hook useSelector para obtener datos

```javascript
import { useSelector } from 'react-redux';

export default function MiComponente() {
  // Obtener datos del estado Redux
  const { facturas, loading, error } = useSelector(state => state.facturacion);
  const { clientes } = useSelector(state => state.clientes);
  const { productos } = useSelector(state => state.productos);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Facturas: {facturas.length}</h2>
      <h2>Clientes: {clientes.length}</h2>
      <h2>Productos: {productos.length}</h2>
    </div>
  );
}
```

## 9. Ejemplo: Formatear Fechas

```javascript
import { formatearFecha, formatearHora } from '../utils/facturacionUtils';

const fecha = new Date('2024-01-15T14:30:00');

console.log(formatearFecha(fecha)); // 15/01/2024
console.log(formatearHora(fecha)); // 14:30:00
```

## 10. Ejemplo: Obtener Estados de Factura

```javascript
import { getEstadoFacturaLabel, getEstadoColor } from '../utils/facturacionUtils';

const estado = 'aceptada';
console.log(getEstadoFacturaLabel(estado)); // "Aceptada"
console.log(getEstadoColor(estado)); // "green"

// Usar en componente
<span style={{ color: `var(--${getEstadoColor(estado)}-color)` }}>
  {getEstadoFacturaLabel(estado)}
</span>
```

## 11. Ejemplo: Combo - Crear Cliente + Factura

```javascript
import { useDispatch } from 'react-redux';
import { crearCliente } from '../features/clientesSlice';
import { crearFactura } from '../features/facturacionSlice';

export default function WorkflowCompleto() {
  const dispatch = useDispatch();

  const crearClienteYFactura = async () => {
    try {
      // Paso 1: Crear cliente
      const cliente = await dispatch(crearCliente({
        razonSocial: 'Nueva Empresa',
        nit: '9007654321',
        email: 'empresa@example.com',
        telefono: '6015551234',
        direccion: 'Calle Principal',
        ciudad: 'Medellín',
        departamento: 'Antioquia'
      }));

      // Paso 2: Crear factura para ese cliente
      await dispatch(crearFactura({
        numero: 'INV-001-000001',
        cliente_id: cliente.payload.id,
        items: [
          {
            descripcion: 'Producto A',
            cantidad: 1,
            precioUnitario: 100000,
            iva: 19
          }
        ],
        descuentoGlobal: 0,
        notas: 'Primera factura'
      }));

      alert('Cliente y factura creados exitosamente');
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return <button onClick={crearClienteYFactura}>Crear Todo</button>;
}
```

---

## Tips Importantes

1. **Siempre valida antes de enviar**: Usa `validarNIT()`, `validarEmail()`
2. **Usa `formatearMoneda()`**: Para mostrar precios en UI
3. **Captura errores**: Los thunks pueden rechazarse
4. **Carga datos al montar**: Usa `useEffect` con `dispatch(fetch...)`
5. **Resetea formularios**: Limpia el estado después de guardar

¡Listo! Ahora puedes usar estos ejemplos en tu aplicación.
