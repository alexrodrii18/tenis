const express = require("express");
const router = express.Router();
const db = require("../db");

// Guardar disponibilidad y generar emparejamientos
router.post("/", (req, res) => {
    const { usuario_id, horario } = req.body;
  
    const insertQuery = `
      INSERT INTO disponibilidades (usuario_id, horario)
      VALUES (?, ?)
    `;
  
    db.query(insertQuery, [usuario_id, horario], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error al guardar disponibilidad" });
      }
  
      const insertedId = result.insertId;
  
      // Devuelve el nuevo registro insertado
      const selectQuery = `SELECT * FROM disponibilidades WHERE id = ?`;
      db.query(selectQuery, [insertedId], (err, rows) => {
        if (err || rows.length === 0) {
          return res.status(500).json({ error: "Error al recuperar la disponibilidad" });
        }
  
        res.json(rows[0]); // 👈 Esto es lo que el frontend necesita
      });
    });
  });
  module.exports = router;

