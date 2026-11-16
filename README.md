# 🩺 Shop & Care — Aplicación Web Oficial (SPA Full-Stack)

Plataforma web de comercio electrónico y comunidad para **Shop & Care**, tienda peruana especializada en uniformes médicos (scrubs antifluido con tecnología 4-way stretch), accesorios e instrumental quirúrgico básico para estudiantes de ciencias de la salud, internado y SERUMS en Perú.

Construida con la **identidad visual, maquetación y especificaciones generadas en Google Stitch** (Proyecto ID: `17696986628278540354`).

---

## 🎨 1. Identidad Visual y Colores Oficiales

* **Blanco Puro (`#FFFFFF`)**: Fondo base limpio y tarjetas de producto.
* **Deep Navy Blue (`#0D3365`)**: Titulares principales, textos de alto contraste, sección "Voces" y footer institucional.
* **Light Sky Blue (`#9CCBEF`)**: Pestañas activas, botones de acción principal (con texto `#0D3365` en negrita) y acentos clínicos.
* **Soft Heart Pink (`#EFAEBF`)**: Insignias promocionales de `-15% DTO`, estrellas de calificación y acentos cálidos.
* **Porcelana Quirúrgica (`#F4F8FC`)** y **Bordes Suaves (`#EBF3FA`)**.
* **Tipografía Oficial**: *Plus Jakarta Sans* (títulos y etiquetas) + *Inter* (cuerpo y especificaciones técnicas).

---

## 🚀 2. Arquitectura del Proyecto

```text
Shop&Care/
├── .agents/                    # Habilidades y agentes de diseño Stitch
├── dist/                       # Build de producción compilado (HTML, CSS, JS)
├── public/                     # Assets estáticos
│   ├── Logo.jpeg               # Logotipo oficial de marca
│   └── estudiantes-medicina-peru.jpg # Fotografía médica de cabecera Stitch
├── server/                     # Backend ligero para producción
│   ├── data/
│   │   └── shop_care.db        # Base de datos SQLite persistente (autogenerada)
│   ├── db.js                   # Inicialización automática de esquema y seed de 16 productos
│   └── index.js                # API REST con Express, rate limiting y panel Admin
├── src/
│   ├── components/             # Navbar fijo, CartDrawer, Footer, Modales de talla y stock
│   ├── context/                # AppContext (sincronización URL Hash, Carrito de compras, UTMs)
│   ├── data/
│   │   └── catalogo.json       # 16 productos reales preconfigurados con precios y detalles
│   ├── types/                  # Tipado estricto en TypeScript
│   ├── views/                  # Vistas de las 4 pestañas + Panel Admin
│   │   ├── TabInicio.tsx       # #inicio (Hero 2 columnas, beneficios operativos, categorías, testimonios)
│   │   ├── TabCatalogo.tsx     # #catalogo (Filtros, buscador, grid de 16 productos con adición al carrito)
│   │   ├── ProductDetailView.tsx # Sub-vista de detalle 50/50, selector de tallas/colores, carrito y WhatsApp
│   │   ├── TabKit.tsx          # #kit (Configurador interactivo 2 columnas con descuento y adición al carrito)
│   │   ├── TabGuia.tsx         # #guia (Comunidad y Contacto: asesoría personalizada, reseñas interactivas, FAQ)
│   │   └── AdminView.tsx       # #admin (Panel protegido, edición de precios en vivo, stock, leads y CSV)
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── .env                        # Variables de entorno locales
├── .env.example                # Plantilla de variables para tu servidor
├── package.json
├── tailwind.config.js
└── vite.config.ts
```

---

## 💻 3. Requisitos Previos

* **Node.js**: v18.0.0 o superior (verificado en Node.js v24).
* **npm**: v9.0.0 o superior.

---

## 🛠️ 4. Puesta en Marcha en Local (Desarrollo)

1. **Instalar dependencias**:
   ```bash
   npm install
   ```

2. **Configurar variables de entorno**:
   Copia el archivo `.env.example` a `.env` si aún no existe y edita los valores:
   ```bash
   PORT=3000
   VITE_WHATSAPP_NUMBER=51999999999
   ADMIN_PASSWORD=shopcare2026
   ```

3. **Iniciar frontend y backend en paralelo**:
   ```bash
   npm run dev
   ```
   * **Frontend (Vite)**: `http://localhost:5173`
   * **Backend API (Express + SQLite)**: `http://localhost:3000`

---

## 🚢 5. Despliegue en Servidor de Producción (VPS / Node.js)

En tu servidor VPS (Ubuntu, Debian, CentOS, etc.) o hosting Node.js:

1. **Clonar o subir el proyecto**.
2. **Instalar dependencias**:
   ```bash
   npm install --omit=dev
   ```
   *(o `npm install` si vas a compilar directamente en el servidor)*.

