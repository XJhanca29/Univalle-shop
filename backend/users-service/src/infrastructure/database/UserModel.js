// Ejemplo de tu Esquema de Mongoose (Infraestructura)
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  picture: { type: String },
  role: { type: String, default: 'student' },
  studentId: { type: String }, // Asegúrate de tener estos 3
  phone: { type: String },     // Asegúrate de tener estos 3
  address: { type: String },   // Asegúrate de tener estos 3
  isProfileComplete: { type: Boolean, default: false }
});

module.exports = mongoose.model('User', userSchema);