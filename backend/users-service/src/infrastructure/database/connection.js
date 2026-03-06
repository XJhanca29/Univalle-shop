const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // ¡Nota la diferencia! Aquí nos conectamos a "univalle_users"
    const uri = 'mongodb://127.0.0.1:27017/univalle_users';
    
    await mongoose.connect(uri);
    console.log('👤 Conectado exitosamente a MongoDB (Base de datos: univalle_users)');
  } catch (error) {
    console.error('❌ Error conectando a MongoDB:', error.message);
    process.exit(1); 
  }
};

module.exports = connectDB;