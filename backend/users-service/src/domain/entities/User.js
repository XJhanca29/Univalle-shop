class User {
  constructor({ name, email, picture, studentId, phone, address, role = 'student' }) {
    if (!email || !email.endsWith('@correounivalle.edu.co')) {
      throw new Error("Acceso denegado: Solo se permiten correos institucionales (@correounivalle.edu.co).");
    }

    this.name = name;
    this.email = email;
    this.picture = picture || ''; // Foto de Google
    this.role = role;
    
    // Nuevos campos para el formulario de Onboarding
    this.studentId = studentId || null;
    this.phone = phone || null;
    this.address = address || null;
    
    // Bandera mágica: nos dirá si el usuario ya llenó el formulario o no
    this.isProfileComplete = !!(studentId && phone && address); 
    
    this.isActive = true;
    this.createdAt = new Date();
  }
}

module.exports = User;