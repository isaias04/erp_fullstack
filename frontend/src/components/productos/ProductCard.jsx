export function ProductCard({ product, onDeleteProduct }) {
  const handleDelete = () => {
    if (window.confirm(`¿Eliminar "${product.name}"?`)) {
      onDeleteProduct(product.id);
    }
  };

  const stockStatus =
    product.stock === 0 ? 'out-of-stock' :
    product.stock <= 5 ? 'low-stock' :
    'in-stock';

  return (
    <div className={`product-card ${stockStatus}`}>
      <div className="product-header">
        <h3 className="product-name">{product.name}</h3>
        <span className={`stock-badge ${stockStatus}`}>
          {product.stock === 0 ? 'Agotado' : `${product.stock} unid.`}
        </span>
      </div>

      <div className="product-price">
        ${product.price.toFixed(2)}
      </div>

      <button
        className="btn-add-cart"
        onClick={handleDelete}
        style={{ backgroundColor: '#e74c3c' }}
      >
        Eliminar
      </button>
    </div>
  );
}
