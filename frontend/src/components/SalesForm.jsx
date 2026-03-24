import { useState } from "react";

export function SalesForm({ products, onCreateSale }) {
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!selectedProduct || quantity < 1) {
      setMessage('Por favor completa todos los campos');
      return;
    }

    const result = onCreateSale(parseInt(selectedProduct), quantity);

    if (result.success) {
      setMessage(`✓ Venta registrada: ${result.sale.product.name}`);
      setSelectedProduct('');
      setQuantity(1);
      setTimeout(() => setMessage(''), 2000);
    } else {
      setMessage(`✗ ${result.message}`);
    }
  };

  return (
    <div className="sales-form">
      <h2>Registrar Venta</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Producto</label>
          <select
            value={selectedProduct}
            onChange={(e) => setSelectedProduct(e.target.value)}
          >
            <option value="">-- Selecciona un producto --</option>
            {products.map(product => (
              <option key={product.id} value={product.id}>
                {product.name} - ${product.price} (Stock: {product.stock})
              </option>
            ))}
          </select>
        </div>

        <div className="form-group">
          <label>Cantidad</label>
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
          />
        </div>

        <button type="submit">Registrar Venta</button>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}