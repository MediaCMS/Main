import db, { filter } from '../db.js';

export default {

    find: async (request, response) => {
        const stages = filter(request.query);
        const tags = await db.collection('tags').aggregate(stages).toArray();
        response.json(tags);
    },

    findOne: async (request, response) => {
        const match = {
            alias: request.params.alias,
            status: true
        };
        const tag = await db.collection('tags').find(match).next();
        response.json(tag);
    }
}