import { configureStore } from '@reduxjs/toolkit';
import facturacionReducer from '../modules/invoicing/features/facturacionSlice';
import clientesReducer from '../modules/invoicing/features/clientesSlice';
import productosReducer from '../modules/invoicing/features/productosSlice';

export const store = configureStore({
  reducer: {
    facturacion: facturacionReducer,
    clientes: clientesReducer,
    productos: productosReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['facturacion/crearFactura', 'facturacion/actualizarFactura'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['facturacion.facturas'],
      },
    }),
});

export default store;
