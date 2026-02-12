/**
 * Servicio local para persistencia de datos en Supabase
 * Maneja CRUD de clientes, productos y facturas
 */

import { supabase } from '../../../services/supabase';

// ================== CLIENTES ==================

export const clientesService = {
  /**
   * Obtener todos los clientes del usuario actual
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('invoicing_clientes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener clientes:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo cliente
   */
  async create(cliente) {
    try {
      console.log('Datos del cliente a crear:', cliente);
      // Evitar duplicados por NIT
      if (cliente.nit) {
        const { data: existente, error: errorExistente } = await supabase
          .from('invoicing_clientes')
          .select('*')
          .eq('nit', cliente.nit)
          .single();

        if (!errorExistente && existente) {
          console.warn('Cliente ya existe con ese NIT, devolviendo existente');
          return existente;
        }
        // Si el error es 406 (no rows) continuamos
      }
      // Obtener usuario si existe (sesión opcional para anónimos)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Limpiar el objeto para asegurarnos que solo tenga las columnas correctas
      const datosLimpios = {
        razon_social: cliente.razonSocial || cliente.razon_social,
        nit: cliente.nit,
        email: cliente.email,
        telefono: cliente.telefono || '',
        direccion: cliente.direccion || '',
        ciudad: cliente.ciudad || '',
        departamento: cliente.departamento || '',
        cliente_factus_id: cliente.cliente_factus_id || null,
        // user_id: user?.id || null, // Comentado: si la columna no existe
      };
      
      console.log('Datos limpios a insertar:', datosLimpios);
      
      const { data, error } = await supabase
        .from('invoicing_clientes')
        .insert(datosLimpios)
        .select();

      if (error) {
        console.error('Error de Supabase completo:', JSON.stringify(error, null, 2));
        console.error('Mensaje:', error.message);
        console.error('Details:', error.details);
        console.error('Hint:', error.hint);
        if (error.code === '23505') {
          throw new Error('Ya existe un cliente con ese NIT');
        }
        throw error;
      }
      
      console.log('Cliente creado exitosamente:', data?.[0]);
      return data?.[0];
    } catch (error) {
      console.error('Error al crear cliente:', JSON.stringify(error, null, 2));
      throw error;
    }
  },

  /**
   * Actualizar un cliente
   */
  async update(id, cliente) {
    try {
      const { data, error } = await supabase
        .from('invoicing_clientes')
        .update(cliente)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error al actualizar cliente:', error);
      throw error;
    }
  },

  /**
   * Eliminar un cliente
   */
  async delete(id) {
    try {
      // Validar que no existan facturas asociadas al cliente
      const { count, error: countError } = await supabase
        .from('invoicing_facturas')
        .select('id', { count: 'exact', head: true })
        .eq('cliente_id', id);

      if (countError) throw countError;
      if ((count || 0) > 0) {
        throw new Error('No se puede eliminar: el cliente tiene facturas asociadas');
      }

      const { error } = await supabase
        .from('invoicing_clientes')
        .delete()
        .eq('id', id);

      if (error) {
        if (error.code === '23503') {
          throw new Error('No se puede eliminar: el cliente tiene facturas asociadas');
        }
        throw error;
      }
      return true;
    } catch (error) {
      console.error('Error al eliminar cliente:', error);
      throw error;
    }
  },

  /**
   * Buscar cliente por NIT
   */
  async getByNit(nit) {
    try {
      const { data, error } = await supabase
        .from('invoicing_clientes')
        .select('*')
        .eq('nit', nit)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error al buscar cliente por NIT:', error);
      throw error;
    }
  },
};

// ================== PRODUCTOS ==================

export const productosService = {
  /**
   * Obtener todos los productos del usuario
   */
  async getAll() {
    try {
      const { data, error } = await supabase
        .from('invoicing_productos')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener productos:', error);
      throw error;
    }
  },

  /**
   * Crear un nuevo producto
   */
  async create(producto) {
    try {
      const { data, error } = await supabase
        .from('invoicing_productos')
        .insert([producto])
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error al crear producto:', error);
      throw error;
    }
  },

  /**
   * Actualizar un producto
   */
  async update(id, producto) {
    try {
      const { data, error } = await supabase
        .from('invoicing_productos')
        .update(producto)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error al actualizar producto:', error);
      throw error;
    }
  },

  /**
   * Eliminar un producto
   */
  async delete(id) {
    try {
      const { error } = await supabase
        .from('invoicing_productos')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      throw error;
    }
  },

  /**
   * Obtener producto por código
   */
  async getByCodigo(codigo) {
    try {
      const { data, error } = await supabase
        .from('invoicing_productos')
        .select('*')
        .eq('codigo', codigo)
        .single();

      if (error && error.code !== 'PGRST116') throw error;
      return data || null;
    } catch (error) {
      console.error('Error al obtener producto:', error);
      throw error;
    }
  },
};

