// ============================================================================
// ADDPRODUCTMODAL.JSX
// ============================================================================
// 
// ¿QUÉ ES ESTE ARCHIVO?
// ---------------------
// Este archivo crea una VENTANA EMERGENTE (modal) que aparece cuando el usuario
// quiere agregar un producto nuevo al inventario. Es como un formulario flotante
// que aparece encima de todo lo demás.
//
// ¿DÓNDE VA ESTE ARCHIVO?
// -----------------------
// src/components/productos/AddProductModal.jsx
//
// ¿QUIÉN USA ESTE COMPONENTE?
// ---------------------------
// App.jsx lo importa y lo usa así:
//   <AddProductModal
//     isOpen={isModalOpen}           <-- ¿Está abierto? true/false
//     onClose={() => setIsModalOpen(false)}  <-- Función para cerrarlo
//     onAddProduct={handleAddProduct}        <-- Función que recibe el producto nuevo
//   />
//
// ¿CÓMO FUNCIONA UN MODAL?
// ------------------------
// 1. Normalmente está OCULTO (isOpen = false)
// 2. Cuando el usuario da clic en "Nuevo Producto", isOpen cambia a true
// 3. El modal APARECE encima de todo con un fondo oscuro
// 4. El usuario llena el formulario y da clic en "Guardar"
// 5. Se ejecuta onAddProduct() con los datos del producto
// 6. El modal se CIERRA (isOpen vuelve a false)
//
// ============================================================================

// ----------------------------------------------------------------------------
// IMPORT: Traemos useState de React
// ----------------------------------------------------------------------------
// useState es un HOOK de React que nos permite guardar datos que pueden cambiar.
// En este caso guardamos:
//   - formData: lo que el usuario escribe en el formulario
//   - error: mensaje de error si algo está mal
// ----------------------------------------------------------------------------
import { useState } from 'react';

