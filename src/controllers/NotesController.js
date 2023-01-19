const knex = require("../database/knex");

class NotesController {
    //criar notas com tags
    async create(request, response) {
        const { title, description, rating, tags } = request.body;
        const user_id = request.user.id;

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

        return response.json();
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

    //deletar
    async delete(request, response) {
        const { id } = request.params;

        await knex("notes").where({ id }).delete();

        return response.json();
    }

    //mostrar notas com filtros
    async index(request, response) {
        const { title, tags } = request.query;
        const user_id = request.user.id;

        let notes;

        if(tags) {
            const filterTags = tags.split(',').map(tag => tag.trim()); 

            notes = await knex("tags")
            .select([
                "notes.id",
                "notes.title",
                "notes.user_id"
            ])
            .where("notes.user_id", user_id)
            .whereLike("notes.title", `%${title}%`)
            .whereIn("name", filterTags)
            .innerJoin("notes", "notes.id", "tags.note_id")
            .orderBy("notes.title")
        } else {
            notes = await knex("notes")
            .where({ user_id })
            .whereLike("title", `%${ title }%`)
            .orderBy("title");
        }

        const userTags = await knex("tags").where({ user_id });

        const notesWithTags = notes.map(note => {
            const noteTags = userTags.filter(tag => tag.note_id === note.id);

            return {
                ...note,
                tags: noteTags
            }
        });

        return response.json(notesWithTags);
    }
}

module.exports = NotesController;