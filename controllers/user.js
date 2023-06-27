import db, { skip, limit } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: 'Автори', 
            description: 'Список авторів публікацій',
            keywords: 'автори'
        };
        data.users = await db.collection('users')
            .aggregate([
                { $match: { status: true } },
                { $lookup: {
                    from: 'roles',
                    localField: 'role',
                    foreignField: '_id',
                    as: 'role'
                }},
                { $unwind: '$role' },
                { $match: { 'role.level': { $gt: 0 } } },
                { $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'user',
                    as: 'posts'
                } },
                { $project: {
                    title: true, description: true, image: true, alias: true,
                    posts: { $size: '$posts' }
                } },
                { $match: { posts: { $gt: 0 } } },
                { $sort: { title: 1 } },
                { $skip: skip(request.query?.page) },
                { $limit: limit }
            ]).toArray();
        response.render('users/index', data);
    },

    posts: async (request, response, next) => {
        const data = await db.collection('users')
            .aggregate([
                { $match: {
                    alias: request.params.slug,
                    status: true
                } },
                { $lookup: {
                    from: 'posts', 
                    let: { user: '$_id' },
                    pipeline: [
                        { $match: {
                            $expr: {
                                $eq: [ '$user', '$$user' ]
                            },
                            status: true
                        } },
                        { $sort: { time: 1 } },
                        { $skip: skip(request.query?.page) },
                        { $limit: limit },
                        { $lookup: {
                            from: 'categories', 
                            localField: 'category', 
                            foreignField: '_id', 
                            as: 'category'
                        } },
                        { $unwind: '$category' },
                        { $project: {
                            _id: false, title: true, description: true,
                            image: true, alias: true, status: true,
                            category: { title: true, alias: true }
                        } }
                    ],
                    as: 'posts'
                } },
                { $project: {
                    _id: false, time: false, order: false,
                    user: false, status: false
                } }
            ]).next();
        if (!data) {
            response.status(404);
            return next();
        }
        response.render('users/posts', data);
    }
}