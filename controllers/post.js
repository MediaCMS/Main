import db, { skip, limit } from '../db.js';
import cache from '../cache.js';

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
                { $sort: { date: -1 } },
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
                    image: true, tags: true, slug: true, status: true,
                    category: { title: true, slug: true }, date: true,
                    user: { title: true, slug: true }
                }}
            ]).toArray();
        response.render('posts/index', data);
    },

    view: async (request, response, next) => {
        let post;
        const match = {
            slug: request.params.slug
        }
        if (!request.query?.preview) {
            match.status = true
        }
        if (!cache.has(request.path)) {
            post = await db.collection('posts')
                .aggregate([
                    { $match: match },
                    { $lookup: {
                        from: 'categories', localField: 'category',
                        foreignField: '_id', as: 'category'
                    } },
                    { $unwind: '$category' },
                    { $lookup: {
                        from: 'tags', localField: 'tags',
                        foreignField: '_id', as: 'tags'
                    } },
                    { $lookup: {
                        from: 'users', localField: 'user',
                        foreignField: '_id', as: 'user'
                    } },
                    { $unwind: '$user' }
                ]).next();
            if (!post) {
                response.status(404);
                return next();
            }
            /*
            post.body = post.body.replace(
                /<img\s+src="https:\/\/image\.mediacms\.org\/([^"]+)"/g,
                `<img src="${config.images.blank}" data-src="$1"`
            );
            */
            cache.set(request.path, post);
        } else {
            post = cache.get(request.path);
        }
        response.render('posts/view', post);
    }
}