const express = require("express");
const router = express.Router();
const db = require("../db");

router.post("/login", (req, res) => {
  const { usuario, password } = req.body;
  console.log("Datos recibidos:", usuario, password);

  const query = "SELECT * FROM usuarios WHERE usuario = ? AND password = ?";
  db.query(query, [usuario, password], (err, results) => {
    if (err) {
      console.error("Error en login:", err);
      return res.status(500).json({ error: "Error del servidor" });
    }

    if (results.length === 0) {
      return res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }

    const user = results[0];
    res.json({ user: { id: user.id, nombre: user.nombre, rol: user.rol } });
  });
});

module.exports = router;