3. **Compilar el frontend para producción**:
   ```bash
   npm run build
   ```
   *(Esto generará la carpeta optimizada `/dist`)*.

4. **Iniciar en modo producción unificado**:
   ```bash
   npm start
   ```
   *Express servirá la aplicación completa en el puerto configurado (`PORT=3000`) y manejará todas las rutas estáticas y endpoints `/api/...` en un único proceso.*

5. **(Opcional pero recomendado) Mantener en segundo plano con PM2**:
   ```bash
   npm install -g pm2
   pm2 start server/index.js --name "shop-care"
   pm2 save
   pm2 startup
   ```

---

## 🔗 6. Compatibilidad con Google Ads y Enlaces Directos

La aplicación está diseñada como una **Single Page Application (SPA)** pero sincroniza el hash y los parámetros de búsqueda de la URL. Puedes crear tus anuncios de Google Ads apuntando directamente a:

* **Página principal**: `https://tudominio.pe/#inicio`
* **Catálogo general**: `https://tudominio.pe/#catalogo`
* **Categoría específica**: `https://tudominio.pe/#catalogo?categoria=Scrubs+Mujer`
* **Filtro de instrumental**: `https://tudominio.pe/#catalogo?categoria=Instrumental`
* **Ficha directa de un producto**: `https://tudominio.pe/#catalogo?producto=scrubs-oriana-mujer`
* **Configurador de Kit**: `https://tudominio.pe/#kit`
* **Comunidad, Asesoría y Reseñas**: `https://tudominio.pe/#guia`
* **Tracking de campañas (UTMs)**:
  `https://tudominio.pe/#guia?utm_source=google&utm_campaign=internado2026&utm_term=scrubs+medicos`
  *(Los parámetros UTM se capturan y se guardan automáticamente en la base de datos junto con el lead).*

---

## 🔐 7. Panel Administrativo (`#admin`)

Para acceder al panel de administración:
1. Navega a `https://tudominio.pe/#admin` (o haz clic en "Panel Admin" en el pie de página).
2. Ingresa la contraseña configurada en `ADMIN_PASSWORD` (por defecto: `shopcare2026`).
3. Desde el panel podrás:
   * **Ver métricas en tiempo real**: Total de leads, cotizaciones de kit, reseñas y stock.
   * **Edición de Precios en Caliente**: Modificar `precio_normal` y `precio_dto` con guardado instantáneo en base de datos.
   * **Exportar Leads a CSV**: Descarga instantánea con todas las columnas de captura y UTMs de Google Ads (`GET /api/admin/leads/csv`).
   * **Control de Stock en Tiempo Real**: Botón para cambiar cualquier producto entre *Disponible* y *Agotado*.
   * **Moderación de Reseñas**: Aprobar o eliminar reseñas de clientes antes de que aparezcan en el catálogo público.
   * **Atención de Consultas y Reclamos**: Gestionar y marcar mensajes como atendidos.

---

## 📦 8. Resumen de Endpoints REST

| Método | Ruta | Descripción | Acceso |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/leads` | Captura de lead con validación de privacidad y UTMs | Público (Rate-limit 15/15m) |
| `GET` | `/api/productos` | Catálogo de 16 productos con reseñas aprobadas | Público |
| `GET` | `/api/resenas` | Listado público de reseñas aprobadas | Público |
| `POST` | `/api/alertas-stock` | Notificación para productos agotados | Público (Rate-limit 15/15m) |
| `POST` | `/api/cotizaciones` | Registro de kit previo a WhatsApp (genera código `SC-XXXX`) | Público (Rate-limit 15/15m) |
| `POST` | `/api/resenas` | Envío interactivo de reseña | Público (Rate-limit 15/15m) |
| `POST` | `/api/feedback` | Mensajes de soporte, sugerencia o reclamo | Público (Rate-limit 15/15m) |
| `POST` | `/api/admin/auth` | Validación de contraseña administrativa | Público |
| `GET` | `/api/admin/stats` | Métricas y estadísticas del panel | Admin (`Authorization: Bearer`) |
| `GET` | `/api/admin/leads/csv` | Descarga de leads en archivo CSV para Excel | Admin (`Authorization: Bearer`) |
| `PATCH` | `/api/admin/productos/:id/precio` | Modificar precios normal y con descuento | Admin (`Authorization: Bearer`) |
| `PATCH` | `/api/admin/productos/:id/stock` | Cambiar disponibilidad de stock en vivo | Admin (`Authorization: Bearer`) |
| `PATCH` | `/api/admin/resenas/:id` | Aprobar o rechazar reseña | Admin (`Authorization: Bearer`) |
| `DELETE` | `/api/admin/resenas/:id` | Eliminar reseña | Admin (`Authorization: Bearer`) |
| `PATCH` | `/api/admin/feedback/:id` | Marcar mensaje como atendido | Admin (`Authorization: Bearer`) |
