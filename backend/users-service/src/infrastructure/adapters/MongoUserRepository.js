// src/infrastructure/adapters/MongoUserRepository.js
const UserModel = require('../database/UserModel');

class MongoUserRepository {
  async save(userEntity) {
    // Recibe la entidad pura y la guarda en MongoDB
    const newUser = new UserModel(userEntity);
    await newUser.save();
    return newUser;
  }

  async findByEmail(email) {
    // Busca si un usuario ya existe
    return await UserModel.findOne({ email });
  }
}

module.exports = MongoUserRepository;