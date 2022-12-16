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
        const { name, email, password, old_password } = request.body;
        const { id } = request.params;

        const user = await knex.select("id").from("users").where("id", id)

        if (!user) { 
            throw new AppError("Usuário não encontrado")
        }

        const userWithUpdateEmail = await knex.select('email').from('users').where('email', email)

        if(userWithUpdateEmail && userWithUpdateEmail.id !== user.id) { 
            throw new AppError("Esse e-mail já está em uso")
        }

        user.name = name ?? user.name; //é ele, ou ele mesmo
        user.email = email ?? user.email;

        if (password && !old_password) { 
            throw new AppError("Você precisa informar a senha antiga")
        }

        if (password && old_password) { 
            const checkOldPassword = await compare(old_password, user.password); 

            if (!checkOldPassword) {
                throw new AppError("A senha antiga não confere");
            }

            user.password = await hash(password, 8); //criptografia
        }

        await knex("users").insert({
            name,
            email,
            password: hashedPassword,
            id,
            update_at: dateTime('now')
        });

        return response.json();
    }   
}

module.exports = UsersController;