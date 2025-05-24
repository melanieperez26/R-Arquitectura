const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');

const app = express(); // Declaración correcta

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public'))); // Sirve archivos estáticos

// Obtener todas las tareas
app.get('/tareas', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tareas');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar tarea
app.post('/tareas', async (req, res) => {
  const { texto, fecha, hora } = req.body;
  console.log('Recibido:', { texto, fecha, hora });  // 👈 para verificar entrada

  try {
    const result = await db.query(
      'INSERT INTO tareas (texto, fecha, hora) VALUES ($1, $2, $3) RETURNING *',
      [texto, fecha, hora]
    );
    console.log('Insertado:', result.rows[0]);       // 👈 para verificar inserción
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Error al insertar:', err);         // 👈 para ver errores
    res.status(500).json({ error: err.message });
  }
});


// Eliminar tarea
app.delete('/tareas/:id', async (req, res) => {
  try {
    await db.query('DELETE FROM tareas WHERE id = $1', [req.params.id]);
    res.json({ eliminado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Marcar como completada
app.put('/tareas/:id', async (req, res) => {
  const { completada } = req.body;
  try {
    await db.query(
      'UPDATE tareas SET completada = $1 WHERE id = $2',
      [completada, req.params.id]
    );
    res.json({ actualizado: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});
