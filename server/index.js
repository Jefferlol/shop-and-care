import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import rateLimit from 'express-rate-limit';
import { db, initDatabase } from './db.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'shopcare2026';

// Middlewares
app.use(cors());
app.use(express.json());

// Rate Limiter para endpoints públicos POST (15 peticiones por IP cada 15 min)
const publicPostLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: 'Has alcanzado el límite de solicitudes. Por favor intenta de nuevo en unos minutos.'
  }
});

// Middleware de autenticación para panel Admin
function requireAdminAuth(req, res, next) {
  const authHeader = req.headers['authorization'];
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7);
  } else if (req.headers['x-admin-password']) {
    token = req.headers['x-admin-password'];
  }

  if (!token || token !== ADMIN_PASSWORD) {
    return res.status(401).json({ success: false, error: 'Acceso no autorizado. Contraseña incorrecta.' });
  }
  next();
}

// -----------------------------------------------------------------------------
// ENDPOINTS PÚBLICOS
// -----------------------------------------------------------------------------

// 1. POST /api/leads - Captura de Lead Magnet
app.post('/api/leads', publicPostLimiter, (req, res) => {
  try {
    const { nombre, correo, whatsapp, carrera, acepto_privacidad, utm_source, utm_campaign, utm_term } = req.body;

    if (!nombre || !correo || !whatsapp || !carrera) {
      return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios.' });
    }

    if (!acepto_privacidad) {
      return res.status(400).json({ success: false, error: 'Debes aceptar la política de privacidad de datos.' });
    }

    const emailNorm = correo.trim().toLowerCase();

    // Comprobar si el correo ya existe
    const existing = db.get('SELECT id FROM leads WHERE correo = ?', [emailNorm]);

    if (existing) {
      db.run(
        `UPDATE leads SET nombre = ?, whatsapp = ?, carrera = ?, acepto_privacidad = 1, utm_source = COALESCE(?, utm_source), utm_campaign = COALESCE(?, utm_campaign), utm_term = COALESCE(?, utm_term) WHERE correo = ?`,
        [nombre.trim(), whatsapp.trim(), carrera.trim(), utm_source || null, utm_campaign || null, utm_term || null, emailNorm]
      );
    } else {
      db.run(
        `INSERT INTO leads (nombre, correo, whatsapp, carrera, acepto_privacidad, cupon, utm_source, utm_campaign, utm_term)
         VALUES (?, ?, ?, ?, ?, 'TURNO15', ?, ?, ?)`,
        [nombre.trim(), emailNorm, whatsapp.trim(), carrera.trim(), 1, utm_source || null, utm_campaign || null, utm_term || null]
      );
    }

    return res.json({
      success: true,
      cupon: 'TURNO15',
      message: '¡Registro exitoso! Tus datos han sido registrados para asesoría personalizada y promociones exclusivas con el código TURNO15.'
    });
  } catch (error) {
    console.error('Error en /api/leads:', error);
    return res.status(500).json({ success: false, error: 'Error al registrar tus datos.' });
  }
});

// 2. GET /api/productos - Catálogo completo con reseñas aprobadas
app.get('/api/productos', (req, res) => {
  try {
    const productos = db.all('SELECT * FROM productos ORDER BY id ASC');
    const resenasAprobadas = db.all('SELECT * FROM resenas WHERE aprobado = 1 ORDER BY id DESC');

    const productosConResenas = productos.map(p => {
      const pResenas = resenasAprobadas.filter(r => r.producto_slug === p.slug);
      return {
        ...p,
        imagen: p.imagen || `/productos/${p.slug}.jpg`,
        tallas: p.tallas_json ? JSON.parse(p.tallas_json) : [],
        colores: p.colores_json ? JSON.parse(p.colores_json) : [],
        detalles: p.detalles_json ? JSON.parse(p.detalles_json) : [],
        resenas: pResenas
      };
    });

    return res.json({ success: true, productos: productosConResenas });
  } catch (error) {
    console.error('Error en /api/productos:', error);
    return res.status(500).json({ success: false, error: 'Error al obtener productos.' });
  }
});

// 3. POST /api/alertas-stock - Notificación para productos agotados
app.post('/api/alertas-stock', publicPostLimiter, (req, res) => {
  try {
    const { producto_slug, talla, contacto } = req.body;
    if (!producto_slug || !contacto) {
      return res.status(400).json({ success: false, error: 'Producto y contacto son obligatorios.' });
    }

    db.run(
      'INSERT INTO alertas_stock (producto_slug, talla, contacto) VALUES (?, ?, ?)',
      [producto_slug, talla || 'Única', contacto.trim()]
    );

    return res.json({
      success: true,
      message: '¡Listo! Te avisaremos por WhatsApp o correo en cuanto este producto vuelva a estar en stock.'
    });
  } catch (error) {
    console.error('Error en /api/alertas-stock:', error);
    return res.status(500).json({ success: false, error: 'Error al registrar alerta de stock.' });
  }
});

