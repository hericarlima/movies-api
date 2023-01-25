const UserRepository = require("../repositories/UserRepository");
const UserCreateService = require("../services/UserCreateService");

const knex = require("../database/knex");

class UsersController {  

    async create(request, response) {
        const { name, email, password } = request.body; 

        const userRepository = new UserRepository();
        const userCreateService = new UserCreateService(userRepository);

        await userCreateService.execute({ name, email, password });

        return response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, new_password } = request.body
        const user_id = request.user.id

        const userExists = await knex('users').where({ email })
        
        if (userExists.length === 1 && userExists[0].id !== user_id) {
            throw new AppError('Email já cadastrado!')
        }

        if (password && new_password) {
            const validUserPassword = await knex
            .select('password')
            .from('users')
            .where('id', user_id)

            const checkOldPassword = await compare(password, validUserPassword[0].password)
            
            const att_password = await hash(new_password, 8)
            
            if (!checkOldPassword) {
                throw new AppError('A senha antiga não confere.')
            }

            await knex('users').where('id', user_id).update({ password: att_password })
        }

        await knex('users').where('id', user_id).update({
        name,
        email
        })

        return response.json()
  }
}

module.exports = UsersController;