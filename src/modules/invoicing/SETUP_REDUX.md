# Configuración Redux Store

Este archivo muestra cómo configurar Redux correctamente en tu proyecto.

## Opción 1: Si ya tienes Redux configurado

Actualiza tu `src/redux/store.js` (o donde tengas tu store):

```javascript
import { configureStore } from '@reduxjs/toolkit';
import facturacionReducer from '../modules/invoicing/features/facturacionSlice';
import clientesReducer from '../modules/invoicing/features/clientesSlice';
import productosReducer from '../modules/invoicing/features/productosSlice';

export const store = configureStore({
  reducer: {
    facturacion: facturacionReducer,
    clientes: clientesReducer,
    productos: productosReducer,
    // ... otros reducers que ya tengas
  },
});

export default store;
```

## Opción 2: Si NO tienes Redux configurado

Crea un nuevo archivo `src/redux/store.js`:

```javascript
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
        ignoredActions: ['your-action'],
        ignoredActionPaths: ['meta.arg', 'payload.timestamp'],
        ignoredPaths: ['items.dates'],
      },
    }),
});

export default store;
```

## Configurar Provider en main.jsx

Actualiza tu archivo `src/main.jsx`:

```javascript
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Provider } from 'react-redux'
import store from './redux/store'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>,
)
```

## Instalación de Dependencias

```bash
# Redux Toolkit y React Redux
npm install @reduxjs/toolkit react-redux

# Supabase (si aún no está instalado)
npm install @supabase/supabase-js

# Opcional: para persistencia de Redux
npm install redux-persist
```

## Verificar la Instalación

Para asegurarte de que todo está configurado correctamente, ejecuta:

```bash
npm list @reduxjs/toolkit react-redux @supabase/supabase-js
```

Deberías ver versiones instaladas (sin errores de "unmet dependency").

## Estructura Final Esperada

```
src/
├── redux/
│   └── store.js                    # Store configurado
├── modules/
│   └── invoicing/                  # Módulo de facturación
│       ├── components/
│       ├── features/               # Slices Redux aquí
│       ├── services/
│       ├── utils/
│       ├── pages/
│       └── README.md
├── main.jsx                        # Provider configurado aquí
├── App.jsx
└── index.css
```

## Troubleshooting

**Error: "Cannot find module '@reduxjs/toolkit'"**
```bash
npm install @reduxjs/toolkit react-redux
```

**Error: "store is not defined"**
- Verifica que hayas creado `src/redux/store.js`
- Verifica que lo importes en `main.jsx`

**Los slices no cargan datos**
- Asegúrate de que el store esté disponible a través del Provider
- Comprueba que uses `useSelector` y `useDispatch` dentro de componentes que estén dentro del Provider

---

¡Listo! Tu Redux store está configurado para el módulo de facturación.
