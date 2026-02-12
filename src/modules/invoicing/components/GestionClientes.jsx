/**
 * Componente mejorado para gestionar clientes
 * Incluye formulario detallado y tabla interactiva
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchClientes,
  crearCliente,
  actualizarCliente,
  eliminarCliente,
  setBusqueda,
} from '../features/clientesSlice';
import { validarNIT, validarEmail, validarTelefono } from '../utils/facturacionUtils';

export default function GestionClientes() {
  const dispatch = useDispatch();
  const { clientes, loading, error, busqueda } = useSelector(state => state.clientes);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [clienteEditando, setClienteEditando] = useState(null);
  const [erroresFormulario, setErroresFormulario] = useState({});
  const [formData, setFormData] = useState({
    razonSocial: '',
    nit: '',
    tipoPersona: 'juridica',
    email: '',
    telefono: '',
    celular: '',
    direccion: '',
    ciudad: '',
    departamento: '',
    codigoPostal: '',
    pais: 'Colombia',
    responsabilidadFiscal: 'R-99-PN',
    contactoNombre: '',
    contactoCargo: '',
    notas: '',
  });

  useEffect(() => {
    if (clientes.length === 0) {
      dispatch(fetchClientes());
    }
  }, [dispatch, clientes.length]);

  const limpiarFormulario = () => {
    setFormData({
      razonSocial: '',
      nit: '',
      tipoPersona: 'juridica',
      email: '',
      telefono: '',
      celular: '',
      direccion: '',
      ciudad: '',
      departamento: '',
      codigoPostal: '',
      pais: 'Colombia',
      responsabilidadFiscal: 'R-99-PN',
      contactoNombre: '',
      contactoCargo: '',
      notas: '',
    });
    setClienteEditando(null);
    setErroresFormulario({});
    setMostrarFormulario(false);
  };

  const handleEditar = (cliente) => {
    setClienteEditando(cliente);
    setFormData(cliente);
    setMostrarFormulario(true);
  };

  const validarFormulario = () => {
    const errores = {};
    if (!formData.razonSocial.trim()) errores.razonSocial = 'Razón social requerida';
    if (!validarNIT(formData.nit)) errores.nit = 'NIT inválido';
    if (!validarEmail(formData.email)) errores.email = 'Email inválido';
    if (!validarTelefono(formData.telefono)) errores.telefono = 'Teléfono inválido';
    if (!formData.direccion.trim()) errores.direccion = 'Dirección requerida';
    if (!formData.ciudad.trim()) errores.ciudad = 'Ciudad requerida';
    setErroresFormulario(errores);
    return Object.keys(errores).length === 0;
  };

  const handleGuardar = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      if (clienteEditando) {
        await dispatch(actualizarCliente({ id: clienteEditando.id, datos: formData }));
      } else {
        await dispatch(crearCliente(formData));
      }
      limpiarFormulario();
    } catch (err) {
      setErroresFormulario({ submit: err.message });
    }
  };

  const handleEliminar = async (clienteId) => {
    if (confirm('¿Eliminar este cliente?')) {
      await dispatch(eliminarCliente(clienteId));
    }
  };

  const clientesFiltrados = clientes.filter(cliente =>
    (cliente.razon_social || cliente.razonSocial || '').toLowerCase().includes(busqueda.toLowerCase()) ||
    cliente.nit.includes(busqueda)
  );

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h2 className="text-4xl font-bold text-gray-800">👥 Gestión de Clientes</h2>
            <p className="text-gray-600 mt-2">Administra tu base de clientes</p>
          </div>
          <button
            onClick={() => {
              limpiarFormulario();
              setMostrarFormulario(true);
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white px-8 py-3 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all font-bold flex items-center space-x-2"
          >
            <span className="text-xl">➕</span>
            <span>Nuevo Cliente</span>
          </button>
        </div>

        {/* Búsqueda mejorada */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre, NIT o email..."
            value={busqueda}
            onChange={(e) => dispatch(setBusqueda(e.target.value))}
            className="w-full px-6 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        {/* Modal/Panel del formulario */}
        {mostrarFormulario && (
          <div className="bg-white rounded-xl shadow-2xl mb-8 border-l-4 border-blue-600">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-6 rounded-t-lg">
              <h3 className="text-2xl font-bold">
                {clienteEditando ? '✏️ Editar Cliente' : '✨ Nuevo Cliente'}
              </h3>
            </div>

            <form onSubmit={handleGuardar} className="p-8 space-y-6">
              {/* Información Básica */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>📋</span>
                  <span>Información Básica</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Razón Social *
                    </label>
                    <input
                      type="text"
                      value={formData.razonSocial}
                      onChange={(e) => setFormData({ ...formData, razonSocial: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                        erroresFormulario.razonSocial ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Ej: Empresa S.A.S"
                    />
                    {erroresFormulario.razonSocial && (
                      <p className="text-red-500 text-sm mt-1">{erroresFormulario.razonSocial}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      NIT *
                    </label>
                    <input
                      type="text"
                      value={formData.nit}
                      onChange={(e) => setFormData({ ...formData, nit: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                        erroresFormulario.nit ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Ej: 900123456-7"
                    />
                    {erroresFormulario.nit && (
                      <p className="text-red-500 text-sm mt-1">{erroresFormulario.nit}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Tipo de Persona
                    </label>
                    <select
                      value={formData.tipoPersona}
                      onChange={(e) => setFormData({ ...formData, tipoPersona: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                    >
                      <option value="juridica">Jurídica</option>
                      <option value="natural">Natural</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Contacto */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>📞</span>
                  <span>Información de Contacto</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                        erroresFormulario.email ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="cliente@empresa.com"
                    />
                    {erroresFormulario.email && (
                      <p className="text-red-500 text-sm mt-1">{erroresFormulario.email}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Teléfono *
                    </label>
                    <input
                      type="tel"
                      value={formData.telefono}
                      onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                        erroresFormulario.telefono ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="+57 1 234 5678"
                    />
                    {erroresFormulario.telefono && (
                      <p className="text-red-500 text-sm mt-1">{erroresFormulario.telefono}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Celular
                    </label>
                    <input
                      type="tel"
                      value={formData.celular}
                      onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="+57 300 123 4567"
                    />
                  </div>
                </div>
              </div>

              {/* Dirección */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>🏢</span>
                  <span>Dirección</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Dirección *
                    </label>
                    <input
                      type="text"
                      value={formData.direccion}
                      onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                        erroresFormulario.direccion ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Calle 123 #45-67"
                    />
                    {erroresFormulario.direccion && (
                      <p className="text-red-500 text-sm mt-1">{erroresFormulario.direccion}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Ciudad *
                    </label>
                    <input
                      type="text"
                      value={formData.ciudad}
                      onChange={(e) => setFormData({ ...formData, ciudad: e.target.value })}
                      className={`w-full px-4 py-2 border-2 rounded-lg focus:outline-none transition-colors ${
                        erroresFormulario.ciudad ? 'border-red-500' : 'border-gray-200 focus:border-blue-500'
                      }`}
                      placeholder="Bogotá"
                    />
                    {erroresFormulario.ciudad && (
                      <p className="text-red-500 text-sm mt-1">{erroresFormulario.ciudad}</p>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Departamento
                    </label>
                    <input
                      type="text"
                      value={formData.departamento}
                      onChange={(e) => setFormData({ ...formData, departamento: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Cundinamarca"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Código Postal
                    </label>
                    <input
                      type="text"
                      value={formData.codigoPostal}
                      onChange={(e) => setFormData({ ...formData, codigoPostal: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="110111"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      País
                    </label>
                    <input
                      type="text"
                      value={formData.pais}
                      onChange={(e) => setFormData({ ...formData, pais: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Colombia"
                    />
                  </div>
                </div>
              </div>

              {/* Contacto Principal */}
              <div>
                <h4 className="text-xl font-bold text-gray-800 mb-4 flex items-center space-x-2">
                  <span>👤</span>
                  <span>Contacto Principal</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre Contacto
                    </label>
                    <input
                      type="text"
                      value={formData.contactoNombre}
                      onChange={(e) => setFormData({ ...formData, contactoNombre: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Juan Pérez"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Cargo
                    </label>
                    <input
                      type="text"
                      value={formData.contactoCargo}
                      onChange={(e) => setFormData({ ...formData, contactoCargo: e.target.value })}
                      className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                      placeholder="Gerente"
                    />
                  </div>
                </div>
              </div>

              {/* Notas */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notas Adicionales
                </label>
                <textarea
                  value={formData.notas}
                  onChange={(e) => setFormData({ ...formData, notas: e.target.value })}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-blue-500"
                  rows="3"
                  placeholder="Información adicional del cliente..."
                />
              </div>

              {/* Botones */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-lg hover:shadow-lg font-bold transition-all"
                >
                  ✅ {clienteEditando ? 'Actualizar' : 'Guardar'} Cliente
                </button>
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="flex-1 bg-gray-300 text-gray-800 px-6 py-3 rounded-lg hover:bg-gray-400 font-bold transition-all"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Errores globales */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 text-red-700 px-6 py-4 rounded-lg mb-6">
            <p className="font-semibold">Error:</p>
            <p>{error}</p>
          </div>
        )}

        {/* Tabla de clientes */}
        {loading ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-4xl mb-2">⏳</div>
            <p className="text-gray-600 font-semibold">Cargando clientes...</p>
          </div>
        ) : clientesFiltrados.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg shadow">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-600 text-lg font-semibold">
              {clientes.length === 0 ? 'No hay clientes aún' : 'No se encontraron resultados'}
            </p>
          </div>
        ) : (
          <>
            <div className="hidden md:block bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-700 to-gray-800 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-bold">Razón Social</th>
                      <th className="px-6 py-4 text-left font-bold">NIT</th>
                      <th className="px-6 py-4 text-left font-bold">Email</th>
                      <th className="px-6 py-4 text-left font-bold">Teléfono</th>
                      <th className="px-6 py-4 text-left font-bold">Ciudad</th>
                      <th className="px-6 py-4 text-center font-bold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientesFiltrados.map((cliente) => (
                      <tr key={cliente.id} className="hover:bg-blue-50 transition-colors">
                        <td className="px-6 py-4 font-semibold text-gray-800">
                          {cliente.razon_social || cliente.razonSocial}
                        </td>
                        <td className="px-6 py-4 text-gray-600">{cliente.nit}</td>
                        <td className="px-6 py-4 text-gray-600">{cliente.email}</td>
                        <td className="px-6 py-4 text-gray-600">{cliente.telefono}</td>
                        <td className="px-6 py-4 text-gray-600">{cliente.ciudad || '-'}</td>
                        <td className="px-6 py-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditar(cliente)}
                              className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded transition-colors font-semibold"
                            >
                              ✏️
                            </button>
                            <button
                              onClick={() => handleEliminar(cliente.id)}
                              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded transition-colors font-semibold"
                            >
                              🗑️
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Vista móvil en tarjetas */}
            <div className="md:hidden space-y-4">
              {clientesFiltrados.map((cliente) => (
                <div key={cliente.id} className="bg-white rounded-xl shadow p-4 space-y-2">
                  <div className="flex justify-between">
                    <div>
                      <p className="text-xs text-gray-500">Razón social</p>
                      <p className="font-bold text-gray-800">{cliente.razon_social || cliente.razonSocial}</p>
                      <p className="text-xs text-gray-500 mt-1">NIT</p>
                      <p className="font-semibold text-gray-700">{cliente.nit}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500">Ciudad</p>
                      <p className="font-semibold text-gray-700">{cliente.ciudad || '-'}</p>
                      <p className="text-xs text-gray-500 mt-1">Teléfono</p>
                      <p className="font-semibold text-gray-700">{cliente.telefono}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Email</p>
                    <p className="text-gray-700 break-all">{cliente.email}</p>
                  </div>
                  <div className="flex gap-2 justify-end text-sm font-semibold">
                    <button
                      onClick={() => handleEditar(cliente)}
                      className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleEliminar(cliente.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
