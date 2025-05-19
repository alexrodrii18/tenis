const express = require("express");
const router = express.Router();
const db = require("../db"); // Este ya es con mysql2/promise

router.post("/login", async (req, res) => {
  const { usuario, password } = req.body;
  console.log("Datos recibidos:", usuario, password);

  const query = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";

  try {
    const [results] = await db.query(query, [usuario, password]);

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const user = results[0];
    res.json({ user: { id: user.id, nombre: user.nombre, rol: user.rol } });

  } catch (err) {
    console.error("Error en login:", err);
    res.status(500).json({ error: "Error del servidor" });
  }
});

module.exports = router;
