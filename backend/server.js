const express = require("express");
const cors = require("cors");  // Asegúrate de haber instalado 'cors' con 'npm install cors'
const mysql = require("mysql2");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Configuración de CORS para permitir solicitudes desde localhost:5173 (tu frontend Vue)
const corsOptions = {
  origin: "http://localhost:5173",  // Permite solicitudes desde el frontend
  methods: ["GET", "POST"],        // Permite métodos GET y POST
  allowedHeaders: ["Content-Type"] // Permite el encabezado Content-Type
};

// Usar CORS con las opciones especificadas
app.use(cors(corsOptions));

// Middleware para poder leer los datos en formato JSON de las solicitudes
app.use(express.json());

// Rutas
const usuariosRoutes = require("./routes/usuarios");
app.use("/api/usuarios", usuariosRoutes);

// Conexión a la base de datos MySQL
const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASS || "",
  database: process.env.DB_NAME || "gestion-tenis",
});

db.connect((err) => {
  if (err) {
    console.error("❌ Error conectando a la base de datos:", err);
  } else {
    console.log("✅ Conectado a la base de datos MySQL");
  }
});

// Rutas adicionales (por ejemplo, jugadores)
const jugadoresRoutes = require("./routes/jugadores");
app.use("/jugadores", jugadoresRoutes);

// Ruta principal de prueba
app.get("/", (req, res) => {
  res.send("Servidor funcionando correctamente");
});

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
