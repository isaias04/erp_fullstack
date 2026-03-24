// ========================================
// INVENTORYLIST.JSX - Lista de inventario
// ========================================
// UBICACIÓN: src/components/productos/InventoryList.jsx
// ACCIÓN: REEMPLAZAR el archivo existente (era versión temporal)
// ========================================

import { SearchBar } from "./SearchBar";
import { ProductCard } from "./ProductCard";

export function InventoryList({ products, onSearch, onAddProduct, onDeleteProduct }) {
  // ===== PROPS QUE RECIBE =====
  // products        = array de productos a mostrar
  // onSearch        = función para buscar/filtrar productos
  // onAddProduct    = función para abrir el modal de nuevo producto
  // onDeleteProduct = función para eliminar un producto

  // ===== RENDER =====
  return (
    <div className="inventory-list">
      
      {/* ===== HEADER DEL INVENTARIO ===== */}
      <div className="inventory-header">
        {/* Título y contador */}
        <div className="inventory-title">
          <h2>📦 Inventario de Productos</h2>
          <p className="inventory-count">
            {products.length} productos
          </p>
        </div>
        
        {/* Botón para agregar nuevo producto */}
        <button className="btn-add-product" onClick={onAddProduct}>
          + Nuevo Producto
        </button>
      </div>

      {/* ===== BARRA DE BÚSQUEDA ===== */}
      <SearchBar onSearch={onSearch} />

      {/* ===== LISTA DE PRODUCTOS ===== */}
      {products.length === 0 ? (
        // Si no hay productos, mostrar mensaje
        <div className="empty-state">
          <p>No se encontraron productos</p>
        </div>
      ) : (
        // Si hay productos, mostrar en grilla
        <div className="products-grid">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onDeleteProduct={onDeleteProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
}