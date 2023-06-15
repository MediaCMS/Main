import db, { filter } from '../db.js';

export default {

    find: async (request, response) => {
        const stages = filter(request.query);
        stages =[
            { $lookup: {
                from: "categories", localField: "category", foreignField: "_id", as: "category"
            } },
            { $unwind: '$category' },
            { $lookup: {
                from: "users", localField: "user", foreignField: "_id", as: "user"
            } },
            { $unwind: '$user' },
            { $project: {
                time: 1, title: 1, description: 1, image: 1, tags: 1, alias: 1, status: 1,
                category: { _id: 1, title: 1, alias: 1 },
                user: { _id: 1, title: 1, alias: 1 }
            }},
            ...stages
        ];
        const posts = await db.collection('articles').aggregate().toArray();
        response.json(posts);
    },

    findOne: async (request, response) => {
        const stages = [
            { $lookup: {
                from: "categories", localField: "category", foreignField: "_id", as: "category"
            }},
            { $unwind: '$category' },
            { $lookup: {
                from: "tags", localField: "tags", foreignField: "_id", as: "tags"
            }},
            { $lookup: {
                from: "users", localField: "user", foreignField: "_id", as: "user"
            }},
            { $unwind: '$user' },
            { $match: {
                alias: request.params.alias, status: true
            }}
        ];
        const post = await db.collection('articles').aggregate(stages).next();
        response.json(post);
    }
}