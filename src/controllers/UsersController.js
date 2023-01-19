const { hash, compare } = require("bcryptjs"); //criptografia + comparação de senha

const AppError = require("../utils/AppError"); 

const knex = require("../database/knex");

class UsersController {  

    async create(request, response) {
        const { name, email, password } = request.body; 

        const userExists = await knex.select("email").from("users").where("email", email)
  
        if (userExists.length === 0) {
            const hashedPassword = await hash(password, 8) //criptografia

            await knex("users").insert({
                name,
                email,
                password: hashedPassword
            });

        } else {
            throw new AppError("Este e-mail ja esta em uso")
        }
  
        return response.status(201).json()
    }

    async update(request, response) {
        const { name, email, password, new_password } = request.body
        const user_id = request.user.id

        const userExists = await knex('users').where({ email })
        
        if (userExists.length === 1 && userExists[0].id !== user_id) {
            throw new AppError('Email já cadastrado')
        }

        if (password && new_password) {
            const validUserPassword = await knex
            .select('password')
            .from('users')
            .where('id', user_id)

            const checkOldPassword = await compare(password, validUserPassword[0].password)
            
            const att_password = await hash(new_password, 8)
            
            if (!checkOldPassword) {
                throw new AppError('A senha antiga nao confere')
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