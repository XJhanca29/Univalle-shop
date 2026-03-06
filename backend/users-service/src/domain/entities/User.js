class User {
  constructor({ name, email, role = 'student' }) {
    // Regla de negocio #1: Exclusividad Univalle
    if (!email || !email.endsWith('@univalle.edu.co')) {
      throw new Error("Acceso denegado: Solo se permiten correos institucionales de la Universidad del Valle (@univalle.edu.co).");
    }

    // Regla de negocio #2: Validar roles permitidos (según tus requerimientos)
    const validRoles = ['student', 'teacher', 'admin'];
    if (!validRoles.includes(role)) {
      throw new Error("Rol de usuario inválido.");
    }

    this.name = name;
    this.email = email;
    this.role = role;
    this.isActive = true;
    this.createdAt = new Date();
  }
}

module.exports = User;