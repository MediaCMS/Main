import config from '../config.js';
import db, { skip, limit } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: 'Публікації',
            description: 'Список публікацій сайту',
            keywords: 'публікації'
        };
        data.posts = await db.collection('posts')
            .aggregate([
                { $match: { status: true } },
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
                { $lookup: {
                    from: 'users',
                    localField: 'user',
                    foreignField: '_id',
                    as: 'user'
                } },
                { $unwind: '$user' },
                { $project: {
                    time: true, title: true, description: true, 
                    image: true, tags: true, alias: true, status: true,
                    category: { title: true, alias: true },
                    user: { title: true, alias: true }
                }}
            ]).toArray();
        response.render('posts/index', data);
    },

    view: async (request, response) => {
        const post = await db.collection('posts')
            .aggregate([
                { $match: {
                    alias: request.params.slug,
                    status: true
                }},
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
                { $unwind: '$user' }
            ]).next();
        post.body = post.body.replace(
            /<img\s+src="https:\/\/фото\.медіа\.укр\/сховище([^"]+)"/g,
            `<img src="${config.image.blank}" data-src="$1"`
        );
        response.render('posts/view', post);
    }
}