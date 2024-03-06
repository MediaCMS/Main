import db, { skip, limit } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: "Сторінки",
            description: "Список сторінок сайту",
            keywords: "сторінки"
        };
        data.pages = await db.collection('pages')
            .aggregate([
                { $match: { status: true } },
                { $sort: { title: 1 } },
                { $skip: skip(request.query?.page) },
                { $limit: limit }
            ]).toArray();
        response.render('pages/index', data);
    },

    view: async (request, response, next) => {
        const match = {
            slug: request.params.slug
        }
        if (!request.query?.preview) {
            match.status = true
        }
        const page = await db.collection('pages')
            .find(match).next();
        if (!page) {
            response.status(404);
            return next();
        }
        response.render('pages/view', page);
    }
}