import db, { skip, limit } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: "Мітки",
            description: "Список міток публікацій",
            keywords: "мітки"
        };
        data.tags = await db.collection('tags').aggregate([
        { $match: { status: true } },
        { $lookup: {
            from: 'posts',
            let: { tagId: '$_id' },
            pipeline: [
                { $match: {
                    $expr: {
                    $and: [
                        { $eq: ['$status', true] },
                        { $in: ['$$tagId', '$tags'] }
                    ]
                    }
                }},
                { $project: { _id: 1 } } // беремо мінімум полів
            ],
            as: 'posts'
        }},
        { $addFields: { postCount: { $size: '$posts' } } },
        { $match: { postCount: { $gt: 1 } } },
        { $project: { title: 1, slug: 1, status: 1, posts: '$postCount' } },
        { $sort: { title: 1 } },
        { $limit: 100 }
        ]).toArray();
        response.render('tags/index', data);
    },

    posts: async (request, response, next) => {
        const data = await db.collection('tags')
            .aggregate([
                { $match: {
                    slug: request.params.slug,
                    status: true
                } },
                { $lookup: {
                    from: 'posts', 
                    let: { tag: '$_id' },
                    pipeline: [
                        { $match: {
                            $expr: {
                                $in: [ '$$tag', '$tags' ]
                            },
                            status: true
                        } },
                        { $sort: { date: -1 } },
                        { $skip: skip(request.query?.page) },
                        { $limit: limit },
                        { $lookup: {
                            from: 'categories', localField: 'category', 
                            foreignField: '_id', as: 'category'
                        } },
                        { $unwind: '$category' },
                        { $lookup: {
                            from: 'users', localField: 'user', 
                            foreignField: '_id', as: 'user'
                        } },
                        { $unwind: '$user' },
                        { $project: {
                            _id: false, title: true, description: true,
                            image: true, slug: true, date: true, status: true,
                            category: { title: true, slug: true },
                            user: { title: true, slug: true }
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
        response.render('tags/posts', data);
     }
}