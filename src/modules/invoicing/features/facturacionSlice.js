/**
 * Redux Slice para gestión de facturas
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as localDataService from '../services/localDataService';
import * as factusAPI from '../services/factusAPI';
import { calcularTotalesFactura, generarNumeroFactura } from '../utils/facturacionUtils';
import { supabase } from '../../../services/supabase';

// ================== THUNKS ==================

export const fetchFacturas = createAsyncThunk(
  'facturacion/fetchFacturas',
  async (filtros = {}, { rejectWithValue }) => {
    try {
      return await localDataService.facturasService.getAll(filtros);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearFactura = createAsyncThunk(
  'facturacion/crearFactura',
  async (datosFactura, { rejectWithValue }) => {
    try {
      // Obtener usuario si existe (sesión opcional para anónimos)
      const { data: { user } } = await supabase.auth.getUser();

      // Calcular totales
      const totales = calcularTotalesFactura(datosFactura.items, datosFactura.descuentoGlobal);

      // Obtener consecutivo real para evitar duplicados en Supabase
      const consecutivo = await localDataService.facturasService.getNextConsecutivo();
      const numeroFactura = datosFactura.numero || generarNumeroFactura('INV', '001', consecutivo);

      // Asociar la factura al usuario autenticado si existe (evita fallas por RLS)

      const facturaLocal = {
        numero: numeroFactura,
        // user_id: user?.id || null, // Comentado: columna no existe en tabla
        cliente_id: datosFactura.cliente_id,
        items: JSON.stringify(datosFactura.items),
        subtotal: totales.subtotal,
        descuentos: totales.totalDescuentos,
        impuestos: totales.totalImpuestos,
        total: totales.totalGeneral,
        notas: datosFactura.notas || '',
        estado: 'borrador',
        fecha_emision: new Date().toISOString().split('T')[0], // Solo fecha YYYY-MM-DD
      };

      return await localDataService.facturasService.create(facturaLocal);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarFactura = createAsyncThunk(
  'facturacion/actualizarFactura',
  async ({ id, datos }, { rejectWithValue }) => {
    try {
      // Recalcular totales si hay items
      let datosActualizar = datos;
      if (datos.items) {
        const totales = calcularTotalesFactura(datos.items, datos.descuentoGlobal);
        datosActualizar = {
          ...datos,
          subtotal: totales.subtotal,
          descuentos: totales.totalDescuentos,
          impuestos: totales.totalImpuestos,
          total: totales.totalGeneral,
          items: JSON.stringify(datos.items),
        };
      }

      return await localDataService.facturasService.update(id, datosActualizar);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const enviarFacturaAFactus = createAsyncThunk(
  'facturacion/enviarFacturaAFactus',
  async (facturaId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const factura = state.facturacion.facturas.find(f => f.id === facturaId);

      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      // Verificar si Factus está habilitado
      const factusEnabled = import.meta.env.VITE_FACTUS_ENABLED === 'true';
      if (!factusEnabled) {
        throw new Error('Integración con Factus está deshabilitada. Habilita VITE_FACTUS_ENABLED en .env.local');
      }

      // Preparar datos para Factus
      const datosFactus = {
        customer_id: factura.cliente_id,
        items: JSON.parse(factura.items || '[]'),
        subtotal: factura.subtotal,
        tax: factura.impuestos,
        total: factura.total,
        notes: factura.notas,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      };

      // Enviar a Factus
      const respuesta = await factusAPI.crearFactura(datosFactus);

      // Actualizar estado local
      await localDataService.facturasService.updateEstado(
        facturaId,
        'enviada',
        respuesta
      );

      return {
        id: facturaId,
        estado: 'enviada',
        datos_factus: respuesta,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const verificarEstadoFactura = createAsyncThunk(
  'facturacion/verificarEstadoFactura',
  async (facturaId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const factura = state.facturacion.facturas.find(f => f.id === facturaId);

      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      const datosFactus = JSON.parse(factura.datos_factus || '{}');
      const estado = await factusAPI.getEstadoFactura(datosFactus.id);

      // Actualizar estado local
      await localDataService.facturasService.updateEstado(
        facturaId,
        estado.status || factura.estado
      );

      return {
        id: facturaId,
        estado: estado.status,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const obtenerPDF = createAsyncThunk(
  'facturacion/obtenerPDF',
  async ({ facturaId, formato = 'pdf' }, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const factura = state.facturacion.facturas.find(f => f.id === facturaId);

      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      const datosFactus = JSON.parse(factura.datos_factus || '{}');
      // Aquí iría la lógica para obtener el PDF desde Factus API
      
      return {
        facturaId,
        formato,
        datosFactus,
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarFactura = createAsyncThunk(
  'facturacion/eliminarFactura',
  async (facturaId, { rejectWithValue, getState }) => {
    try {
      const state = getState();
      const factura = state.facturacion.facturas.find(f => f.id === facturaId);

      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      // Validar que no esté enviada a DIAN
      const estadosEliminables = ['borrador', 'rechazada', 'cancelada'];
      if (!estadosEliminables.includes(factura.estado)) {
        throw new Error(`No se puede eliminar una factura con estado "${factura.estado}". Solo se pueden eliminar facturas en estado borrador, rechazada o cancelada.`);
      }

      await localDataService.facturasService.delete(facturaId);
      return facturaId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================== SLICE ==================

const initialState = {
  facturas: [],
  loading: false,
  error: null,
  facturaSeleccionada: null,
  filtros: {
    estado: null,
    cliente_id: null,
    fecha_inicio: null,
    fecha_fin: null,
  },
};

const facturacionSlice = createSlice({
  name: 'facturacion',
  initialState,
  reducers: {
    setFiltros: (state, action) => {
      state.filtros = { ...state.filtros, ...action.payload };
    },
    limpiarFiltros: (state) => {
      state.filtros = initialState.filtros;
    },
    seleccionarFactura: (state, action) => {
      state.facturaSeleccionada = action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchFacturas
    builder
      .addCase(fetchFacturas.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFacturas.fulfilled, (state, action) => {
        state.loading = false;
        state.facturas = action.payload;
      })
      .addCase(fetchFacturas.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // crearFactura
    builder
      .addCase(crearFactura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearFactura.fulfilled, (state, action) => {
        state.loading = false;
        state.facturas.push(action.payload);
      })
      .addCase(crearFactura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // actualizarFactura
    builder
      .addCase(actualizarFactura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarFactura.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.facturas.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.facturas[index] = action.payload;
        }
      })
      .addCase(actualizarFactura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // enviarFacturaAFactus
    builder
      .addCase(enviarFacturaAFactus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(enviarFacturaAFactus.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.facturas.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.facturas[index].estado = action.payload.estado;
          state.facturas[index].datos_factus = action.payload.datos_factus;
        }
      })
      .addCase(enviarFacturaAFactus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // verificarEstadoFactura
    builder
      .addCase(verificarEstadoFactura.pending, (state) => {
        state.loading = true;
      })
      .addCase(verificarEstadoFactura.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.facturas.findIndex(f => f.id === action.payload.id);
        if (index !== -1) {
          state.facturas[index].estado = action.payload.estado;
        }
      })
      .addCase(verificarEstadoFactura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // eliminarFactura
    builder
      .addCase(eliminarFactura.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarFactura.fulfilled, (state, action) => {
        state.loading = false;
        state.facturas = state.facturas.filter(f => f.id !== action.payload);
      })
      .addCase(eliminarFactura.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setFiltros, limpiarFiltros, seleccionarFactura, limpiarError } = facturacionSlice.actions;
export default facturacionSlice.reducer;
