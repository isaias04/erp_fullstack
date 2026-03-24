// ============================================================================
// SALESCART.JSX - Carrito de ventas
// ============================================================================
//
// ¿QUÉ ES ESTE ARCHIVO?
// ---------------------
// Este componente muestra la pantalla de VENTAS. Es donde el vendedor:
// 1. Ve la lista de productos disponibles
// 2. Agrega productos al carrito
// 3. Ve el subtotal, IVA y total en tiempo real
// 4. Completa la venta cuando el cliente paga
//
// ¿DÓNDE VA ESTE ARCHIVO?
// -----------------------
// src/components/SalesCart.jsx
//
// ¿CÓMO FUNCIONA?
// ---------------
// LADO IZQUIERDO: Lista de productos disponibles para vender
//   - Cada producto tiene botón "+ Agregar"
//   - Se puede buscar productos
//
// LADO DERECHO: Carrito con los productos seleccionados
//   - Muestra cantidad, precio unitario, subtotal por producto
//   - Botones +/- para cambiar cantidad
//   - Botón 🗑️ para quitar del carrito
//   - Subtotal (suma de todos los productos)
//   - IVA (porcentaje configurable, ej: 13%)
//   - Total (subtotal + IVA)
//   - Botón "Completar Venta"
//
// FLUJO DE UNA VENTA:
// -------------------
// 1. Vendedor busca "Coca Cola"
// 2. Da clic en "+ Agregar" → aparece en el carrito
// 3. Da clic en "+" para agregar otra → cantidad = 2
// 4. Agrega más productos...
// 5. Ve el total: Subtotal $10.00 + IVA $1.30 = Total $11.30
// 6. Cliente paga → Vendedor da clic en "Completar Venta"
// 7. Se registra la venta → Se reduce el stock → Carrito se vacía
//
// ============================================================================

import { useState } from 'react';

