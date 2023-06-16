import db, { filter } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: "Категорії",
            description: "Список категорій публікацій",
            keywords: "категорії"
        };
        const stages = filter(request.query);
        data.categories = await db.collection('categories')
            .aggregate(stages).toArray();
        response.render('categories/list', data);
    },

    view: async (request, response) => {
        const category = await db.collection('categories')
            .find({
                alias: request.params.slug,
                status: true
            }).next();
        response.render('categories/view', category);
     }
}