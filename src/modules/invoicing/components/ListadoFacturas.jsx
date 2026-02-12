/**
 * Componente para listar, filtrar y gestionar facturas
 * Permite ver detalles, descargar PDF/XML y cambiar estados
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFacturas,
  setFiltros,
  limpiarFiltros,
  enviarFacturaAFactus,
  verificarEstadoFactura,
  eliminarFactura,
} from '../features/facturacionSlice';
import { fetchClientes } from '../features/clientesSlice';
import TicketFactura from './TicketFactura';
import {
  formatearMoneda,
  formatearFecha,
  getEstadoFacturaLabel,
  getEstadoColor,
} from '../utils/facturacionUtils';

export default function ListadoFacturas() {
  const dispatch = useDispatch();
  const { facturas, loading, error, filtros } = useSelector(state => state.facturacion);
  const { clientes } = useSelector(state => state.clientes);

  const [facturaSeleccionada, setFacturaSeleccionada] = useState(null);
  const [mostrarDetalles, setMostrarDetalles] = useState(false);
  const [mostrarTicket, setMostrarTicket] = useState(false);
  const [busqueda, setBusqueda] = useState('');

  // Cargar datos
  useEffect(() => {
    dispatch(fetchFacturas());
    if (clientes.length === 0) {
      dispatch(fetchClientes());
    }
  }, [dispatch, clientes.length]);

  // Filtrar facturas
  const facturasFiltradas = facturas.filter(factura => {
    const cliente = clientes.find(c => c.id === factura.cliente_id);
    const clienteNombre = cliente?.razon_social || cliente?.razonSocial || '';

    if (busqueda && !clienteNombre.toLowerCase().includes(busqueda.toLowerCase())) {
      return false;
    }
    if (filtros.estado && factura.estado !== filtros.estado) {
      return false;
    }
    return true;
  });

  // Manejar envío a Factus
  const handleEnviarAFactus = async (facturaId) => {
    if (confirm('¿Enviar esta factura a Factus?')) {
      await dispatch(enviarFacturaAFactus(facturaId));
    }
  };

  // Manejar verificación de estado
  const handleVerificarEstado = async (facturaId) => {
    await dispatch(verificarEstadoFactura(facturaId));
  };

  // Manejar eliminación de factura
  const handleEliminar = async (facturaId) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta factura?')) {
      await dispatch(eliminarFactura(facturaId));
    }
  };

  // Obtener nombre del cliente
  const getClienteNombre = (clienteId) => {
    const cliente = clientes.find(c => c.id === clienteId);
    return cliente?.razon_social || cliente?.razonSocial || 'Sin especificar';
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 py-6">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Facturas</h2>

      {/* Controles de filtrado */}
      <div className="bg-white p-4 rounded-lg shadow mb-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Búsqueda */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Buscar por cliente
            </label>
            <input
              type="text"
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
              placeholder="Nombre del cliente..."
              className="w-full p-2 border border-gray-300 rounded-lg"
            />
          </div>

          {/* Filtro por estado */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filtros.estado || ''}
              onChange={(e) => dispatch(setFiltros({ estado: e.target.value || null }))}
              className="w-full p-2 border border-gray-300 rounded-lg"
            >
              <option value="">Todos</option>
              <option value="borrador">Borrador</option>
              <option value="enviada">Enviada</option>
              <option value="aceptada">Aceptada</option>
              <option value="rechazada">Rechazada</option>
              <option value="cancelada">Cancelada</option>
            </select>
          </div>

          {/* Botón para limpiar filtros */}
          <div className="flex items-end">
            <button
              onClick={() => {
                dispatch(limpiarFiltros());
                setBusqueda('');
              }}
              className="w-full bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 transition font-semibold"
            >
              Limpiar Filtros
            </button>
          </div>
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {/* Tabla de facturas */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin">⏳</div>
          <p className="text-gray-600 mt-2">Cargando facturas...</p>
        </div>
      ) : facturasFiltradas.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600">No hay facturas para mostrar</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto bg-white rounded-lg shadow">
            <table className="w-full">
              <thead className="bg-gray-100 border-b-2 border-gray-300">
                <tr>
                  <th className="p-3 text-left font-semibold">Número</th>
                  <th className="p-3 text-left font-semibold">Cliente</th>
                  <th className="p-3 text-right font-semibold">Total</th>
                  <th className="p-3 text-left font-semibold">Fecha</th>
                  <th className="p-3 text-center font-semibold">Estado</th>
                  <th className="p-3 text-center font-semibold">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {facturasFiltradas.map((factura) => (
                  <tr key={factura.id} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3 font-mono text-sm">{factura.numero}</td>
                    <td className="p-3">{getClienteNombre(factura.cliente_id)}</td>
                    <td className="p-3 text-right font-semibold">
                      {formatearMoneda(factura.total)}
                    </td>
                    <td className="p-3 text-sm">
                      {formatearFecha(factura.fecha_emision)}
                    </td>
                    <td className="p-3 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${getEstadoColor(
                          factura.estado
                        )}-500`}
                      >
                        {getEstadoFacturaLabel(factura.estado)}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={() => {
                            setFacturaSeleccionada(factura);
                            setMostrarDetalles(true);
                          }}
                          className="px-3 py-1 bg-blue-500 text-white rounded text-xs hover:bg-blue-600 font-semibold"
                        >
                          Ver
                        </button>

                        <button
                          onClick={() => {
                            setFacturaSeleccionada(factura);
                            setMostrarTicket(true);
                          }}
                          className="px-3 py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 font-semibold"
                        >
                          🎫 Ticket
                        </button>

                        {factura.estado === 'borrador' && (
                          <button
                            onClick={() => handleEnviarAFactus(factura.id)}
                            className="px-3 py-1 bg-green-500 text-white rounded text-xs hover:bg-green-600 font-semibold"
                          >
                            Enviar
                          </button>
                        )}

                        {factura.estado === 'enviada' && (
                          <button
                            onClick={() => handleVerificarEstado(factura.id)}
                            className="px-3 py-1 bg-orange-500 text-white rounded text-xs hover:bg-orange-600 font-semibold"
                          >
                            Verificar
                          </button>
                        )}

                        {['borrador', 'rechazada', 'cancelada'].includes(factura.estado) && (
                          <button
                            onClick={() => handleEliminar(factura.id)}
                            className="px-3 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600 font-semibold"
                          >
                            🗑️ Eliminar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Vista móvil en tarjetas */}
          <div className="md:hidden space-y-4">
            {facturasFiltradas.map((factura) => (
              <div key={factura.id} className="bg-white rounded-lg shadow p-4 space-y-3">
                <div className="flex justify-between items-start gap-2">
                  <div>
                    <p className="text-xs text-gray-500">Número</p>
                    <p className="font-bold text-gray-800">{factura.numero}</p>
                    <p className="text-xs text-gray-500 mt-1">Cliente</p>
                    <p className="font-semibold text-gray-700">{getClienteNombre(factura.cliente_id)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Total</p>
                    <p className="font-extrabold text-gray-900">{formatearMoneda(factura.total)}</p>
                    <p className="text-xs text-gray-500 mt-1">Fecha</p>
                    <p className="font-semibold text-gray-700">{formatearFecha(factura.fecha_emision)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold text-white bg-${getEstadoColor(
                      factura.estado
                    )}-500`}
                  >
                    {getEstadoFacturaLabel(factura.estado)}
                  </span>
                  <div className="flex gap-2 flex-wrap justify-end text-xs font-semibold">
                    <button
                      onClick={() => {
                        setFacturaSeleccionada(factura);
                        setMostrarDetalles(true);
                      }}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Ver
                    </button>
                    <button
                      onClick={() => {
                        setFacturaSeleccionada(factura);
                        setMostrarTicket(true);
                      }}
                      className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600"
                    >
                      🎫 Ticket
                    </button>
                    {factura.estado === 'borrador' && (
                      <button
                        onClick={() => handleEnviarAFactus(factura.id)}
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                      >
                        Enviar
                      </button>
                    )}
                    {factura.estado === 'enviada' && (
                      <button
                        onClick={() => handleVerificarEstado(factura.id)}
                        className="px-3 py-1 bg-orange-500 text-white rounded hover:bg-orange-600"
                      >
                        Verificar
                      </button>
                    )}
                    {['borrador', 'rechazada', 'cancelada'].includes(factura.estado) && (
                      <button
                        onClick={() => handleEliminar(factura.id)}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                      >
                        🗑️ Eliminar
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal de detalles */}
      {mostrarDetalles && facturaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-2xl font-bold">Detalles de Factura</h3>
              <button
                onClick={() => setMostrarDetalles(false)}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                ×
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Información general */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm text-gray-600">Número</p>
                  <p className="font-bold text-lg">{facturaSeleccionada.numero}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Estado</p>
                  <p className={`font-bold text-${getEstadoColor(facturaSeleccionada.estado)}-600`}>
                    {getEstadoFacturaLabel(facturaSeleccionada.estado)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Cliente</p>
                  <p className="font-bold">{getClienteNombre(facturaSeleccionada.cliente_id)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Fecha</p>
                  <p className="font-bold">{formatearFecha(facturaSeleccionada.fecha_emision)}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-bold text-lg mb-3">Items</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-100">
                      <tr>
                        <th className="p-2 text-left">Descripción</th>
                        <th className="p-2 text-right">Cantidad</th>
                        <th className="p-2 text-right">Precio</th>
                        <th className="p-2 text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {JSON.parse(facturaSeleccionada.items || '[]').map((item, idx) => (
                        <tr key={idx} className="border-b">
                          <td className="p-2">{item.descripcion}</td>
                          <td className="p-2 text-right">{item.cantidad}</td>
                          <td className="p-2 text-right">{formatearMoneda(item.precioUnitario)}</td>
                          <td className="p-2 text-right font-semibold">
                            {formatearMoneda(item.cantidad * item.precioUnitario)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Totales */}
              <div className="p-4 bg-blue-50 rounded-lg space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold">{formatearMoneda(facturaSeleccionada.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Descuentos:</span>
                  <span className="font-bold">{formatearMoneda(facturaSeleccionada.descuentos)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Impuestos:</span>
                  <span className="font-bold">{formatearMoneda(facturaSeleccionada.impuestos)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold text-blue-600">
                  <span>Total:</span>
                  <span>{formatearMoneda(facturaSeleccionada.total)}</span>
                </div>
              </div>

              {/* Notas */}
              {facturaSeleccionada.notas && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-gray-600">Notas</p>
                  <p className="text-gray-800">{facturaSeleccionada.notas}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex gap-3">
              <button
                onClick={() => setMostrarDetalles(false)}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600 font-semibold"
              >
                Cerrar
              </button>
              {facturaSeleccionada.estado === 'borrador' && (
                <button
                  onClick={() => {
                    handleEnviarAFactus(facturaSeleccionada.id);
                    setMostrarDetalles(false);
                  }}
                  className="flex-1 bg-green-500 text-white py-2 rounded-lg hover:bg-green-600 font-semibold"
                >
                  Enviar a Factus
                </button>
              )}
              {['borrador', 'rechazada', 'cancelada'].includes(facturaSeleccionada.estado) && (
                <button
                  onClick={() => {
                    handleEliminar(facturaSeleccionada.id);
                    setMostrarDetalles(false);
                  }}
                  className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 font-semibold"
                >
                  🗑️ Eliminar
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Modal Ticket PDF */}
      {mostrarTicket && facturaSeleccionada && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto">
            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 flex justify-between items-center">
              <h3 className="text-xl font-bold">Ticket de Factura #{facturaSeleccionada.numero}</h3>
              <button
                onClick={() => setMostrarTicket(false)}
                className="text-2xl hover:bg-white hover:text-purple-600 rounded-full p-1"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <TicketFactura
                factura={facturaSeleccionada}
                cliente={clientes.find(c => c.id === facturaSeleccionada.cliente_id)}
                items={JSON.parse(facturaSeleccionada.items || '[]')}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
