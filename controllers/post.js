import config from '../config.js';
import db, { filter } from '../db.js';

export default {

    index: async (request, response) => {
        const data = {
            title: 'Публікації',
            description: 'Список публікацій сайту',
            keywords: 'публікації'
        };
        let stages = filter({
            sortField: 'time', sortOrder: 1, ...request.query
        });
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
        data.posts = await db.collection('posts')
            .aggregate(stages).toArray();
        response.render('posts/index', data);
    },

    view: async (request, response) => {
        const post = await db.collection('posts')
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
        post.body = post.body.replace(
            /<img\s+src="https:\/\/фото\.медіа\.укр\/сховище([^"]+)"/g,
            `<img src="${config.image.blank}" data-src="$1"`
        );
        response.render('posts/view', post);
    }
}