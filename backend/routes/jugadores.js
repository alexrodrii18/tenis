const express = require("express");
const router = express.Router();
const db = require("../db"); // Importar la conexión a MySQL

// Obtener todos los jugadores
router.get("/", (req, res) => {
  db.query("SELECT * FROM usuarios", (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener un jugador por ID
router.get("/:id", (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.length === 0) return res.status(404).json({ error: "Jugador no encontrado" });
    res.json(result[0]);
  });
});

// Crear un nuevo jugador
router.post("/", (req, res) => {
  const { nombre, usuario, division_id } = req.body;
  db.query(
    "INSERT INTO usuarios (nombre, usuario, division_id) VALUES (?, ?, ?)",
    [nombre, usuario, division_id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Jugador creado con éxito", id: result.insertId });
    }
  );
});

// Actualizar datos de un jugador
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, usuario, division_id } = req.body;
  db.query(
    "UPDATE usuarios SET nombre = ?, usuario = ?, division_id = ? WHERE id = ?",
    [nombre, usuario, division_id, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ message: "Jugador actualizado con éxito" });
    }
  );
});

// Eliminar un jugador
router.delete("/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM usuarios WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "Jugador eliminado correctamente" });
  });
});

//login
// Verificar login
router.post("/login", (req, res) => {
  const { usuario, password } = req.body;

  // Aquí deberías usar una tabla con contraseñas, o al menos simularlo si no usas aún autenticación real
  db.query("SELECT * FROM usuarios WHERE usuario = ?", [usuario], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: "Usuario no encontrado" });

    const user = results[0];

    // Aquí normalmente se compara el password con bcrypt. Por simplicidad:
    if (user.password !== password) {
      return res.status(401).json({ error: "Contraseña incorrecta" });
    }

    res.json({ message: "Login exitoso", user });
  });
});


module.exports = router;
