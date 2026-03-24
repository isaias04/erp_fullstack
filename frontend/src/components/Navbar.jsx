// ============================================================================
// NAVBAR.JSX - Barra de navegación con permisos por rol
// ============================================================================
// UBICACIÓN: src/components/Navbar.jsx
// ============================================================================
//
// ╔═══════════════════════════════════════════════════════════════════════════╗
// ║ CAMBIOS REALIZADOS EN ESTE ARCHIVO                                        ║
// ╠═══════════════════════════════════════════════════════════════════════════╣
// ║                                                                           ║
// ║ CAMBIO 1 (línea 44): Props que recibe la función                          ║
// ║   ANTES:  { currentView, onViewChange }                                   ║
// ║   DESPUÉS: { currentView, onViewChange, user, onLogout }                  ║
// ║   ¿POR QUÉ?: Necesitamos "user" para saber el rol y filtrar botones,     ║
// ║              y "onLogout" para cerrar sesión.                             ║
// ║                                                                           ║
// ║ CAMBIO 2 (línea 53): Renombrar array de vistas                            ║
// ║   ANTES:  const views = [...]                                             ║
// ║   DESPUÉS: const allViews = [...]                                         ║
// ║   ¿POR QUÉ?: Ahora "allViews" es el array completo, y "views" será       ║
// ║              el array filtrado según el rol.                              ║
// ║                                                                           ║
// ║ CAMBIO 3 (líneas 66-90): Agregar función getViewsByRole                   ║
// ║   ANTES:  No existía                                                      ║
// ║   DESPUÉS: Función que filtra vistas según el rol                         ║
// ║   ¿POR QUÉ?: Sin esto, todos los usuarios ven todos los botones.         ║
// ║              Con esto, cada rol ve solo lo que le corresponde.            ║
// ║                                                                           ║
// ║ CAMBIO 4 (líneas 117-123): Agregar sección de usuario                     ║
// ║   ANTES:  No existía                                                      ║
// ║   DESPUÉS: div con nombre de usuario y botón "Salir"                      ║
// ║   ¿POR QUÉ?: Para mostrar quién está logueado y permitir cerrar sesión.  ║
// ║                                                                           ║
// ╚═══════════════════════════════════════════════════════════════════════════╝
//
// ============================================================================

