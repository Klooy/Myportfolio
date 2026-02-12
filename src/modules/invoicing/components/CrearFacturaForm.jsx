/**
 * Componente para crear/editar facturas
 * Permite agregar múltiples items, calcular automáticamente y enviar a Factus
 */

import React, { useState, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { crearFactura, actualizarFactura } from '../features/facturacionSlice';
import { fetchClientes } from '../features/clientesSlice';
import { fetchProductos } from '../features/productosSlice';
import {
  calcularTotalLinea,
  calcularTotalesFactura,
  formatearMoneda,
} from '../utils/facturacionUtils';

export default function CrearFacturaForm({ facturaExistente = null, onSuccess = null }) {
  const dispatch = useDispatch();
  const { clientes } = useSelector(state => state.clientes);
  const { productos } = useSelector(state => state.productos);
  const { loading, error } = useSelector(state => state.facturacion);

  // Estados del formulario
  const [clienteSeleccionado, setClienteSeleccionado] = useState(facturaExistente?.cliente_id || '');
  const [items, setItems] = useState(facturaExistente ? JSON.parse(facturaExistente.items || '[]') : []);
  const [descuentoGlobal, setDescuentoGlobal] = useState(facturaExistente?.descuentoGlobal || 0);
  const [notas, setNotas] = useState(facturaExistente?.notas || '');
  const [errores, setErrores] = useState({});

  // Estado para agregar items
  const [nuevoItem, setNuevoItem] = useState({
    productoId: '',
    cantidad: 1,
    precioUnitario: 0,
    descuento: 0,
    iva: 19,
  });

  // Cargar clientes y productos al montar
  useEffect(() => {
    if (clientes.length === 0) {
      dispatch(fetchClientes());
    }
    if (productos.length === 0) {
      dispatch(fetchProductos());
    }
  }, [dispatch, clientes.length, productos.length]);

  // Manejar cambio de cliente
  const handleClienteChange = (e) => {
    setClienteSeleccionado(e.target.value);
    setErrores({ ...errores, cliente: '' });
  };

  // Manejar cambio en los campos del nuevo item
  const handleNuevoItemChange = (e) => {
    const { name, value } = e.target;

    const toNumber = (val) => {
      const n = parseFloat(val);
      return Number.isFinite(n) ? n : 0;
    };

    if (name === 'productoId') {
      const producto = productos.find(p => p.id === value);
      if (producto) {
        setNuevoItem({
          ...nuevoItem,
          productoId: value,
          precioUnitario: toNumber(producto.precio),
          iva: toNumber(producto.iva || 19),
          descripcion: producto.nombre,
        });
      } else {
        setNuevoItem({ ...nuevoItem, [name]: value });
      }
    } else {
      setNuevoItem({
        ...nuevoItem,
        [name]: ['cantidad', 'descuento', 'iva', 'precioUnitario'].includes(name)
          ? toNumber(value)
          : value,
      });
    }
  };

  // Agregar item a la factura
  const agregarItem = () => {
    if (!nuevoItem.productoId || nuevoItem.cantidad <= 0) {
      setErrores({ ...errores, nuevoItem: 'Selecciona un producto y cantidad válida' });
      return;
    }

    const itemConCalculos = {
      ...nuevoItem,
      id: Math.random().toString(36).substr(2, 9),
    };

    setItems([...items, itemConCalculos]);
    setNuevoItem({
      productoId: '',
      cantidad: 1,
      precioUnitario: 0,
      descuento: 0,
      iva: 19,
    });
    setErrores({ ...errores, nuevoItem: '' });
  };

  // Eliminar item
  const eliminarItem = (id) => {
    setItems(items.filter(item => item.id !== id));
  };

  // Calcular totales
  const totales = calcularTotalesFactura(items, descuentoGlobal);

  // Validar y enviar formulario
  const handleSubmit = async (e) => {
    e.preventDefault();
    const nuevosErrores = {};

    if (!clienteSeleccionado) {
      nuevosErrores.cliente = 'Selecciona un cliente';
    }
    if (items.length === 0) {
      nuevosErrores.items = 'Agrega al menos un item';
    }

    if (Object.keys(nuevosErrores).length > 0) {
      setErrores(nuevosErrores);
      return;
    }

    try {
      const datosFactura = {
        cliente_id: clienteSeleccionado,
        items,
        descuentoGlobal,
        notas,
      };

      if (facturaExistente) {
        await dispatch(actualizarFactura({ id: facturaExistente.id, datos: datosFactura }));
      } else {
        await dispatch(crearFactura(datosFactura));
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      setErrores({ submit: err.message });
    }
  };

  const cliente = clientes.find(c => c.id === clienteSeleccionado);

  return (
    <div className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">
        {facturaExistente ? 'Editar Factura' : 'Crear Nueva Factura'}
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de cliente */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Cliente *
          </label>
          <select
            value={clienteSeleccionado}
            onChange={handleClienteChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Selecciona un cliente</option>
            {clientes.map(cliente => (
              <option key={cliente.id} value={cliente.id}>
                {cliente.razon_social || cliente.razonSocial} - {cliente.nit}
              </option>
            ))}
          </select>
          {errores.cliente && <p className="text-red-500 text-sm mt-1">{errores.cliente}</p>}

          {cliente && (
            <div className="mt-4 p-3 bg-blue-50 rounded text-sm">
              <p><strong>Email:</strong> {cliente.email}</p>
              <p><strong>Teléfono:</strong> {cliente.telefono}</p>
              <p><strong>Dirección:</strong> {cliente.direccion}, {cliente.ciudad}</p>
            </div>
          )}
        </div>

        {/* Items de la factura */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Items</h3>

          {/* Tabla de items (desktop) */}
          {items.length > 0 && (
            <>
              <div className="mb-4 overflow-x-auto hidden md:block">
                <table className="w-full text-sm">
                  <thead className="bg-gray-200">
                    <tr>
                      <th className="p-2 text-left">Producto</th>
                      <th className="p-2 text-right">Cantidad</th>
                      <th className="p-2 text-right">Precio Unit.</th>
                      <th className="p-2 text-right">IVA</th>
                      <th className="p-2 text-right">Descuento</th>
                      <th className="p-2 text-right">Total</th>
                      <th className="p-2">Acción</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map(item => {
                      const totalesLinea = calcularTotalLinea(
                        item.cantidad,
                        item.precioUnitario,
                        item.iva,
                        item.descuento
                      );
                      return (
                        <tr key={item.id} className="border-b hover:bg-gray-100">
                          <td className="p-2">{item.descripcion || item.productoId}</td>
                          <td className="p-2 text-right">{item.cantidad}</td>
                          <td className="p-2 text-right">{formatearMoneda(item.precioUnitario)}</td>
                          <td className="p-2 text-right">{item.iva}%</td>
                          <td className="p-2 text-right">{item.descuento || 0}%</td>
                          <td className="p-2 text-right font-semibold">
                            {formatearMoneda(totalesLinea.total)}
                          </td>
                          <td className="p-2">
                            <button
                              type="button"
                              onClick={() => eliminarItem(item.id)}
                              className="text-red-500 hover:text-red-700 text-sm font-semibold"
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Vista móvil en tarjetas */}
              <div className="md:hidden space-y-3 mb-4">
                {items.map(item => {
                  const totalesLinea = calcularTotalLinea(
                    item.cantidad,
                    item.precioUnitario,
                    item.iva,
                    item.descuento
                  );
                  return (
                    <div key={item.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                      <div className="flex justify-between">
                        <div>
                          <p className="text-xs text-gray-500">Producto</p>
                          <p className="font-semibold text-gray-800">{item.descripcion || item.productoId}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500">Total</p>
                          <p className="font-bold text-gray-800">{formatearMoneda(totalesLinea.total)}</p>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs text-gray-700 mt-2">
                        <p>Cant.: <span className="font-semibold">{item.cantidad}</span></p>
                        <p>Precio: <span className="font-semibold">{formatearMoneda(item.precioUnitario)}</span></p>
                        <p>IVA: <span className="font-semibold">{item.iva}%</span></p>
                        <p>Desc.: <span className="font-semibold">{item.descuento || 0}%</span></p>
                      </div>
                      <div className="flex justify-end mt-2">
                        <button
                          type="button"
                          onClick={() => eliminarItem(item.id)}
                          className="text-red-500 hover:text-red-700 text-sm font-semibold"
                        >
                          Eliminar
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {/* Agregar nuevo item */}
          <div className="bg-white p-4 rounded border border-gray-200 space-y-3">
            <h4 className="font-semibold text-gray-800">Agregar Item</h4>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              <select
                name="productoId"
                value={nuevoItem.productoId}
                onChange={handleNuevoItemChange}
                className="p-2 border border-gray-300 rounded text-sm"
              >
                <option value="">Producto</option>
                {productos.map(producto => (
                  <option key={producto.id} value={producto.id}>
                    {producto.nombre}
                  </option>
                ))}
              </select>

              <input
                type="number"
                name="cantidad"
                min="1"
                value={nuevoItem.cantidad}
                onChange={handleNuevoItemChange}
                placeholder="Cantidad"
                className="p-2 border border-gray-300 rounded text-sm"
              />

              <input
                type="number"
                name="precioUnitario"
                value={nuevoItem.precioUnitario}
                onChange={handleNuevoItemChange}
                placeholder="Precio"
                className="p-2 border border-gray-300 rounded text-sm"
              />

              <select
                name="iva"
                value={nuevoItem.iva}
                onChange={handleNuevoItemChange}
                className="p-2 border border-gray-300 rounded text-sm"
              >
                <option value="0">IVA 0%</option>
                <option value="5">IVA 5%</option>
                <option value="19">IVA 19%</option>
              </select>

              <input
                type="number"
                name="descuento"
                min="0"
                max="100"
                value={nuevoItem.descuento}
                onChange={handleNuevoItemChange}
                placeholder="Descto %"
                className="p-2 border border-gray-300 rounded text-sm"
              />
            </div>

            <button
              type="button"
              onClick={agregarItem}
              className="w-full bg-blue-500 text-white py-2 rounded font-semibold hover:bg-blue-600 transition"
            >
              Agregar Item
            </button>

            {errores.nuevoItem && <p className="text-red-500 text-sm">{errores.nuevoItem}</p>}
            {errores.items && <p className="text-red-500 text-sm">{errores.items}</p>}
          </div>
        </div>

        {/* Descuento global y notas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descuento Global (%)
            </label>
            <input
              type="number"
              value={descuentoGlobal || 0}
              onChange={(e) => setDescuentoGlobal(parseFloat(e.target.value) || 0)}
              min="0"
              max="100"
              className="w-full p-3 border border-gray-300 rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notas
            </label>
            <textarea
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg h-12"
              placeholder="Notas adicionales..."
            />
          </div>
        </div>

        {/* Resumen de totales */}
        <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
          <h3 className="text-lg font-bold text-gray-800 mb-4">Resumen</h3>
          <div className="space-y-2 text-gray-700">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span className="font-semibold">{formatearMoneda(totales.subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Descuentos:</span>
              <span className="font-semibold text-red-600">{formatearMoneda(totales.totalDescuentos)}</span>
            </div>
            <div className="flex justify-between">
              <span>Impuestos (IVA):</span>
              <span className="font-semibold">{formatearMoneda(totales.totalImpuestos)}</span>
            </div>
            <div className="border-t pt-2 flex justify-between text-xl font-bold text-blue-600">
              <span>Total:</span>
              <span>{formatearMoneda(totales.totalGeneral)}</span>
            </div>
          </div>
        </div>

        {/* Errores */}
        {error && <div className="p-3 bg-red-100 text-red-700 rounded">{error}</div>}
        {errores.submit && <div className="p-3 bg-red-100 text-red-700 rounded">{errores.submit}</div>}

        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            type="submit"
            disabled={loading || items.length === 0}
            className="flex-1 bg-green-500 text-white py-3 rounded-lg font-bold hover:bg-green-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Procesando...' : facturaExistente ? 'Actualizar Factura' : 'Crear Factura'}
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-bold hover:bg-gray-600 transition"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>
  );
}
