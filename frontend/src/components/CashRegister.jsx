// ============================================================================
// CASHREGISTER.JSX - Historial de ventas
// ============================================================================
// UBICACIÓN: src/components/CashRegister.jsx
// ============================================================================
//
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║ CAMBIOS REALIZADOS EN ESTE ARCHIVO                                        ║
// ╠═══════════════════════════════════════════════════════════════════════════╣
// ║                                                                           ║
// ║ ¿POR QUÉ SE CAMBIÓ COMPLETAMENTE?                                         ║
// ║ El archivo anterior esperaba ventas con este formato:                     ║
// ║   { id, product: { name, price }, quantity }                              ║
// ║                                                                           ║
// ║ Pero el nuevo carrito (SalesCart.jsx) envía ventas con este formato:      ║
// ║   { id, items: [...], subtotal, taxRate, taxAmount, total, date }         ║
// ║                                                                           ║
// ║ Por eso sale el error "Cannot read properties of undefined (reading       ║
// ║ 'name')" - porque sale.product ya no existe, ahora es sale.items[].       ║
// ║                                                                           ║
// ║ CAMBIOS PRINCIPALES:                                                      ║
// ║ 1. Cambió de tabla a tarjetas (cards) para mostrar múltiples productos    ║
// ║ 2. Muestra subtotal, IVA y total por cada venta                           ║
// ║ 3. Muestra resumen general arriba (total ventas, IVA recaudado)           ║
// ║ 4. Formato de fecha legible                                               ║
// ║                                                                           ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
//
// ============================================================================

export function CashRegister({ sales }) {
  // ==========================================================================
  // PROPS QUE RECIBE
  // ==========================================================================
  //
  // sales (array)
  //   - Lista de todas las ventas realizadas
  //   - Viene de: controller.getSales() en App.jsx
  //
  // FORMATO DE CADA VENTA (NUEVO):
  // {
  //   id: 1673547823456,
  //   items: [
  //     { productId: 1, name: "Coca Cola", price: 1.50, quantity: 2 },
  //     { productId: 3, name: "Doritos", price: 2.00, quantity: 1 }
  //   ],
  //   subtotal: 5.00,
  //   taxRate: 13,
  //   taxAmount: 0.65,
  //   total: 5.65,
  //   date: "2024-01-15T10:30:00.000Z"
  // }
  //
  // ==========================================================================

  // ==========================================================================
  // CALCULAR TOTALES GENERALES
  // ==========================================================================
  //
  // Sumamos el total de TODAS las ventas para mostrar arriba.
  //
  // .reduce() recorre el array y acumula un valor:
  // - sum: el acumulador (empieza en 0)
  // - sale: cada venta
  // - Retorna: sum + sale.total
  //
  // ==========================================================================
  const totalVentas = sales.reduce((sum, sale) => sum + (sale.total || 0), 0);
  const totalIVA = sales.reduce((sum, sale) => sum + (sale.taxAmount || 0), 0);

  // ==========================================================================
  // FUNCIÓN: formatDate
  // ==========================================================================
  //
  // Convierte la fecha ISO a formato legible.
  //
  // ANTES:  "2024-01-15T10:30:00.000Z"
  // DESPUÉS: "15/01/2024, 10:30"
  //
  // ==========================================================================
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="cash-register">
      <h2>📋 Historial de Ventas</h2>

      {/* ================================================================== */}
      {/* RESUMEN GENERAL                                                    */}
      {/* ================================================================== */}
      {/* Muestra totales de todas las ventas arriba                         */}
      {/* ================================================================== */}
      <div className="sales-summary">
        <div className="summary-item">
          <span>Total Ventas:</span>
          <span className="amount">${totalVentas.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>IVA Recaudado:</span>
          <span className="amount">${totalIVA.toFixed(2)}</span>
        </div>
        <div className="summary-item">
          <span>Transacciones:</span>
          <span className="amount">{sales.length}</span>
        </div>
      </div>

      {/* ================================================================== */}
      {/* LISTA DE VENTAS                                                    */}
      {/* ================================================================== */}
      {sales.length === 0 ? (
        <div className="empty-message">
          <p>No hay ventas registradas</p>
        </div>
      ) : (
        <div className="sales-list">
          {/* 
            .slice() crea una copia del array
            .reverse() invierte el orden (más recientes primero)
            Así las ventas nuevas aparecen arriba
          */}
          {sales.slice().reverse().map(sale => (
            <div key={sale.id} className="sale-card">
              
              {/* Header: ID y fecha */}
              <div className="sale-header">
                <span className="sale-id">Venta #{sale.id}</span>
                <span className="sale-date">{formatDate(sale.date)}</span>
              </div>

              {/* Items: productos vendidos en esta venta */}
              <div className="sale-items">
                {(sale.items || []).map((item, index) => (
                  <div key={index} className="sale-item">
                    <span className="item-name">
                      {item.quantity}x {item.name}
                    </span>
                    <span className="item-price">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Totales de esta venta */}
              <div className="sale-totals">
                <div className="sale-row">
                  <span>Subtotal:</span>
                  <span>${(sale.subtotal || 0).toFixed(2)}</span>
                </div>
                <div className="sale-row">
                  <span>IVA ({sale.taxRate}%):</span>
                  <span>${(sale.taxAmount || 0).toFixed(2)}</span>
                </div>
                <div className="sale-row total">
                  <span>Total:</span>
                  <span>${(sale.total || 0).toFixed(2)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}