const knex = require("../database/knex");

class NotesController {
    //criar notas com tags
    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const { user_id } = request.params;

        //recebe os dados + insere + retorna id da nota
        const note_id = await knex("notes").insert({ 
            title,
            description,
            rating,
            user_id
        });

        //para cada tag atribui os dados
        const tagsInsert = tags.map(name => {
            return {
                note_id,
                name,
                user_id
            }
        });

        //insere
        await knex("tags").insert(tagsInsert);

        response.json();
    }

    //mostrar notas
    async show(request, response) {
        const { id } = request.params;

        const note = await knex("notes").where({id}).first(); //pega 1ª nota do id
        const tags = await knex("tags").where({note_id: id}).orderBy("name"); //pela ordem alfabética

        return response.json({
            ...note, //despejando todos os detalhes da note
            tags
        });
    }
}

module.exports = NotesController;