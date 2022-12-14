const knex = require("../database/knex");

class MoviesController {
    
    async create(request, response) {
        const { title, description, rating } = request.body;
        const { user_id } = request.params; 

        const movie_id = await knex("movies").insert({ //inserir na tabela notes
            title,
            description,
            rating,
            user_id
        });
        
        response.json();
    }
}

module.exports = MoviesController;