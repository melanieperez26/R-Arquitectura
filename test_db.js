const db = require('./db');

async function testConnection() {
  try {
    const res = await db.query('SELECT NOW()');
    console.log('Conexión exitosa, hora actual:', res.rows[0]);
    process.exit(0);
  } catch (err) {
    console.error('Error en conexión:', err);
    process.exit(1);
  }
}

testConnection();
