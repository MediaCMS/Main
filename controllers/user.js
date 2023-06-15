import db, { ObjectId } from '../db.js';

export default {

    find: async (request, response) => {
        const stages = filter(request.query);
        stages[0].$match.role = new ObjectId("61fae1ba6be8f90a409ecda6");
        const users = await db.collection('users').aggregate(stages).toArray();
        response.json(users);
    },

    findOne: async (request, response) => {
        const match = {
            alias: request.params.alias,
            status: true
        };
        const user = await db.collection('users').find(match).next();
        response.json(user);
    }
}