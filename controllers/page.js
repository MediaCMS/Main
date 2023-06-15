import db, { filter } from '../db.js';

export default {

    find: async (request, response) => {
        const stages = filter(request.query);
        const pages = await db.collection('pages').aggregate(stages).toArray();
        response.json(pages);
    },

    findOne: async (request, response) => {
        const match = {
            alias: request.params.alias,
            status: true
        };
        const page = await db.collection('pages').find(match).next();
        response.json(page);
    }
}