// 4. POST /api/cotizaciones - Registrar cotización antes de WhatsApp
app.post('/api/cotizaciones', publicPostLimiter, (req, res) => {
  try {
    const { origen, items, subtotal, descuento, total } = req.body;
    if (!items || !total) {
      return res.status(400).json({ success: false, error: 'Datos de cotización inválidos.' });
    }

    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const codigo = `SC-${randomSuffix}`;

    db.run(
      'INSERT INTO cotizaciones (codigo, origen, items_json, subtotal, descuento, total) VALUES (?, ?, ?, ?, ?, ?)',
      [codigo, origen || 'web', JSON.stringify(items), Number(subtotal) || 0, Number(descuento) || 0, Number(total)]
    );

    return res.json({
      success: true,
      codigo,
      total,
      message: 'Cotización registrada con éxito.'
    });
  } catch (error) {
    console.error('Error en /api/cotizaciones:', error);
    return res.status(500).json({ success: false, error: 'Error al generar cotización.' });
  }
});

// 5. GET & POST /api/resenas - Listar y dejar nueva reseña
app.get('/api/resenas', (req, res) => {
  try {
    const resenas = db.all('SELECT * FROM resenas WHERE aprobado = 1 ORDER BY id DESC');
    return res.json({ success: true, resenas });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al obtener reseñas.' });
  }
});

app.post('/api/resenas', publicPostLimiter, (req, res) => {
  try {
    const { producto_slug, autor, carrera_sede, estrellas, comentario } = req.body;
    if (!producto_slug || !autor || !carrera_sede || !estrellas || !comentario) {
      return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios.' });
    }

    db.run(
      'INSERT INTO resenas (producto_slug, autor, carrera_sede, estrellas, comentario, aprobado) VALUES (?, ?, ?, ?, ?, 1)',
      [producto_slug, autor.trim(), carrera_sede.trim(), Number(estrellas), comentario.trim()]
    );

    const nuevaResena = db.get('SELECT * FROM resenas WHERE producto_slug = ? AND autor = ? ORDER BY id DESC LIMIT 1', [producto_slug, autor.trim()]);

    return res.json({
      success: true,
      resena: nuevaResena,
      message: '¡Gracias, tu reseña ha sido enviada y publicada con éxito!'
    });
  } catch (error) {
    console.error('Error en /api/resenas:', error);
    return res.status(500).json({ success: false, error: 'Error al enviar reseña.' });
  }
});

// 6. POST /api/feedback - Mensaje de soporte, sugerencia o reclamo
app.post('/api/feedback', publicPostLimiter, (req, res) => {
  try {
    const { tipo, nombre, contacto, mensaje } = req.body;
    if (!tipo || !nombre || !contacto || !mensaje) {
      return res.status(400).json({ success: false, error: 'Todos los campos son obligatorios.' });
    }

    db.run(
      'INSERT INTO feedback (tipo, nombre, contacto, mensaje, estado) VALUES (?, ?, ?, ?, ?)',
      [tipo, nombre.trim(), contacto.trim(), mensaje.trim(), 'pendiente']
    );

    return res.json({
      success: true,
      message: 'Tu mensaje fue recibido correctamente. Nuestro equipo te responderá a la brevedad.'
    });
  } catch (error) {
    console.error('Error en /api/feedback:', error);
    return res.status(500).json({ success: false, error: 'Error al registrar feedback.' });
  }
});

// -----------------------------------------------------------------------------
// PANEL ADMINISTRATIVO (/api/admin/...)
// -----------------------------------------------------------------------------

// Validar login admin
app.post('/api/admin/auth', (req, res) => {
  const { password } = req.body;
  if (password === ADMIN_PASSWORD) {
    return res.json({ success: true, token: ADMIN_PASSWORD });
  }
  return res.status(401).json({ success: false, error: 'Contraseña incorrecta.' });
});

