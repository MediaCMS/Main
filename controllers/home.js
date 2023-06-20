import db, { filter } from '../db.js';

export default async (request, response) => {
    const data = {
        description: 'Новини',
        keywords: 'новини, статті, медіа'
    };
    let stages = filter(request.query);
    stages[1].$sort = { 'time': -1 };
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
    /*
    data.tags = await db.collection('tags')
        .find({ status: true }).sort({ order: 1 }).toArray();
    */
    data.tags = await db.collection('tags')
        .aggregate([
        { $lookup: {
            from: 'posts', 
            localField: '_id', 
            foreignField: 'tags', 
            as: 'posts'
        } },
        { $project: {
            title: true, alias: true, posts: { $size: '$posts' }, status: true }
        },
        { $match: { posts: { $gt: -1 }, status: true } },

    ]).toArray();
    response.render('home', data);
}