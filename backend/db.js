const mysql = require("mysql2");
require("dotenv").config();

// Configuración de la conexión a la base de datos
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "gestion_tenis",
});

// Conectar a la base de datos
db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
  } else {
    console.log("✅ Conectado a la base de datos MySQL");
  }
});


module.exports = db;
