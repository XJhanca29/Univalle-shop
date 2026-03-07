class CompleteUserProfile {
  constructor(userRepository) {
    this.userRepository = userRepository;
  }

  async execute(email, { studentId, phone, address }) {
    // Calculamos si está completo
    const isProfileComplete = !!(studentId && phone && address);
    
    // Mandamos a guardar
    const updatedUser = await this.userRepository.updateProfileByEmail(email, {
      studentId,
      phone,
      address,
      isProfileComplete
    });

    if (!updatedUser) {
      throw new Error("Usuario no encontrado");
    }

    return updatedUser;
  }
}

module.exports = CompleteUserProfile;