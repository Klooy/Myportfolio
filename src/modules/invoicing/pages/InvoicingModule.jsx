/**
 * Página principal del módulo de facturación
 * Integra los 4 tabs: Crear Factura, Listado, Clientes y Productos
 */

import { useState } from 'react';
import Dashboard from '../components/Dashboard';
import CrearFacturaForm from '../components/CrearFacturaForm';
import ListadoFacturas from '../components/ListadoFacturas';
import GestionClientes from '../components/GestionClientes';
import GestionProductos from '../components/GestionProductos';

export default function InvoicingModule() {
  const [tabActivo, setTabActivo] = useState('dashboard');

  const tabs = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      description: 'Resumen y estadísticas',
    },
    {
      id: 'crear',
      label: 'Nueva Factura',
      icon: '➕',
      description: 'Crear factura nueva',
    },
    {
      id: 'facturas',
      label: 'Facturas',
      icon: '📋',
      description: 'Ver todas las facturas',
    },
    {
      id: 'clientes',
      label: 'Clientes',
      icon: '👥',
      description: 'Gestionar clientes',
    },
    {
      id: 'productos',
      label: 'Productos',
      icon: '📦',
      description: 'Catálogo de productos',
    },
  ];

  const renderContenido = () => {
    switch (tabActivo) {
      case 'dashboard':
        return <Dashboard onNavigate={setTabActivo} />;
      case 'facturas':
        return <ListadoFacturas />;
      case 'crear':
        return <CrearFacturaForm onSuccess={() => setTabActivo('facturas')} />;
      case 'clientes':
        return <GestionClientes />;
      case 'productos':
        return <GestionProductos />;
      default:
        return <Dashboard onNavigate={setTabActivo} />;
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header mejorado - Responsive */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 text-white shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-5xl font-bold mb-2 sm:mb-3 tracking-tight">
                💼 Sistema de Facturación
              </h1>
              <p className="text-blue-100 text-sm sm:text-lg">
                Gestión completa de facturas, clientes y productos
              </p>
            </div>
            <div className="text-left sm:text-right">
              <div className="bg-white/10 backdrop-blur-sm px-4 sm:px-6 py-2 sm:py-3 rounded-lg border border-white/20 w-fit">
                <p className="text-xs sm:text-sm text-blue-100">Estado</p>
                <p className="text-lg sm:text-xl font-bold">🟢 Operativo</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de navegación - Responsive */}
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex overflow-x-auto space-x-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setTabActivo(tab.id)}
                className={`group px-3 sm:px-6 py-3 sm:py-4 font-semibold text-xs sm:text-sm border-b-4 transition-all relative whitespace-nowrap ${
                  tabActivo === tab.id
                    ? 'border-blue-600 text-blue-600 bg-gradient-to-t from-blue-50 to-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:border-gray-300'
                }`}
              >
                <div className="flex flex-col items-center gap-0.5 sm:gap-1">
                  <span className="text-xl sm:text-2xl">{tab.icon}</span>
                  <span className="text-xs sm:text-sm font-bold">{tab.label}</span>
                  {tabActivo !== tab.id && (
                    <span className="hidden md:block text-xs text-gray-400 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      {tab.description}
                    </span>
                  )}
                </div>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Contenido */}
      <div className="bg-gray-50 py-8">
        {renderContenido()}
      </div>

      {/* Footer */}
      <div className="bg-gray-800 text-gray-300 py-4 sm:py-6 mt-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
          <p className="text-xs sm:text-sm">
            Sistema de Facturación Electrónica © 2024 | Integración Factus Colombia
          </p>
          <p className="text-xs text-gray-500 mt-1 sm:mt-2">
            Ambiente: Sandbox | Cumplimiento DIAN
          </p>
        </div>
      </div>
    </div>
  );
}