// Estadísticas para panel
app.get('/api/admin/stats', requireAdminAuth, (req, res) => {
  try {
    const leadsTotal = db.get('SELECT count(*) as count FROM leads')?.count || 0;
    const cotizacionesTotal = db.get('SELECT count(*) as count FROM cotizaciones')?.count || 0;
    const resenasPendientes = db.get('SELECT count(*) as count FROM resenas WHERE aprobado = 0')?.count || 0;
    const feedbackPendiente = db.get("SELECT count(*) as count FROM feedback WHERE estado = 'pendiente'")?.count || 0;
    const productosAgotados = db.get('SELECT count(*) as count FROM productos WHERE en_stock = 0')?.count || 0;

    return res.json({
      success: true,
      stats: {
        leadsTotal,
        cotizacionesTotal,
        resenasPendientes,
        feedbackPendiente,
        productosAgotados
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: 'Error al obtener estadísticas.' });
  }
});

// Exportar Leads a CSV
app.get('/api/admin/leads/csv', requireAdminAuth, (req, res) => {
  try {
    const leads = db.all('SELECT * FROM leads ORDER BY id DESC');

    const headers = [
      'ID',
      'Nombre',
      'Correo',
      'WhatsApp',
      'Carrera/Etapa',
      'Cupon',
      'UTM Source',
      'UTM Campaign',
      'UTM Term',
      'Fecha Creacion'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.join(',')];
    for (const lead of leads) {
      csvRows.push([
        escapeCsv(lead.id),
        escapeCsv(lead.nombre),
        escapeCsv(lead.correo),
        escapeCsv(lead.whatsapp),
        escapeCsv(lead.carrera),
        escapeCsv(lead.cupon),
        escapeCsv(lead.utm_source),
        escapeCsv(lead.utm_campaign),
        escapeCsv(lead.utm_term),
        escapeCsv(lead.created_at)
      ].join(','));
    }

    const csvContent = csvRows.join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="leads_shop_care.csv"');
    return res.send('\uFEFF' + csvContent); // BOM for Excel UTF-8 support
  } catch (error) {
    console.error('Error exportando CSV:', error);
    return res.status(500).json({ success: false, error: 'Error al exportar CSV.' });
  }
});

// Listar Leads en Admin
app.get('/api/admin/leads', requireAdminAuth, (req, res) => {
  const leads = db.all('SELECT * FROM leads ORDER BY id DESC LIMIT 100');
  res.json({ success: true, leads });
});

// Listar Cotizaciones en Admin
app.get('/api/admin/cotizaciones', requireAdminAuth, (req, res) => {
  const cotizaciones = db.all('SELECT * FROM cotizaciones ORDER BY id DESC LIMIT 50');
  res.json({ success: true, cotizaciones });
});

// Actualizar stock de producto (Disponible <-> Agotado)
app.patch('/api/admin/productos/:id/stock', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { en_stock } = req.body;
    db.run('UPDATE productos SET en_stock = ? WHERE id = ?', [en_stock ? 1 : 0, Number(id)]);
    res.json({ success: true, message: 'Stock actualizado con éxito.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar stock.' });
  }
});

// Actualizar precio de producto (precio_normal y precio_dto)
app.patch('/api/admin/productos/:id/precio', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    let { precio_normal, precio_dto } = req.body;
    
    precio_normal = parseFloat(precio_normal);
    if (isNaN(precio_normal) || precio_normal < 0) {
      return res.status(400).json({ success: false, error: 'El precio normal debe ser un número válido mayor o igual a 0.' });
    }

    if (precio_dto === undefined || precio_dto === null || precio_dto === '' || isNaN(parseFloat(precio_dto))) {
      precio_dto = Math.round(precio_normal * 0.85 * 100) / 100;
    } else {
      precio_dto = parseFloat(precio_dto);
    }

    db.run(
      'UPDATE productos SET precio_normal = ?, precio_dto = ? WHERE id = ?',
      [precio_normal, precio_dto, Number(id)]
    );

    res.json({
      success: true,
      message: 'Precio actualizado con éxito en la base de datos.',
      producto: { id: Number(id), precio_normal, precio_dto }
    });
  } catch (error) {
    console.error('Error al actualizar precio:', error);
    res.status(500).json({ success: false, error: 'Error al actualizar precio.' });
  }
});

// Listar todas las reseñas para moderar
app.get('/api/admin/resenas', requireAdminAuth, (req, res) => {
  const resenas = db.all('SELECT * FROM resenas ORDER BY id DESC');
  res.json({ success: true, resenas });
});

// Aprobar reseña
app.patch('/api/admin/resenas/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { aprobado } = req.body;
    db.run('UPDATE resenas SET aprobado = ? WHERE id = ?', [aprobado ? 1 : 0, Number(id)]);
    res.json({ success: true, message: 'Estado de reseña actualizado.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar reseña.' });
  }
});

// Eliminar reseña
app.delete('/api/admin/resenas/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    db.run('DELETE FROM resenas WHERE id = ?', [Number(id)]);
    res.json({ success: true, message: 'Reseña eliminada.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al eliminar reseña.' });
  }
});

// Listar feedback
app.get('/api/admin/feedback', requireAdminAuth, (req, res) => {
  const feedback = db.all('SELECT * FROM feedback ORDER BY id DESC');
  res.json({ success: true, feedback });
});

// Marcar feedback como atendido
app.patch('/api/admin/feedback/:id', requireAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    db.run('UPDATE feedback SET estado = ? WHERE id = ?', [estado || 'atendido', Number(id)]);
    res.json({ success: true, message: 'Estado de feedback actualizado.' });
  } catch (error) {
    res.status(500).json({ success: false, error: 'Error al actualizar feedback.' });
  }
});

// -----------------------------------------------------------------------------
// MODO PRODUCCIÓN UNIFICADO
// -----------------------------------------------------------------------------
const distPath = path.join(__dirname, '..', 'dist');

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res) => {
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ error: 'Endpoint no encontrado' });
    }
    res.sendFile(path.join(distPath, 'index.html'));
  });
}

// Iniciar base de datos y servidor
async function startServer() {
  await initDatabase();
  app.listen(PORT, () => {
    console.log(`[SERVER] Shop & Care API corriendo en http://localhost:${PORT}`);
    console.log(`[SERVER] Entorno: ${process.env.NODE_ENV || 'development'}`);
  });
}

startServer().catch(err => {
  console.error('[SERVER] Fallo al iniciar servidor:', err);
});
