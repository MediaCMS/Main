import db, { ObjectId } from '../../db.js';

const home = async () => {
    const data = { posts: [] };
    const pipeline = [
        { $match: { status: true } },
        { $sort: { order: 1 } },
        { $lookup: {
            from: 'posts',
            let: { category: '$_id' },
            pipeline: [
                { $match: {
                    $expr: {
                        $eq: [ '$$category', '$category' ]
                    },
                    type: new ObjectId('64be89ff69a893de210bd7d4'),
                    status: true
                }},
                { $sort: { date: -1 } },
                { $limit: 7 },
                { $lookup: {
                    from: 'users', localField: 'user', 
                    foreignField: '_id', as: 'user'
                } },
                { $unwind: '$user' },
                { $project: {
                    date: true, title: true, description: true, 
                    image: true, tags: true, slug: true, status: true,
                    user: { title: true, slug: true }
                }}
            ],
            as: 'posts'
        }},          
        { $match: { 'posts.0': { $exists: true } } },
    ];
    data.posts = await db.collection('categories')
    .aggregate(pipeline, { allowDiskUse: true }).toArray();
    return data;
}

export default home;