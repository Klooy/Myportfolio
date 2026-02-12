/**
 * Componente para generar PDF de facturas
 * Crea un ticket profesional listo para imprimir
 */

import { useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { formatearMoneda, formatearFecha } from '../utils/facturacionUtils';

export default function TicketFactura({ factura, cliente, items = [] }) {
  const ticketRef = useRef();

  // Calcular totales con tolerancia a datos incompletos
  const itemsArray = Array.isArray(items)
    ? items
    : typeof items === 'string'
      ? JSON.parse(items)
      : [];

  const subtotalCalc =
    factura.subtotal ??
    itemsArray.reduce((acc, item) => acc + (item.cantidad || 1) * (item.precioUnitario || item.precio || 0), 0);

  const impuestosCalc = factura.impuestos ?? itemsArray.reduce((acc, item) => {
    const base = (item.cantidad || 1) * (item.precioUnitario || item.precio || 0);
    const iva = (item.iva ?? 19) / 100;
    return acc + base * iva;
  }, 0);

  const descuentosCalc = factura.descuentos ?? 0;
  const totalCalc = factura.total ?? subtotalCalc - descuentosCalc + impuestosCalc;
  const ivaLabel = factura.tasaIva
    ? `${factura.tasaIva}%`
    : `${itemsArray.find((i) => i?.iva !== undefined)?.iva ?? 19}%`;
  const totalTexto = formatearMoneda(totalCalc);
  const totalFontSize = totalTexto.replace(/\s/g, '').length > 14 ? '18px' : '22px';
  const quickTotalFontSize = totalTexto.replace(/\s/g, '').length > 12 ? '16px' : '18px';

  const generarPDF = async () => {
    if (!ticketRef.current) return;

    try {
      const element = ticketRef.current;
      
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        allowTaint: true,
        padding: 0,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
        compress: true,
      });

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      
      // Márgenes
      const margin = 5;
      const contentWidth = pageWidth - (margin * 2);
      
      // Calcular altura de la imagen proporcionalmente
      const imgWidth = contentWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      let position = margin;
      let pageCount = 1;

      // Primera página
      pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
      let remainingHeight = imgHeight - (pageHeight - position - margin);

      // Páginas adicionales si es necesario
      while (remainingHeight > 0) {
        pdf.addPage();
        position = -remainingHeight + (pageHeight - margin);
        pdf.addImage(imgData, 'PNG', margin, position, imgWidth, imgHeight);
        remainingHeight -= (pageHeight - margin * 2);
        pageCount++;
      }

      pdf.save(`factura-${factura.numero}.pdf`);
      alert(`✅ PDF descargado exitosamente: factura-${factura.numero}.pdf`);
    } catch (error) {
      console.error('Error generando PDF:', error);
      alert('❌ Error al generar PDF. Intenta nuevamente.');
    }
  };

  const imprimirDirecto = () => {
    if (!ticketRef.current) return;

    const ventanaImpresion = window.open('', '_blank');
    if (!ventanaImpresion) {
      alert('Por favor habilita las ventanas emergentes en tu navegador');
      return;
    }

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Factura ${factura.numero}</title>
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: Arial, sans-serif;
              font-size: 12px;
              line-height: 1.4;
              color: #333;
              padding: 10mm;
            }
            @media print {
              body {
                padding: 5mm;
              }
              .no-print {
                display: none;
              }
            }
            .ticket {
              max-width: 800px;
              margin: 0 auto;
              background: white;
              padding: 15px;
              border: 1px solid #ddd;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 10px;
              margin-bottom: 10px;
            }
            .header h1 {
              font-size: 24px;
              margin-bottom: 5px;
            }
            .header p {
              font-size: 14px;
              margin: 2px 0;
            }
            .cliente-info {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-bottom: 10px;
              padding-bottom: 10px;
              border-bottom: 1px solid #ddd;
            }
            .cliente-info strong {
              font-size: 11px;
              text-transform: uppercase;
              display: block;
              margin-bottom: 5px;
              border-bottom: 1px solid #999;
              padding-bottom: 3px;
            }
            .cliente-info p {
              font-size: 11px;
              margin: 2px 0;
            }
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 10px;
            }
            table thead {
              background: #333;
              color: white;
            }
            table th {
              padding: 6px 4px;
              text-align: left;
              font-weight: bold;
              font-size: 11px;
              border: 1px solid #333;
            }
            table td {
              padding: 6px 4px;
              border-bottom: 1px solid #ddd;
              font-size: 11px;
            }
            table th:nth-child(2),
            table th:nth-child(3),
            table th:nth-child(4),
            table th:nth-child(5),
            table td:nth-child(2),
            table td:nth-child(3),
            table td:nth-child(4),
            table td:nth-child(5) {
              text-align: right;
            }
            .totales {
              background: #f5f5f5;
              padding: 12px;
              border: 2px solid #333;
              border-radius: 4px;
              margin-bottom: 10px;
              margin-left: 50%;
            }
            .totales div {
              display: flex;
              justify-content: space-between;
              margin-bottom: 6px;
              font-size: 11px;
            }
            .totales div:nth-child(2),
            .totales div:nth-child(3) {
              padding-bottom: 6px;
              border-bottom: 1px solid #ddd;
            }
            .total-final {
              background: linear-gradient(to right, #333, #555);
              color: white;
              padding: 8px 10px;
              border-radius: 3px;
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 13px;
            }
            .notas {
              background: #fffacd;
              padding: 8px;
              border-left: 3px solid #ffa500;
              margin-bottom: 10px;
              font-size: 11px;
            }
            .notas strong {
              display: block;
              margin-bottom: 3px;
              font-size: 10px;
              text-transform: uppercase;
            }
            .footer {
              text-align: center;
              border-top: 2px solid #333;
              padding-top: 8px;
              margin-top: 10px;
              font-size: 10px;
              color: #666;
            }
            .footer p {
              margin: 2px 0;
            }
          </style>
        </head>
        <body>
          <div class="ticket">
            ${ticketRef.current.innerHTML}
          </div>
        </body>
      </html>
    `;

    ventanaImpresion.document.write(htmlContent);
    ventanaImpresion.document.close();
    
    // Esperar a que se cargue el contenido antes de imprimir
    ventanaImpresion.onload = () => {
      setTimeout(() => {
        ventanaImpresion.print();
      }, 250);
    };
  };

  const formatItemTotal = (item) => {
    const cant = item.cantidad || 1;
    const precio = item.precioUnitario || item.precio || 0;
    const ivaPct = item.iva ?? 19;
    const base = cant * precio;
    const iva = base * (ivaPct / 100);
    return item.total ?? base + iva;
  };

  return (
    <div className="w-full px-4 sm:px-0">
      {/* Botones de acción - Responsive */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-center">
        <button
          onClick={generarPDF}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all text-sm sm:text-base"
        >
          <span>📥</span>
          <span>Descargar PDF</span>
        </button>
        <button
          onClick={imprimirDirecto}
          className="bg-gray-600 hover:bg-gray-700 text-white px-4 sm:px-6 py-2 rounded-lg font-bold flex items-center justify-center space-x-2 transition-all text-sm sm:text-base"
        >
          <span>🖨️</span>
          <span>Imprimir</span>
        </button>
      </div>

      {/* Contenido del Ticket */}
      <div
        ref={ticketRef}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-lg max-w-3xl mx-auto border border-gray-300"
        style={{
          fontFamily: 'Arial, sans-serif',
          fontSize: '13px',
          lineHeight: '1.45'
        }}
      >
        {/* Header - Responsive */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between border-b-2 border-gray-800 pb-3 sm:pb-4 mb-4 gap-2 sm:gap-3">
          <div className="text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900" style={{ fontSize: 'clamp(20px, 5vw, 28px)' }}>
              💼 FACTURA ELECTRÓNICA
            </h1>
            <p className="text-base sm:text-lg font-bold text-gray-700" style={{ fontSize: 'clamp(14px, 4vw, 18px)' }}>
              #{factura.numero}
            </p>
          </div>
          <div className="text-right text-xs text-gray-700 space-y-1">
            <p><strong>Emisión:</strong> {formatearFecha(factura.fecha_emision)}</p>
            <p><strong>Vencimiento:</strong> {factura.fecha_vencimiento ? formatearFecha(factura.fecha_vencimiento) : '30 días'}</p>
            <p className={`inline-block px-2 py-1 rounded text-white font-semibold text-xs ${
              factura.estado === 'enviada'
                ? 'bg-green-600'
                : factura.estado === 'pagada'
                  ? 'bg-blue-600'
                  : 'bg-yellow-600'
            }`}>
              {factura.estado?.toUpperCase() || 'BORRADOR'}
            </p>
          </div>
        </div>

        {/* Datos del Cliente - Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-6 pb-3 sm:pb-4 border-b border-gray-300">
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase mb-2 border-b border-gray-400 pb-1">
              Facturado a:
            </p>
            <p className="font-bold text-gray-800" style={{ fontSize: 'clamp(12px, 3vw, 14px)' }}>
              {cliente?.razon_social || cliente?.razonSocial || 'Cliente'}
            </p>
            <p className="text-xs text-gray-700">
              <strong>NIT:</strong> {cliente?.nit || 'N/A'}
            </p>
            <p className="text-xs text-gray-700">
              <strong>Email:</strong> {cliente?.email || 'N/A'}
            </p>
            <p className="text-xs text-gray-700">
              <strong>Tel:</strong> {cliente?.telefono || cliente?.celular || 'N/A'}
            </p>
            {cliente?.direccion && (
              <p className="text-xs text-gray-700">
                <strong>Dir:</strong> {cliente.direccion}
              </p>
            )}
          </div>
          <div>
            <p className="text-xs font-bold text-gray-700 uppercase mb-2 border-b border-gray-400 pb-1">
              Totales rápidos
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="bg-gray-50 border border-gray-200 rounded p-2">
                <p className="font-semibold text-gray-700 text-xs">Subtotal</p>
                <p className="font-bold text-gray-900 text-xs">{formatearMoneda(subtotalCalc)}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2">
                <p className="font-semibold text-gray-700 text-xs">IVA</p>
                <p className="font-bold text-gray-900 text-xs">{formatearMoneda(impuestosCalc)}</p>
              </div>
              <div className="bg-gray-50 border border-gray-200 rounded p-2">
                <p className="font-semibold text-gray-700 text-xs">Descuento</p>
                <p className="font-bold text-red-600 text-xs">{formatearMoneda(descuentosCalc)}</p>
              </div>
              <div className="bg-gray-800 text-white rounded p-2">
                <p className="font-semibold text-xs">Total</p>
                <p className="font-extrabold" style={{ fontSize: quickTotalFontSize }}>
                  {formatearMoneda(totalCalc)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Items/Detalles - Tabla Desktop */}
        <div className="mb-6 hidden sm:block overflow-x-auto">
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-700 text-white">
                <th className="px-2 py-2 text-left font-bold border border-gray-700">Descripción</th>
                <th className="px-2 py-2 text-center font-bold border border-gray-700" style={{ width: '50px' }}>Cant.</th>
                <th className="px-2 py-2 text-right font-bold border border-gray-700" style={{ width: '70px' }}>V. Unit.</th>
                <th className="px-2 py-2 text-center font-bold border border-gray-700" style={{ width: '45px' }}>IVA</th>
                <th className="px-2 py-2 text-right font-bold border border-gray-700" style={{ width: '70px' }}>Total</th>
              </tr>
            </thead>
            <tbody>
              {itemsArray.length > 0 ? (
                itemsArray.map((item, index) => (
                  <tr key={index} className="border-b border-gray-300">
                    <td className="px-2 py-2 border-l border-gray-300">
                      {item.descripcion || item.nombre || 'Producto'}
                    </td>
                    <td className="px-2 py-2 text-center border-l border-gray-300">
                      {item.cantidad || 1}
                    </td>
                    <td className="px-2 py-2 text-right border-l border-gray-300">
                      {formatearMoneda(item.precioUnitario || item.precio || 0)}
                    </td>
                    <td className="px-2 py-2 text-center border-l border-gray-300">
                      {item.iva || 19}%
                    </td>
                    <td className="px-2 py-2 text-right border-l border-gray-300 font-bold">
                      {formatearMoneda(formatItemTotal(item))}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-2 py-3 text-center text-gray-500">
                    No hay items detallados
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Items/Detalles - Vista Móvil en Tarjetas */}
        <div className="mb-6 sm:hidden space-y-3">
          {itemsArray.length > 0 ? (
            itemsArray.map((item, index) => (
              <div key={index} className="border border-gray-300 rounded-lg bg-white p-3 space-y-2">
                <div className="flex justify-between items-start gap-2">
                  <div className="flex-1">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Producto</p>
                    <p className="font-semibold text-gray-800 text-sm break-words">
                      {item.descripcion || item.nombre || 'Producto'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500 font-semibold uppercase">Total</p>
                    <p className="font-bold text-gray-900 text-sm">
                      {formatearMoneda(formatItemTotal(item))}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-gray-200">
                  <div>
                    <p className="text-gray-500 font-semibold">Cantidad</p>
                    <p className="font-bold text-gray-800">{item.cantidad || 1}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Precio Unit.</p>
                    <p className="font-bold text-gray-800">{formatearMoneda(item.precioUnitario || item.precio || 0)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">IVA</p>
                    <p className="font-bold text-gray-800">{item.iva || 19}%</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-semibold">Subtotal</p>
                    <p className="font-bold text-gray-800">{formatearMoneda((item.cantidad || 1) * (item.precioUnitario || item.precio || 0))}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="px-2 py-3 text-center text-gray-500 bg-gray-50 rounded">
              No hay items detallados
            </div>
          )}
        </div>

        {/* Separador */}
        <div className="border-t-2 border-gray-800 mb-4"></div>

        {/* Totales - Sección Destacada */}
        <div className="mb-6 bg-gray-50 p-4 border-2 border-gray-800 rounded">
          <div className="space-y-2">
            <div className="flex justify-between text-xs">
              <span className="font-semibold">Subtotal:</span>
              <span className="font-semibold">{formatearMoneda(subtotalCalc)}</span>
            </div>
            {descuentosCalc > 0 && (
              <div className="flex justify-between text-xs">
                <span className="font-semibold">Descuentos:</span>
                <span className="font-semibold text-red-600">
                  -{formatearMoneda(descuentosCalc)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-xs border-t border-gray-400 pt-2">
              <span className="font-semibold">IVA ({ivaLabel}):</span>
              <span className="font-semibold">{formatearMoneda(impuestosCalc)}</span>
            </div>
            
            {/* TOTAL - DESTACADO */}
            <div className="flex flex-wrap items-center justify-between gap-3 bg-gradient-to-r from-gray-800 to-gray-700 text-white px-4 py-4 rounded mt-3 border-2 border-gray-900 shadow">
              <span className="font-extrabold tracking-wide" style={{ fontSize: '18px' }}>TOTAL A PAGAR</span>
              <span className="font-black" style={{ fontSize: totalFontSize, letterSpacing: '0.5px' }}>
                {totalTexto}
              </span>
            </div>
          </div>
        </div>

        {/* Notas */}
        {factura.notas && (
          <div className="mb-4 pb-4 border-b border-gray-300">
            <p className="text-xs font-bold text-gray-700 uppercase mb-1">Notas/Observaciones:</p>
            <p className="text-xs text-gray-700 italic">{factura.notas}</p>
          </div>
        )}

        {/* Pie de página */}
        <div className="text-center text-xs text-gray-600 mt-6 pt-4 border-t-2 border-gray-800">
          <p className="font-semibold">✓ Gracias por su compra</p>
          <p className="mt-1 text-gray-500">
            Documento generado automáticamente
          </p>
          <p className="text-gray-500">
            Sistema de Facturación Electrónica
          </p>
          <p className="text-gray-400 text-xs mt-2">
            {new Date().toLocaleString('es-CO')}
          </p>
        </div>
      </div>
    </div>
  );
}
