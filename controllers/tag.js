import db, { skip, limit } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: "Мітки",
            description: "Список міток публікацій",
            keywords: "мітки"
        };
        data.tags = await db.collection('tags')
            .aggregate([
                { $match: { status: true } },
                { $lookup: {
                    from: 'posts',
                    localField: '_id',
                    foreignField: 'tags',
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
        response.render('tags/index', data);
    },

    posts: async (request, response) => {
        const data = await db.collection('tags')
            .aggregate([
                { $match: {
                    alias: request.params.slug,
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
                        { $sort: { time: 1 } },
                        { $skip: skip(request.query?.page) },
                        { $limit: limit },
                        { $lookup: {
                            from: 'users', 
                            localField: 'user', 
                            foreignField: '_id', 
                            as: 'user'
                        } },
                        { $unwind: '$user' },
                        { $project: {
                            _id: false, title: true, description: true,
                            image: true, alias: true, status: true,
                            user: { title: true, alias: true }
                        } }
                    ],
                    as: 'posts'
                } },
                { $project: {
                    _id: false, time: false, order: false,
                    user: false, status: false
                } }
            ]).next();
        response.render('categories/posts', data);
     }
}