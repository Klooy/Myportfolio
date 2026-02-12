/**
 * Servicio de integración con API de Factus Colombia
 * Ambiente Sandbox para pruebas
 */

const FACTUS_CONFIG = {
  API_URL: import.meta.env.DEV 
    ? '/api-factus'  // En desarrollo usa el proxy de Vite
    : (import.meta.env.VITE_FACTUS_API_URL || 'https://api-sandbox.factus.com.co'),
  CLIENT_ID: import.meta.env.VITE_FACTUS_CLIENT_ID || '9e9929e9-5ff9-4b69-8690-a9c93736d49c',
  CLIENT_SECRET: import.meta.env.VITE_FACTUS_CLIENT_SECRET || 'UDMf4UKXIehCXaCBSz78EfJahLIXgfW1dhrS8lDk',
  USERNAME: import.meta.env.VITE_FACTUS_USERNAME || 'sandbox@factus.com.co',
  PASSWORD: import.meta.env.VITE_FACTUS_PASSWORD || 'sandbox2024%'
};

let accessToken = null;
let tokenExpiration = null;

/**
 * Obtener token de acceso usando OAuth2
 * Intenta diferentes endpoints de autenticación
 */
export const getAccessToken = async () => {
  try {
    // Validar si el token existente aún es válido
    if (accessToken && tokenExpiration && new Date() < tokenExpiration) {
      return accessToken;
    }

    // Lista de endpoints posibles para probar
    const authEndpoints = [
      '/oauth/token',           // Endpoint estándar OAuth2
      '/api/v1/oauth/token',    // Con prefijo API
      '/v1/auth/token',         // Endpoint original
      '/api/oauth/token',       // Variante común
    ];

    const body = new URLSearchParams({
      grant_type: 'password',
      username: FACTUS_CONFIG.USERNAME,
      password: FACTUS_CONFIG.PASSWORD,
      client_id: FACTUS_CONFIG.CLIENT_ID,
      client_secret: FACTUS_CONFIG.CLIENT_SECRET,
    });

    let lastError = null;

    // Probar cada endpoint hasta que uno funcione
    for (const endpoint of authEndpoints) {
      try {
        const response = await fetch(`${FACTUS_CONFIG.API_URL}${endpoint}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body,
        });

        if (response.ok) {
          const data = await response.json();
          accessToken = data.access_token;
          tokenExpiration = new Date(Date.now() + (data.expires_in * 1000) - 300000);
          console.log(`✅ Autenticación exitosa con endpoint: ${endpoint}`);
          return accessToken;
        }
        
        lastError = `${endpoint}: ${response.status} ${response.statusText}`;
      } catch (err) {
        lastError = `${endpoint}: ${err.message}`;
        continue;
      }
    }

    throw new Error(`No se pudo autenticar con ningún endpoint. Último error: ${lastError}`);
  } catch (error) {
    console.error('Error al obtener token de Factus:', error);
    throw error;
  }
};

const getHeaders = async () => {
  const token = await getAccessToken();
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

/**
 * CLIENTES - Obtener lista de clientes
 */
export const getClientes = async () => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${FACTUS_CONFIG.API_URL}/v1/customers`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener clientes: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getClientes:', error);
    throw error;
  }
};

/**
 * CLIENTES - Crear un nuevo cliente
 */
export const crearCliente = async (datosCliente) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${FACTUS_CONFIG.API_URL}/v1/customers`, {
      method: 'POST',
      headers,
      body: JSON.stringify(datosCliente),
    });

    if (!response.ok) {
      throw new Error(`Error al crear cliente: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en crearCliente:', error);
    throw error;
  }
};

/**
 * FACTURAS - Crear una nueva factura
 */
export const crearFactura = async (datosFactura) => {
  try {
    console.log('📄 Datos de factura a enviar:', datosFactura);
    
    const headers = await getHeaders();
    
    // Endpoints posibles para crear facturas
    const invoiceEndpoints = [
      '/api/v1/invoices',     // Con prefijo API
      '/v1/invoices',         // Endpoint original
      '/invoices',            // Sin versión
      '/api/invoices',        // API sin versión
    ];

    let lastError = null;

    // Probar cada endpoint hasta que uno funcione
    for (const endpoint of invoiceEndpoints) {
      try {
        console.log(`🔍 Probando endpoint: ${FACTUS_CONFIG.API_URL}${endpoint}`);
        
        const response = await fetch(`${FACTUS_CONFIG.API_URL}${endpoint}`, {
          method: 'POST',
          headers,
          body: JSON.stringify(datosFactura),
        });

        if (response.ok) {
          const result = await response.json();
          console.log('✅ Factura creada exitosamente con endpoint:', endpoint, result);
          return result;
        }

        const errorData = await response.json().catch(() => ({ message: response.statusText }));
        lastError = `${endpoint}: ${errorData.message || response.statusText}`;
        console.warn(`❌ ${endpoint} falló (${response.status}):`, errorData);
      } catch (err) {
        lastError = `${endpoint}: ${err.message}`;
        console.warn(`❌ ${endpoint} error:`, err.message);
        continue;
      }
    }

    throw new Error(`No se pudo crear factura con ningún endpoint. Último error: ${lastError}`);
  } catch (error) {
    console.error('Error en crearFactura:', error);
    throw error;
  }
};

/**
 * FACTURAS - Obtener lista de facturas
 */
export const getFacturas = async (filtros = {}) => {
  try {
    const headers = await getHeaders();
    const queryParams = new URLSearchParams(filtros);
    const response = await fetch(`${FACTUS_CONFIG.API_URL}/v1/invoices?${queryParams}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener facturas: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getFacturas:', error);
    throw error;
  }
};

/**
 * FACTURAS - Obtener una factura específica
 */
export const getFacturaById = async (facturaId) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${FACTUS_CONFIG.API_URL}/v1/invoices/${facturaId}`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener factura: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getFacturaById:', error);
    throw error;
  }
};

/**
 * FACTURAS - Obtener el estado de una factura (validación DIAN)
 */
export const getEstadoFactura = async (facturaId) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${FACTUS_CONFIG.API_URL}/v1/invoices/${facturaId}/status`, {
      method: 'GET',
      headers,
    });

    if (!response.ok) {
      throw new Error(`Error al obtener estado: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en getEstadoFactura:', error);
    throw error;
  }
};

/**
 * VALIDACIÓN - Validar datos de factura antes de enviar
 */
export const validarFactura = async (datosFactura) => {
  try {
    const headers = await getHeaders();
    const response = await fetch(`${FACTUS_CONFIG.API_URL}/v1/validate/invoice`, {
      method: 'POST',
      headers,
      body: JSON.stringify(datosFactura),
    });

    if (!response.ok) {
      throw new Error(`Error en validación: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error en validarFactura:', error);
    throw error;
  }
};
