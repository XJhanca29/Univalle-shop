// src/application/use-cases/CreateUserUseCase.js
const User = require('../../domain/entities/User'); // Nuestra regla de negocio pura

class CreateUserUseCase {
  constructor(userRepository) {
    this.userRepository = userRepository; // Inyección de dependencias
  }

  async execute(userData) {
    // 1. Validar reglas de negocio (Aquí explotará si no es @univalle.edu.co)
    const user = new User(userData);

    // 2. Verificar que el correo no esté registrado ya en la base de datos
    const existingUser = await this.userRepository.findByEmail(user.email);
    if (existingUser) {
      throw new Error("Este correo de Univalle ya está registrado.");
    }

    // 3. Guardar el usuario usando el puerto/adaptador
    const savedUser = await this.userRepository.save(user);
    return savedUser;
  }
}

module.exports = CreateUserUseCase;