export function Dashboard({ totalSales, transactionCount, products }) {
  return (
    <div className="dashboard">
      <h2>Panel de Control</h2>
      <div className="stats">
        <div className="stat-card">
          <h3>Total Ventas</h3>
          {/* CAMBIO: tofixed → toFixed (con F mayúscula) */}
          <p className="amount">${totalSales.toFixed(2)}</p>
        </div>
        <div className="stat-card">
          <h3>Transacciones</h3>
          <p className="amount">{transactionCount}</p>
        </div>
        <div className="stat-card">
          <h3>Productos</h3>
          <p className="amount">{products.length}</p>
        </div>
      </div>
    </div>
  );
}