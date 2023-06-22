import db from '../db.js';

export default async (request, response) => {
    const data = {
        description: 'Новини',
        keywords: 'новини, статті, медіа'
    };
    data.posts = await db.collection('posts')
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
                title: true, alias: true, 
                posts: { $size: '$posts' },
                status: true
            } },
            { $match: { posts: { $gt: -1 } } },
            { $limit: 100 },
            { $sort: { title: 1 } }
        ]).toArray();
    response.render('home', data);
}