import db, { filter } from '../db.js';

export default {

    find: async (request, response) => {
        const stages = filter(request.query);
        const categories = await db.collection('categories')
            .aggregate(stages).toArray();
        response.json(categories);
    },

    findOne: async (request, response) => {
        const match = {
            alias: request.params.alias,
            status: true
        };
        const category = await db.collection('categories').find(match).next();
        response.json(category);
     }
}