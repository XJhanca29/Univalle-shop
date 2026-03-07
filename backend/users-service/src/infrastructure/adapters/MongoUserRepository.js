// src/infrastructure/adapters/MongoUserRepository.js
const UserModel = require('../database/UserModel');

class MongoUserRepository {
  async save(userEntity) {
    // Recibe la entidad pura y la guarda en MongoDB
    const newUser = new UserModel(userEntity);
    await newUser.save();
    return newUser;
  }
  
  async updateProfile(email, profileData) {
    // Usamos findOneAndUpdate de Mongoose para buscar por email y actualizar
    const updatedUser = await UserModel.findOneAndUpdate(
      { email: email },
      { 
        $set: {
          studentId: profileData.studentId,
          phone: profileData.phone,
          address: profileData.address,
          isProfileComplete: true // ¡Activamos la bandera mágica!
        } 
      },
      { new: true } // Para que nos devuelva el usuario ya modificado
    );
    
    return updatedUser;
  }

  // Dentro de tu clase MongoUserRepository...
  async findByEmail(email) {
    // UserModel es tu esquema de Mongoose
    const user = await UserModel.findOne({ email });
    return user;
  }
}

module.exports = MongoUserRepository;