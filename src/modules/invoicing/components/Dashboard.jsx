/**
 * Dashboard principal del sistema de facturación
 * Muestra estadísticas y accesos rápidos
 */

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFacturas } from '../features/facturacionSlice';
import { fetchClientes } from '../features/clientesSlice';
import { fetchProductos } from '../features/productosSlice';
import { formatearMoneda } from '../utils/facturacionUtils';

export default function Dashboard({ onNavigate }) {
  const dispatch = useDispatch();
  const { facturas } = useSelector(state => state.facturacion);
  const { clientes } = useSelector(state => state.clientes);
  const { productos } = useSelector(state => state.productos);

  useEffect(() => {
    dispatch(fetchFacturas());
    dispatch(fetchClientes());
    dispatch(fetchProductos());
  }, [dispatch]);

  // Calcular estadísticas
  const totalFacturas = facturas.length;
  const facturasEnviadas = facturas.filter(f => f.estado === 'enviada').length;
  const facturasBorrador = facturas.filter(f => f.estado === 'borrador').length;
  const totalVentas = facturas.reduce((sum, f) => sum + parseFloat(f.total || 0), 0);

  const cards = [
    {
      title: 'Total Facturas',
      value: totalFacturas,
      icon: '📋',
      color: 'from-blue-500 to-blue-600',
      action: () => onNavigate('facturas'),
    },
    {
      title: 'Clientes',
      value: clientes.length,
      icon: '👥',
      color: 'from-green-500 to-green-600',
      action: () => onNavigate('clientes'),
    },
    {
      title: 'Productos',
      value: productos.length,
      icon: '📦',
      color: 'from-purple-500 to-purple-600',
      action: () => onNavigate('productos'),
    },
    {
      title: 'Total Ventas',
      value: formatearMoneda(totalVentas),
      icon: '💰',
      color: 'from-yellow-500 to-orange-500',
      subtitle: 'Acumulado',
    },
  ];

  const quickActions = [
    {
      label: 'Nueva Factura',
      icon: '➕',
      color: 'bg-blue-600 hover:bg-blue-700',
      action: () => onNavigate('crear'),
    },
    {
      label: 'Agregar Cliente',
      icon: '👤',
      color: 'bg-green-600 hover:bg-green-700',
      action: () => onNavigate('clientes'),
    },
    {
      label: 'Nuevo Producto',
      icon: '🏷️',
      color: 'bg-purple-600 hover:bg-purple-700',
      action: () => onNavigate('productos'),
    },
  ];

  const recentInvoices = facturas.slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Tarjetas de estadísticas - Responsive */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
        {cards.map((card, index) => (
          <div
            key={index}
            onClick={card.action}
            className={`bg-gradient-to-br ${card.color} text-white rounded-xl p-4 sm:p-6 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all cursor-pointer`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-3">
              <span className="text-4xl sm:text-5xl">{card.icon}</span>
              <div className="text-left sm:text-right flex-1">
                <p className="text-xs sm:text-sm opacity-90">{card.title}</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1 break-words" style={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}>{card.value}</p>
                {card.subtitle && (
                  <p className="text-xs opacity-75 mt-1">{card.subtitle}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Acciones rápidas */}
      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
        <h2 className="text-xl sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">⚡ Acciones Rápidas</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={action.action}
              className={`${action.color} text-white px-4 sm:px-8 py-4 sm:py-6 rounded-lg font-semibold text-sm sm:text-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3`}
            >
              <span className="text-2xl sm:text-3xl">{action.icon}</span>
              <span className="text-center sm:text-left">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
        {/* Facturas recientes */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-2">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-800">📋 Facturas Recientes</h2>
            <button
              onClick={() => onNavigate('facturas')}
              className="text-blue-600 hover:text-blue-800 font-semibold text-sm self-start sm:self-auto"
            >
              Ver todas →
            </button>
          </div>
          
          {recentInvoices.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <p className="text-4xl mb-3">📄</p>
              <p className="text-lg font-semibold">No hay facturas aún</p>
              <button
                onClick={() => onNavigate('crear')}
                className="mt-4 text-blue-600 hover:text-blue-800 font-semibold"
              >
                Crear primera factura
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {recentInvoices.map((factura) => (
                <div
                  key={factura.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{factura.numero}</p>
                    <p className="text-sm text-gray-500">
                      {new Date(factura.fecha_emision).toLocaleDateString('es-CO')}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-800">
                      {formatearMoneda(factura.total)}
                    </p>
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        factura.estado === 'enviada'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
                    >
                      {factura.estado}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Estado del sistema */}
        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-800 mb-4 sm:mb-6">📊 Estado del Sistema</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Facturas Enviadas</p>
                <p className="text-sm text-gray-600">Procesadas correctamente</p>
              </div>
              <p className="text-3xl font-bold text-green-600">{facturasEnviadas}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Borradores</p>
                <p className="text-sm text-gray-600">Pendientes de envío</p>
              </div>
              <p className="text-3xl font-bold text-yellow-600">{facturasBorrador}</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Base de Datos</p>
                <p className="text-sm text-gray-600">Supabase conectado</p>
              </div>
              <p className="text-2xl">🟢</p>
            </div>

            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="font-semibold text-gray-800">Factus API</p>
                <p className="text-sm text-gray-600">Modo local activo</p>
              </div>
              <p className="text-2xl">⚪</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
