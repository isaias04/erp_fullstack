## Flujo de Datos

A continuación se describe el proceso de comunicación entre las capas de la aplicación, utilizando como ejemplo la consulta de productos por parte del usuario.

### 1. Frontend (React)
La aplicación inicia la solicitud desde `app.jsx` ejecutando la función de servicio:
javascript
const productos = await api.getProducts();
2. Capa de Servicio (api.js)Se realiza la petición HTTP al servidor backend:JavaScriptfetch('http://localhost:3001/api/products')
3. Servidor (Node.js - productRoutes.js)El backend recibe la solicitud en el endpoint definido:Endpoint: GET /api/products4. Controlador (Node.js - productController.js)Se ejecuta la lógica de negocio y la consulta a la base de datos:JavaScriptconst { data } = await supabase.from('products').select('*')
5. Base de Datos (Supabase)Supabase procesa la consulta y retorna los registros correspondientes al servidor.6. Respuesta del ServidorNode.js envía los datos recibidos de la base de datos de vuelta al cliente React en formato JSON.7. Interfaz de UsuarioReact recibe la respuesta, actualiza el estado local y renderiza los productos en pantalla.Resumen de ComponentesCapaTecnologíaFrontendReactAPI ClientFetchBackendNode.js / ExpressDatabaseSupabase (PostgreSQL)