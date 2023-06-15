import db, { filter } from '../db.js';

export default {

    index: async (request, response) => {
        const view = {
            title: "Мітки",
            description: "Список міток публікацій",
            keywords: "мітки"
        };
        const stages = filter(request.query);
        view.tags = await db.collection('tags')
            .aggregate(stages).toArray();
        response.render('tags/list', view);
    },

    view: async (request, response) => {
        const tag = await db.collection('tags').find({
            alias: request.params.slug,
            status: true
        }).next();
        response.render('tags/view', tag);
    }
}