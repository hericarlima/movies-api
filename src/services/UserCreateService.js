const { hash } = require("bcryptjs"); 
const AppError = require("../utils/AppError"); 

class UserCreateService {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }

    async execute({ name, email, password }) {
        const userExists = await this.userRepository.findByEmail(email);
  
        if (userExists) {
            throw new AppError("Este e-mail já está em uso.")
        } else {
            const hashedPassword = await hash(password, 8) //criptografia

            const userCreated = await this.userRepository.create({ name, email, password: hashedPassword });

            return userCreated;
        }
    }
}

module.exports = UserCreateService;