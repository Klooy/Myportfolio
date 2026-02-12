/**
 * Redux Slice para gestión de productos
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as localDataService from '../services/localDataService';

// ================== THUNKS ==================

export const fetchProductos = createAsyncThunk(
  'productos/fetchProductos',
  async (_, { rejectWithValue }) => {
    try {
      return await localDataService.productosService.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearProducto = createAsyncThunk(
  'productos/crearProducto',
  async (datosProducto, { rejectWithValue }) => {
    try {
      // Validar datos básicos
      if (!datosProducto.nombre || !datosProducto.codigo) {
        throw new Error('Nombre y código son requeridos');
      }

      if (datosProducto.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      // Validar IVA válido
      const ivasValidos = [0, 5, 19];
      if (!ivasValidos.includes(datosProducto.iva)) {
        throw new Error('IVA debe ser 0%, 5% o 19%');
      }

      const producto = {
        nombre: datosProducto.nombre,
        codigo: datosProducto.codigo,
        descripcion: datosProducto.descripcion || '',
        precio: parseFloat(datosProducto.precio),
        iva: datosProducto.iva || 19,
        inc: datosProducto.inc || 0,
        stock: parseInt(datosProducto.stock) || 0,
        unidad: datosProducto.unidad || 'UND',
      };

      return await localDataService.productosService.create(producto);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarProducto = createAsyncThunk(
  'productos/actualizarProducto',
  async ({ id, datos }, { rejectWithValue }) => {
    try {
      // Validar si hay precio
      if (datos.precio !== undefined && datos.precio <= 0) {
        throw new Error('El precio debe ser mayor a 0');
      }

      // Validar IVA si está siendo actualizado
      if (datos.iva !== undefined) {
        const ivasValidos = [0, 5, 19];
        if (!ivasValidos.includes(datos.iva)) {
          throw new Error('IVA debe ser 0%, 5% o 19%');
        }
      }

      return await localDataService.productosService.update(id, datos);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarProducto = createAsyncThunk(
  'productos/eliminarProducto',
  async (productoId, { rejectWithValue }) => {
    try {
      await localDataService.productosService.delete(productoId);
      return productoId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const obtenerProductoPorCodigo = createAsyncThunk(
  'productos/obtenerProductoPorCodigo',
  async (codigo, { rejectWithValue }) => {
    try {
      return await localDataService.productosService.getByCodigo(codigo);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================== SLICE ==================

const initialState = {
  productos: [],
  loading: false,
  error: null,
  productoSeleccionado: null,
  busqueda: '',
};

const productosSlice = createSlice({
  name: 'productos',
  initialState,
  reducers: {
    setBusqueda: (state, action) => {
      state.busqueda = action.payload;
    },
    limpiarBusqueda: (state) => {
      state.busqueda = '';
    },
    seleccionarProducto: (state, action) => {
      state.productoSeleccionado = action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchProductos
    builder
      .addCase(fetchProductos.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductos.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = action.payload;
      })
      .addCase(fetchProductos.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // crearProducto
    builder
      .addCase(crearProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearProducto.fulfilled, (state, action) => {
        state.loading = false;
        state.productos.push(action.payload);
      })
      .addCase(crearProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // actualizarProducto
    builder
      .addCase(actualizarProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarProducto.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.productos.findIndex(p => p.id === action.payload.id);
        if (index !== -1) {
          state.productos[index] = action.payload;
        }
      })
      .addCase(actualizarProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // eliminarProducto
    builder
      .addCase(eliminarProducto.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarProducto.fulfilled, (state, action) => {
        state.loading = false;
        state.productos = state.productos.filter(p => p.id !== action.payload);
      })
      .addCase(eliminarProducto.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // obtenerProductoPorCodigo
    builder
      .addCase(obtenerProductoPorCodigo.pending, (state) => {
        state.loading = true;
      })
      .addCase(obtenerProductoPorCodigo.fulfilled, (state, action) => {
        state.loading = false;
        state.productoSeleccionado = action.payload;
      })
      .addCase(obtenerProductoPorCodigo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBusqueda, limpiarBusqueda, seleccionarProducto, limpiarError } = productosSlice.actions;
export default productosSlice.reducer;