// ================== FACTURAS ==================

export const facturasService = {
  /**
   * Obtener todas las facturas del usuario
   */
  async getAll(filtros = {}) {
    try {
      let query = supabase
        .from('invoicing_facturas')
        .select('*');

      // Aplicar filtros si existen
      if (filtros.estado) {
        query = query.eq('estado', filtros.estado);
      }
      if (filtros.cliente_id) {
        query = query.eq('cliente_id', filtros.cliente_id);
      }
      if (filtros.fecha_inicio && filtros.fecha_fin) {
        query = query
          .gte('fecha_emision', filtros.fecha_inicio)
          .lte('fecha_emision', filtros.fecha_fin);
      }

      const { data, error } = await query.order('fecha_emision', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error al obtener facturas:', error);
      throw error;
    }
  },

  /**
   * Crear una nueva factura
   */
  async create(factura) {
    try {
      // Adjuntar el usuario autenticado si existe (sesión opcional para anónimos)
      const { data: { user } } = await supabase.auth.getUser();
      
      // Crear objeto sin user_id si la columna no existe en la tabla
      const facturaConUsuario = {
        ...factura,
        // user_id: factura.user_id || user?.id || null, // Comentado: columna no existe
      };
      
      // Eliminar user_id del objeto si existe
      delete facturaConUsuario.user_id;

      const { data, error } = await supabase
        .from('invoicing_facturas')
        .insert([facturaConUsuario])
        .select();

      if (error) {
        console.error('Error al crear factura:', error);
        console.error('Código:', error.code);
        console.error('Mensaje:', error.message);
        console.error('Detalles:', error.details);
        console.error('Hint:', error.hint);
        console.error('Datos enviados:', JSON.stringify(facturaConUsuario, null, 2));
        throw error;
      }
      return data?.[0];
    } catch (error) {
      console.error('Error al crear factura:', error);
      throw error;
    }
  },

  /**
   * Actualizar una factura
   */
  async update(id, factura) {
    try {
      const { data, error } = await supabase
        .from('invoicing_facturas')
        .update(factura)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error al actualizar factura:', error);
      throw error;
    }
  },

  /**
   * Obtener una factura específica
   */
  async getById(id) {
    try {
      const { data, error } = await supabase
        .from('invoicing_facturas')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error al obtener factura:', error);
      throw error;
    }
  },

  /**
   * Actualizar estado de factura
   */
  async updateEstado(id, estado, datosFactus = null) {
    try {
      const updates = { estado, updated_at: new Date().toISOString() };
      if (datosFactus) {
        updates.datos_factus = datosFactus;
      }

      const { data, error } = await supabase
        .from('invoicing_facturas')
        .update(updates)
        .eq('id', id)
        .select();

      if (error) throw error;
      return data?.[0];
    } catch (error) {
      console.error('Error al actualizar estado:', error);
      throw error;
    }
  },

  /**
   * Eliminar una factura (solo si no está enviada)
   */
  async delete(id) {
    try {
      // Validar que la factura no esté enviada a DIAN
      const factura = await this.getById(id);
      if (!factura) {
        throw new Error('Factura no encontrada');
      }

      const estadosEliminables = ['borrador', 'rechazada', 'cancelada'];
      if (!estadosEliminables.includes(factura.estado)) {
        throw new Error(`No se puede eliminar una factura con estado "${factura.estado}". Solo se pueden eliminar facturas en estado borrador, rechazada o cancelada.`);
      }

      const { error } = await supabase
        .from('invoicing_facturas')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error al eliminar factura:', error);
      throw error;
    }
  },

  /**
   * Obtener consecutivo para nueva factura
   */
  async getNextConsecutivo() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      // Para anónimos, generar consecutivo temporal basado en timestamp
      if (!user) {
        console.warn('getNextConsecutivo: usuario anónimo, usando consecutivo temporal');
        return Math.floor(Date.now() / 1000); // segundos desde epoch
      }

      const { data, error } = await supabase
        .from('invoicing_facturas')
        .select('numero')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(1);

      if (error) throw error;

      const ultimoNumeroRaw = data?.[0]?.numero;
      let ultimoNumero = 0;

      // Soporta números simples o códigos tipo INV-001-000123
      if (typeof ultimoNumeroRaw === 'number') {
        ultimoNumero = ultimoNumeroRaw;
      } else if (typeof ultimoNumeroRaw === 'string') {
        const match = ultimoNumeroRaw.match(/(\d+)(?!.*\d)/); // Último bloque de dígitos
        ultimoNumero = match ? parseInt(match[1], 10) : 0;
      }

      return ultimoNumero + 1;
    } catch (error) {
      console.error('Error al obtener consecutivo:', error);
      throw error;
    }
  },
};
