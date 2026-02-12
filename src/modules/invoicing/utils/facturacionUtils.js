/**
 * Utilidades para cálculos, validaciones y formatos de facturación
 */

// ================== VALIDACIÓN DE NIT ==================
/**
 * Validar NIT usando algoritmo DIAN
 * @param {string} nit - NIT sin dígito de verificación
 * @returns {boolean} - NIT válido
 */
export const validarNIT = (nit) => {
  if (!nit || nit.toString().length < 6) return false;

  const nitLimpio = nit.toString().replace(/[^0-9]/g, '');
  if (nitLimpio.length < 6) return false;

  // Extraer NIT sin dígito de verificación
  const nitSinDigito = nitLimpio.substring(0, nitLimpio.length - 1);
  const digitoVerificacion = parseInt(nitLimpio.charAt(nitLimpio.length - 1), 10);

  // Cálculo del dígito de verificación DIAN
  let multiplicador = 2;
  let suma = 0;

  for (let i = nitSinDigito.length - 1; i >= 0; i--) {
    suma += parseInt(nitSinDigito.charAt(i), 10) * multiplicador;
    multiplicador++;
    if (multiplicador === 10) multiplicador = 2;
  }

  const residuo = suma % 11;
  const calculado = residuo === 0 ? 0 : residuo === 1 ? 9 : 11 - residuo;

  return calculado === digitoVerificacion;
};

/**
 * Validar formato de email
 */
export const validarEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

/**
 * Validar número de teléfono colombiano
 */
export const validarTelefono = (telefono) => {
  const regex = /^(\+57|0057|57)?[1-9]\d{6,9}$/;
  return regex.test(telefono.toString().replace(/[^0-9]/g, ''));
};

// ================== CÁLCULOS IMPUESTOS ==================

/**
 * Calcular IVA (Impuesto al Valor Agregado)
 * @param {number} monto - Monto base sin IVA
 * @param {number} porcentaje - Porcentaje de IVA (default: 19)
 */
export const calcularIVA = (monto, porcentaje = 19) => {
  return (monto * porcentaje) / 100;
};

/**
 * Calcular INC (Impuesto Nacional al Consumo)
 * Varía según el tipo de producto
 * @param {number} monto - Monto base
 * @param {string} tipoProducto - Tipo de producto para determinar INC
 */
export const calcularINC = (monto, tipoProducto = 'general') => {
  const tasas = {
    combustible: 0.08,
    alcohol: 0.10,
    general: 0.0,
  };
  const tasa = tasas[tipoProducto] || 0;
  return (monto * tasa) / 100;
};

/**
 * Calcular descuento
 * @param {number} monto - Monto base
 * @param {number|string} descuento - Descuento (número o porcentaje)
 * @param {boolean} esporcentaje - Si es true, el descuento es un porcentaje
 */
export const calcularDescuento = (monto, descuento, esporcentaje = true) => {
  if (!descuento) return 0;
  
  if (esporcentaje) {
    return (monto * parseFloat(descuento)) / 100;
  }
  return parseFloat(descuento);
};

/**
 * Calcular total de una línea de factura
 */
export const calcularTotalLinea = (cantidad, precioUnitario, iva = 19, descuento = 0) => {
  const subtotal = cantidad * precioUnitario;
  const descuentoAplicado = calcularDescuento(subtotal, descuento, true);
  const montoConDescuento = subtotal - descuentoAplicado;
  const impuesto = calcularIVA(montoConDescuento, iva);
  const total = montoConDescuento + impuesto;

  return {
    subtotal: redondear(subtotal),
    descuento: redondear(descuentoAplicado),
    montoConDescuento: redondear(montoConDescuento),
    impuesto: redondear(impuesto),
    total: redondear(total),
  };
};

/**
 * Calcular totales de factura
 */
export const calcularTotalesFactura = (items, descuentoGlobal = 0) => {
  let subtotal = 0;
  let totalDescuentos = 0;
  let totalImpuestos = 0;

  // Calcular subtotal y totales por línea
  items.forEach((item) => {
    const linea = calcularTotalLinea(
      item.cantidad,
      item.precioUnitario,
      item.iva || 19,
      item.descuento || 0
    );

    subtotal += linea.subtotal;
    totalDescuentos += linea.descuento;
    totalImpuestos += linea.impuesto;
  });

  // Aplicar descuento global
  const descuentoGlobalCalculado = calcularDescuento(subtotal, descuentoGlobal, true);
  const montoConDescuentos = subtotal - totalDescuentos - descuentoGlobalCalculado;

  // Recalcular impuestos después de descuentos
  let totalImpuestosAjustado = 0;
  items.forEach((item) => {
    const descuentoItemizado = (calcularDescuento(item.cantidad * item.precioUnitario, item.descuento || 0, true)) +
      (descuentoGlobalCalculado * ((item.cantidad * item.precioUnitario) / subtotal));
    const montoItem = (item.cantidad * item.precioUnitario) - descuentoItemizado;
    totalImpuestosAjustado += calcularIVA(montoItem, item.iva || 19);
  });

  const totalGeneral = montoConDescuentos + totalImpuestosAjustado;

  return {
    subtotal: redondear(subtotal),
    totalDescuentosLinea: redondear(totalDescuentos),
    descuentoGlobal: redondear(descuentoGlobalCalculado),
    totalDescuentos: redondear(totalDescuentos + descuentoGlobalCalculado),
    totalImpuestos: redondear(totalImpuestosAjustado),
    totalGeneral: redondear(totalGeneral),
    detalleImpuestos: {
      iva: redondear(totalImpuestosAjustado),
      inc: 0, // Calcular si es necesario
    },
  };
};

