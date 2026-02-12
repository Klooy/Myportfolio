/**
 * Redux Slice para gestión de clientes
 */

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import * as localDataService from '../services/localDataService';
import * as factusAPI from '../services/factusAPI';
import { validarNIT, validarEmail } from '../utils/facturacionUtils';

// ================== THUNKS ==================

export const fetchClientes = createAsyncThunk(
  'clientes/fetchClientes',
  async (_, { rejectWithValue }) => {
    try {
      return await localDataService.clientesService.getAll();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const crearCliente = createAsyncThunk(
  'clientes/crearCliente',
  async (datosCliente, { rejectWithValue }) => {
    try {
      // Validar datos
      if (!validarNIT(datosCliente.nit)) {
        throw new Error('NIT inválido');
      }
      if (!validarEmail(datosCliente.email)) {
        throw new Error('Email inválido');
      }

      // Crear localmente primero (siempre funciona)
      const clienteLocal = {
        razon_social: datosCliente.razonSocial || datosCliente.nombre,
        nit: datosCliente.nit,
        email: datosCliente.email,
        telefono: datosCliente.telefono,
        direccion: datosCliente.direccion,
        ciudad: datosCliente.ciudad,
        departamento: datosCliente.departamento,
      };

      const clienteGuardado = await localDataService.clientesService.create(clienteLocal);

      // Intentar crear en Factus (opcional, no bloquea si falla)
      const factusEnabled = import.meta.env.VITE_FACTUS_ENABLED === 'true';
      if (factusEnabled) {
        try {
          const clienteFactus = await factusAPI.crearCliente({
            name: datosCliente.razonSocial || datosCliente.nombre,
            email: datosCliente.email,
            phone: datosCliente.telefono,
            tax_id: datosCliente.nit,
            address: datosCliente.direccion,
          });

          // Actualizar con el ID de Factus si se creó exitosamente
          if (clienteFactus?.id) {
            await localDataService.clientesService.update(clienteGuardado.id, {
              cliente_factus_id: clienteFactus.id,
            });
            clienteGuardado.cliente_factus_id = clienteFactus.id;
          }
        } catch (factusError) {
          console.warn('No se pudo crear en Factus (continuando con local):', factusError.message);
        }
      }

      return clienteGuardado;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const actualizarCliente = createAsyncThunk(
  'clientes/actualizarCliente',
  async ({ id, datos }, { rejectWithValue }) => {
    try {
      // Validar email si está siendo actualizado
      if (datos.email && !validarEmail(datos.email)) {
        throw new Error('Email inválido');
      }

      return await localDataService.clientesService.update(id, datos);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const eliminarCliente = createAsyncThunk(
  'clientes/eliminarCliente',
  async (clienteId, { rejectWithValue }) => {
    try {
      await localDataService.clientesService.delete(clienteId);
      return clienteId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const buscarClientePorNIT = createAsyncThunk(
  'clientes/buscarClientePorNIT',
  async (nit, { rejectWithValue }) => {
    try {
      return await localDataService.clientesService.getByNit(nit);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// ================== SLICE ==================

const initialState = {
  clientes: [],
  loading: false,
  error: null,
  clienteSeleccionado: null,
  busqueda: '',
};

const clientesSlice = createSlice({
  name: 'clientes',
  initialState,
  reducers: {
    setBusqueda: (state, action) => {
      state.busqueda = action.payload;
    },
    limpiarBusqueda: (state) => {
      state.busqueda = '';
    },
    seleccionarCliente: (state, action) => {
      state.clienteSeleccionado = action.payload;
    },
    limpiarError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // fetchClientes
    builder
      .addCase(fetchClientes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClientes.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = action.payload;
      })
      .addCase(fetchClientes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // crearCliente
    builder
      .addCase(crearCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(crearCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes.push(action.payload);
      })
      .addCase(crearCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // actualizarCliente
    builder
      .addCase(actualizarCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(actualizarCliente.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.clientes.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.clientes[index] = action.payload;
        }
      })
      .addCase(actualizarCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // eliminarCliente
    builder
      .addCase(eliminarCliente.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(eliminarCliente.fulfilled, (state, action) => {
        state.loading = false;
        state.clientes = state.clientes.filter(c => c.id !== action.payload);
      })
      .addCase(eliminarCliente.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // buscarClientePorNIT
    builder
      .addCase(buscarClientePorNIT.pending, (state) => {
        state.loading = true;
      })
      .addCase(buscarClientePorNIT.fulfilled, (state, action) => {
        state.loading = false;
        state.clienteSeleccionado = action.payload;
      })
      .addCase(buscarClientePorNIT.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setBusqueda, limpiarBusqueda, seleccionarCliente, limpiarError } = clientesSlice.actions;
export default clientesSlice.reducer;
