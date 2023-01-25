const { hash, compare } = require("bcryptjs"); //criptografia + comparação de senha
const AppError = require("../utils/AppError"); 

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        const userExists = await this.userRepository.findByEmail(email);
  
        if (userExists.length === 0) {
            const hashedPassword = await hash(password, 8) //criptografia

            await this.userRepository.create({ name, email, password: hashedPassword });

        } else {
            throw new AppError("Este e-mail já está em uso.")
        }
    }
}

module.exports = UserCreateService;