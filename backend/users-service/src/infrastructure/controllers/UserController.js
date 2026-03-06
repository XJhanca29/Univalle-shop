// src/infrastructure/controllers/UserController.js
const CreateUserUseCase = require('../../application/use-cases/CreateUserUseCase');
const MongoUserRepository = require('../adapters/MongoUserRepository');

class UserController {
  static async createUser(req, res) {
    try {
      // 1. Preparamos las herramientas (Inyección de dependencias)
      const userRepository = new MongoUserRepository();
      const createUserUseCase = new CreateUserUseCase(userRepository);

      // 2. Ejecutamos la lógica de negocio enviando lo que llegó en el body
      const user = await createUserUseCase.execute(req.body);

      // 3. Si todo sale bien, respondemos con código 201 (Creado)
      res.status(201).json({ success: true, data: user });
    } catch (error) {
      // Si el correo no es de Univalle o ya existe, el error cae aquí
      res.status(400).json({ success: false, message: error.message });
    }
  }
}

module.exports = UserController;