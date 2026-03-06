const express = require('express');
const connectDB = require('./src/infrastructure/database/connection');
const userRoutes = require('./src/infrastructure/routes/userRoutes');

const app = express();
// Usaremos el puerto 3001 para no chocar con el de Reviews (3000)
const PORT = process.env.PORT || 3001;

app.use(express.json());

// Conectamos a la base de datos de usuarios
connectDB(); 

// Rutas de nuestra API
app.use('/api/users', userRoutes); // <-- Conectamos las rutas al prefijo /api/users

// Ruta de prueba (Health Check)
app.get('/api/users/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: '¡El Servicio de Usuarios de Univalle Shop está funcionando! 🎓' 
  });
});

app.listen(PORT, () => {
  console.log(`Servicio de Usuarios corriendo en http://localhost:${PORT}`);
});