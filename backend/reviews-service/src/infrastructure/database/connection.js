const mongoose = require('mongoose');

// Función asíncrona para conectar a la base de datos
const connectDB = async () => {
  try {
    // Intentamos conectar a una base de datos local llamada "univalle_reviews"
    // (Si usas MongoDB Atlas, aquí iría tu URL de la nube más adelante)
    const uri = 'mongodb://127.0.0.1:27017/univalle_reviews';
    
    await mongoose.connect(uri);
    console.log('📦 Conectado exitosamente a MongoDB (Base de datos: univalle_reviews)');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    // Si falla la base de datos, apagamos el microservicio (Fail-fast)
    process.exit(1); 
  }
};

module.exports = connectDB;