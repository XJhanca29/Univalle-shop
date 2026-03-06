const express = require('express');
const connectDB = require('./src/infrastructure/database/connection'); // <-- Importamos la conexión
// Inicializamos la aplicación de Express
const app = express();

// Definimos el puerto (usaremos el 3000 para Reviews, luego el 3001 para otro, etc.)
const PORT = process.env.PORT || 3000;

// <-- Ejecutamos la conexión a la base de datos
connectDB();

// Middleware fundamental: Le dice a Express que entienda las peticiones en formato JSON
app.use(express.json());

// Ruta de prueba (Health Check) para saber si nuestro microservicio está vivo
app.get('/api/reviews/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: '¡El Servicio de Reviews de Univalle Shop está funcionando! 🚀' 
  });
});

// Encendemos el servidor
app.listen(PORT, () => {
  console.log(`Servicio de Reviews corriendo en http://localhost:${PORT}`);
});