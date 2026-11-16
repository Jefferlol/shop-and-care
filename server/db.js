import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import initSqlJs from 'sql.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.join(__dirname, 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbFilePath = path.join(dataDir, 'shop_care.db');

let rawDb = null;

// Persist SQLite database to disk
function saveDb() {
  if (rawDb) {
    const data = rawDb.export();
    fs.writeFileSync(dbFilePath, Buffer.from(data));
  }
}

// Helper to convert sql.js exec result to array of objects
function formatExecResult(res) {
  if (!res || res.length === 0) return [];
  const { columns, values } = res[0];
  return values.map(row => {
    const obj = {};
    columns.forEach((col, idx) => {
      obj[col] = row[idx];
    });
    return obj;
  });
}

// Clean wrapper matching better-sqlite3 convenience
export const db = {
  all(sql, params = []) {
    const stmt = rawDb.prepare(sql);
    if (params && params.length > 0) {
      stmt.bind(params);
    }
    const rows = [];
    while (stmt.step()) {
      rows.push(stmt.getAsObject());
    }
    stmt.free();
    return rows;
  },

  get(sql, params = []) {
    const stmt = rawDb.prepare(sql);
    if (params && params.length > 0) {
      stmt.bind(params);
    }
    let result = null;
    if (stmt.step()) {
      result = stmt.getAsObject();
    }
    stmt.free();
    return result;
  },

  run(sql, params = []) {
    rawDb.run(sql, params);
    const lastIdRes = rawDb.exec('SELECT last_insert_rowid() as id');
    const changesRes = rawDb.exec('SELECT changes() as changes');
    saveDb();
    return {
      lastInsertRowid: lastIdRes[0]?.values[0]?.[0] || 0,
      changes: changesRes[0]?.values[0]?.[0] || 0,
    };
  },

  exec(sql) {
    rawDb.run(sql);
    saveDb();
  }
};

export async function initDatabase() {
  const SQL = await initSqlJs();

  if (fs.existsSync(dbFilePath)) {
    const fileBuffer = fs.readFileSync(dbFilePath);
    rawDb = new SQL.Database(fileBuffer);
  } else {
    rawDb = new SQL.Database();
  }

  // 1. Crear Tablas si no existen
  rawDb.run(`
    CREATE TABLE IF NOT EXISTS leads (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      correo TEXT NOT NULL UNIQUE,
      whatsapp TEXT NOT NULL,
      carrera TEXT NOT NULL,
      acepto_privacidad INTEGER NOT NULL,
      cupon TEXT DEFAULT 'TURNO15',
      utm_source TEXT,
      utm_campaign TEXT,
      utm_term TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS productos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      slug TEXT UNIQUE,
      nombre TEXT,
      categoria TEXT,
      precio_normal REAL,
      precio_dto REAL,
      en_stock INTEGER DEFAULT 1,
      tallas_json TEXT,
      colores_json TEXT,
      detalles_json TEXT
    );

    CREATE TABLE IF NOT EXISTS alertas_stock (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_slug TEXT NOT NULL,
      talla TEXT,
      contacto TEXT NOT NULL,
      notificado INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS cotizaciones (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      codigo TEXT UNIQUE,
      origen TEXT,
      items_json TEXT,
      subtotal REAL,
      descuento REAL,
      total REAL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS resenas (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      producto_slug TEXT NOT NULL,
      autor TEXT NOT NULL,
      carrera_sede TEXT NOT NULL,
      estrellas INTEGER NOT NULL,
      comentario TEXT NOT NULL,
      aprobado INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      tipo TEXT NOT NULL,
      nombre TEXT NOT NULL,
      contacto TEXT NOT NULL,
      mensaje TEXT NOT NULL,
      estado TEXT DEFAULT 'pendiente',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // 2. Seed inicial de productos desde catalogo.json si la tabla está vacía
  const productCountRes = rawDb.exec('SELECT count(*) as count FROM productos');
  const count = productCountRes[0]?.values[0]?.[0] || 0;

  if (count === 0) {
    const catalogoPath = path.join(__dirname, '..', 'src', 'data', 'catalogo.json');
    if (fs.existsSync(catalogoPath)) {
      const catalogo = JSON.parse(fs.readFileSync(catalogoPath, 'utf8'));
      const stmt = rawDb.prepare(`
        INSERT INTO productos (slug, nombre, categoria, precio_normal, precio_dto, en_stock, tallas_json, colores_json, detalles_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      `);

      for (const p of catalogo) {
        // Alondra marcado como agotado (en_stock = 0)
        const enStock = p.slug === 'guardapolvo-alondra-mujer' ? 0 : (p.en_stock !== undefined ? p.en_stock : 1);
        stmt.run([
          p.slug,
          p.nombre,
          p.categoria,
          p.precio_normal,
          p.precio_dto,
          enStock,
          JSON.stringify(p.tallas || []),
          JSON.stringify(p.colores || []),
          JSON.stringify(p.detalles || [p.descripcion || ''])
        ]);
      }
      stmt.free();
    }
  }

  // 3. Seed inicial de 4 reseñas aprobadas para los modelos principales si está vacía
  const resenaCountRes = rawDb.exec('SELECT count(*) as count FROM resenas');
  const resenasCount = resenaCountRes[0]?.values[0]?.[0] || 0;

  if (resenasCount === 0) {
    const seedResenas = [
      {
        slug: 'scrubs-carlos-varon',
        autor: 'Dr. Giancarlo M.',
        carrera_sede: 'Médico Residente - Hospital Dos de Mayo',
        estrellas: 5,
        comentario: 'Excelente caída y muy fresco para guardias de 24 horas. Los bolsillos externos entran perfecto con las hojas de evolución y el tensiómetro.'
      },
      {
        slug: 'scrubs-oriana-mujer',
        autor: 'Lic. Valeria C.',
        carrera_sede: 'Enfermería - Hospital Cayetano Heredia',
        estrellas: 5,
        comentario: 'La tela es comodísima, no se arruga después del lavado y el color rosa pastel es precioso. Muy recomendado para rotaciones de piso.'
      },
      {
        slug: 'scrubs-estefany-mujer',
        autor: 'Dra. Lucía S.',
        carrera_sede: 'Médico SERUMS - Puesto de Salud Chontabamba',
        estrellas: 5,
        comentario: 'El Polystel le da un porte impecable para pasar visita y atender consulta externa. Resistente al clima y al uso constante.'
      },
      {
        slug: 'set-de-instrumental-basico',
        autor: 'Rodrigo T.',
        carrera_sede: 'Interno de Medicina - Hospital Regional de Ayacucho',
        estrellas: 5,
        comentario: 'El acero es de excelente calidad, no se oxida tras varias esterilizaciones en autoclave. Muy superior a los sets genéricos de Jr. Huancavelica.'
      }
    ];

    const stmtResena = rawDb.prepare(`
      INSERT INTO resenas (producto_slug, autor, carrera_sede, estrellas, comentario, aprobado)
      VALUES (?, ?, ?, ?, ?, 1)
    `);

    for (const r of seedResenas) {
      stmtResena.run([r.slug, r.autor, r.carrera_sede, r.estrellas, r.comentario]);
    }
    stmtResena.free();
  }

  saveDb();
  console.log(`[DB] Base de datos SQLite inicializada exitosamente en ${dbFilePath}`);
}
