import db, { filter } from '../db.js';

export default {

    home: async (request, response) => {
        const view = {
            title: 'Категорії',
            description: 'Список категорій публікацій',
            keywords: 'категорії'
        };
        response.render('posts/home', view);
    },

    index: async (request, response) => {
        const view = {
            title: 'Публікації',
            description: 'Список публікацій сайту',
            keywords: 'публікації'
        };
        const stages = filter(request.query);
        stages = [
            { $lookup: {
                from: 'categories', 
                localField: 'category', 
                foreignField: '_id', 
                as: 'category'
            } },
            { $unwind: '$category' },
            { $lookup: {
                from: 'users', 
                localField: 'user', 
                foreignField: '_id', 
                as: 'user'
            } },
            { $unwind: '$user' },
            { $project: {
                time: 1, title: 1, description: 1, 
                image: 1, tags: 1, alias: 1, status: 1,
                category: { _id: 1, title: 1, alias: 1 },
                user: { _id: 1, title: 1, alias: 1 }
            }},
            ...stages
        ];
        stages[1].$order = { 'time': 0 };
        view.posts = await db.collection('posts')
            .aggregate().toArray();
        response.render('posts/list', view);
    },

    view: async (request, response) => {
        const post = await db.collection('articles')
            .aggregate([
            { $lookup: {
                from: 'categories',
                localField: 'category',
                foreignField: '_id',
                as: 'category'
            }},
            { $unwind: '$category' },
            { $lookup: {
                from: 'tags',
                localField: 'tags',
                foreignField: '_id',
                as: 'tags'
            }},
            { $lookup: {
                from: 'users', 
                localField: 'user',
                foreignField: '_id',
                as: 'user'
            }},
            { $unwind: '$user' },
            { $match: {
                alias: request.params.slug,
                status: true
            }}
        ]).next();
        response.render('posts/view', post);
    }
}