// ================== FORMATOS ==================

/**
 * Formatear número como moneda colombiana
 */
export const formatearMoneda = (valor, moneda = 'COP') => {
  const numero = parseFloat(valor);
  if (isNaN(numero)) return '$0';

  const opciones = {
    COP: { style: 'currency', currency: 'COP', minimumFractionDigits: 0 },
    USD: { style: 'currency', currency: 'USD', minimumFractionDigits: 2 },
    EUR: { style: 'currency', currency: 'EUR', minimumFractionDigits: 2 },
  };

  return new Intl.NumberFormat('es-CO', opciones[moneda] || opciones.COP).format(numero);
};

/**
 * Formatear fecha a formato colombiano
 */
export const formatearFecha = (fecha) => {
  if (!fecha) return '';
  
  // Si la fecha viene como string ISO, parsearla considerando zona horaria
  const date = typeof fecha === 'string' 
    ? new Date(fecha + (fecha.includes('T') && !fecha.includes('Z') ? 'Z' : ''))
    : new Date(fecha);
  
  // Si la fecha es inválida, intentar parsear de otra forma
  if (isNaN(date.getTime())) {
    return fecha;
  }
  
  return new Intl.DateTimeFormat('es-CO', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    timeZone: 'America/Bogota', // Forzar zona horaria de Colombia
  }).format(date);
};

/**
 * Formatear hora
 */
export const formatearHora = (fecha) => {
  if (!fecha) return '';
  const date = new Date(fecha);
  return date.toLocaleTimeString('es-CO', { hour12: false });
};

/**
 * Redondear a 2 decimales
 */
export const redondear = (numero) => {
  return Math.round(numero * 100) / 100;
};

/**
 * Convertir a número
 */
export const aNumero = (valor) => {
  if (typeof valor === 'string') {
    return parseFloat(valor.replace(/[^0-9.-]/g, ''));
  }
  return parseFloat(valor) || 0;
};

// ================== GENERACIÓN DE CONSECUTIVOS ==================

/**
 * Generar número de factura
 */
export const generarConsecutivo = (ultimoConsecutivo = 0) => {
  return ultimoConsecutivo + 1;
};

/**
 * Generar prefijo + consecutivo con formato
 * Ej: INV-001-000001
 */
export const generarNumeroFactura = (prefijo = 'INV', resolucion = '001', consecutivo = 1) => {
  const consFormateado = consecutivo.toString().padStart(6, '0');
  return `${prefijo}-${resolucion}-${consFormateado}`;
};

// ================== UTILIDADES ==================

/**
 * Generar UUID v4
 */
export const generarUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

/**
 * Parsear JSON de forma segura
 */
export const parsearJSON = (json, defaultValue = null) => {
  try {
    return typeof json === 'string' ? JSON.parse(json) : json;
  } catch (error) {
    console.error('Error al parsear JSON:', error);
    return defaultValue;
  }
};

/**
 * Convertir objeto a JSON string
 */
export const stringificarJSON = (obj) => {
  try {
    return JSON.stringify(obj);
  } catch (error) {
    console.error('Error al stringificar JSON:', error);
    return '{}';
  }
};

/**
 * Obtener estado de factura legible
 */
export const getEstadoFacturaLabel = (estado) => {
  const estados = {
    'borrador': 'Borrador',
    'enviada': 'Enviada a DIAN',
    'aceptada': 'Aceptada',
    'rechazada': 'Rechazada',
    'cancelada': 'Cancelada',
  };
  return estados[estado] || estado;
};

/**
 * Obtener color de estado
 */
export const getEstadoColor = (estado) => {
  const colores = {
    'borrador': 'gray',
    'enviada': 'blue',
    'aceptada': 'green',
    'rechazada': 'red',
    'cancelada': 'orange',
  };
  return colores[estado] || 'gray';
};
