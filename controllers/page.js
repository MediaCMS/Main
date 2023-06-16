import db, { filter } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: "Сторінки",
            description: "Список сторінок сайту",
            keywords: "сторінки"
        };
        const stages = filter(request.query);
        data.pages = await db.collection('pages')
            .aggregate(stages).toArray();
        response.render('pages/list', data);
    },

    view: async (request, response) => {
        const page = await db.collection('pages').find({
            alias: request.params.slug,
            status: true
        }).next();
        response.render('pages/view', page);
    }
}