import db, { filter } from '../db.js';

export default {

    index: async (request, response) => {
        const view = {
            title: "Сторінки",
            description: "Список сторінок сайту",
            keywords: "сторінки"
        };
        const stages = filter(request.query);
        view.pages = await db.collection('pages')
            .aggregate(stages).toArray();
        response.render('pages/list', view);
    },

    view: async (request, response) => {
        const page = await db.collection('pages').find({
            alias: request.params.slug,
            status: true
        }).next();
        response.render('pages/view', page);
    }
}