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
  
  // 👇 MÉTODO PARA EL ONBOARDING (Simulado por ahora) 👇
  static async updateProfile(req, res) {
    try {
      const { email } = req.params;
      const { studentId, phone, address } = req.body;

      // 1. Instanciamos el repositorio
      const userRepository = new MongoUserRepository();

      // 2. Mandamos a guardar los datos reales en MongoDB
      const updatedUser = await userRepository.updateProfile(email, { 
        studentId, 
        phone, 
        address 
      });

      if (!updatedUser) {
        return res.status(404).json({ message: 'Usuario no encontrado para actualizar' });
      }

      // 3. Respondemos con éxito
      res.status(200).json({ 
        message: 'Perfil completado con éxito en la base de datos', 
        data: updatedUser 
      });

    } catch (error) {
      console.error("Error en updateProfile:", error);
      res.status(400).json({ message: error.message });
    }
  }

  // 👇 MÉTODO ARREGLADO PARA BUSCAR USUARIO 👇
  static async getUser(req, res) {
    try {
      const { email } = req.params;
      
      // 1. Instanciamos el repositorio (igual que en createUser)
      const userRepository = new MongoUserRepository();

      // 2. Buscamos al usuario usando el método del repositorio
      // Asegúrate de que tu MongoUserRepository tenga un método llamado findByEmail
      const user = await userRepository.findByEmail(email);

      if (!user) {
        // Si no existe, devolvemos 404 para que React sepa que debe crearlo (POST)
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }

      // Si existe, lo devolvemos con todos sus datos
      res.status(200).json({ message: 'Usuario encontrado', data: user });

    } catch (error) {
      console.error("Error al buscar usuario en GET:", error);
      res.status(500).json({ message: 'Error interno del servidor' });
    }
  }

}

module.exports = UserController;