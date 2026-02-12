/**
 * Componente para gestionar (CRUD) productos
 * Permite crear, editar y eliminar productos con configuración de impuestos
 * Versión mejorada con UI profesional y campos expandidos
 */

import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  setBusqueda,
} from '../features/productosSlice';
import { formatearMoneda } from '../utils/facturacionUtils';

export default function GestionProductos() {
  const dispatch = useDispatch();
  const { productos, loading, error, busqueda } = useSelector(state => state.productos);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [productoEditando, setProductoEditando] = useState(null);
  const [erroresFormulario, setErroresFormulario] = useState({});
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    descripcion: '',
    precio: '',
    iva: 19,
    stock: 0,
    unidad: 'UND',
    categoria: '',
    proveedor: '',
    margenGanancia: 30,
  });

  // Cargar productos
  useEffect(() => {
    if (productos.length === 0) {
      dispatch(fetchProductos());
    }
  }, [dispatch, productos.length]);

  // Limpiar formulario
  const limpiarFormulario = () => {
    setFormData({
      nombre: '',
      codigo: '',
      descripcion: '',
      precio: '',
      iva: 19,
      stock: 0,
      unidad: 'UND',
      categoria: '',
      proveedor: '',
      margenGanancia: 30,
    });
    setProductoEditando(null);
    setErroresFormulario({});
    setMostrarFormulario(false);
  };

  // Editar producto
  const handleEditar = (producto) => {
    setProductoEditando(producto);
    setFormData(producto);
    setMostrarFormulario(true);
  };

  // Validar formulario
  const validarFormulario = () => {
    const errores = {};

    if (!formData.nombre?.trim()) {
      errores.nombre = 'Nombre es requerido';
    }

    if (!formData.codigo?.trim()) {
      errores.codigo = 'Código es requerido';
    }

    const precio = parseFloat(formData.precio);
    if (isNaN(precio) || precio <= 0) {
      errores.precio = 'Precio debe ser mayor a 0';
    }

    const ivasValidos = [0, 5, 19];
    if (!ivasValidos.includes(formData.iva)) {
      errores.iva = 'IVA inválido';
    }

    setErroresFormulario(errores);
    return Object.keys(errores).length === 0;
  };

  // Guardar producto
  const handleGuardar = async (e) => {
    e.preventDefault();

    if (!validarFormulario()) {
      return;
    }

    try {
      if (productoEditando) {
        await dispatch(actualizarProducto({ id: productoEditando.id, datos: formData }));
      } else {
        await dispatch(crearProducto(formData));
      }
      limpiarFormulario();
    } catch (err) {
      setErroresFormulario({ submit: err.message });
    }
  };

  // Eliminar producto
  const handleEliminar = async (productoId) => {
    if (confirm('¿Estás seguro de que deseas eliminar este producto?')) {
      await dispatch(eliminarProducto(productoId));
    }
  };

  // Filtrar productos
  const productosFiltrados = productos.filter(producto =>
    (producto.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
    producto.codigo?.toLowerCase().includes(busqueda.toLowerCase())) ?? false
  );

  // Agrupar productos por categoría
  const productosPorCategoria = productosFiltrados.reduce((acc, producto) => {
    const cat = producto.categoria || 'Sin categoría';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(producto);
    return acc;
  }, {});

  return (
    <div className="w-full h-full bg-gradient-to-br from-slate-50 to-slate-100 px-4 sm:px-6 py-6 rounded-lg">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
            📦 Gestión de Productos
          </h2>
          <p className="text-gray-600 mt-1">
            Total: <span className="font-bold text-emerald-600">{productos.length}</span> productos
          </p>
        </div>
        <button
          onClick={() => {
            limpiarFormulario();
            setMostrarFormulario(true);
          }}
          className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-6 py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 font-bold transition transform flex items-center gap-2"
        >
          ➕ Nuevo Producto
        </button>
      </div>

      {/* Barra de búsqueda */}
      <div className="mb-6">
        <div className="relative">
          <input
            type="text"
            placeholder="🔍 Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => dispatch(setBusqueda(e.target.value))}
            className="w-full p-4 border-2 border-gray-200 rounded-lg bg-white hover:border-emerald-300 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 transition"
          />
        </div>
      </div>

      {/* Errores */}
      {error && (
        <div className="p-4 mb-6 bg-red-100 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          {error}
        </div>
      )}

      {/* Contenido principal */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block animate-spin text-4xl mb-4">⏳</div>
          <p className="text-gray-600 text-lg">Cargando productos...</p>
        </div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
          <p className="text-gray-600 text-lg mb-2">📭 No hay productos</p>
          <p className="text-gray-500">Crea el primer producto haciendo clic en "Nuevo Producto"</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="hidden md:block space-y-6">
            {/* Tabla general si no hay categorías */}
            {Object.keys(productosPorCategoria).length === 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
                    <tr>
                      <th className="p-4 text-left font-semibold">Nombre</th>
                      <th className="p-4 text-left font-semibold">Código</th>
                      <th className="p-4 text-right font-semibold">Precio</th>
                      <th className="p-4 text-center font-semibold">Stock</th>
                      <th className="p-4 text-center font-semibold">IVA</th>
                      <th className="p-4 text-center font-semibold">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productosFiltrados.map((producto) => (
                      <tr key={producto.id} className="border-b hover:bg-emerald-50 transition">
                        <td className="p-4 font-medium text-gray-800">{producto.nombre}</td>
                        <td className="p-4 font-mono text-sm text-gray-600">{producto.codigo}</td>
                        <td className="p-4 text-right font-bold text-emerald-600">{formatearMoneda(producto.precio)}</td>
                        <td className="p-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                            producto.stock > 10 ? 'bg-green-100 text-green-800' :
                            producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {producto.stock}
                          </span>
                        </td>
                        <td className="p-4 text-center text-gray-700">{producto.iva}%</td>
                        <td className="p-4 text-center">
                          <div className="flex gap-2 justify-center">
                            <button
                              onClick={() => handleEditar(producto)}
                              className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 hover:shadow-md font-semibold transition"
                            >
                              ✏️ Editar
                            </button>
                            <button
                              onClick={() => handleEliminar(producto.id)}
                              className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 hover:shadow-md font-semibold transition"
                            >
                              🗑️ Eliminar
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              /* Tabla por categorías */
              Object.entries(productosPorCategoria).map(([categoria, prods]) => (
                <div key={categoria} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-4 font-semibold">
                    📂 {categoria}
                    <span className="float-right text-sm font-normal opacity-90">
                      {prods.length} productos
                    </span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-100 border-b-2 border-gray-300">
                        <tr>
                          <th className="p-4 text-left font-semibold">Nombre</th>
                          <th className="p-4 text-left font-semibold">Código</th>
                          <th className="p-4 text-right font-semibold">Precio</th>
                          <th className="p-4 text-center font-semibold">Stock</th>
                          <th className="p-4 text-center font-semibold">IVA</th>
                          <th className="p-4 text-center font-semibold">Acciones</th>
                        </tr>
                      </thead>
                      <tbody>
                        {prods.map((producto) => (
                          <tr key={producto.id} className="border-b hover:bg-emerald-50 transition">
                            <td className="p-4 font-medium text-gray-800">{producto.nombre}</td>
                            <td className="p-4 font-mono text-sm text-gray-600">{producto.codigo}</td>
                            <td className="p-4 text-right font-bold text-emerald-600">{formatearMoneda(producto.precio)}</td>
                            <td className="p-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                                producto.stock > 10 ? 'bg-green-100 text-green-800' :
                                producto.stock > 0 ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                              }`}>
                                {producto.stock}
                              </span>
                            </td>
                            <td className="p-4 text-center text-gray-700">{producto.iva}%</td>
                            <td className="p-4 text-center">
                              <div className="flex gap-2 justify-center">
                                <button
                                  onClick={() => handleEditar(producto)}
                                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 hover:shadow-md font-semibold transition"
                                >
                                  ✏️ Editar
                                </button>
                                <button
                                  onClick={() => handleEliminar(producto.id)}
                                  className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 hover:shadow-md font-semibold transition"
                                >
                                  🗑️ Eliminar
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Vista móvil en tarjetas */}
          <div className="md:hidden space-y-4">
            {productosFiltrados.map((producto) => (
              <div key={producto.id} className="bg-white rounded-lg shadow p-4 space-y-2">
                <div className="flex justify-between gap-3">
                  <div>
                    <p className="text-xs text-gray-500">Nombre</p>
                    <p className="font-bold text-gray-800">{producto.nombre}</p>
                    <p className="text-xs text-gray-500 mt-1">Código</p>
                    <p className="font-mono text-sm text-gray-700">{producto.codigo}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">Precio</p>
                    <p className="font-extrabold text-emerald-600">{formatearMoneda(producto.precio)}</p>
                    <p className="text-xs text-gray-500 mt-1">Stock</p>
                    <p className="font-semibold text-gray-800">{producto.stock}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>IVA: {producto.iva}%</span>
                  <span className="text-xs px-2 py-1 bg-emerald-50 text-emerald-700 rounded">{producto.categoria || 'Sin categoría'}</span>
                </div>
                <div className="flex gap-2 justify-end text-sm font-semibold flex-wrap">
                  <button
                    onClick={() => handleEditar(producto)}
                    className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleEliminar(producto.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal de formulario */}
      {mostrarFormulario && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto shadow-2xl">
            {/* Header Modal */}
            <div className="sticky top-0 bg-gradient-to-r from-emerald-500 to-teal-500 text-white p-6 flex justify-between items-center">
              <div>
                <h3 className="text-2xl font-bold flex items-center gap-2">
                  {productoEditando ? '✏️ Editar Producto' : '➕ Nuevo Producto'}
                </h3>
                {productoEditando && (
                  <p className="text-emerald-100 text-sm mt-1">Código: {productoEditando.codigo}</p>
                )}
              </div>
              <button
                onClick={limpiarFormulario}
                className="text-2xl hover:bg-white hover:text-emerald-600 rounded-full p-2 transition"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleGuardar} className="p-8 space-y-6">
              {/* Sección Básica */}
              <div className="border-b-2 border-gray-200 pb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📋 Información Básica
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  {/* Nombre */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Nombre del Producto *
                    </label>
                    <input
                      type="text"
                      value={formData.nombre || ''}
                      onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                      placeholder="Ej: Camiseta Blanca Algodón"
                      className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-200 transition ${
                        erroresFormulario.nombre ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                      }`}
                    />
                    {erroresFormulario.nombre && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {erroresFormulario.nombre}</p>
                    )}
                  </div>

                  {/* Código */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Código del Producto *
                    </label>
                    <input
                      type="text"
                      value={formData.codigo || ''}
                      onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                      placeholder="Ej: PROD-001"
                      className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-200 transition ${
                        erroresFormulario.codigo ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                      }`}
                    />
                    {erroresFormulario.codigo && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {erroresFormulario.codigo}</p>
                    )}
                  </div>
                </div>

                {/* Descripción */}
                <div className="mt-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion || ''}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    placeholder="Descripción detallada del producto..."
                    className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition h-24"
                  />
                </div>

                {/* Categoría y Proveedor */}
                <div className="grid grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={formData.categoria || ''}
                      onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                      placeholder="Ej: Ropa, Electrónica, etc."
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Proveedor
                    </label>
                    <input
                      type="text"
                      value={formData.proveedor || ''}
                      onChange={(e) => setFormData({ ...formData, proveedor: e.target.value })}
                      placeholder="Nombre del proveedor"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Sección Precios e Impuestos */}
              <div className="border-b-2 border-gray-200 pb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  💰 Precios e Impuestos
                </h4>
                <div className="grid grid-cols-4 gap-4">
                  {/* Precio */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Precio Base *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.precio || ''}
                      onChange={(e) => setFormData({ ...formData, precio: e.target.value })}
                      placeholder="0.00"
                      className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-200 transition ${
                        erroresFormulario.precio ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                      }`}
                    />
                    {erroresFormulario.precio && (
                      <p className="text-red-500 text-sm mt-1">⚠️ {erroresFormulario.precio}</p>
                    )}
                  </div>

                  {/* IVA */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      IVA *
                    </label>
                    <select
                      value={formData.iva || 19}
                      onChange={(e) => setFormData({ ...formData, iva: parseInt(e.target.value) })}
                      className={`w-full p-3 border-2 rounded-lg focus:ring-2 focus:ring-emerald-200 transition ${
                        erroresFormulario.iva ? 'border-red-500' : 'border-gray-300 focus:border-emerald-500'
                      }`}
                    >
                      <option value="0">0%</option>
                      <option value="5">5%</option>
                      <option value="19">19%</option>
                    </select>
                  </div>

                  {/* Margen */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Margen Ganancia %
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={formData.margenGanancia || 30}
                      onChange={(e) => setFormData({ ...formData, margenGanancia: parseFloat(e.target.value) || 0 })}
                      placeholder="30"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition"
                    />
                  </div>

                  {/* Unidad */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Unidad
                    </label>
                    <select
                      value={formData.unidad || 'UND'}
                      onChange={(e) => setFormData({ ...formData, unidad: e.target.value })}
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition"
                    >
                      <option value="UND">Unidad</option>
                      <option value="KG">Kilogramo</option>
                      <option value="G">Gramo</option>
                      <option value="LT">Litro</option>
                      <option value="ML">Mililitro</option>
                      <option value="M">Metro</option>
                      <option value="M2">Metro²</option>
                      <option value="M3">Metro³</option>
                      <option value="PAQ">Paquete</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Sección Inventario */}
              <div className="pb-6">
                <h4 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  📦 Inventario
                </h4>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Stock Disponible
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.stock || 0}
                      onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                      placeholder="0"
                      className="w-full p-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-200 focus:border-emerald-500 transition"
                    />
                  </div>
                  <div className="bg-emerald-50 p-4 rounded-lg flex items-center gap-3">
                    <span className="text-2xl">📊</span>
                    <div>
                      <p className="text-sm text-gray-600">Precio con IVA</p>
                      <p className="text-xl font-bold text-emerald-600">
                        {formatearMoneda(
                          parseFloat(formData.precio || 0) * (1 + (formData.iva || 0) / 100)
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Error de submit */}
              {erroresFormulario.submit && (
                <div className="p-4 bg-red-100 border-l-4 border-red-500 text-red-700 rounded flex items-center gap-2">
                  <span className="text-xl">⚠️</span>
                  {erroresFormulario.submit}
                </div>
              )}

              {/* Botones de acción */}
              <div className="flex gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white py-3 rounded-lg hover:shadow-lg hover:-translate-y-0.5 font-bold disabled:opacity-50 transition transform"
                >
                  {loading ? '⏳ Guardando...' : (productoEditando ? '💾 Actualizar Producto' : '➕ Crear Producto')}
                </button>
                <button
                  type="button"
                  onClick={limpiarFormulario}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg hover:bg-gray-600 hover:shadow-lg hover:-translate-y-0.5 font-bold transition transform"
                >
                  ❌ Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