// ============================================================================
// CAMBIO 1: PROPS QUE RECIBE
// ============================================================================
// ANTES:  export function Navbar({ currentView, onViewChange }) {
// DESPUÉS: Agregamos "user" y "onLogout"
//
// - user: objeto con datos del usuario { id, username, role, name }
//         Lo necesitamos para saber el ROL y filtrar qué botones mostrar
//
// - onLogout: función que se ejecuta al dar clic en "Salir"
//             En App.jsx hace setUser(null) que regresa al Login
// ============================================================================
export function Navbar({ currentView, onViewChange, user, onLogout }) {

  // ==========================================================================
  // CAMBIO 2: RENOMBRAR ARRAY DE VISTAS
  // ==========================================================================
  // ANTES:  const views = [...]
  // DESPUÉS: const allViews = [...]
  //
  // ¿POR QUÉ RENOMBRAMOS?
  // Antes "views" era el array final que se usaba directamente.
  // Ahora "allViews" contiene TODAS las vistas posibles, y más abajo
  // creamos "views" con solo las vistas que el usuario puede ver.
  // ==========================================================================
  const allViews = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'inventory', label: 'Inventario', icon: '📦' },
    { id: 'sales', label: 'Ventas', icon: '🛒' },
    { id: 'history', label: 'Historial', icon: '📋' },
  ];

  // ==========================================================================
  // CAMBIO 3: FUNCIÓN PARA FILTRAR VISTAS POR ROL (NUEVO - NO EXISTÍA ANTES)
  // ==========================================================================
  //
  // ¿QUÉ HACE ESTA FUNCIÓN?
  // Recibe el rol del usuario y retorna SOLO las vistas que puede ver.
  //
  // ¿CÓMO FUNCIONA .filter()?
  // Crea un nuevo array solo con los elementos que cumplen la condición.
  // Ejemplo: [1,2,3,4,5].filter(n => n > 3) retorna [4,5]
  //
  // PERMISOS POR ROL:
  // - owner (Administrador): Ve TODO - puede administrar todo el sistema
  // - warehouse (Jefe Almacén): Solo INVENTARIO - su trabajo es el almacén
  // - seller (Vendedor): Solo VENTAS e HISTORIAL - vende y ve sus ventas
  //
  // ==========================================================================
  const getViewsByRole = (role) => {
    switch (role) {
      
      case 'owner':
        // El owner ve TODO - retornamos el array completo sin filtrar
        return allViews;
      
      case 'warehouse':
        // Jefe de almacén SOLO ve inventario
        // .filter() busca elementos donde id === 'inventory'
        // Resultado: [{ id: 'inventory', label: 'Inventario', icon: '📦' }]
        return allViews.filter(v => v.id === 'inventory');
      
      case 'seller':
        // Vendedor ve ventas E historial
        // .filter() busca elementos donde id es 'sales' O 'history'
        // Resultado: [{ id: 'sales', ... }, { id: 'history', ... }]
        return allViews.filter(v => v.id === 'sales' || v.id === 'history');
      
      default:
        // Si el rol no coincide con ninguno, no mostrar nada (seguridad)
        return [];
    }
  };

  // ==========================================================================
  // OBTENER VISTAS FILTRADAS PARA ESTE USUARIO
  // ==========================================================================
  //
  // user?.role significa:
  // - Si user existe → obtener user.role
  // - Si user es null/undefined → retornar undefined (no da error)
  //
  // Ejemplo:
  // - user = { role: 'seller' } → getViewsByRole('seller') → [ventas, historial]
  // - user = { role: 'owner' } → getViewsByRole('owner') → [todas las vistas]
  //
  // ==========================================================================
  const views = getViewsByRole(user?.role);

  // ==========================================================================
  // RENDER - Lo que se muestra en pantalla
  // ==========================================================================
  return (
    <nav className="navbar">
      {/* Logo del sistema */}
      <div className="navbar-brand">
        <h1>🏪 Sistema ERP</h1>
      </div>
      
      {/* Menú de navegación - SOLO muestra los botones filtrados por rol */}
      <div className="navbar-menu">
        {views.map(view => (
          <button
            key={view.id}
            className={`nav-item ${currentView === view.id ? 'active' : ''}`}
            onClick={() => onViewChange(view.id)}
          >
            <span className="nav-icon">{view.icon}</span>
            <span className="nav-label">{view.label}</span>
          </button>
        ))}
      </div>

      {/* ================================================================== */}
      {/* CAMBIO 4: SECCIÓN DE USUARIO (NUEVO - NO EXISTÍA ANTES)            */}
      {/* ================================================================== */}
      {/*                                                                    */}
      {/* ¿QUÉ AGREGAMOS?                                                    */}
      {/* - Un div que muestra el nombre del usuario logueado                */}
      {/* - Un botón "Salir" para cerrar sesión                              */}
      {/*                                                                    */}
      {/* ¿QUÉ ES user?.name?                                                */}
      {/* El ?. es "optional chaining". Si user es null, no da error.        */}
      {/* Si user existe, muestra user.name (ej: "Administrador")            */}
      {/*                                                                    */}
      {/* ¿QUÉ HACE onClick={onLogout}?                                      */}
      {/* Cuando dan clic en "Salir", ejecuta la función onLogout que        */}
      {/* viene de App.jsx. Esa función hace setUser(null) y el usuario      */}
      {/* regresa a la pantalla de Login.                                    */}
      {/*                                                                    */}
      {/* ================================================================== */}
      <div className="navbar-user">
        <span className="user-name">👤 {user?.name}</span>
        <button className="btn-logout" onClick={onLogout}>
          Salir
        </button>
      </div>
    </nav>
  );
}