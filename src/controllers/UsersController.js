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
        const { name, email, password, old_password } = request.body
        const { id } = request.params

        const [ user ] = await knex("users").where({id})

        if(!user) {
            throw new AppError("Usuário não encontrado")
        }

        const [ userWithUpdatedEmail ] = await knex("users").select(["id","email"]).where({email})

        if (userWithUpdatedEmail && userWithUpdatedEmail.id !== user.id) {
          throw new AppError("Este e-mail já está em uso")
        }

        user.name = name ?? user.name
        user.email = email ?? user.email

        if (password && !old_password) {
          throw new AppError("Você precisa informar a senha antiga")
        }

        if (password && old_password) {
          const checkOldPassword = await compare(old_password, user.password)
            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere")
            }

            user.password = await hash(password, 8)
        }


        await knex("users").where({id})
        .update({
            name : user.name,
            email : user.email,
            password : user.password,
            updated_at: knex.fn.now()
        })

        return response.json()
    }
}

module.exports = UsersController;