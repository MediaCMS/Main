import db from '../db.js';
import cache from '../cache.js';

export default async (request, response) => {
    let data = {};
    if (!cache.has(request.path)) {
        data = {
            description: 'Новини',
            keywords: 'новини, статті, медіа'
        };
        data.posts = await getPosts();
        data.tags = await getTags();
        cache.set('/', data);
    } else {
        data = cache.get('/');
    }
    response.render('home', data);
}

async function getPosts() {
    return await db.collection('posts')
        .aggregate([
            { $match: { status: true } },
            { $sort: { time: -1 } },
            { $limit: 100 },
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
}

async function getTags() {
    return await db.collection('tags')
        .aggregate([
            { $match: { status: true } },
            { $lookup: {
                from: 'posts', 
                localField: '_id', 
                foreignField: 'tags', 
                as: 'posts'
            } },
            { $project: {
                title: true, alias: true, 
                posts: { $size: '$posts' },
                status: true
            } },
            { $match: { posts: { $gt: -1 } } },
            { $limit: 100 },
            { $sort: { title: 1 } }
        ]).toArray();;
}