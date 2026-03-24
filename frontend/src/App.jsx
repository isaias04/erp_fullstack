// ============================================================================
//
//   🏠 ARCHIVO: App.jsx - MODIFICADO PARA USAR API
//
// ============================================================================
//
//   UBICACIÓN: frontend/src/App.jsx
//
//   ¿QUÉ CAMBIÓ?
//
//   ELIMINADO:
//   - import { SalesController }
//   - import { initialProducts, initialSales } from './data/MockData'
//   - const [controller] = useState(...)
//   - Todas las llamadas a controller.xxx()
//
//   AGREGADO:
//   - import { api } from './services/api'
//   - Estados: products, sales, loading
//   - useEffect para cargar datos al iniciar
//   - Funciones async que llaman a la API
//
// ============================================================================


import { useState, useEffect } from "react";
import { api } from './services/api';

import { Login } from "./components/Login";
import { Navbar } from "./components/Navbar";
import { Dashboard } from "./components/Dashboard";
import { InventoryList } from "./components/productos/InventoryList";
import { AddProductModal } from "./components/productos/AddProductModal";
import { SalesCart } from "./components/SalesCart";
import { CashRegister } from "./components/CashRegister";

import "./App.css";


function App() {
  // =========================================================================
  // ESTADOS
  // =========================================================================

  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('dashboard');

  // ESTADOS NUEVOS (reemplazan al controller)
  const [products, setProducts] = useState([]);
  const [sales, setSales] = useState([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalTax: 0,
    transactionCount: 0
  });

  const [loading, setLoading] = useState(true);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taxRate] = useState(13);


  // =========================================================================
  // CARGAR DATOS AL INICIAR
  // =========================================================================

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);


  const loadData = async () => {
    setLoading(true);
    try {
      const [productsRes, salesRes, statsRes] = await Promise.all([
        api.products.getAll(),
        api.sales.getAll(),
        api.sales.getStats()
      ]);

      if (productsRes.success) {
        setProducts(productsRes.products);
        setFilteredProducts(productsRes.products);
      }

      if (salesRes.success) {
        setSales(salesRes.sales);
      }

      if (statsRes.success) {
        setStats(statsRes.stats);
      }

    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };


  // =========================================================================
  // HANDLERS DE AUTENTICACIÓN
  // =========================================================================

  const handleLogin = (userData) => {
    setUser(userData);
    
    if (userData.role === 'warehouse') {
      setCurrentView('inventory');
    } else if (userData.role === 'seller') {
      setCurrentView('sales');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView('dashboard');
    setProducts([]);
    setSales([]);
    setStats({ totalSales: 0, totalTax: 0, transactionCount: 0 });
  };

  const handleViewChange = (view) => {
    setCurrentView(view);
    if (view === 'inventory') {
      setFilteredProducts(products);
    }
  };


  // =========================================================================
  // HANDLERS DE PRODUCTOS
  // =========================================================================

  const handleSearch = async (query) => {
    if (!query.trim()) {
      setFilteredProducts(products);
      return;
    }

    try {
      const response = await api.products.search(query);
      if (response.success) {
        setFilteredProducts(response.products);
      }
    } catch (error) {
      console.error('Error en búsqueda:', error);
      const filtered = products.filter(p =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  };

  const handleAddProduct = async (newProduct) => {
    try {
      const response = await api.products.create(newProduct);
      
      if (response.success) {
        // Recargar productos
        const productsRes = await api.products.getAll();
        if (productsRes.success) {
          setProducts(productsRes.products);
          setFilteredProducts(productsRes.products);
        }
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error al crear producto:', error);
      alert('Error al crear el producto');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await api.products.delete(productId);
      
      if (response.success) {
        // Recargar productos
        const productsRes = await api.products.getAll();
        if (productsRes.success) {
          setProducts(productsRes.products);
          setFilteredProducts(productsRes.products);
        }
      }
    } catch (error) {
      console.error('Error al eliminar producto:', error);
      alert('Error al eliminar el producto');
    }
  };


  // =========================================================================
  // HANDLERS DE VENTAS
  // =========================================================================

  const handleCompleteSale = async (saleData) => {
    try {
      const response = await api.sales.create({
        items: saleData.items,
        subtotal: saleData.subtotal,
        taxRate: saleData.taxRate,
        taxAmount: saleData.taxAmount,
        total: saleData.total,
        userId: user?.id
      });
      
      if (response.success) {
        // Recargar todo (productos para actualizar stock, ventas y stats)
        await loadData();
      }
    } catch (error) {
      console.error('Error al registrar venta:', error);
      alert('Error al registrar la venta');
    }
  };


  // =========================================================================
  // VERIFICACIÓN DE LOGIN
  // =========================================================================

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }


  // =========================================================================
  // RENDER DE VISTAS
  // =========================================================================

  const renderView = () => {
    if (loading) {
      return (
        <div className="loading-container">
          <p>Cargando datos...</p>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            totalSales={stats.totalSales}
            transactionCount={stats.transactionCount}
            products={products}
          />
        );
        
      case 'inventory':
        return (
          <InventoryList
            products={filteredProducts}
            onSearch={handleSearch}
            onAddProduct={() => setIsModalOpen(true)}
            onDeleteProduct={handleDeleteProduct}
          />
        );
        
      case 'sales':
        return (
          <SalesCart
            products={products}
            onCompleteSale={handleCompleteSale}
            taxRate={taxRate}
          />
        );
        
      case 'history':
        return <CashRegister sales={sales} />;
        
      default:
        return null;
    }
  };


  // =========================================================================
  // RENDER PRINCIPAL
  // =========================================================================

  return (
    <div className="app">
      <Navbar
        currentView={currentView}
        onViewChange={handleViewChange}
        user={user}
        onLogout={handleLogout}
      />
      
      <main className="app-content">
        {renderView()}
      </main>
      
      <AddProductModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAddProduct={handleAddProduct}
      />
    </div>
  );
}

export default App;