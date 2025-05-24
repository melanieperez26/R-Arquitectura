// db.js
const { Pool } = require('pg');

const pool = new Pool({
  user: 'postgres',         // tu usuario de PostgreSQL
  host: 'localhost',
  database: 'tareas_db',    // nombre de tu base de datos
  password: 'melanie',// cámbiala por la que pusiste
  port: 5433,
});

module.exports = pool;
