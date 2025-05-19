const express = require("express");
const router = express.Router();
const db = require("../db"); // conexión promisificada

// Guardar nueva reserva
router.post('/', async (req, res) => {
  const { dia, hora } = req.body;

  if (!dia || !hora) {
    return res.status(400).json({ message: 'Faltan datos' });
  }

  try {
    // Asegúrate de usar await
    await db.query('INSERT INTO reservas (dia, hora) VALUES (?, ?)', [dia, hora]);
    res.status(201).json({ message: 'Reserva guardada' });
  } catch (error) {
    console.error('Error al guardar la reserva:', error);
    res.status(500).json({ message: 'Error al guardar la reserva' });
  }
});

// Obtener todas las reservas
router.get("/", async (req, res) => {
  try {
    // Asegúrate de usar await
    const [rows] = await db.query("SELECT * FROM reservas");
    res.json(rows);
  } catch (err) {
    console.error("Error al obtener reservas:", err);
    res.status(500).json({ error: "Error al obtener reservas" });
  }
});

module.exports = router;
