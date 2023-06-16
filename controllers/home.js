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
    const posts = await db.collection('posts')
        .aggregate(stages).toArray();
    data.top = posts.slice(0, 3);
    data.posts = posts.slice(3);
    response.render('home', data);
}