export function SalesCart({ products, onCompleteSale, taxRate = 13 }) {
  // ==========================================================================
  // PROPS QUE RECIBE
  // ==========================================================================
  //
  // products (array)
  //   - Lista de TODOS los productos disponibles para vender
  //   - Viene de: controller.getProducts() en App.jsx
  //   - Ejemplo: [{ id: 1, name: "Coca Cola", price: 1.50, stock: 100 }, ...]
  //
  // onCompleteSale (función)
  //   - Se ejecuta cuando el vendedor da clic en "Completar Venta"
  //   - Recibe un objeto con todos los datos de la venta
  //   - App.jsx usa esto para registrar la venta en el controlador
  //
  // taxRate (número)
  //   - Porcentaje de IVA a aplicar
  //   - Default: 13 (significa 13%)
  //   - Ejemplo: taxRate = 13 → IVA = subtotal * 0.13
  //
  // ==========================================================================

  // --------------------------------------------------------------------------
  // ESTADO 1: cartItems (Productos en el carrito)
  // --------------------------------------------------------------------------
  //
  // ¿QUÉ GUARDA?
  // Un array con los productos que el vendedor ha agregado al carrito.
  //
  // ESTRUCTURA DE CADA ITEM:
  // {
  //   productId: 1,        // ID del producto (para identificarlo)
  //   name: "Coca Cola",   // Nombre (para mostrar)
  //   price: 1.50,         // Precio unitario
  //   quantity: 2          // Cantidad en el carrito
  // }
  //
  // EJEMPLO:
  // cartItems = [
  //   { productId: 1, name: "Coca Cola", price: 1.50, quantity: 2 },
  //   { productId: 3, name: "Doritos", price: 2.00, quantity: 1 }
  // ]
  // Esto significa: 2 Coca Colas + 1 Doritos en el carrito
  //
  // VALOR INICIAL: [] (carrito vacío)
  //
  // --------------------------------------------------------------------------
  const [cartItems, setCartItems] = useState([]);

  // --------------------------------------------------------------------------
  // ESTADO 2: searchQuery (Texto de búsqueda)
  // --------------------------------------------------------------------------
  //
  // ¿QUÉ GUARDA?
  // Lo que el vendedor escribe en la barra de búsqueda de productos.
  //
  // EJEMPLO:
  // Usuario escribe "coca" → searchQuery = "coca"
  // Solo se muestran productos que contengan "coca" en el nombre
  //
  // --------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');

  // --------------------------------------------------------------------------
  // ESTADO 3: message (Mensaje de feedback)
  // --------------------------------------------------------------------------
  //
  // ¿QUÉ GUARDA?
  // Un mensaje para mostrar al usuario. Puede ser:
  // - Éxito: "¡Venta registrada exitosamente!"
  // - Advertencia: "No hay más stock de Coca Cola"
  // - Error: "Agrega productos al carrito"
  //
  // VALOR INICIAL: '' (sin mensaje)
  //
  // --------------------------------------------------------------------------
  const [message, setMessage] = useState('');

  // ==========================================================================
  // PRODUCTOS FILTRADOS
  // ==========================================================================
  //
  // Filtramos la lista de productos según:
  // 1. El texto de búsqueda (searchQuery)
  // 2. Que tengan stock > 0 (no mostrar productos agotados)
  //
  // .filter() crea un nuevo array solo con los elementos que cumplen la condición
  //
  // EJEMPLO:
  // products = [Coca Cola (stock 10), Pepsi (stock 0), Doritos (stock 5)]
  // searchQuery = "co"
  // Resultado: [Coca Cola] (Pepsi no tiene stock, Doritos no contiene "co")
  //
  // ==========================================================================
  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
    p.stock > 0
  );

  // ==========================================================================
  // CÁLCULOS AUTOMÁTICOS
  // ==========================================================================
  //
  // Estos valores se RECALCULAN automáticamente cada vez que cambia cartItems.
  // No necesitamos guardarlos en estados porque se derivan de cartItems.
  //
  // ==========================================================================

  // --------------------------------------------------------------------------
  // SUBTOTAL
  // --------------------------------------------------------------------------
  // Suma de (precio × cantidad) de todos los items del carrito.
  //
  // .reduce() recorre el array y acumula un valor.
  // - sum: el acumulador (empieza en 0)
  // - item: el elemento actual
  // - Retorna: sum + (precio del item × cantidad)
  //
  // EJEMPLO:
  // cartItems = [
  //   { price: 1.50, quantity: 2 },  // 1.50 × 2 = 3.00
  //   { price: 2.00, quantity: 1 }   // 2.00 × 1 = 2.00
  // ]
  // subtotal = 0 + 3.00 + 2.00 = 5.00
  //
  // --------------------------------------------------------------------------
  const subtotal = cartItems.reduce(
    (sum, item) => sum + (item.price * item.quantity), 0
  );

  // --------------------------------------------------------------------------
  // IVA (IMPUESTO)
  // --------------------------------------------------------------------------
  // El monto del impuesto = subtotal × (porcentaje / 100)
  //
  // EJEMPLO:
  // subtotal = 100.00
  // taxRate = 13 (13%)
  // taxAmount = 100.00 × (13 / 100) = 100.00 × 0.13 = 13.00
  //
  // --------------------------------------------------------------------------
  const taxAmount = subtotal * (taxRate / 100);

  // --------------------------------------------------------------------------
  // TOTAL
  // --------------------------------------------------------------------------
  // Lo que el cliente debe pagar = subtotal + IVA
  //
  // EJEMPLO:
  // subtotal = 100.00
  // taxAmount = 13.00
  // total = 113.00
  //
  // --------------------------------------------------------------------------
  const total = subtotal + taxAmount;

  // ==========================================================================
  // HANDLER: handleAddToCart (Agregar producto al carrito)
  // ==========================================================================
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cuando el vendedor da clic en "+ Agregar" en un producto.
  //
  // ¿QUÉ RECIBE?
  // product = el objeto del producto que quiere agregar
  // { id: 1, name: "Coca Cola", price: 1.50, stock: 100 }
  //
  // ¿QUÉ HACE?
  // 1. Verifica si el producto YA está en el carrito
  // 2. Si SÍ está → aumenta la cantidad en 1 (si hay stock)
  // 3. Si NO está → lo agrega con cantidad 1
  //
  // ==========================================================================
  const handleAddToCart = (product) => {
    setCartItems(prev => {
      // Buscar si el producto ya está en el carrito
      const existing = prev.find(item => item.productId === product.id);

      if (existing) {
        // --------------------------------------------------------------------
        // CASO 1: El producto YA está en el carrito
        // --------------------------------------------------------------------
        
        // Verificar si hay stock suficiente
        if (existing.quantity >= product.stock) {
          // No hay más stock disponible
          setMessage(`No hay más stock de ${product.name}`);
          return prev; // Retornar el carrito sin cambios
        }
        
        // Aumentar cantidad en 1
        // .map() crea un nuevo array transformando cada elemento
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: item.quantity + 1 }  // Este item: aumentar cantidad
            : item                                       // Otros items: dejar igual
        );
      } else {
        // --------------------------------------------------------------------
        // CASO 2: El producto NO está en el carrito
        // --------------------------------------------------------------------
        
        // Agregar nuevo item con cantidad 1
        return [...prev, {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1
        }];
      }
    });
    
    // Limpiar mensaje anterior (si había)
    setMessage('');
  };

  // ==========================================================================
  // HANDLER: handleRemoveOne (Quitar uno del carrito)
  // ==========================================================================
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cuando el vendedor da clic en el botón "-" de un item del carrito.
  //
  // ¿QUÉ HACE?
  // - Si cantidad > 1 → reduce la cantidad en 1
  // - Si cantidad = 1 → quita el producto del carrito
  //
  // ==========================================================================
  const handleRemoveOne = (productId) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.productId === productId);

      if (existing && existing.quantity > 1) {
        // Reducir cantidad en 1
        return prev.map(item =>
          item.productId === productId
            ? { ...item, quantity: item.quantity - 1 }
            : item
        );
      } else {
        // Quitar del carrito completamente
        // .filter() crea un nuevo array excluyendo el item
        return prev.filter(item => item.productId !== productId);
      }
    });
  };

  // ==========================================================================
  // HANDLER: handleRemoveFromCart (Eliminar producto del carrito)
  // ==========================================================================
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cuando el vendedor da clic en el botón 🗑️ de un item.
  //
  // ¿QUÉ HACE?
  // Elimina el producto completamente del carrito, sin importar la cantidad.
  //
  // ==========================================================================
  const handleRemoveFromCart = (productId) => {
    setCartItems(prev => prev.filter(item => item.productId !== productId));
  };

  // ==========================================================================
  // HANDLER: handleCompleteSale (Completar la venta)
  // ==========================================================================
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cuando el vendedor da clic en "💰 Completar Venta".
  //
  // ¿QUÉ HACE?
  // 1. Verifica que haya productos en el carrito
  // 2. Crea un objeto con todos los datos de la venta
  // 3. Llama a onCompleteSale() para registrar la venta
  // 4. Vacía el carrito
  // 5. Muestra mensaje de éxito
  //
  // ==========================================================================
  const handleCompleteSale = () => {
    // Validar que haya productos
    if (cartItems.length === 0) {
      setMessage('Agrega productos al carrito');
      return;
    }

    // Crear objeto con datos de la venta
    const sale = {
      id: Date.now(),                    // ID único (timestamp)
      items: cartItems,                  // Productos vendidos
      subtotal: subtotal,                // Suma antes de IVA
      taxRate: taxRate,                  // Porcentaje de IVA (13)
      taxAmount: taxAmount,              // Monto del IVA ($13.00)
      total: total,                      // Total a pagar ($113.00)
      date: new Date().toISOString()     // Fecha y hora de la venta
    };

    // Enviar al padre (App.jsx) para registrar
    onCompleteSale(sale);

    // Vaciar carrito
    setCartItems([]);
    
    // Mostrar mensaje de éxito
    setMessage('¡Venta registrada exitosamente!');

    // Limpiar mensaje después de 3 segundos
    setTimeout(() => setMessage(''), 3000);
  };

  // ==========================================================================
  // HANDLER: handleClearCart (Limpiar carrito)
  // ==========================================================================
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cuando el vendedor da clic en "Limpiar".
  //
  // ¿QUÉ HACE?
  // Vacía el carrito completamente (el cliente se arrepintió, por ejemplo).
  //
  // ==========================================================================
  const handleClearCart = () => {
    setCartItems([]);
    setMessage('');
  };

  // ==========================================================================
  // RENDER
  // ==========================================================================
  return (
    <div className="sales-cart">
      <div className="sales-cart-layout">
        
        {/* ================================================================ */}
        {/* LADO IZQUIERDO: Lista de productos disponibles                   */}
        {/* ================================================================ */}
        <div className="products-section">
          <h2>📦 Productos Disponibles</h2>
          
          {/* Barra de búsqueda */}
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Buscar producto..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
            {/* Botón X para limpiar búsqueda (solo si hay texto) */}
            {searchQuery && (
              <button 
                className="search-clear"
                onClick={() => setSearchQuery('')}
              >
                ✕
              </button>
            )}
          </div>

          {/* Lista de productos */}
          <div className="products-list">
            {filteredProducts.length === 0 ? (
              <p className="no-products">No hay productos disponibles</p>
            ) : (
              filteredProducts.map(product => (
                <div key={product.id} className="product-row">
                  {/* Info del producto */}
                  <div className="product-info">
                    <span className="product-name">{product.name}</span>
                    <span className="product-stock">{product.stock} disponibles</span>
                  </div>
                  {/* Precio */}
                  <span className="product-price">${product.price.toFixed(2)}</span>
                  {/* Botón agregar */}
                  <button
                    className="btn-add"
                    onClick={() => handleAddToCart(product)}
                  >
                    + Agregar
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* ================================================================ */}
        {/* LADO DERECHO: Carrito de venta                                   */}
        {/* ================================================================ */}
        <div className="cart-section">
          <h2>🛒 Carrito de Venta</h2>

          {/* Mensaje de feedback (éxito/error) */}
          {message && (
            <div className={`cart-message ${message.includes('exitosamente') ? 'success' : 'warning'}`}>
              {message}
            </div>
          )}

          {/* Items del carrito */}
          <div className="cart-items">
            {cartItems.length === 0 ? (
              <p className="empty-cart">El carrito está vacío</p>
            ) : (
              cartItems.map(item => (
                <div key={item.productId} className="cart-item">
                  {/* Info del item */}
                  <div className="cart-item-info">
                    <span className="cart-item-name">{item.name}</span>
                    <span className="cart-item-price">
                      ${item.price.toFixed(2)} x {item.quantity}
                    </span>
                  </div>
                  {/* Subtotal del item */}
                  <div className="cart-item-total">
                    ${(item.price * item.quantity).toFixed(2)}
                  </div>
                  {/* Botones de cantidad */}
                  <div className="cart-item-actions">
                    {/* Botón - (quitar uno) */}
                    <button
                      className="btn-quantity"
                      onClick={() => handleRemoveOne(item.productId)}
                    >
                      -
                    </button>
                    {/* Cantidad actual */}
                    <span className="quantity">{item.quantity}</span>
                    {/* Botón + (agregar uno) */}
                    <button
                      className="btn-quantity"
                      onClick={() => {
                        // Buscar el producto original para verificar stock
                        const product = products.find(p => p.id === item.productId);
                        if (product) handleAddToCart(product);
                      }}
                    >
                      +
                    </button>
                    {/* Botón eliminar */}
                    <button
                      className="btn-remove"
                      onClick={() => handleRemoveFromCart(item.productId)}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* ============================================================== */}
          {/* TOTALES                                                        */}
          {/* ============================================================== */}
          <div className="cart-totals">
            {/* Subtotal */}
            <div className="total-row">
              <span>Subtotal:</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {/* IVA */}
            <div className="total-row tax">
              <span>IVA ({taxRate}%):</span>
              <span>${taxAmount.toFixed(2)}</span>
            </div>
            {/* Total a pagar */}
            <div className="total-row grand-total">
              <span>TOTAL:</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          {/* ============================================================== */}
          {/* BOTONES DE ACCIÓN                                              */}
          {/* ============================================================== */}
          <div className="cart-actions">
            {/* Botón Limpiar */}
            <button
              className="btn-clear"
              onClick={handleClearCart}
              disabled={cartItems.length === 0}
            >
              Limpiar
            </button>
            {/* Botón Completar Venta */}
            <button
              className="btn-sell"
              onClick={handleCompleteSale}
              disabled={cartItems.length === 0}
            >
              💰 Completar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}