// ----------------------------------------------------------------------------
// COMPONENTE PRINCIPAL: AddProductModal
// ----------------------------------------------------------------------------
// 
// PARÁMETROS QUE RECIBE (props):
// 
// 1. isOpen (boolean)
//    - true = el modal se muestra en pantalla
//    - false = el modal está oculto
//    - Ejemplo: isOpen={true} hace que aparezca el modal
//
// 2. onClose (función)
//    - Es una función que viene del PADRE (App.jsx)
//    - Cuando la llamamos, el padre cambia isOpen a false y el modal se cierra
//    - Se ejecuta cuando: dan clic en X, dan clic en Cancelar, o clic afuera
//
// 3. onAddProduct (función)
//    - Es una función que viene del PADRE (App.jsx)
//    - Recibe UN PARÁMETRO: el objeto del producto nuevo
//    - Ejemplo: onAddProduct({ id: 123, name: "Coca Cola", price: 1.50, stock: 10 })
//    - El padre recibe este objeto y lo agrega a la lista de productos
//
// ----------------------------------------------------------------------------
export function AddProductModal({ isOpen, onClose, onAddProduct }) {
  
  // --------------------------------------------------------------------------
  // ESTADO 1: formData
  // --------------------------------------------------------------------------
  // 
  // ¿QUÉ ES ESTO?
  // Es un OBJETO que guarda todo lo que el usuario escribe en el formulario.
  // Tiene 4 propiedades, una por cada campo del formulario.
  //
  // ¿POR QUÉ USAMOS useState?
  // Porque queremos que React RE-RENDERICE (vuelva a dibujar) el componente
  // cada vez que el usuario escribe algo. Así el input muestra lo que escribió.
  //
  // ¿QUÉ ES setFormData?
  // Es la función para CAMBIAR el valor de formData.
  // NUNCA hacemos formData.name = "algo" directamente.
  // SIEMPRE usamos setFormData({ ...formData, name: "algo" })
  //
  // VALORES INICIALES:
  // - name: '' (string vacío - el usuario no ha escrito nada)
  // - price: '' (string vacío - aunque es precio, lo guardamos como texto)
  // - stock: '' (string vacío - lo convertimos a número al guardar)
  // - category: '' (string vacío - ninguna categoría seleccionada)
    //
    // --------------------------------------------------------------------------
  const [formData, setFormData] = useState({
    name: '',      // Nombre del producto, ej: "Coca Cola 600ml"
    price: '',     // Precio en texto, ej: "1.50" (se convierte a número después)
    stock: '',     // Cantidad en texto, ej: "100" (se convierte a número después)
    category: ''   // Categoría, ej: "Bebidas", "Snacks", etc.
  });

  // --------------------------------------------------------------------------
  // ESTADO 2: error
  // --------------------------------------------------------------------------
  //
  // ¿QUÉ ES ESTO?
  // Un string que guarda el mensaje de error a mostrar.
  // Si está vacío (''), no se muestra ningún error.
  //
  // ¿CUÁNDO SE USA?
  // Cuando el usuario intenta guardar pero:
  //   - No escribió el nombre → error = "El nombre es requerido"
  //   - El precio es 0 o negativo → error = "El precio debe ser mayor a 0"
  //   - El stock es negativo → error = "El stock no puede ser negativo"
  //
  // --------------------------------------------------------------------------
  const [error, setError] = useState('');

  // --------------------------------------------------------------------------
  // VERIFICACIÓN: ¿El modal debe mostrarse?
  // --------------------------------------------------------------------------
  //
  // Si isOpen es false, retornamos NULL.
  // NULL significa "no renderices nada".
  // Es como decir: "este componente no existe en este momento".
  //
  // ¿POR QUÉ HACEMOS ESTO?
  // Porque el modal solo debe aparecer cuando el usuario da clic en 
  // "Nuevo Producto". El resto del tiempo debe estar oculto.
  //
  // FLUJO:
  // 1. Usuario da clic en "Nuevo Producto" en InventoryList.jsx
  // 2. Eso ejecuta: setIsModalOpen(true) en App.jsx
  // 3. App.jsx pasa isOpen={true} a este componente
  // 4. Esta línea NO se ejecuta (porque isOpen es true)
  // 5. El modal se renderiza y aparece en pantalla
  //
  // FLUJO CONTRARIO:
  // 1. Usuario da clic en "Cancelar" o "X"
  // 2. Eso ejecuta: onClose() que es setIsModalOpen(false) en App.jsx
  // 3. App.jsx pasa isOpen={false} a este componente
  // 4. Esta línea SÍ se ejecuta y retorna null
  // 5. El modal desaparece
  //
  // --------------------------------------------------------------------------
  if (!isOpen) return null;

  // --------------------------------------------------------------------------
  // FUNCIÓN: handleChange
  // --------------------------------------------------------------------------
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cada vez que el usuario escribe UNA LETRA en cualquier input.
  // También cuando selecciona una opción del dropdown de categoría.
  //
  // ¿QUÉ RECIBE?
  // Un objeto "e" (evento) que tiene información sobre qué pasó.
  // - e.target = el elemento HTML donde ocurrió el evento (el input)
  // - e.target.name = el atributo "name" del input (ej: "name", "price")
  // - e.target.value = lo que el usuario escribió (ej: "Coca Cola")
  //
  // EJEMPLO REAL:
  // Si el usuario escribe "Coca" en el campo de nombre:
  // - e.target.name = "name"
  // - e.target.value = "Coca"
  // - Resultado: formData cambia de {name: ''} a {name: 'Coca'}
  //
  // ¿QUÉ ES ...prev?
  // Es el SPREAD OPERATOR. Copia todas las propiedades del objeto anterior.
  // Si no lo usamos, perderíamos los otros campos.
  //
  // EJEMPLO:
  // formData antes = { name: "Coca", price: "1.50", stock: "", category: "" }
  // Usuario escribe "100" en stock
  // Sin spread: setFormData({ stock: "100" }) 
  //   → formData = { stock: "100" } ← ¡PERDIMOS name y price!
  // Con spread: setFormData({ ...prev, stock: "100" })
  //   → formData = { name: "Coca", price: "1.50", stock: "100", category: "" } ✓
  //
  // ¿QUÉ ES [name]: value?
  // Es una PROPIEDAD COMPUTADA. El nombre de la propiedad viene de una variable.
  // Si name = "price", entonces [name]: value es lo mismo que price: value
  //
  // --------------------------------------------------------------------------
  const handleChange = (e) => {
    const { name, value } = e.target;  // Extraer name y value del input
    
    setFormData(prev => ({
      ...prev,        // Mantener todos los campos anteriores
      [name]: value   // Actualizar SOLO el campo que cambió
    }));
    
    setError('');     // Limpiar error cuando el usuario escribe
  };

  // --------------------------------------------------------------------------
  // FUNCIÓN: handleSubmit
  // --------------------------------------------------------------------------
  //
  // ¿CUÁNDO SE EJECUTA?
  // Cuando el usuario da clic en el botón "Guardar Producto".
  // El botón tiene type="submit", así que al dar clic se dispara el evento
  // "onSubmit" del formulario, que llama a esta función.
  //
  // ¿QUÉ HACE e.preventDefault()?
  // Por defecto, cuando un formulario se envía, la página se RECARGA.
  // Eso es comportamiento de HTML antiguo, no lo queremos.
  // preventDefault() CANCELA ese comportamiento.
  // Así la página no se recarga y nosotros controlamos qué pasa.
  //
  // --------------------------------------------------------------------------
  const handleSubmit = (e) => {
    e.preventDefault();  // IMPORTANTE: Evitar que la página se recargue

    // ------------------------------------------------------------------------
    // VALIDACIÓN 1: El nombre es obligatorio
    // ------------------------------------------------------------------------
    // .trim() quita espacios al inicio y final del texto.
    // Si después de quitar espacios queda vacío, es inválido.
    // 
    // EJEMPLO:
    // "   " → trim() → "" → !("") es true → HAY ERROR
    // "Coca Cola" → trim() → "Coca Cola" → !("Coca Cola") es false → OK
    // ------------------------------------------------------------------------
    if (!formData.name.trim()) {
      setError('El nombre es requerido');
      return;  // DETENER. No seguir ejecutando el resto de la función.
    }
    
    // ------------------------------------------------------------------------
    // VALIDACIÓN 2: El precio debe ser mayor a 0
    // ------------------------------------------------------------------------
    // parseFloat() convierte texto a número decimal.
    // "1.50" → parseFloat() → 1.5
    // "" → parseFloat() → NaN (Not a Number)
    //
    // Verificamos:
    // - Si está vacío (!formData.price)
    // - O si es 0 o negativo (parseFloat(formData.price) <= 0)
    // ------------------------------------------------------------------------
    if (!formData.price || parseFloat(formData.price) <= 0) {
      setError('El precio debe ser mayor a 0');
      return;
    }
    
    // ------------------------------------------------------------------------
    // VALIDACIÓN 3: El stock no puede ser negativo
    // ------------------------------------------------------------------------
    // parseInt() convierte texto a número entero.
    // "100" → parseInt() → 100
    // "10.5" → parseInt() → 10 (ignora decimales)
    //
    // El stock puede ser 0 (producto agotado), pero no -1 o -100.
    // ------------------------------------------------------------------------
    if (!formData.stock || parseInt(formData.stock) < 0) {
      setError('El stock no puede ser negativo');
      return;
    }

    // ------------------------------------------------------------------------
    // CREAR EL OBJETO DEL PRODUCTO NUEVO
    // ------------------------------------------------------------------------
    // 
    // Este objeto tiene la estructura que espera el resto de la aplicación.
    // 
    // PROPIEDADES:
    //
    // id: Date.now()
    //   - Date.now() retorna los milisegundos desde el 1 de enero de 1970
    //   - Es un número único que usamos como ID temporal
    //   - Ejemplo: 1673547823456
    //   - Cuando conectemos Supabase, la base de datos generará el ID real
    //
    // name: formData.name.trim()
    //   - El nombre que escribió el usuario, sin espacios extras
    //   - "  Coca Cola  " → "Coca Cola"
    //
    // price: parseFloat(formData.price)
    //   - El precio convertido de texto a número decimal
    //   - "1.50" → 1.5
    //   - Necesitamos número para hacer cálculos (subtotal, IVA, etc.)
    //
    // stock: parseInt(formData.stock)
    //   - La cantidad convertida de texto a número entero
    //   - "100" → 100
    //   - Necesitamos número para restar cuando se vende
    //
    // category: formData.category.trim() || 'General'
    //   - Si el usuario seleccionó una categoría, usar esa
    //   - Si no seleccionó nada (está vacío), usar "General" por defecto
    //   - El || es el operador OR: si lo de la izquierda es falsy (vacío),
    //     usa lo de la derecha
    //
    // ------------------------------------------------------------------------
    const newProduct = {
      id: Date.now(),
      name: formData.name.trim(),
      price: parseFloat(formData.price),
      stock: parseInt(formData.stock),
      category: formData.category.trim() || 'General'
    };

    // ------------------------------------------------------------------------
    // ENVIAR EL PRODUCTO AL PADRE (App.jsx)
    // ------------------------------------------------------------------------
    // Llamamos la función onAddProduct que nos pasó App.jsx como prop.
    // Le pasamos el objeto newProduct que acabamos de crear.
    //
    // ¿QUÉ PASA EN App.jsx?
    // La función handleAddProduct recibe el producto y:
    // 1. Lo agrega a la lista de productos (controller.addProduct)
    // 2. Actualiza la vista para mostrar el producto nuevo
    // ------------------------------------------------------------------------
    onAddProduct(newProduct);

    // ------------------------------------------------------------------------
    // LIMPIAR EL FORMULARIO
    // ------------------------------------------------------------------------
    // Reseteamos todos los campos a vacío para que el próximo producto
    // que agreguen empiece con el formulario limpio.
    // ------------------------------------------------------------------------
    setFormData({ name: '', price: '', stock: '', category: '' });
    setError('');
    
    // ------------------------------------------------------------------------
    // CERRAR EL MODAL
    // ------------------------------------------------------------------------
    // Llamamos onClose() que en App.jsx ejecuta setIsModalOpen(false)
    // Eso hace que isOpen sea false, y arriba donde dice:
    // if (!isOpen) return null;
    // Se ejecuta y el modal desaparece.
    // ------------------------------------------------------------------------
    onClose();
  };

  // --------------------------------------------------------------------------
  // FUNCIÓN: handleOverlayClick
  // --------------------------------------------------------------------------
  //
  // ¿QUÉ ES EL OVERLAY?
  // Es el fondo oscuro semi-transparente que aparece detrás del modal.
  // Cubre toda la pantalla para que el usuario se enfoque en el modal.
  //
  // ¿QUÉ HACE ESTA FUNCIÓN?
  // Cuando el usuario da clic EN EL FONDO OSCURO (no en el modal), 
  // cierra el modal. Es un atajo para cerrar sin dar clic en X o Cancelar.
  //
  // ¿POR QUÉ VERIFICAMOS e.target.className?
  // Porque el fondo oscuro (overlay) CONTIENE al modal (content).
  // Si damos clic en el modal, técnicamente también estamos dando clic
  // en el overlay (porque el modal está dentro del overlay).
  //
  // Queremos cerrar SOLO si el clic fue directamente en el fondo oscuro,
  // NO si fue en el contenido del modal.
  //
  // EJEMPLO:
  // - Clic en el fondo oscuro → e.target.className = "modal-overlay" → CERRAR
  // - Clic en el input de nombre → e.target.className = "" → NO CERRAR
  // - Clic en el botón Guardar → e.target.className = "btn-save" → NO CERRAR
  //
  // --------------------------------------------------------------------------
  const handleOverlayClick = (e) => {
    if (e.target.className === 'modal-overlay') {
      onClose();
    }
  };

  // --------------------------------------------------------------------------
  // RENDER: Lo que se muestra en pantalla
  // --------------------------------------------------------------------------
  //
  // ESTRUCTURA HTML:
  //
  // <div class="modal-overlay">          ← Fondo oscuro (cubre toda la pantalla)
  //   <div class="modal-content">        ← Caja blanca del modal
  //     <div class="modal-header">       ← Título y botón X
  //     <form>                           ← Formulario con los campos
  //       <input name>                   ← Campo: Nombre del producto
  //       <input price>                  ← Campo: Precio
  //       <input stock>                  ← Campo: Stock/Cantidad
  //       <select category>              ← Dropdown: Categoría
  //       <button Cancelar>              ← Botón para cerrar sin guardar
  //       <button Guardar>               ← Botón para guardar el producto
  //     </form>
  //   </div>
  // </div>
  //
  // --------------------------------------------------------------------------
  return (
    // OVERLAY: Fondo oscuro que cubre toda la pantalla
    // onClick={handleOverlayClick} → Si dan clic aquí, verificar si cerrar
    <div className="modal-overlay" onClick={handleOverlayClick}>
      
      {/* CONTENT: Caja blanca centrada donde está el formulario */}
      <div className="modal-content">
        
        {/* HEADER: Título del modal y botón para cerrar */}
        <div className="modal-header">
          <h2>Agregar Producto</h2>
          {/* Botón X para cerrar el modal */}
          <button className="modal-close" onClick={onClose}>
            X
          </button>
        </div>

        {/* FORMULARIO: Donde el usuario escribe los datos del producto */}
        {/* onSubmit={handleSubmit} → Cuando envíen el form, ejecutar handleSubmit */}
        <form onSubmit={handleSubmit} className="modal-form">
          
          {/* MENSAJE DE ERROR: Solo aparece si hay un error */}
          {/* Si error es "" (vacío), esto no se muestra */}
          {/* Si error es "El nombre es requerido", aparece un div rojo con ese texto */}
          {error && <div className="form-error">{error}</div>}

          {/* CAMPO: Nombre del producto */}
          <div className="form-group">
            <label htmlFor="name">Nombre del producto *</label>
            <input
              type="text"           // Tipo texto, acepta cualquier caracter
              id="name"             // ID para conectar con el label (accesibilidad)
              name="name"           // IMPORTANTE: debe coincidir con formData.name
              value={formData.name} // El valor viene del estado (controlled input)
              onChange={handleChange} // Cada tecla ejecuta handleChange
              placeholder="Ej: Coca Cola 600ml"  // Texto de ayuda en gris
            />
          </div>

          {/* FILA CON DOS CAMPOS: Precio y Stock lado a lado */}
          <div className="form-row">
            
            {/* CAMPO: Precio */}
            <div className="form-group">
              <label htmlFor="price">Precio ($) *</label>
              <input
                type="number"          // Solo acepta números
                id="price"
                name="price"           // IMPORTANTE: debe coincidir con formData.price
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                min="0"                // No permite números negativos
                step="0.01"            // Permite decimales de 2 dígitos (centavos)
              />
            </div>

            {/* CAMPO: Stock (cantidad en inventario) */}
            <div className="form-group">
              <label htmlFor="stock">Stock *</label>
              <input
                type="number"
                id="stock"
                name="stock"           // IMPORTANTE: debe coincidir con formData.stock
                value={formData.stock}
                onChange={handleChange}
                placeholder="0"
                min="0"                // No permite números negativos
              />
            </div>
          </div>

          {/* CAMPO: Categoría (dropdown/lista desplegable) */}
          <div className="form-group">
            <label htmlFor="category">Categoría</label>
            <select
              id="category"
              name="category"          // IMPORTANTE: debe coincidir con formData.category
              value={formData.category}
              onChange={handleChange}  // Cuando seleccionen una opción, actualizar estado
            >
              {/* Opción por defecto - valor vacío */}
              <option value="">-- Seleccionar --</option>
              {/* Opciones disponibles */}
              <option value="Bebidas">Bebidas</option>
              <option value="Snacks">Snacks</option>
              <option value="Lacteos">Lácteos</option>
              <option value="Limpieza">Limpieza</option>
              <option value="Otros">Otros</option>
            </select>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="modal-actions">
            {/* 
              BOTÓN CANCELAR
              - type="button" → NO envía el formulario, solo ejecuta onClick
              - onClick={onClose} → Cierra el modal sin guardar nada
            */}
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>

            {/* 
              BOTÓN GUARDAR
              - type="submit" → Envía el formulario, dispara onSubmit del form
              - No necesita onClick porque el form tiene onSubmit={handleSubmit}
            */}
            <button type="submit" className="btn-save">
              Guardar Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}